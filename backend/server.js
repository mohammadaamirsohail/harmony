require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ─── HINDI ONLY Query Bank ────────────────────────────────────────────────────
const moodQueryBank = {
  happy: [
    "happy bollywood songs 2024", "khushi ke bollywood gane",
    "happy hindi songs playlist", "bollywood dance songs 2024",
    "happy arijit singh hindi songs", "neha kakkar happy songs",
    "bollywood party songs hindi", "superhit hindi songs 2024",
    "bollywood chartbusters 2024", "hindi feel good songs",
    "dil khush karne wale gane", "hindi wedding songs happy",
    "bollywood celebration songs", "happy songs shreya ghoshal",
    "kumar sanu happy songs", "udit narayan happy songs",
    "happy songs sonu nigam", "bollywood morning songs hindi",
    "hindi songs masti", "bollywood fun songs 2023",
    "happy romantic hindi songs 2024", "bollywood superhits 2024",
    "hindi songs dance floor", "latest bollywood hits 2024",
    "top hindi songs this week",
  ],
  sad: [
    "sad bollywood songs 2024", "dard bhari hindi shayari songs",
    "arijit singh sad songs hindi", "atif aslam sad hindi songs",
    "sad hindi songs playlist", "hindi breakup songs",
    "bollywood emotional songs", "sad songs KK hindi",
    "hindi dard bhari gazal", "mohit chauhan sad songs",
    "sad hindi songs that make you cry", "hindi dil toota songs",
    "best sad bollywood songs ever", "sad hindi lofi songs",
    "hindi judai ke gane", "kishore kumar sad songs",
    "lata mangeshkar sad songs", "rafi sad songs hindi",
    "sad hindi songs 90s", "sad bollywood 2023 hits",
    "hindi akele songs sad", "bollywood dard songs",
    "sad hindi songs nights", "hindi songs about missing someone",
    "sad songs javed ali hindi",
  ],
  romantic: [
    "romantic bollywood songs 2024", "hindi love songs arijit singh",
    "best romantic hindi songs ever", "bollywood romantic hits 2023",
    "romantic atif aslam hindi songs", "hindi pyaar ke gane",
    "bollywood Valentine songs hindi", "romantic songs shreya ghoshal",
    "hindi romantic duet songs", "kumar sanu romantic songs",
    "udit narayan romantic songs", "lata rafi romantic duets",
    "90s hindi romantic songs", "hindi shaadi ke gane romantic",
    "bollywood propose songs hindi", "romantic hindi songs 2000s",
    "hindi dil se love songs", "soulful hindi romantic songs",
    "A R Rahman romantic hindi songs", "vishal shekhar romantic songs",
    "hindi new romantic songs 2024", "bollywood soft love songs",
    "hindi songs for girlfriend", "tere bina hindi songs",
    "romantic hindi film songs playlist",
  ],
  alone: [
    "alone hindi songs night", "akele hindi sad songs",
    "hindi lofi songs alone", "bollywood alone songs playlist",
    "hindi songs for lonely night", "arijit singh alone songs",
    "hindi songs akela feel", "midnight hindi songs",
    "alone bollywood songs 2024", "hindi introspective songs",
    "hindi songs 3 baje ki raat", "bollywood breakup alone songs",
    "hindi songs sochte hue", "alone time hindi songs",
    "hindi lofi chill songs", "bollywood alone sad songs",
    "hindi songs rain alone", "alone hindi songs mohit chauhan",
    "hindi songs yaad aati hai", "bollywood songs akela",
    "hindi slow songs alone", "hindi songs raat ko alone",
    "bollywood songs tanhai", "hindi songs door jaana",
    "alone songs KK hindi",
  ],
  energetic: [
    "high energy bollywood songs", "hindi gym songs 2024",
    "energetic bollywood dance songs", "hindi workout songs",
    "bollywood pump up songs", "hard bass hindi songs",
    "energetic punjabi bollywood songs", "hindi rap songs 2024",
    "bollywood item songs energetic", "hindi songs full energy",
    "divine rap songs hindi", "raftaar energetic songs",
    "badshah pump up songs", "yo yo honey singh songs",
    "hindi hip hop songs 2024", "bollywood action songs",
    "energetic hindi songs running", "desi hip hop songs",
    "hindi songs full josh", "bollywood high energy 2023",
    "hindi songs dance floor", "energetic hindi film songs",
    "bollywood songs adrenaline", "hindi songs attitude",
    "mc stan energetic songs",
  ],
  angry: [
    "angry hindi rap songs", "desi rap aggressive hindi",
    "hindi songs frustration", "bollywood angry songs",
    "hard hindi rap 2024", "raftaar angry rap",
    "divine angry songs hindi", "hindi rap battle songs",
    "aggressive desi hip hop", "hindi songs gussa",
    "mc stan rap hindi", "hindi drill music",
    "bollywood songs attitude anger", "hard bass hindi rap",
    "hindi songs revenge", "angry mood bollywood songs",
    "hindi gangster rap songs", "intense hindi songs",
    "hindi songs fighting spirit", "bollywood mass songs",
    "hindi songs josh", "desi trap music hindi",
    "hindi songs power anger", "aggressive hindi film songs",
    "hard hitting hindi rap 2024",
  ],
  peaceful: [
    "peaceful hindi songs", "bollywood relaxing songs",
    "hindi instrumental music peaceful", "shanti hindi songs",
    "bollywood soft songs hindi", "hindi morning songs peaceful",
    "lata mangeshkar soft songs", "hindi bhajans peaceful",
    "bollywood meditation songs", "soft hindi film songs",
    "hindi songs sukoon", "peaceful bollywood 2024",
    "hindi songs calm mind", "bollywood songs raat ki shanti",
    "hindi songs neend", "peaceful A R Rahman hindi songs",
    "hindi classical fusion peaceful", "bollywood songs nature",
    "hindi lullaby songs", "peaceful hindi songs playlist",
    "hindi songs mann ki shanti", "bollywood slow songs peaceful",
    "hindi songs subah ki", "peaceful ghazal hindi",
    "hindi songs for sleep peaceful",
  ],
  nostalgic: [
    "90s bollywood hits hindi", "purane hindi gaane 80s",
    "nostalgic bollywood songs 90s", "kishore kumar classic songs",
    "lata mangeshkar old songs", "rafi sahab classic hindi songs",
    "2000s bollywood hits hindi", "old is gold bollywood hindi",
    "classic hindi film songs", "purane zamane ke gane",
    "90s hindi romantic songs", "bollywood golden era songs",
    "hindi songs childhood memories", "classic kumar sanu songs",
    "udit narayan 90s songs", "old bollywood dance songs",
    "classic hindi songs playlist", "90s bollywood party songs",
    "hindi songs yaadein", "bollywood retro hits",
    "classic asha bhosle songs", "old hindi sad songs",
    "purane bollywood gane 70s", "classic hindi film music",
    "nostalgic hindi songs that hit different",
  ],
};

