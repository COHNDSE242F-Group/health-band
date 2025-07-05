package com.iot.healthbandmobile;

import android.content.Intent;
import android.os.Bundle;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.google.firebase.auth .FirebaseAuth;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

public class healthRecordActivity extends AppCompatActivity {

    private TextView heartRateValueText, bloodPressureValueText, temperatureValueText, bloodGroupValueText, weightValueText;

    private DatabaseReference medicalDetailsRef;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.health_record); // Replace with your actual layout XML name

        // Initialize views
        heartRateValueText = findViewById(R.id.heartRateValueText);
        bloodPressureValueText = findViewById(R.id.bloodPressureValueText);
        temperatureValueText = findViewById(R.id.temperatureValueText);
        bloodGroupValueText = findViewById(R.id.bloodGroupValueText);
        weightValueText = findViewById(R.id.weightValueText);

        // Check if user is logged in
        String userId = getIntent().getStringExtra("userId");
        if (userId == null) {
            Toast.makeText(this, "User ID missing", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }
        medicalDetailsRef = FirebaseDatabase.getInstance()
                .getReference("patients")
                .child(userId)
                .child("sensordata");

        loadMedicalDetails();
        setupNavBar();
        getWindow().setStatusBarColor(getResources().getColor(R.color.white));


    }


    private void loadMedicalDetails() {
        medicalDetailsRef.orderByKey().limitToLast(1)
                .addListenerForSingleValueEvent(new ValueEventListener() {
                    @Override
                    public void onDataChange(@NonNull DataSnapshot snapshot) {
                        if (snapshot.exists()) {
                            for (DataSnapshot dataPoint : snapshot.getChildren()) {
                                String heartRate = String.valueOf(dataPoint.child("heart_rate").getValue());
                                String bpSystolic = String.valueOf(dataPoint.child("blood_pressure_systolic").getValue());
                                String bpDiastolic = String.valueOf(dataPoint.child("blood_pressure_diastolic").getValue());
                                String temperature = String.valueOf(dataPoint.child("temperature").getValue());
                                String pressure = String.valueOf(dataPoint.child("pressure").getValue());

                                // Set values to your TextViews (use defaults if null)
                                heartRateValueText.setText(heartRate != null ? heartRate : "--");
                                bloodPressureValueText.setText(
                                        (bpSystolic != null && bpDiastolic != null) ? bpSystolic + "/" + bpDiastolic : "--");
                                temperatureValueText.setText(temperature != null ? temperature : "--");
                                weightValueText.setText(pressure != null ? pressure : "--");  // Example usage

                                // bloodGroupValueText: maybe set static or from personal_info if you have it
                                bloodGroupValueText.setText("--");
                            }
                        } else {
                            Toast.makeText(healthRecordActivity.this, "No sensor data found", Toast.LENGTH_SHORT).show();
                        }
                    }

                    @Override
                    public void onCancelled(@NonNull DatabaseError error) {
                        Toast.makeText(healthRecordActivity.this, "Error: " + error.getMessage(), Toast.LENGTH_LONG).show();
                    }
                });
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
