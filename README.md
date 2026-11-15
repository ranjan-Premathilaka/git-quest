# Git Quest

Git Quest is an offline-first Expo and React Native app that teaches Git through short lessons, quizzes, and hands-on command simulations.

## Features

- Five learning modules with 17 detailed lessons, objectives, Git command examples, and lesson navigation.
- Searchable and filterable module catalog.
- Interactive Git terminal simulator and branch history visualizer.
- Knowledge quiz and practical Git challenges with XP rewards.
- Locally saved lesson, quiz, challenge, and XP progress using AsyncStorage.
- Ten screens with stack navigation and a mobile-first dark interface.

Lesson content, modules, quiz questions, and command simulations are bundled with the app, so learning features work offline. Progress is stored on the device.

## Requirements

- Node.js (LTS recommended) and npm
- Expo Go on a compatible Android or iOS device, or an Android/iOS simulator

## Setup

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go, or press `a` / `i` in the Expo CLI to open an available Android / iOS simulator.

Available scripts:

```bash
npm start
npm run android
npm run ios
npm run web
```

The web script requires the Expo web dependencies (`react-dom` and `react-native-web`).

## Project layout

- `src/screens/` — app screens
- `src/navigation/` — React Navigation stack
- `src/data/` — bundled modules, lessons, quiz, and dashboard data
- `src/services/` — local progress storage and Git command simulator
- `src/components/` — reusable interface components
- `assets/` — app icons and splash assets

## License

See [LICENSE](LICENSE).