// ─── Fetch from JioSaavn API ──────────────────────────────────────────────────
async function fetchJioSaavnSongs(query) {
  const response = await axios.get("https://saavn.dev/api/search/songs", {
    params: {
      query: query,
      page: 1,
      limit: 10,
    },
  });

  const results = response.data?.data?.results || [];

  return results
    .filter((song) => song.downloadUrl && song.downloadUrl.length > 0)
    .map((song) => ({
      id:         song.id,
      title:      song.name,
      channel:    song.artists?.primary?.map((a) => a.name).join(", ") || "Unknown Artist",
      thumbnail:  song.image?.[2]?.url || song.image?.[1]?.url || song.image?.[0]?.url || "",
      audioUrl:   song.downloadUrl?.[4]?.url   // 320kbps
                  || song.downloadUrl?.[3]?.url  // 160kbps
                  || song.downloadUrl?.[2]?.url  // 96kbps
                  || song.downloadUrl?.[0]?.url, // fallback
      duration:   song.duration,
      album:      song.album?.name || "",
      language:   song.language || "hindi",
    }));
}

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get("/", (req, res) => res.json({ status: "Harmony API running 🎵" }));
app.get("/api/moods", (req, res) => res.json({ moods: Object.keys(moodQueryBank) }));

// Mood based songs
app.post("/api/mood", async (req, res) => {
  const { mood } = req.body;
  if (!mood) return res.status(400).json({ error: "Mood is required." });

  const normalized = mood.toLowerCase().trim();
  const queries    = moodQueryBank[normalized];
  if (!queries) return res.status(400).json({
    error: `Unknown mood. Try: ${Object.keys(moodQueryBank).join(", ")}`,
  });

  try {
    const shuffled = [...queries].sort(() => Math.random() - 0.5);
    const [r1, r2] = await Promise.allSettled([
      fetchJioSaavnSongs(shuffled[0]),
      fetchJioSaavnSongs(shuffled[1]),
    ]);

    const allSongs = [];
    const seenIds  = new Set();
    for (const r of [r1, r2]) {
      if (r.status === "fulfilled") {
        for (const song of r.value) {
          if (!seenIds.has(song.id)) { seenIds.add(song.id); allSongs.push(song); }
        }
      }
    }

    return res.json({
      mood: normalized,
      songs: allSongs.sort(() => Math.random() - 0.5),
    });
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    return res.status(500).json({ error: "Failed to fetch songs." });
  }
});

// Search any song by name
app.post("/api/search", async (req, res) => {
  const { query } = req.body;
  if (!query || !query.trim()) return res.status(400).json({ error: "Search query is required." });

  try {
    const songs = await fetchJioSaavnSongs(query.trim());
    return res.json({ query: query.trim(), songs });
  } catch (err) {
    console.error("Search error:", err.response?.data || err.message);
    return res.status(500).json({ error: "Search failed. Try again." });
  }
});

app.listen(PORT, () => console.log(`🎵 Harmony running on http://localhost:${PORT}`));