package com.iot.healthbandmobile;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class MedicalHistoryAdapter extends RecyclerView.Adapter<MedicalHistoryAdapter.MedicalViewHolder> {

    private final List<MedicalRecord> medicalRecords;

    public MedicalHistoryAdapter(List<MedicalRecord> medicalRecords) {
        this.medicalRecords = medicalRecords;
    }

    @NonNull
    @Override
    public MedicalViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_medical_history, parent, false);
        return new MedicalViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull MedicalViewHolder holder, int position) {
        MedicalRecord record = medicalRecords.get(position);

        holder.tvDate.setText("Date: " + record.date);
        holder.tvHeartRate.setText("Heart Rate: " + record.heartRate + " bpm");
        holder.tvBloodPressure.setText("Blood Pressure: " + record.bloodPressure);
        holder.tvTemperature.setText("Temperature: " + record.temperature + " °C");
        holder.tvDisease.setText("Disease: " + record.disease);
        holder.tvSituation.setText("Situation: " + record.situation);
    }

    @Override
    public int getItemCount() {
        return medicalRecords.size();
    }

    public static class MedicalViewHolder extends RecyclerView.ViewHolder {
        TextView tvDate, tvHeartRate, tvBloodPressure, tvTemperature, tvDisease, tvSituation;

        public MedicalViewHolder(@NonNull View itemView) {
            super(itemView);
            tvDate = itemView.findViewById(R.id.tvDate);
            tvHeartRate = itemView.findViewById(R.id.tvHeartRate);
            tvBloodPressure = itemView.findViewById(R.id.tvBloodPressure);
            tvTemperature = itemView.findViewById(R.id.tvTemperature);
            tvDisease = itemView.findViewById(R.id.tvDisease);
            tvSituation = itemView.findViewById(R.id.tvSituation);
        }
    }
}
