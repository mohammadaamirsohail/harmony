import React, { useState, useEffect, useRef } from "react";
import "./Player.css";

function SkeletonCard() {
  return (
    <div className="song-card skeleton">
      <div className="sk-thumb" />
      <div className="sk-info">
        <div className="sk-line sk-t" />
        <div className="sk-line sk-a" />
      </div>
    </div>
  );
}

export default function Player({ songs, loading, moodData, currentSong, onSelectSong, onShuffle, searchQuery }) {
  const audioRef     = useRef(null);
  const songsRef     = useRef(songs);
  const currentRef   = useRef(currentSong);
  const intervalRef  = useRef(null);
  const skipTimerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [duration,  setDuration]  = useState(0);
  const [volume,    setVolume]    = useState(80);
  const [skipped,   setSkipped]   = useState(null);

  // Keep refs in sync
  useEffect(() => { songsRef.current  = songs;       }, [songs]);
  useEffect(() => { currentRef.current = currentSong; }, [currentSong]);

  const autoSkipToNext = () => {
    const list = songsRef.current;
    const curr = currentRef.current;
    if (!list.length || !curr) return;
    const idx  = list.findIndex((s) => s.id === curr.id);
    const next = list[(idx + 1) % list.length];
    setSkipped(curr.title);
    setTimeout(() => setSkipped(null), 3000);
    onSelectSong(next);
  };

  // When currentSong changes — load and play new audio
  useEffect(() => {
    if (!currentSong?.audioUrl) return;
    const audio = audioRef.current;
    clearInterval(intervalRef.current);
    clearTimeout(skipTimerRef.current);
    setProgress(0);
    setDuration(0);

    audio.src = currentSong.audioUrl;
    audio.volume = volume / 100;
    audio.load();

    const onCanPlay = () => {
      setDuration(audio.duration);
      audio.play().then(() => setIsPlaying(true)).catch(() => autoSkipToNext());
    };

    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration);
    const onEnded = () => autoSkipToNext();
    const onError = () => {
      skipTimerRef.current = setTimeout(() => autoSkipToNext(), 1000);
    };

    audio.addEventListener("canplay",        onCanPlay);
    audio.addEventListener("timeupdate",     onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("ended",          onEnded);
    audio.addEventListener("error",          onError);

    // Safety net — if nothing plays in 8s, skip
    skipTimerRef.current = setTimeout(() => {
      if (audio.paused && audio.readyState < 3) autoSkipToNext();
    }, 8000);

    return () => {
      audio.removeEventListener("canplay",        onCanPlay);
      audio.removeEventListener("timeupdate",     onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("ended",          onEnded);
      audio.removeEventListener("error",          onError);
      clearInterval(intervalRef.current);
      clearTimeout(skipTimerRef.current);
    };
  }, [currentSong]); // eslint-disable-line

  // Volume change
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;
    if (isPlaying) { audio.pause(); setIsPlaying(false); }
    else           { audio.play().then(() => setIsPlaying(true)).catch(() => {}); }
  };

  const seek = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect  = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * duration;
    setProgress(ratio * duration);
  };

  const fmt = (s) => {
    if (!s || isNaN(s)) return "0:00";
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  };

  const pct = duration ? (progress / duration) * 100 : 0;

  const prevSong = () => {
    if (!currentSong) return;
    const idx = songs.findIndex((s) => s.id === currentSong.id);
    onSelectSong(songs[(idx - 1 + songs.length) % songs.length]);
  };

  const nextSong = () => {
    if (!currentSong) return;
    const idx = songs.findIndex((s) => s.id === currentSong.id);
    onSelectSong(songs[(idx + 1) % songs.length]);
  };

  return (
    <div className="player">
      {/* Hidden HTML5 audio element */}
      <audio ref={audioRef} preload="auto" />

      {/* Auto skip notification */}
      {skipped && (
        <div className="skip-toast">
          ⏭ Skipped unplayable song — playing next
        </div>
      )}

      {/* Header */}
      <div className="player-head">
        <h2 className="pl-title">
          {moodData
            ? <><span style={{ color: moodData.color }}>{moodData.emoji}</span> {moodData.label} Playlist</>
            : `🔍 Results for "${searchQuery}"`}
        </h2>
        <div className="pl-right">
          <span className="pl-count">{loading ? "Loading…" : `${songs.length} songs`}</span>
          {!loading && songs.length > 0 && (
            <button className="shuffle-btn" onClick={onShuffle} title="Get fresh songs">
              🔀 Shuffle
            </button>
          )}
        </div>
      </div>

      {/* Now Playing */}
      {currentSong && (
        <div className="now-playing" style={{ "--mc": moodData?.color || "var(--accent)" }}>
          <img src={currentSong.thumbnail} alt={currentSong.title} className="np-thumb" />
          <div className="np-info">
            <p className="np-title">{currentSong.title}</p>
            <p className="np-channel">{currentSong.channel}</p>
            <div className="prog-wrap">
              <span className="time-label">{fmt(progress)}</span>
              <div className="prog-bar" onClick={seek}>
                <div className="prog-fill" style={{ width: `${pct}%` }} />
                <div className="prog-thumb" style={{ left: `${pct}%` }} />
              </div>
              <span className="time-label">{fmt(duration)}</span>
            </div>
          </div>
          <div className="np-right">
            <button className="big-play" onClick={togglePlay}
              style={{ "--mc": moodData?.color || "var(--accent)" }}>
              {isPlaying ? "⏸" : "▶"}
            </button>
            <div className="skip-btns">
              <button onClick={prevSong}>⏮</button>
              <button onClick={nextSong}>⏭</button>
            </div>
            <div className="vol-wrap">
              <span>🔊</span>
              <input type="range" min="0" max="100" value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="vol-slider" />
            </div>
          </div>
        </div>
      )}

      {/* Song List */}
      <div className="song-list">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : songs.map((song, i) => {
              const active = currentSong?.id === song.id;
              return (
                <button key={song.id}
                  className={`song-card ${active ? "active" : ""}`}
                  style={{ "--mc": moodData?.color || "var(--accent)", animationDelay: `${i * 0.04}s` }}
                  onClick={() => onSelectSong(song)}>
                  <span className="s-num">{active && isPlaying ? "♪" : i + 1}</span>
                  <img src={song.thumbnail} alt={song.title} className="s-thumb" />
                  <div className="s-info">
                    <p className="s-title">{song.title}</p>
                    <p className="s-channel">{song.channel}</p>
                  </div>
                  {/* Album badge instead of YT link */}
                  {song.album && (
                    <span className="yt-link" title={song.album}>
                      💿 {song.album.length > 12 ? song.album.slice(0, 12) + "…" : song.album}
                    </span>
                  )}
                </button>
              );
            })}
      </div>
    </div>
  );
}