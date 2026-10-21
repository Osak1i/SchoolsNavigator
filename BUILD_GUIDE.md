# RTK Navigator — Android APK Build Guide

## Overview

Your project uses **Capacitor** to wrap the React web app into a native Android APK.
All the Android config files are already set up. You just need to install tools and run a few commands.

---

## Requirements

Install these before you start:

| Tool | Where to get it | Notes |
|------|----------------|-------|
| **Node.js 18+** | https://nodejs.org | Required for npm/vite |
| **Android Studio** | https://developer.android.com/studio | Free, ~4GB download |
| **Java 17 (JDK)** | Bundled with Android Studio | No separate install needed |

After installing Android Studio, open it once and let it finish its setup wizard — it will install the Android SDK automatically.

---

## One-Time Setup (do this once)

### 1. Install Node dependencies

Open a terminal in the project folder and run:

```bash
npm install
```

### 2. Add the Android platform

```bash
npx cap add android
```

This creates the `android/` folder with the full Android Studio project.

### 3. Build the web app and copy it into Android

```bash
npm run build
npx cap copy android
```

---

## Building the APK

### Option A — Debug APK (for testing, no signing needed)

```bash
# Step 1: Build the React app
npm run build

# Step 2: Sync changes to Android
npx cap sync android

# Step 3: Open in Android Studio
npx cap open android
```

Inside Android Studio:
1. Wait for Gradle sync to finish (bottom status bar)
2. Go to **Build → Build Bundle(s) / APK(s) → Build APK(s)**
3. Click the **"locate"** link in the notification to find your APK

Your APK will be at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### Option B — Build from terminal (no Android Studio UI needed)

```bash
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## Installing the APK on a Phone

### Via USB cable
```bash
# Enable Developer Options on your phone first:
# Settings → About Phone → tap "Build Number" 7 times
# Then: Settings → Developer Options → Enable USB Debugging

adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### Via file transfer
1. Copy the `.apk` file to your phone
2. Open a file manager on the phone
3. Tap the APK → tap **Install**
4. If prompted, enable "Install from unknown sources" in settings

---

## After Making Code Changes

Every time you change the React code, run:

```bash
npm run build
npx cap sync android
```

Then rebuild the APK in Android Studio or via `./gradlew assembleDebug`.

---

## Release APK (for sharing / Google Play)

A release APK is smaller and faster, but requires a signing key.

### Step 1: Create a signing key (do this once)
```bash
keytool -genkey -v -keystore rtk-navigator.keystore \
  -alias rtk-navigator -keyalg RSA -keysize 2048 -validity 10000
```
Answer the prompts. **Keep this file safe — you need it for all future updates.**

### Step 2: Build signed release APK

In Android Studio:
1. **Build → Generate Signed Bundle / APK**
2. Choose **APK**
3. Select your `.keystore` file
4. Fill in alias and passwords
5. Choose **release** build variant
6. Click **Finish**

Or from terminal — add to `android/app/build.gradle` under `android { }`:
```gradle
signingConfigs {
    release {
        storeFile file("../../rtk-navigator.keystore")
        storePassword "your_password"
        keyAlias "rtk-navigator"
        keyPassword "your_password"
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
    }
}
```

Then run:
```bash
cd android
./gradlew assembleRelease
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `SDK not found` | Open Android Studio → SDK Manager → install Android 14 (API 34) |
| `Gradle sync failed` | File → Sync Project with Gradle Files; or check internet connection |
| `JAVA_HOME not set` | Android Studio → Settings → Build Tools → Gradle → set Gradle JDK to "Android Studio JDK" |
| `adb not found` | Add Android SDK platform-tools to PATH: `export PATH=$PATH:~/Android/Sdk/platform-tools` |
| Maps not loading | Already handled — SVG maps are bundled inside the APK via `assets/public/` |

---

## Project Structure

```
RTKNavigator/
  src/                    ← React source code (edit this)
  public/maps/            ← SVG floor maps (bundled into APK)
  capacitor.config.ts     ← Capacitor settings
  android/                ← Android Studio project (auto-generated)
    app/
      src/main/
        java/.../MainActivity.java
        AndroidManifest.xml
        res/
          values/strings.xml   ← App name
          values/styles.xml    ← RTK red theme + splash screen
          drawable/splash.xml  ← Splash icon
          mipmap-*/            ← App icons (all sizes)
```

---

## App Details

- **Package ID:** `lv.rtk.navigator`
- **App Name:** RTK Navigator
- **Min Android:** 6.0 (API 23) — covers ~99% of devices
- **Target Android:** 14 (API 34)
- **Theme color:** RTK Red `#A82227`
- **Splash screen:** Red background with white map pin icon

---

*Generated for RTK Navigator v2.0 — Rīgas Tehniskā Koledža*
