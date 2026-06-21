const header = document.getElementById("siteHeader");
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const year = document.getElementById("year");
const form = document.querySelector(".contact-form");
const formStatus = document.getElementById("formStatus");
const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".nav-menu a")];

year.textContent = new Date().getFullYear();

const setHeaderState = () => {
  header.classList.toggle("scrolled", window.scrollY > 18);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.innerHTML = isOpen
    ? '<i class="fa-solid fa-xmark"></i>'
    : '<i class="fa-solid fa-bars"></i>';
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  });
});

const soundStyles = document.createElement("style");
soundStyles.textContent = `
  .sound-toggle {
    position: fixed;
    right: 18px;
    bottom: 18px;
    z-index: 120;
    min-width: 48px;
    min-height: 48px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    padding: 12px 16px;
    border: 1px solid rgba(255, 255, 255, 0.22);
    border-radius: 8px;
    background: rgba(8, 21, 38, 0.86);
    color: #ffffff;
    font: inherit;
    font-weight: 800;
    box-shadow: 0 16px 40px rgba(2, 9, 20, 0.28);
    backdrop-filter: blur(16px);
    cursor: pointer;
    transition: transform 0.22s ease, background 0.22s ease, border-color 0.22s ease;
  }

  .sound-toggle:hover {
    transform: translateY(-3px);
    background: rgba(13, 32, 54, 0.94);
    border-color: rgba(212, 175, 55, 0.55);
  }

  .sound-toggle i {
    color: #d4af37;
  }

  .sound-toggle.sound-on {
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.95), rgba(242, 212, 106, 0.95));
    color: #0b1726;
    border-color: rgba(255, 255, 255, 0.18);
  }

  .sound-toggle.sound-on i {
    color: #0b1726;
  }

  @media (max-width: 760px) {
    .sound-toggle {
      right: 14px;
      bottom: 14px;
      padding: 12px;
    }

    .sound-toggle span {
      display: none;
    }
  }
`;
document.head.appendChild(soundStyles);

const soundToggle = document.createElement("button");
soundToggle.className = "sound-toggle";
soundToggle.id = "soundToggle";
soundToggle.type = "button";
soundToggle.setAttribute("aria-pressed", "false");
soundToggle.setAttribute("aria-label", "Play AI welcome");
soundToggle.innerHTML = '<i class="fa-solid fa-play"></i><span>AI welcome</span>';
document.body.appendChild(soundToggle);

let isSoundOn = false;
let hasAudioStarted = false;
const aiWelcome = new Audio(
  "https://storage.googleapis.com/adm--audio-playback--7d--public/mcp-preview/f709e545-3cf1-4af6-9aa0-5c62224efe03.mp3"
);
aiWelcome.preload = "metadata";

const updateSoundButton = () => {
  soundToggle.classList.toggle("sound-on", isSoundOn);
  soundToggle.setAttribute("aria-pressed", String(isSoundOn));
  soundToggle.setAttribute("aria-label", isSoundOn ? "Pause AI welcome" : "Play AI welcome");
  soundToggle.innerHTML = isSoundOn
    ? '<i class="fa-solid fa-pause"></i><span>Pause welcome</span>'
    : '<i class="fa-solid fa-play"></i><span>AI welcome</span>';
};

const stopIntroMusic = () => {
  isSoundOn = false;
  aiWelcome.pause();
  updateSoundButton();
};

const startIntroMusic = async () => {
  isSoundOn = true;
  hasAudioStarted = true;
  updateSoundButton();
  await aiWelcome.play();
};

aiWelcome.addEventListener("ended", () => {
  aiWelcome.currentTime = 0;
  stopIntroMusic();
});

aiWelcome.addEventListener("error", () => {
  stopIntroMusic();
});

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
