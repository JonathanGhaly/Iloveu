(() => {
  const openButton = document.getElementById("open-letter");
  const revealButton = document.getElementById("reveal-letter");
  const paper = document.getElementById("letter-paper");
  const hint = document.getElementById("letter-hint");
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  const toast = document.getElementById("toast");
  const heartButton = document.getElementById("heart-button");
  const readLetterButton = document.getElementById("reveal-letter");
  const loveSong = document.getElementById("love-song");
  const letterContent = document.getElementById("letter-content");
  const letterHint = document.getElementById("letter-hint");

  readLetterButton.addEventListener("click", async () => {
      // Reveal the letter
      letterContent.classList.add("visible");

      if (letterHint) {
          letterHint.style.display = "none";
      }

      // Start the song from the beginning
      try {
          loveSong.currentTime = 0;
          await loveSong.play();
      } catch (error) {
          console.error("Could not play the song:", error);
      }
  });
  function revealLetter() {
    paper.classList.add("is-open");
    if (hint) hint.hidden = true;
    paper.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  openButton?.addEventListener("click", () => {
    revealLetter();
    openButton.textContent = "Your letter is open ♡";
  });
  revealButton?.addEventListener("click", revealLetter);

  menuButton?.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });
  nav?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton?.setAttribute("aria-expanded", "false");
    });
  });

  heartButton?.addEventListener("click", () => {
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 2200);
    heartButton.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.25)" }, { transform: "scale(1)" }],
      { duration: 420, easing: "ease-out" }
    );
  });

  const sections = [...document.querySelectorAll("main section[id]")];
  const links = [...document.querySelectorAll(".nav-links a")];
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
        }
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach(section => observer.observe(section));
  }

  // Local two-song playlist. Browsers may block audible autoplay until the
  // visitor interacts with the page; after the first play, tracks advance automatically.
  const tracks = [
    { audio: document.getElementById("song-one"), title: "تملي معاك", artist: "Amr Diab · Tamally Maak" },
    { audio: document.getElementById("song-two"), title: "Can't Help Falling in Love", artist: "Elvis Presley" }
  ];
  const titleNode = document.getElementById("track-title");
  const artistNode = document.getElementById("track-artist");
  const playButton = document.getElementById("play-pause");
  const nextButton = document.getElementById("next-track");
  const indicator = document.getElementById("playing-indicator");
  const note = document.getElementById("autoplay-note");
  const progress = document.getElementById("progress-fill");
  const timeNode = document.getElementById("track-time");
  let currentTrack = 0;
  let hasStarted = false;

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  }

  function showTrack(index) {
    currentTrack = (index + tracks.length) % tracks.length;
    titleNode.textContent = tracks[currentTrack].title;
    artistNode.textContent = tracks[currentTrack].artist;
    tracks.forEach((track, i) => {
      if (i !== currentTrack) {
        track.audio.pause();
        track.audio.currentTime = 0;
      }
    });
    progress.style.width = "0%";
    timeNode.textContent = "0:00";
  }

  async function playCurrent() {
    const audio = tracks[currentTrack].audio;
    try {
      await audio.play();
      hasStarted = true;
      playButton.textContent = "Ⅱ";
      playButton.setAttribute("aria-label", "Pause music");
      indicator.textContent = "PLAYING";
      note.textContent = "Our soundtrack is playing. The next song will start automatically.";
    } catch (error) {
      playButton.textContent = "▶";
      playButton.setAttribute("aria-label", "Play music");
      indicator.textContent = "READY";
      note.textContent = "Your browser blocked autoplay. Tap the play button once; the songs will then continue automatically.";
    }
  }

  function pauseCurrent() {
    tracks[currentTrack].audio.pause();
    playButton.textContent = "▶";
    playButton.setAttribute("aria-label", "Play music");
    indicator.textContent = "PAUSED";
  }

  playButton?.addEventListener("click", () => {
    if (tracks[currentTrack].audio.paused) playCurrent();
    else pauseCurrent();
  });

  nextButton?.addEventListener("click", async () => {
    showTrack(currentTrack + 1);
    await playCurrent();
  });

  tracks.forEach((track, index) => {
    track.audio.addEventListener("ended", () => {
      showTrack(index + 1);
      playCurrent();
    });
    track.audio.addEventListener("timeupdate", () => {
      if (index !== currentTrack) return;
      const audio = track.audio;
      const percent = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
      progress.style.width = `${percent}%`;
      timeNode.textContent = formatTime(audio.currentTime);
    });
    track.audio.addEventListener("error", () => {
      if (index === currentTrack) {
        indicator.textContent = "FILE MISSING";
        note.textContent = "Add both MP3 files to assets/music using the exact filenames listed in the README.";
      }
    });
  });

  // Attempt autoplay on page load. If the browser disallows it, the visible
  // play control provides the required first user gesture.
  showTrack(0);
  window.addEventListener("load", () => {
    playCurrent();
  }, { once: true });

})();