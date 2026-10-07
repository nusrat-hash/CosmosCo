# CosmosCo
CosmosCo is an interactive, web-based space education platform designed to make astronomy accessible to everyone.
# CosmosCo 

An interactive, web-based space education and exploration platform designed to train and inspire the next generation of space explorers.

**Live Demo:** [Insert your hosted website link here, or delete this line if not hosted]

---

##  Project Overview

CosmosCo bridges the gap between heavy astronomical data and accessible education. By tapping into live NASA open data, the platform turns raw cosmic information into an engaging, visual learning journey for young explorers, with a dark, mission-control-inspired interface.

### Core Features

* **Home Dashboard:** A hero landing page with live mission stats (ISS velocity, JWST position at L2, space weather) and NASA's **Astronomy Picture of the Day**.
* **Mission Dispatches (News):** A filterable feed of space science articles (Exoplanets, Planetary, Astrophysics, Artemis Program, Deep Sky) with full article pages. A live strip shows near-Earth objects, active natural events, and the APOD.
* **Real-Time Orbital Tracker:** Telemetry dashboards for the ISS, Tiangong, Hubble, and JWST, including an animated orbital canvas, a ground track, signal sparklines, and pass predictions.
* **3D Solar System:** A fully interactive Three.js solar system. Drag to orbit, scroll to zoom, click a planet for its dossier, with play/pause, speed control, and label toggles.
* **Student Hub:**
  * **HelioSim Orrery:** a 3D orrery with camera presets (Heliocentric, Earth-Moon, Inner Planets, Gas Giants), time scaling, orbit trails, and an AU grid.
  * **Flashcard Deck:** astrophysics concepts with formulas, flip cards, and a mastery tracker.
  * **Daily Challenge:** a timed 5-question quiz with explanations and XP rewards.
  * **Learning Paths:** Orbital Mechanics, Planetary Science, Astrophysics, and Spaceflight Operations.
* **Deep Sky Gallery:** Imagery pulled live from the NASA Image and Video Library, with category tabs and a full-screen lightbox (keyboard navigation supported).
* **Celestial Calendar:** An interactive monthly calendar of meteor showers, lunar phases, conjunctions, and ISS passes, plus headline events with countdowns synced to NASA NeoWs.
* **Mission Live Feed:** A Deep Space Network-style event stream mixing real NASA data (EONET, NeoWs, APOD) with simulated ground-segment chatter.

---

## 🛠️ How It Works & Architecture

CosmosCo is a pure frontend single-page application. It calls open NASA APIs directly from the browser, caches responses in memory, and falls back to bundled sample data if a NASA service is unreachable, so the site always renders.

### Tech Stack

* **Frontend:** React, Vite, React Router
* **Styling:** Tailwind CSS v4 with a custom space theme (Space Grotesk, Inter, JetBrains Mono)
* **3D & Graphics:** Three.js, `@react-three/fiber`, `@react-three/drei`, plus HTML5 Canvas for 2D visualizations
* **Animation & Icons:** Framer Motion, Lucide React
* **Backend:** None (client-side only)
* **Data Sources & APIs:** NASA APOD, NASA NeoWs, NASA Image and Video Library, NASA EONET

### Project Structure

```
src/
├── components/   # Navbar, Footer, Orrery, OrbitalCanvas, GroundTrack, MediaSection, ...
├── pages/        # Home, News, ArticleDetail, Tracker, SolarSystem, StudentHub,
│                 # Gallery, Calendar, LiveFeed, SignalLost (404)
├── data/         # Articles, events, flashcards, quiz, planets, tracked objects
├── lib/nasa.js   # NASA API helpers, in-memory cache, useNasaQuery hook
├── hooks.js      # useCountUp, useNow, useInterval
└── index.css     # Tailwind theme and shared component classes
```

---

##  NASA Open Data Integration

This project uses the following open data resources to drive its live insights:

1. **[APOD (Astronomy Picture of the Day)](https://api.nasa.gov/)** — Powers the featured daily image on the Home page and the News live strip.
2. **[NeoWs (Near Earth Object Web Service)](https://api.nasa.gov/)** — Provides near-Earth asteroid close approaches for the News strip, Celestial Calendar headline countdowns, and the Live Feed.
3. **[NASA Image and Video Library](https://images.nasa.gov/docs/)** (`images-api.nasa.gov`, no key required) — Supplies the Deep Sky Gallery and the Student Hub media archive.
4. **[EONET (Earth Observatory Natural Event Tracker)](https://eonet.gsfc.nasa.gov/)** — Supplies active natural events for the News strip and Live Feed.

> **Note:** Orbital tracker telemetry, space weather stats, and some Live Feed chatter are **simulated** for educational demonstration. They are not real-time spacecraft data. Articles and calendar events are bundled sample content.

---

##  Local Installation & Setup

To run this project locally, follow these steps:

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (v18 or later) and npm installed.

### Step-by-Step Guide

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/<your-repo>.git
   ```

2. **Navigate into the project directory:**
   ```bash
   cd <CosmosCo>
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **(Optional) Add your NASA API key:**
   Get a free key at [api.nasa.gov](https://api.nasa.gov/) and create a `.env` file in the project root:
   ```bash
   VITE_NASA_API_KEY=my_key_here
   ```
   Without a key, the app uses NASA's `DEMO_KEY`, which has strict rate limits. If requests fail, the site falls back to cached sample content.

5. **Launch the application:**
   ```bash
   npm run dev
   ```

6. Open `http://localhost:5173` (or the local link shown in your terminal) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

##  The Team

Developed with 🌌 for the NASA International Space Apps Challenge.

* **Nusrat Binte Zaman** — Frontend Developer, UI Designer, Logic
* **Mst. Tasnim Khanam** — Data Analyst, Documentation, UI Designer

---

##  Acknowledgements

* NASA Open APIs and the NASA Image and Video Library
* The open-source communities behind React, Three.js, Tailwind CSS, and Framer Motion
