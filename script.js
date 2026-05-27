
soundToggle.innerHTML = '<i class="fa-solid fa-volume-xmark"></i><span>Play music</span>';
document.body.appendChild(soundToggle);

let audioContext;
let masterGain;
let introTimer;
let isSoundOn = false;
let hasAudioStarted = false;
let noteIndex = 0;

const introMelody = [
  392.0,
  493.88,
  587.33,
  659.25,
  587.33,
  493.88,
  440.0,
  523.25
];

const updateSoundButton = () => {
  soundToggle.classList.toggle("sound-on", isSoundOn);
  soundToggle.setAttribute("aria-pressed", String(isSoundOn));
  soundToggle.setAttribute("aria-label", isSoundOn ? "Pause opening music" : "Play opening music");
  soundToggle.innerHTML = isSoundOn
    ? '<i class="fa-solid fa-volume-high"></i><span>Music on</span>'
    : '<i class="fa-solid fa-volume-xmark"></i><span>Play music</span>';
};

const playIntroNote = () => {
  if (!audioContext || !masterGain || !isSoundOn) return;

  const now = audioContext.currentTime;
  const frequency = introMelody[noteIndex % introMelody.length];
  const oscillator = audioContext.createOscillator();
  const noteGain = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, now);
  noteGain.gain.setValueAtTime(0.0001, now);
  noteGain.gain.exponentialRampToValueAtTime(0.55, now + 0.04);
  noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.68);

  oscillator.connect(noteGain);
  noteGain.connect(masterGain);
  oscillator.start(now);
  oscillator.stop(now + 0.72);

  noteIndex += 1;
};

const stopIntroMusic = () => {
  isSoundOn = false;
  clearInterval(introTimer);
  introTimer = undefined;

  if (masterGain && audioContext) {
    const now = audioContext.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setTargetAtTime(0.0001, now, 0.08);
  }

  updateSoundButton();
};

const startIntroMusic = async () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.0001;
    masterGain.connect(audioContext.destination);
  }

  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  isSoundOn = true;
  hasAudioStarted = true;
  const now = audioContext.currentTime;
  masterGain.gain.cancelScheduledValues(now);
  masterGain.gain.setTargetAtTime(0.045, now, 0.12);
  updateSoundButton();
  playIntroNote();
  clearInterval(introTimer);
  introTimer = setInterval(playIntroNote, 760);
};

const toggleIntroMusic = () => {
  if (isSoundOn) {
    stopIntroMusic();
    return;
  }

  startIntroMusic().catch(() => {
    stopIntroMusic();
  });
};

const startMusicAfterFirstInteraction = () => {
  if (hasAudioStarted || isSoundOn) return;
  startIntroMusic().catch(() => {
    stopIntroMusic();
  });
};

soundToggle.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleIntroMusic();
});

document.addEventListener("pointerdown", startMusicAfterFirstInteraction, { once: true });
document.addEventListener("keydown", startMusicAfterFirstInteraction, { once: true });

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 5, 4) * 70}ms`;
  revealObserver.observe(element);
});

const activeSectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const activeId = entry.target.id;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`);
      });
    });
  },
  {
    rootMargin: "-42% 0px -48% 0px",
    threshold: 0
  }
);

sections.forEach((section) => activeSectionObserver.observe(section));

form.addEventListener("submit", (event) => {
  if (window.location.protocol === "file:") {
    event.preventDefault();
    formStatus.textContent = "Thank you. On the live website, this form sends messages to Rami's email.";
    form.reset();
    return;
  }

  formStatus.textContent = "Sending your message securely...";
});
r message securely...";
});
