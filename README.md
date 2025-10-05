# CUPOLA QUEST 🚀🌍

> An interactive geolocation guessing game using real Earth photos seen from the ISS Cupola (observation window)

- Demo: https://cupola-quest.vercel.app
- Platform: Web

## 🛰️ Summary
CUPOLA QUEST is an interactive web-based game inspired by the breathtaking Earth views from the International Space Station's Cupola.

Using real ISS images, players guess where each photo was taken by placing a pin on a world map. Scores are calculated based on both distance accuracy and response time, turning real astronaut photography into an exciting global guessing challenge.

The project addresses the challenge by transforming sight—one of the ISS's most profound sensory experiences—into an accessible, visual learning tool. It shifts the experience from "just watching" to active discovery, allowing anyone to explore Earth through an astronaut's eyes.

By combining NASA's open data, interactive design, and game mechanics, CUPOLA QUEST engages people of all ages.

“You started playing, and before you knew it, you loved space.” — This is the experience CUPOLA QUEST aims to deliver.

## 🎮 How It Works
- View real ISS photos: At the start of a round, you see an Earth photo taken from the Cupola.
- Guess on the map: Rotate and zoom the 3D globe (MapLibre GL) to infer the shooting location.
- Drop a pin and submit: Click the map to select coordinates, then submit.
- See results: The correct location and your guess are connected by a line. Your round score combines distance points + time bonus.
- Try again: Return home to start a new round and chase a higher score.

## 🏆 Scoring
- Distance points (up to 7,000): Based on distance; closer guesses score higher.
- Time bonus (up to 3,000): The faster you submit, the larger the bonus (max within 10s; 0 after 180s).
- Total: Distance points + time bonus = up to 10,000 per round.

## ✨ Features
- 3D globe interactions: Rotate/zoom and place markers by clicking 🗺️
- Real-time time-bonus bar: Visualizes how response time affects score ⏱️
- Responsive UI: Natural layouts for desktop and mobile 📱
- Round-based flow: Review results and retry quickly 🔁

## 🛠️ Tech Stack
- React + TypeScript — Modern frontend with type safety
- Vite — Fast development server and bundling
- MapLibre GL JS — 3D globe rendering and interaction
- Python — Collects/refines NASA images/metadata (preprocessing)
- Node.js & npm — Package management and script execution
- Git — Version control
- Vercel — Cloud deployment (https://cupola-quest.vercel.app)

## 📚 NASA Data & Credits
CUPOLA QUEST is built on NASA open data and resources. This project does not imply NASA’s endorsement, approval, or sponsorship.

- Example data sources
  - NASA Earth Observatory collections (e.g., articles and image sets)
  - Gateway to Astronaut Photography of Earth (JSC EOL)
  - Example image IDs: `ISS064-E-6310`, `ISS062-E-117852`, etc.
- Example reference images/topics
  - “Parmitano with camera in Cupola”
  - “Cupola with Shutters Open”
  - “ISS062-E-117852”

## 🚀 Getting Started (Local)
- Requirements: Node.js 18+ recommended

```bash
npm install
npm run dev
```

- Production build/preview
```bash
npm run build
npm run preview
```

Deployment uses Vercel. Connecting the repository allows automatic deployments after building the `main` branch.

## 👀 How to Play
1) Observe the photo. Look for clues such as colors, terrain, coastlines, and city lights.
2) Rotate the 3D globe to narrow down candidate regions.
3) Click the map to drop a pin and submit.
4) Your score appears as the sum of distance and time bonus.
5) Return home to start a new round.

## 🙏 Acknowledgements
- NASA Earth Observatory; Gateway to Astronaut Photography of Earth (JSC)
- Open-source community (MapLibre GL, React, etc.)

Have fun, and fall in love with Earth again through an astronaut’s eyes! 🌏✨

---
Questions/feedback are welcome. Open an issue or PR to help improve the project. 🙌

