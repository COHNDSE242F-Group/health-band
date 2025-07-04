package com.example.cusnotifigation;

import android.os.Bundle;
import android.view.View;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.ValueEventListener;

public class NotificationActivity extends AppCompatActivity {

    LinearLayout notificationContainer;
    String customerId = "customer2"; // change as needed

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_notification);

        notificationContainer = findViewById(R.id.notificationContainer);

        DatabaseReference reference = FirebaseDatabase.getInstance()
                .getReference("notifications").child(customerId);

        reference.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot snapshot) {
                notificationContainer.removeAllViews(); // clear old views

                for (DataSnapshot notifSnapshot : snapshot.getChildren()) {
                    View itemView = getLayoutInflater().inflate(R.layout.item_notification, notificationContainer, false);

                    TextView tvNotification = itemView.findViewById(R.id.tvNotificationText);
                    ImageButton btnRemove = itemView.findViewById(R.id.btnRemoveNotification);

                    String notificationText = notifSnapshot.getValue(String.class);
                    tvNotification.setText(notificationText);

                    // Remove notification view on (x) click — NO Firebase deletion
                    btnRemove.setOnClickListener(v -> {
                        notificationContainer.removeView(itemView);
                    });

                    notificationContainer.addView(itemView);
                }
            }

            @Override
            public void onCancelled(DatabaseError error) {
                notificationContainer.removeAllViews();
                TextView tv = new TextView(NotificationActivity.this);
                tv.setText("Failed to load notifications.");
                tv.setTextColor(0xFFFF0000); // Red color
                notificationContainer.addView(tv);
            }
        });
    }
}
