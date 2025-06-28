import React, { useEffect, useRef, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "./firebase";
import { useParams } from "react-router-dom";
import "../VoiceConnect.css";

export default function VoiceConnect() {
  const { id } = useParams();
  const [micOn, setMicOn] = useState(false);
  const [youTalking, setYouTalking] = useState(false);
  const [otherTalking, setOtherTalking] = useState(false);
  const [status, setStatus] = useState("Disconnected");
  const [micLevel, setMicLevel] = useState(0);
  const [patientName, setPatientName] = useState("Loading...");
  const [patientIcon, setPatientIcon] = useState("🤖");

  const wsRef = useRef(null);
  const recorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);

  // Fetch patient's name from Firebase
  useEffect(() => {
    const patientRef = ref(database, `patients/${id}/personal_info`);
    const unsubscribe = onValue(patientRef, (snapshot) => {
      const data = snapshot.val();
      if (data?.name) {
        setPatientName(data.name);
        const initials = data.name
          .split(" ")
          .map(part => part[0])
          .join("")
          .toUpperCase();
        setPatientIcon(initials);
      } else {
        setPatientName("Unknown");
      }
    });

    return () => unsubscribe();
  }, [id]);

  // WebSocket communication
  useEffect(() => {
    const ws = new WebSocket("ws://192.168.1.2:4000");
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("Connected");
      ws.send("hello");
    };

    ws.onmessage = (event) => {
      const blob = new Blob([event.data], { type: "audio/webm" });
      const audio = new Audio(URL.createObjectURL(blob));
      audio.play();
      setOtherTalking(true);
      setTimeout(() => setOtherTalking(false), 1000);
    };

    ws.onerror = () => setStatus("Error");
    ws.onclose = () => setStatus("Disconnected");

    return () => ws.close();
  }, []);

  // Start recording
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContextRef.current.createMediaStreamSource(stream);
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 256;
    source.connect(analyserRef.current);

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

    const updateVolume = () => {
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      setMicLevel(average);
      setYouTalking(average > 10); // Threshold
      animationRef.current = requestAnimationFrame(updateVolume);
    };

    updateVolume();

    recorder.ondataavailable = (event) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(event.data);
      }
    };

    recorder.start(250);
    recorderRef.current = recorder;
    setMicOn(true);
  };

  // Stop recording
  const stopRecording = () => {
    recorderRef.current?.stop();
    audioContextRef.current?.close();
    cancelAnimationFrame(animationRef.current);
    setMicLevel(0);
    setMicOn(false);
    setYouTalking(false);
  };

  return (
    <div className="vc-container">
      <h2 className="vc-title">Voice Chat with Patient</h2>

      <div className="vc-avatars">
        <div className="vc-person">
          <div className={`vc-avatar ${youTalking ? "vc-talking" : ""}`}>
            <img src="https://img.icons8.com/ios-filled/100/user.png" alt="icon" />
          </div>
          <div className="vc-bar-wrapper">
            <div className="vc-bar" style={{ width: `${micLevel}px` }} />
          </div>
          <span className="vc-name">You</span>
        </div>

        <div className="vc-person">
          <div className={`vc-avatar ${otherTalking ? "vc-talking" : ""}`}>
            <span className="vc-initials">{patientIcon}</span>
          </div>
          <div className="vc-bar-wrapper">
            <div className={`vc-bar vc-bar-esp`} style={{ width: otherTalking ? "60px" : "15px" }} />
          </div>
          <span className="vc-name">{patientName}</span>
        </div>
      </div>

      <div className="vc-controls">
        <button onClick={startRecording} disabled={micOn} className="vc-button mic-on">
          🎤 Turn Mic On
        </button>
        <button onClick={stopRecording} disabled={!micOn} className="vc-button mic-off">
          🔇 Turn Mic Off
        </button>
      </div>

      <div className="vc-status">
        Status: <span className={`vc-status-text ${status.toLowerCase()}`}>{status}</span>
      </div>
    </div>
  );
}