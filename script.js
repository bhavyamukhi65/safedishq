/*
  GARBA NIGHT — editable event configuration
  Replace RSVP_LINK with the real RSVP URL when you have it.
*/
const EVENT = {
  name: "Garba Night",
  date: "2026-10-25",
  displayDate: "25 October 2026",
  day: "Sunday",
  venue: "Pudsey Civic Hall",
  location: "Pudsey, Leeds",
  organisers: "VANSHI SHAH & BHAVYA PATEL",
  rsvpLink: "YOUR_RSVP_LINK_HERE"
};

const RSVP_LINK = EVENT.rsvpLink;

document.addEventListener("DOMContentLoaded", () => {
  initRSVP();
  initCountdown();
  initRevealAnimations();
  initSparkles();
  initCalendar();
});

function initRSVP() {
  const button = document.getElementById("rsvp-button");
  const note = document.getElementById("rsvp-note");

  if (RSVP_LINK && RSVP_LINK !== "YOUR_RSVP_LINK_HERE") {
    button.href = RSVP_LINK;
    button.target = "_blank";
    button.rel = "noopener noreferrer";
    note.textContent = "We look forward to celebrating with you.";
  } else {
    button.href = "#rsvp";
    button.addEventListener("click", (event) => {
      event.preventDefault();
      note.textContent = "RSVP_LINK is not set yet. Add your RSVP URL near the top of script.js.";
      note.classList.add("is-alert");
    });
  }
}

function getEventStart() {
  // The invitation provides a date but no event start time.
  // Countdown therefore ends at the start of 25 October in the visitor's local timezone.
  const [year, month, day] = EVENT.date.split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

function initCountdown() {
  const days = document.getElementById("days");
  const hours = document.getElementById("hours");
  const minutes = document.getElementById("minutes");
  const seconds = document.getElementById("seconds");
  const timer = document.getElementById("countdown-timer");
  const tonight = document.getElementById("tonight-message");

  function update() {
    const now = new Date();
    const diff = getEventStart() - now;

    if (diff <= 0) {
      timer.hidden = true;
      tonight.hidden = false;
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const d = Math.floor(totalSeconds / 86400);
    const h = Math.floor((totalSeconds % 86400) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    days.textContent = String(d).padStart(2, "0");
    hours.textContent = String(h).padStart(2, "0");
    minutes.textContent = String(m).padStart(2, "0");
    seconds.textContent = String(s).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

function initRevealAnimations() {
  const elements = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    elements.forEach(el => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
}

function initCalendar() {
  document.getElementById("calendar-button").addEventListener("click", downloadICS);
}

function downloadICS() {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Garba Night//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:garba-night-2026-10-25@local",
    "DTSTAMP:20261002T000000Z",
    "DTSTART;VALUE=DATE:20261025",
    "DTEND;VALUE=DATE:20261026",
    `SUMMARY:${escapeICS(EVENT.name)}`,
    `LOCATION:${escapeICS(EVENT.venue + ", " + EVENT.location)}`,
    `DESCRIPTION:${escapeICS("Garba Night — " + EVENT.venue + ", " + EVENT.location + ". Organised by " + EVENT.organisers + ".")}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "garba-night-25-october-2026.ics";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function escapeICS(value) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

function initSparkles() {
  const canvas = document.getElementById("sparkle-canvas");
  const ctx = canvas.getContext("2d", { alpha: true });
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!ctx || reduceMotion) return;

  let particles = [];
  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createParticles();
  }

  function createParticles() {
    const count = Math.min(42, Math.max(18, Math.floor((width * height) / 32000)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.4 + .35,
      alpha: Math.random() * .45 + .12,
      speed: Math.random() * .18 + .05,
      phase: Math.random() * Math.PI * 2
    }));
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.y -= p.speed;
      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      const pulse = (Math.sin(time * .0012 + p.phase) + 1) / 2;
      ctx.beginPath();
      ctx.fillStyle = `rgba(183, 151, 88, ${p.alpha * (.55 + pulse * .45)})`;
      ctx.arc(p.x, p.y, p.r + pulse * .45, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize, { passive: true });
  requestAnimationFrame(draw);
}
