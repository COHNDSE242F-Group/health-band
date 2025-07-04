package com.iot.healthbandmobile;


import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;


import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.DataSnapshot;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.google.firebase.auth.FirebaseAuth;
import androidx.biometric.BiometricManager;
import androidx.biometric.BiometricPrompt;
import androidx.core.content.ContextCompat;

import com.google.firebase.auth.AuthResult;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;

public class loginActivity extends AppCompatActivity {

    private EditText editTextEmail, editTextPassword;
    private Button btnSignIn;
    private Button btnTogglePassword;

    private Button btnFingerprintLogin;
    private FirebaseAuth firebaseAuth;



    @SuppressLint("WrongViewCast")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.login);

        firebaseAuth = FirebaseAuth.getInstance();

        editTextEmail = findViewById(R.id.editTextEmail);
        editTextPassword = findViewById(R.id.editTextPassword);
         btnSignIn = findViewById(R.id.btnSignIn);
        btnTogglePassword = findViewById(R.id.btnTogglePassword);
      //  btnFingerprintLogin = findViewById(R.id.btnFingerprintLogin);

     //   btnFingerprintLogin.setOnClickListener(v -> showBiometricPrompt());



        btnSignIn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                loginUser();
            }
        });

        setupNavBar();
        togglePassword();

    }

    private void loginUser() {
        String inputEmail = editTextEmail.getText().toString().trim();
        String inputPassword = editTextPassword.getText().toString().trim();

        if (TextUtils.isEmpty(inputEmail)) {
            editTextEmail.setError("Email is required");
            return;
        }

        if (TextUtils.isEmpty(inputPassword)) {
            editTextPassword.setError("Password is required");
            return;
        }

        // Get reference to the credentials node
        DatabaseReference ref = FirebaseDatabase.getInstance().getReference("patients/P001/credentials");
        ref.get().addOnCompleteListener(task -> {
            if (task.isSuccessful()) {
                DataSnapshot snapshot = task.getResult();
                if (snapshot.exists()) {
                    String dbEmail = snapshot.child("username").getValue(String.class);
                    String dbPassword = snapshot.child("password").getValue(String.class);

                    if (inputEmail.equals(dbEmail) && inputPassword.equals(dbPassword)) {
                        Toast.makeText(loginActivity.this, "Login successful", Toast.LENGTH_SHORT).show();
                        // Proceed to next activity
                        startActivity(new Intent(loginActivity.this, MainActivity.class));
                        finish();
                    } else {
                        Toast.makeText(loginActivity.this, "Invalid credentials", Toast.LENGTH_SHORT).show();
                    }
                } else {
                    Toast.makeText(loginActivity.this, "No credentials found", Toast.LENGTH_SHORT).show();
                }
            } else {
                Toast.makeText(loginActivity.this, "Database error: " + task.getException().getMessage(), Toast.LENGTH_LONG).show();
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
    public void togglePassword(){
        btnTogglePassword.setOnClickListener(new View.OnClickListener() {
            private boolean isPasswordVisible = false;

            @Override
            public void onClick(View v) {
                if (isPasswordVisible) {
                    // Hide password
                    editTextPassword.setInputType(
                            android.text.InputType.TYPE_CLASS_TEXT | android.text.InputType.TYPE_TEXT_VARIATION_PASSWORD);
                    btnTogglePassword.setBackgroundResource(android.R.drawable.ic_menu_view); // example icon
                } else {
                    // Show password
                    editTextPassword.setInputType(
                            android.text.InputType.TYPE_CLASS_TEXT | android.text.InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD);
                    btnTogglePassword.setBackgroundResource(android.R.drawable.ic_menu_close_clear_cancel); // example icon
                }
                // Move cursor to end
                editTextPassword.setSelection(editTextPassword.getText().length());

                isPasswordVisible = !isPasswordVisible;
            }
        });

    }
    /*
    private void showBiometricPrompt() {
        BiometricManager biometricManager = BiometricManager.from(this);
        switch (biometricManager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_STRONG)) {
            case BiometricManager.BIOMETRIC_SUCCESS:
                break;
            case BiometricManager.BIOMETRIC_ERROR_NO_HARDWARE:
                Toast.makeText(this, "No biometric hardware", Toast.LENGTH_SHORT).show();
                return;
            case BiometricManager.BIOMETRIC_ERROR_HW_UNAVAILABLE:
                Toast.makeText(this, "Biometric hardware unavailable", Toast.LENGTH_SHORT).show();
                return;
            case BiometricManager.BIOMETRIC_ERROR_NONE_ENROLLED:
                Toast.makeText(this, "No fingerprint enrolled", Toast.LENGTH_SHORT).show();
                return;
        }

        BiometricPrompt.PromptInfo promptInfo = new BiometricPrompt.PromptInfo.Builder()
                .setTitle("Fingerprint Login")
                .setSubtitle("Authenticate using your fingerprint")
                .setNegativeButtonText("Cancel")
                .build();

        BiometricPrompt biometricPrompt = new BiometricPrompt(this,
                ContextCompat.getMainExecutor(this),
                new BiometricPrompt.AuthenticationCallback() {
                    @Override
                    public void onAuthenticationError(int errorCode, @NonNull CharSequence errString) {
                        super.onAuthenticationError(errorCode, errString);
                        Toast.makeText(loginActivity.this, "Error: " + errString, Toast.LENGTH_SHORT).show();
                    }

                    @Override
                    public void onAuthenticationSucceeded(@NonNull BiometricPrompt.AuthenticationResult result) {
                        super.onAuthenticationSucceeded(result);
                        Toast.makeText(loginActivity.this, "Login success", Toast.LENGTH_SHORT).show();

                        // Go to next activity (example MainActivity)
                        startActivity(new Intent(loginActivity.this, MainActivity.class));
                        finish();
                    }

                    @Override
                    public void onAuthenticationFailed() {
                        super.onAuthenticationFailed();
                        Toast.makeText(loginActivity.this, "Authentication failed", Toast.LENGTH_SHORT).show();
                    }
                });

        biometricPrompt.authenticate(promptInfo);
    }*/

}
