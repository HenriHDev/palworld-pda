# DEPLOY GUIDE — APK, IPA (Xcode), Web Hosting & GitHub

Everything below is verified against **Expo SDK 54**. Run all commands from the
project root in a terminal (VSCode's integrated terminal works fine).

---

## 0. One-time setup

```bash
cd palworld-pda
npm install
npm install -g eas-cli        # global build tool (once)
eas login                      # create/login an expo.dev account (free)
```

## 1. Android APK

### Option A — EAS cloud build (recommended, works from any machine)
```bash
eas build --platform android --profile preview
```
EAS compiles the APK in the cloud. When done you get a download link — install
the `.apk` on any Android phone (Settings → allow "install unknown apps").

### Option B — Local build (needs Android Studio / JDK 17)
```bash
npx expo run:android            # first run generates the android/ project
cd android && ./gradlew assembleRelease
# output: android/app/build/outputs/apk/release/app-release.apk
```

### Play Store
```bash
eas build --platform android --profile production   # produces an .aab
eas submit --platform android                        # uploads to Play Console
```
You need a Google Play Console developer account ($25 once). The package id
`com.palworld.pda` is already set in `app.json`.

## 2. iOS IPA

### ⚠️ Xcode version
Expo SDK 54 requires **Xcode 16.1+** (SDK 54 ships the iOS 26 SDK era). If your
Mac runs **Xcode 14.2**, a *local* build will fail on SDK requirements.

**You have two paths:**

#### Option A — EAS cloud build (NO Xcode needed — best with Xcode 14.2)
```bash
# Ad-hoc IPA you can install directly on YOUR device (drag into Finder → Devices):
eas build --platform ios --profile preview

# TestFlight distribution:
eas build --platform ios --profile production
eas submit --platform ios    # → appears in TestFlight, install from the app
```
EAS builds on Apple's cloud Macs with current Xcode, so your local Xcode
version never matters. You only need an Apple ID (free tier is fine for
personal ad-hoc/TestFlight use with a registered device).

#### Option B — Local build in Xcode
Only if you upgrade to **Xcode 16.1+** (free from the Mac App Store; requires
macOS 14.5+ / Sequoia):
```bash
npx expo run:ios             # generates ios/ and opens the workspace
# In Xcode: select your signing team (Signing & Capabilities),
# pick a device or "Any iOS Device", then Product → Archive.
# Organizer → Distribute App → Ad Hoc / Development → export .ipa
```

## 3. Host the web version on GitHub

The app is fully web-capable (`npx expo export --platform web` → `dist/`).

### 3.1 Push the project to GitHub
```bash
cd palworld-pda
git init
git add -A
git commit -m "HC Labs Palworld PDA v1.0"
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/palworld-pda.git
git push -u origin main
```

### 3.2 Deploy to GitHub Pages (automatic)
The repo ships with a workflow at `.github/workflows/deploy-pages.yml` that
builds the web export and publishes it to Pages on every push.

1. On GitHub open your repo → **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. That's it. After the first run, your app is live at:
   `https://<YOUR-USERNAME>.github.io/palworld-pda/`

### 3.3 How others (and you) access it
- **Hosted app:** open the Pages URL above on any device — desktop or phone browser.
- **Run from source:** clone → `npm install` → `npm run web` → http://localhost:8081
- **Expo Go on your phone:** `npx expo start` → scan the QR code with the Expo Go app (same Wi-Fi).

### 3.4 Alternative hosts (also one-command)
```bash
npm i -g vercel && vercel            # Vercel — deploys npx expo export output
npm i -g netlify-cli && netlify deploy --prod -d dist
```

## 4. Verifying before shipping

```bash
npm run typecheck     # strict TypeScript, zero errors
npm run web           # dev server
npx expo export --platform web   # production web build → dist/
```

---

### Project facts
- 299 species indexed · official 1.0 Paldeck numbers, CombiRank breeding ranks,
  stats and elements from the game files (pal-atlas datamine, MIT).
- 238 official special breeding pairs from `DT_PalCombiUnique` (256 rows minus
  deprecated-codename leftovers) + formula eligibility rules (legendaries and
  special children never appear as formula results).
- 1,329 real map markers (towers, alphas, fast travel, effigies, chests,
  dungeons, Soralite) plotted on the game-extracted base maps (MIT).
- 350+ bundled official Pal icons; everything runs offline.
