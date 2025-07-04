import React, { useState } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { initializeApp } from "firebase/app";
 
// TODO: Replace with your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDMUwIoYB-G65Jox16ynvtqR_3-hE8Rzig",
    authDomain: "hnd-iot.firebaseapp.com",
    databaseURL: "https://hnd-iot-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "hnd-iot",
    storageBucket: "hnd-iot.firebasestorage.app",
    messagingSenderId: "4841713277",
    appId: "1:4841713277:web:6cd7e519be36540ac74b14"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export default function DoctorRecruitmentForm() {
  const [formData, setFormData] = useState({
    fullname: "",
    dob: "",
    email: "",
    phone: "",
    degree: "",
    specialty: "",
    license: "",
    experience: "",
    cvFile: null,
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "cvFile") {
      setFormData(prev => ({ ...prev, cvFile: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.cvFile) {
      setMessage("Please upload your CV.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Upload CV to Firebase Storage
      const storageRef = ref(storage, `doctorCVs/${formData.email}_${formData.cvFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, formData.cvFile);

      uploadTask.on("state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          setMessage("Upload failed: " + error.message);
          setLoading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Save data to Firestore
          await addDoc(collection(db, "doctors"), {
            fullname: formData.fullname,
            dob: formData.dob,
            email: formData.email,
            phone: formData.phone,
            degree: formData.degree,
            specialty: formData.specialty,
            license: formData.license,
            experience: Number(formData.experience),
            cvURL: downloadURL,
            submittedAt: serverTimestamp()
          });

          setMessage("Application submitted successfully.");
          setFormData({
            fullname: "",
            dob: "",
            email: "",
            phone: "",
            degree: "",
            specialty: "",
            license: "",
            experience: "",
            cvFile: null,
          });
          setUploadProgress(0);
          setLoading(false);
        }
      );

    } catch (error) {
      setMessage("Submission error: " + error.message);
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: 400,
      margin: "auto",
      padding: 20,
      boxShadow: "0 0 15px rgba(0,0,0,0.1)",
      borderRadius: 6,
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>Doctor Recruitment</h2>
      <form onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} required />

        <label>Date of Birth</label>
        <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />

        <label>Email Address</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Phone Number</label>
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />

        <label>Medical Degree</label>
        <input type="text" name="degree" value={formData.degree} onChange={handleChange} placeholder="e.g. MD, MBBS" required />

        <label>Specialty</label>
        <input type="text" name="specialty" value={formData.specialty} onChange={handleChange} required />

        <label>Medical License Number</label>
        <input type="text" name="license" value={formData.license} onChange={handleChange} required />

        <label>Years of Experience</label>
        <input type="number" name="experience" min="0" max="60" value={formData.experience} onChange={handleChange} required />

        <label>Upload CV (PDF)</label>
        <input type="file" name="cvFile" accept=".pdf" onChange={handleChange} required />

        {uploadProgress > 0 && <p>Uploading CV: {Math.round(uploadProgress)}%</p>}

        <button type="submit" disabled={loading} style={{marginTop: 10, padding: "10px 0", width: "100%", fontWeight: "bold", fontSize: 16, backgroundColor: "#0077cc", color: "#fff", border: "none", borderRadius: 4, cursor: loading ? "not-allowed" : "pointer"}}>
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
      {message && <p style={{ marginTop: 15, color: message.includes("successfully") ? "green" : "red" }}>{message}</p>}
    </div>
  );
}
