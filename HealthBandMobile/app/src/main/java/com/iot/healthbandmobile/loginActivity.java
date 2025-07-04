package com.iot.healthbandmobile;


import android.annotation.SuppressLint;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.AuthResult;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;

public class loginActivity extends AppCompatActivity {

    private EditText editTextEmail, editTextPassword;
    private LinearLayout btnSignIn;
    private FirebaseAuth firebaseAuth;

    @SuppressLint("WrongViewCast")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.login);

        firebaseAuth = FirebaseAuth.getInstance();

        editTextEmail = findViewById(R.id.editTextEmail);
        editTextPassword = findViewById(R.id.editTextPassword);
        btnSignIn = (LinearLayout) findViewById(R.id.btnSignIn).getParent();

        btnSignIn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                loginUser();
            }
        });
    }

    private void loginUser() {
        String email = editTextEmail.getText().toString().trim();
        String password = editTextPassword.getText().toString().trim();

        if (TextUtils.isEmpty(email)) {
            editTextEmail.setError("Email is required");
            return;
        }

        if (TextUtils.isEmpty(password)) {
            editTextPassword.setError("Password is required");
            return;
        }

        firebaseAuth.signInWithEmailAndPassword(email, password)
                .addOnCompleteListener(loginActivity.this, task -> {
                    if (task.isSuccessful()) {
                        Toast.makeText(loginActivity.this, "Login successful", Toast.LENGTH_SHORT).show();
                    } else {
                        Exception e = task.getException();
                        if (e != null) {
                            String fullError = e.getClass().getSimpleName() + ": " + e.getMessage();
                            Toast.makeText(loginActivity.this, "Login failed: " + fullError, Toast.LENGTH_LONG).show();

                            // Optional: Log to Logcat for easier reading
                            android.util.Log.e("FIREBASE_LOGIN", "Full error", e);
                        } else {
                            android.util.Log.e("FIREBASE_LOGIN", "Full error", e);

                            Toast.makeText(loginActivity.this, "Login failed: Unknown error", Toast.LENGTH_LONG).show();
                        }
                    }
                });

    }
}
