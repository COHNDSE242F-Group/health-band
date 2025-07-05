package com.iot.healthbandmobile;

public class MedicalRecord {
    public String date;
    public int heartRate;
    public String bloodPressure;
    public double temperature;
    public String disease;
    public String situation;


    public MedicalRecord() {}

    public MedicalRecord(String date, int heartRate, String bloodPressure,
                         double temperature, String disease, String situation) {
        this.date = date;
        this.heartRate = heartRate;
        this.bloodPressure = bloodPressure;
        this.temperature = temperature;
        this.disease = disease;
        this.situation = situation;
    }

}
