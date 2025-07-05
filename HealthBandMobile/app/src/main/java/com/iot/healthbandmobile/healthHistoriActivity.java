package com.iot.healthbandmobile;

import android.content.Intent;
import android.os.Bundle;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.github.mikephil.charting.charts.LineChart;
import com.github.mikephil.charting.components.Description;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import java.util.ArrayList;
import java.util.List;

public class healthHistoriActivity extends AppCompatActivity {

    private TextView heartRateText, bpText, tempText, weightText;
    private LineChart heartChart, bpChart, tempChart, weightChart;
    private DatabaseReference medicalDetailsRef;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.health_histry);



        heartChart = findViewById(R.id.heartChart);
        bpChart = findViewById(R.id.bpChart);
        tempChart = findViewById(R.id.tempChart);
        weightChart = findViewById(R.id.weightChart);

        String userId = getIntent().getStringExtra("userId");
        if (userId == null) {
            Toast.makeText(this, "User ID missing", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        // ✅ Your Firebase file path
        medicalDetailsRef = FirebaseDatabase.getInstance()
                .getReference("patients")
                .child(userId)
                .child("sensordata");

        loadMedicalHistoryForCharts();// Load all history for charts
        setupNavBar();

        getWindow().setStatusBarColor(getResources().getColor(R.color.white));

    }



    private void loadMedicalHistoryForCharts() {
        medicalDetailsRef.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                List<Entry> hrEntries = new ArrayList<>();
                List<Entry> sysEntries = new ArrayList<>();
                List<Entry> diaEntries = new ArrayList<>();
                List<Entry> tempEntries = new ArrayList<>();
                List<Entry> weightEntries = new ArrayList<>();

                int i = 0;
                for (DataSnapshot dp : snapshot.getChildren()) {
                    try {
                        float hr = getFloatValue(dp.child("heart_rate").getValue());
                        float sys = getFloatValue(dp.child("blood_pressure_systolic").getValue());
                        float dia = getFloatValue(dp.child("blood_pressure_diastolic").getValue());
                        float temp = getFloatValue(dp.child("temperature").getValue());
                        float weight = getFloatValue(dp.child("weight").getValue());

                        hrEntries.add(new Entry(i, hr));
                        sysEntries.add(new Entry(i, sys));
                        diaEntries.add(new Entry(i, dia));
                        tempEntries.add(new Entry(i, temp));
                        weightEntries.add(new Entry(i, weight));

                        i++;
                    } catch (Exception e) {
                        // Skip bad data
                    }
                }

                updateChartSingle(heartChart, hrEntries, "Heart Rate", android.R.color.holo_red_dark);
                updateChartMultiple(bpChart, sysEntries, diaEntries, "Systolic BP", "Diastolic BP",
                        android.R.color.holo_blue_dark, android.R.color.holo_blue_light);
                updateChartSingle(tempChart, tempEntries, "Temperature", android.R.color.holo_orange_dark);
                updateChartSingle(weightChart, weightEntries, "Weight", android.R.color.holo_green_dark);
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Toast.makeText(healthHistoriActivity.this, "Error: " + error.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private float getFloatValue(Object value) {
        if (value == null) return 0f;
        if (value instanceof Number) return ((Number) value).floatValue();
        try {
            return Float.parseFloat(value.toString());
        } catch (Exception e) {
            return 0f;
        }
    }

    private void updateChartSingle(LineChart chart, List<Entry> entries, String label, int colorRes) {
        chart.clear();
        if (entries.isEmpty()) return;

        LineDataSet set = new LineDataSet(entries, label);
        set.setColor(getResources().getColor(colorRes));
        set.setCircleColor(getResources().getColor(colorRes));
        set.setLineWidth(2f);
        set.setCircleRadius(4f);

        LineData data = new LineData(set);
        chart.setData(data);

        Description desc = new Description();
        desc.setText(label);
        chart.setDescription(desc);

        // 👉 Enable horizontal scroll/zoom
        chart.setDragEnabled(true);
        chart.setScaleEnabled(true);
        chart.setScaleXEnabled(true);
        chart.setScaleYEnabled(false);
        chart.setPinchZoom(true);
        chart.setVisibleXRangeMaximum(5);  // Show 5 points max at once, scroll for more



        chart.invalidate();
    }

    private void updateChartMultiple(LineChart chart,
                                     List<Entry> entries1, List<Entry> entries2,
                                     String label1, String label2,
                                     int colorRes1, int colorRes2) {
        chart.clear();
        if (entries1.isEmpty() && entries2.isEmpty()) return;

        List<LineDataSet> sets = new ArrayList<>();

        if (!entries1.isEmpty()) {
            LineDataSet set1 = new LineDataSet(entries1, label1);
            set1.setColor(getResources().getColor(colorRes1));
            set1.setCircleColor(getResources().getColor(colorRes1));
            set1.setLineWidth(2f);
            set1.setCircleRadius(4f);
            sets.add(set1);
        }

        if (!entries2.isEmpty()) {
            LineDataSet set2 = new LineDataSet(entries2, label2);
            set2.setColor(getResources().getColor(colorRes2));
            set2.setCircleColor(getResources().getColor(colorRes2));
            set2.setLineWidth(2f);
            set2.setCircleRadius(4f);
            sets.add(set2);
        }

        LineData data = new LineData();
        for (LineDataSet set : sets) {
            data.addDataSet(set);
        }

        chart.setData(data);

        Description desc = new Description();
        desc.setText(label1 + " & " + label2);
        chart.setDescription(desc);

        chart.invalidate();
    }

    public void setupNavBar() {
        LinearLayout navHome = findViewById(R.id.navHome);
        LinearLayout navHistory = findViewById(R.id.navHistory);
        LinearLayout navNotification = findViewById(R.id.navNotification);
        LinearLayout navProfile = findViewById(R.id.navProfile);

        navHome.setOnClickListener(v -> {
            startActivity(new Intent(this, healthRecordActivity.class));
            finish();
        });

        navHistory.setOnClickListener(v -> {
            Intent intent = new Intent(this, healthHistoriActivity.class);
            intent.putExtra("userId", getIntent().getStringExtra("userId"));
            startActivity(intent);
            finish();
        });


        //navNotification.setOnClickListener(v -> {
        //    startActivity(new Intent(this, NotificationActivity.class));
        //    finish();
        // });

        // navProfile.setOnClickListener(v -> {
        //     startActivity(new Intent(this, ProfileActivity.class));
        //     finish();
        //  });
    }

}
