plugins {
    alias(libs.plugins.android.application)
   //alias(libs.plugins.google.services)  // apply Google Services plugin here

    id("com.google.gms.google-services")
}

android {
    namespace = "com.iot.healthbandmobile"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.iot.healthbandmobile"
        minSdk = 27
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
}

dependencies {
    implementation(libs.appcompat)
    implementation(libs.material)
    implementation(libs.activity)
    implementation(libs.constraintlayout)

    // Add Firebase BOM and Realtime Database KTX using version catalog
    implementation(platform(libs.firebase.bom))
    implementation(libs.firebase.database.ktx)
    implementation(libs.firebase.auth)

    // Biometric
    implementation(libs.biometric)
// fireabse
   implementation(platform(libs.firebase.bom.v33160))
    implementation(libs.firebase.analytics)

    //chart
       // implementation (libs.mpandroidchart)
    implementation("com.github.PhilJay:MPAndroidChart:3.1.0")




    testImplementation(libs.junit)
    androidTestImplementation(libs.ext.junit)
    androidTestImplementation(libs.espresso.core)


}

