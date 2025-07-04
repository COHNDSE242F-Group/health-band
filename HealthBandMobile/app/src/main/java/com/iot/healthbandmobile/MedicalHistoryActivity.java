package com.iot.healthbandmobile;

import android.os.Bundle;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.database.*;

import java.util.ArrayList;
import java.util.List;

public class MedicalHistoryActivity extends AppCompatActivity {

    private RecyclerView recyclerView;
    private MedicalHistoryAdapter adapter;
    private List<MedicalRecord> recordList;

    private DatabaseReference databaseRef;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_medical_history);

        recyclerView = findViewById(R.id.rvMedicalHistory);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        recordList = new ArrayList<>();
        adapter = new MedicalHistoryAdapter(recordList);
        recyclerView.setAdapter(adapter);


        String uid = FirebaseAuth.getInstance().getCurrentUser().getUid();


        databaseRef = FirebaseDatabase.getInstance()
                .getReference("Patients")
                .child(uid)
                .child("medicalHistory");


        databaseRef.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                recordList.clear();

                if (snapshot.exists()) {
                    for (DataSnapshot childSnap : snapshot.getChildren()) {
                        MedicalRecord record = childSnap.getValue(MedicalRecord.class);
                        if (record != null) {
                            recordList.add(record);
                        }
                    }
                    adapter.notifyDataSetChanged();
                } else {
                    Toast.makeText(MedicalHistoryActivity.this, "No medical history found.", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Toast.makeText(MedicalHistoryActivity.this, "Failed to load data: " + error.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }
}
