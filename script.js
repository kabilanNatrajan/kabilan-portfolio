document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Page loader ---------- */
window.addEventListener("load", () => {
  const loader = document.getElementById("page-loader");
  setTimeout(() => loader.classList.add("hidden"), 700);
});

/* ---------- Scroll progress bar ---------- */
const progressBar = document.getElementById("scroll-progress");
function updateProgress() {
  const scrollTop = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const pct = height > 0 ? (scrollTop / height) * 100 : 0;
  progressBar.style.width = pct + "%";
}
document.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

/* ---------- Navbar scrolled state ---------- */
const navbar = document.getElementById("navbar");
function updateNavbar() {
  navbar.classList.toggle("scrolled", window.scrollY > 12);
}
document.addEventListener("scroll", updateNavbar, { passive: true });
updateNavbar();

/* ---------- Theme toggle (persists via localStorage) ---------- */
const root = document.documentElement;
const THEME_KEY = "kn-portfolio-theme";

function applyTheme(theme) {
  root.classList.toggle("light", theme === "light");
  const icon = theme === "light" ? "🌙" : "☀";
  document.getElementById("theme-toggle").textContent = icon;
  document.getElementById("theme-toggle-mobile").textContent = icon;
}

const savedTheme = localStorage.getItem(THEME_KEY) || "dark";
applyTheme(savedTheme);

function toggleTheme() {
  const isLight = root.classList.contains("light");
  const next = isLight ? "dark" : "light";
  applyTheme(next);
  localStorage.setItem(THEME_KEY, next);
}
document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
document.getElementById("theme-toggle-mobile").addEventListener("click", toggleTheme);

/* ---------- Mobile menu ---------- */
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
menuToggle.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("open");
  menuToggle.textContent = isOpen ? "✕" : "☰";
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    menuToggle.textContent = "☰";
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

/* ---------- Scroll-spy active nav ---------- */
const sectionIds = [
  "about", "skills", "timeline", "projects",
  "education", "certifications", "achievements", "contact",
];
const navLinks = document.querySelectorAll("[data-nav]");
const navLinksMobile = document.querySelectorAll("[data-nav-m]");

const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((l) => l.classList.toggle("active", l.dataset.nav === id));
        navLinksMobile.forEach((l) => l.classList.toggle("active", l.dataset.navM === id));
      }
    });
  },
  { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
);
sectionIds.forEach((id) => {
  const el = document.getElementById(id);
  if (el) spyObserver.observe(el);
});

/* ---------- Scroll-triggered reveal animations ---------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "-40px" }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* ---------- Animated skill bars ---------- */
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector(".skill-bar-fill");
        const level = entry.target.dataset.level;
        if (fill) fill.style.width = level + "%";
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);
document.querySelectorAll(".skill-row").forEach((el) => skillObserver.observe(el));

/* ---------- Contact form (mailto fallback) ---------- */
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const name = data.get("name");
  const email = data.get("email");
  const subject = data.get("subject") || "Portfolio contact";
  const message = data.get("message");

  const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
  const mailto = `mailto:kabilann.23mts@kongu.edu?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  window.location.href = mailto;

  status.hidden = false;
  status.classList.add("success");
  status.textContent = "Opening your email client to send this message…";
});
