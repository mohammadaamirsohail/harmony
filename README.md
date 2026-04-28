# 🎵 Harmony – Full Song Music App (YouTube Edition)

Play **full songs** based on your mood using YouTube Data API.  
No Spotify Premium needed. No 30-second limits. 100% free.

---

## 📁 Structure

```
harmony-yt/
├── backend/
│   ├── server.js        # Express + YouTube API
│   ├── .env.example     # Copy → .env, add your key
│   └── package.json
└── frontend/
    ├── public/index.html
    ├── src/
    │   ├── App.js / App.css
    │   ├── index.js / index.css
    │   └── components/
    │       ├── Chatbot.js / Chatbot.css
    │       └── Player.js  / Player.css
    └── package.json
```

---

## 🔑 Get Your FREE YouTube API Key (5 minutes)

1. Go to → https://console.cloud.google.com/
2. Create a new project (name it "Harmony")
3. Click **"Enable APIs and Services"**
4. Search **"YouTube Data API v3"** → Enable it
5. Go to **Credentials** → **Create Credentials** → **API Key**
6. Copy the key ✅

**Free quota:** 10,000 units/day (each search = 100 units → ~100 searches/day free)

---

## 🚀 Running the App

### Backend
```bash
cd harmony-yt/backend
npm install
cp .env.example .env
# Open .env and paste your YouTube API key
npm run dev
# ✅ Runs on http://localhost:5000
```

### Frontend
```bash
cd harmony-yt/frontend
npm install
npm start
# ✅ Runs on http://localhost:3000
```

---

## 🎯 Features

- 8 moods: Happy, Sad, Romantic, Alone, Energetic, Angry, Peaceful, Nostalgic
- **Full songs** via YouTube IFrame API (no 30s limit!)
- Seekable progress bar
- Volume control
- Skip prev/next
- Auto-play next song
- Skeleton loading states
- Mood-colored UI that shifts per mood

---

## ⚙️ .env file (backend/.env)

```
YOUTUBE_API_KEY=paste_your_key_here
PORT=5000
```

---

## 🛠 Tech Stack

| Layer    | Tech                     |
|----------|--------------------------|
| Frontend | React 18, CSS            |
| Backend  | Node.js, Express         |
| Music    | YouTube Data API v3      |
| Player   | YouTube IFrame API       |
