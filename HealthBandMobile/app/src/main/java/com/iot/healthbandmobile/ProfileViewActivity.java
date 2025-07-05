package com.iot.healthbandmobile;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.widget.TextView;
import android.widget.Toast;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.*;

public class ProfileActivity extends AppCompatActivity {


    private DatabaseReference databaseRef;
    private FirebaseUser currentUser;

    private TextView tvName, tvAge, tvGender, tvCondition, tvContact, tvHealthInfo;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.profile_view);

        tvName = findViewById(R.id.tvName);
        tvAge = findViewById(R.id.tvAge);
        tvGender = findViewById(R.id.tvGender);
        tvCondition = findViewById(R.id.tvCondition);
        tvContact = findViewById(R.id.tvContact);
        tvHealthInfo = findViewById(R.id.tvHealthInfo);


        currentUser = FirebaseAuth.getInstance().getCurrentUser();

        if (currentUser != null) {
            String uid = currentUser.getUid();


            databaseRef = FirebaseDatabase.getInstance()
                    .getReference("Patients")
                    .child(uid);


            databaseRef.addListenerForSingleValueEvent(new ValueEventListener() {
                @Override
                public void onDataChange(@NonNull DataSnapshot snapshot) {
                    if (snapshot.exists()) {

                        String name = snapshot.child("name").getValue(String.class);
                        String age = snapshot.child("age").getValue(String.class);
                        String gender = snapshot.child("gender").getValue(String.class);
                        String condition = snapshot.child("condition").getValue(String.class);
                        String contact = snapshot.child("contact").getValue(String.class);
                        String healthInfo = snapshot.child("healthInfo").getValue(String.class);


                        tvName.setText(name != null ? name : "N/A");
                        tvAge.setText(age != null ? age : "N/A");
                        tvGender.setText(gender != null ? gender : "N/A");
                        tvCondition.setText(condition != null ? condition : "N/A");
                        tvContact.setText(contact != null ? contact : "N/A");
                        tvHealthInfo.setText(healthInfo != null ? healthInfo : "N/A");
                    } else {
                        Toast.makeText(ProfileActivity.this, "No data found for this user.", Toast.LENGTH_SHORT).show();
                    }
                }

                @Override
                public void onCancelled(@NonNull DatabaseError error) {
                    Toast.makeText(ProfileActivity.this, "Failed to load data: " + error.getMessage(), Toast.LENGTH_SHORT).show();
                }
            });
        } else {
            Toast.makeText(this, "User not logged in.", Toast.LENGTH_SHORT).show();
        }
    }
}

