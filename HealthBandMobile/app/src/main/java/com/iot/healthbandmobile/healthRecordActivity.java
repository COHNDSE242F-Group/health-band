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
        medicalDetailsRef = FirebaseDatabase.getInstance().getReference("medical_details").child(userId);
        loadMedicalDetails();

    }


    private void loadMedicalDetails() {
        medicalDetailsRef.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                if (snapshot.exists()) {
                    String heartRate = snapshot.child("heart_rate").getValue(String.class);
                    String bloodPressure = snapshot.child("blood_pressure").getValue(String.class);
                    String temperature = snapshot.child("temperature").getValue(String.class);
                    String bloodGroup = snapshot.child("blood_group").getValue(String.class);
                    String weight = snapshot.child("weight").getValue(String.class);

                    heartRateValueText.setText(heartRate != null ? heartRate : "--");
                    bloodPressureValueText.setText(bloodPressure != null ? bloodPressure : "--");
                    temperatureValueText.setText(temperature != null ? temperature : "--");
                    bloodGroupValueText.setText(bloodGroup != null ? bloodGroup : "--");
                    weightValueText.setText(weight != null ? weight : "--");
                } else {
                    Toast.makeText(healthRecordActivity.this, "No medical details found", Toast.LENGTH_SHORT).show();
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
            startActivity(new Intent(this, loginActivity.class));
            finish();
        });

        navHistory.setOnClickListener(v -> {
           startActivity(new Intent(this, MainActivity.class));
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
