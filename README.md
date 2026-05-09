# Expert Booking — Mobile App

BMW M industrial-editorial mobile app. Same flows as the web frontend, native motion (Reanimated worklets, Moti, gesture-handler, haptics).

## Stack

- Expo SDK 54 + React Native 0.81 + React 19 (New Architecture default)
- Expo Router 6 (file-based routing, typed routes)
- TanStack Query 5 for server state
- React Hook Form + Zod for forms
- Reanimated 3 + Moti for animation
- expo-haptics for tactile feedback
- expo-blur for glass-feel surfaces
- socket.io-client for real-time slot updates
- NativeWind v4 + Tailwind v3.4 for styling
- sonner-native for toasts
- AsyncStorage for persisting the user's email

## Setup

### 1. Install dependencies

```bash
cd C:\Users\asnoi\Downloads\expert-booking-mobile
npm install
```

> First install can take 4-8 min — Expo SDK 54 pulls a lot of native modules. Tip: SDK 54 ships precompiled XCFrameworks, so subsequent clean builds are ~10s instead of 2min.

### 2. Backend must be running and reachable

The backend lives at `..\expert-booking-backend`:

```bash
cd ..\expert-booking-backend
npm run dev   # runs on :5000
```

### 3. Pick the right API URL for your test target

Edit `.env` based on **how** you'll run the app:

| Test target | EXPO_PUBLIC_API_BASE_URL |
|---|---|
| iOS Simulator | `http://localhost:5000/api/v1` |
| Android Emulator | `http://10.0.2.2:5000/api/v1` |
| Physical device (same Wi-Fi) | `http://<your-LAN-IP>:5000/api/v1` |

Find your LAN IP on Windows:
```bash
ipconfig
# look for "IPv4 Address" under your Wi-Fi adapter
```

Same applies to `EXPO_PUBLIC_SOCKET_URL` (without the `/api/v1` suffix).

For physical-device testing the backend must also bind to all interfaces — by default Express on `:5000` does this, but verify with:
```bash
curl http://<your-LAN-IP>:5000/health
```

### 4. Make sure CORS allows the mobile app

In the backend `.env`, the mobile app uses Expo's bundler URL. Easiest fix:

```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8081,http://localhost:19006,http://localhost:5173
```

(`8081` is Metro, `19006` is Expo Web. Native socket connections don't enforce CORS — only web/dev-tools do.)

### 5. Start the dev server

```bash
npx expo start
```

You'll get a QR code. Options:
- **iOS**: press `i` (needs Xcode + iOS Simulator)
- **Android**: press `a` (needs Android Studio + emulator running)
- **Physical device**: install **Expo Go** from App Store / Play Store, scan the QR

## What's built

| Screen | File |
|---|---|
| Tab layout (Discover · Bookings) | `app/(tabs)/_layout.tsx` |
| Experts list — search, categories, pagination, pull-to-refresh | `app/(tabs)/index.tsx` |
| My Bookings — email-gated, persisted, status badges | `app/(tabs)/bookings.tsx` |
| Expert detail — parallax hero + bio + live slot grid | `app/expert/[id].tsx` |
| Booking modal — RHF + Zod, confirmation morph | `app/book/[id].tsx` |
| 404 | `app/+not-found.tsx` |

### Animations
- **Card entrance**: Moti `FadeIn` with index-based delay → stagger
- **Card press**: Reanimated spring scale (0.96) + light haptic
- **Slot tile booked transition**: Reanimated `withSequence` flashes the border M-red → settles into the booked state
- **Hero parallax**: Reanimated worklet on scroll (`translateY = scrollY * 0.4`, slight scale)
- **Floating header on scroll**: opacity interpolation kicks in past hero
- **Tab bar**: BlurView on iOS, solid surface-soft on Android
- **Page transitions**: native stack — `slide_from_right` for detail, `slide_from_bottom` (modal) for booking

### Haptics
- Light impact on every press
- Selection on category tap, day tab tap, slot select
- Success notification on booking confirmed
- Warning when a slot you were viewing gets taken by someone else
- Error on booking failure / 409 conflict

## Real-time demo

1. Run the web app on a laptop, the mobile app on phone (or two devices).
2. Open the same expert detail on both.
3. Book a slot from one — watch the same slot tile flash red and turn into a strikethrough on the other, plus a haptic warning if you're on iOS/Android with system haptics on.

## Troubleshooting

| Issue | Fix |
|---|---|
| `Network request failed` | Check API URL — physical device needs LAN IP, not localhost |
| Socket never connects | Backend not running, or wrong `EXPO_PUBLIC_SOCKET_URL` |
| Black screen with logo | Splash didn't auto-hide — add an asset to `assets/splash.png` or check Metro logs |
| Reanimated errors | Make sure `react-native-reanimated/plugin` is the LAST entry in `babel.config.js` and clear cache: `npx expo start -c` |
| `getSocket is not a function` after a reload | Restart the dev server — module-level singletons can lose state on hot reload |
| Status bar overlapping content | `SafeAreaView edges={["top"]}` should handle it; if not, check that the screen has the safe-area provider as a parent |

## Out of scope

Same as web: no auth, no payment, no light mode, no admin dashboard, no i18n.
