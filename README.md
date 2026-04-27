# 🏥 Smart Wearable Armband for Health Monitoring

> A hospital-integrated IoT wearable that monitors chronic disease patients in real-time — detecting emergencies early and keeping doctors informed without relying on a smartphone.

![IoT](https://img.shields.io/badge/IoT-ESP8266-E7352C?style=flat-square&logo=esphome)
![Firmware](https://img.shields.io/badge/Firmware-Arduino%20C++-00979D?style=flat-square&logo=arduino)
![Connectivity](https://img.shields.io/badge/Connectivity-Wi--Fi%20%2F%20Bluetooth-0082FC?style=flat-square)
![Type](https://img.shields.io/badge/Type-Academic%20Project-8B5CF6?style=flat-square)

---

## 📌 Overview

This project is a **hospital-integrated smart wearable armband** designed to monitor patients with chronic diseases in real-time. It helps doctors track patient health remotely, detect emergencies early, and respond faster — all without depending on the patient's smartphone.

---

## 🚨 Problem

Most consumer smartwatches fall short in clinical environments:

| Limitation | Impact on Patient Care |
|---|---|
| ❌ No direct hospital connection | Doctors never see the data |
| ❌ Smartphone dependent | Fails when phone is unavailable |
| ❌ Not medical-grade monitoring | Unreliable for clinical decisions |
| ❌ No emergency communication | Delayed response in critical moments |

> These gaps make existing wearables unsuitable for chronic disease patients who need continuous, reliable monitoring.

---

## 💡 Solution

A **smart hospital-connected wearable armband** that:

- ✅ Monitors vital signs continuously in real-time
- ✅ Detects abnormal health conditions automatically
- ✅ Sends instant alerts to the hospital dashboard


---

## ✨ Features

- 💓 Heart rate monitoring
- 🩸 SpO₂ (blood oxygen level) tracking
- 🌡️ Body temperature measurement
- 💉 Blood pressure monitoring (cuff-based)
- 🤸 Fall detection via accelerometer
- 🚨 Emergency alerts to hospital dashboard
- 📞 Basic voice communication support

---

## 🛠️ Technology Stack

### Hardware

| Component | Role |
|---|---|
| ESP8266 Microcontroller | Core processing & Wi-Fi communication |
| MAX30102 Sensor | Heart rate & SpO₂ measurement |
| DS18B20 Sensor | Body temperature measurement |
| BMP280 Sensor | Pressure sensing |
| MPU9250 Accelerometer | Fall detection |
| Microphone + Speaker | Voice communication |
| Blood Pressure Cuff | Clinical BP measurement |

### Software

| Layer | Technology |
|---|---|
| Embedded Firmware | Arduino (C++) |
| Monitoring Dashboard | Web-based real-time UI |
| Data Communication | IoT (Wi-Fi / Bluetooth) |

---

## ⚙️ How It Works

```
🩺 Sensors collect patient vitals
          ↓
🔧 ESP8266 processes & filters the data
          ↓
📡 Transmitted to hospital via Wi-Fi / Bluetooth
          ↓
🖥️ Doctors monitor patients on live dashboard
          ↓
🚨 Emergency alert triggered on abnormal readings
```

---

## 🎯 Goal

To improve chronic disease management by connecting wearable devices **directly to hospital systems** — enabling real-time remote monitoring, faster emergency response, and better patient outcomes.

---



## 🔮 Future Improvements

- [ ] AI-based health risk prediction
- [ ] Full EHR (Electronic Health Records) integration
- [ ] Cloud analytics dashboard
- [ ] Multi-patient ward monitoring support

---


## 📄 License

This project is developed for academic purposes. All rights reserved.

---
