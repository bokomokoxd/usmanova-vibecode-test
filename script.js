// Smooth scroll
document.querySelectorAll("[data-scroll]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = document.querySelector(btn.dataset.scroll);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// Quiz goal filter
const quizOptions = document.querySelectorAll(".quiz__option");
const programCards = document.querySelectorAll(".program-card");

quizOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const goal = option.dataset.goal;
    quizOptions.forEach((item) => item.classList.toggle("is-active", item === option));
    programCards.forEach((card) => {
      card.classList.toggle("is-dimmed", card.dataset.type !== goal);
    });
  });
});

// Form submit
const form = document.querySelector("#requestForm");
const formStatus = document.querySelector("#formStatus");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const digits = String(data.phone || "").replace(/\D/g, "");

  if (digits.length < 10) {
    formStatus.textContent = "Проверьте телефон: нужно минимум 10 цифр.";
    formStatus.style.color = "#d93f7b";
    return;
  }

  const leads = JSON.parse(localStorage.getItem("usmanova_leads") || "[]");
  leads.push({ ...data, createdAt: new Date().toISOString(), source: "usmanova_vibecode_test" });
  localStorage.setItem("usmanova_leads", JSON.stringify(leads));

  form.reset();
  formStatus.style.color = "#16815c";
  formStatus.textContent = "Заявка сохранена. Менеджер свяжется и подберёт программу.";
});

// Scroll reveal via IntersectionObserver
const revealItems = document.querySelectorAll(".reveal");

if (revealItems.length) {
  revealItems.forEach((el) => el.classList.add("reveal--ready"));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      el.classList.add("is-visible");
      return;
    }

    revealObserver.observe(el);
  });
}

// Sticky header shadow on scroll
const header = document.getElementById("site-header");
window.addEventListener("scroll", () => {
  header.style.boxShadow = window.scrollY > 10
    ? "0 4px 24px rgba(24,24,24,0.08)"
    : "";
}, { passive: true });

// Burger menu (mobile)
const burger = document.getElementById("burger");
const nav = document.querySelector(".site-header__nav");

if (burger && nav) {
  burger.setAttribute("aria-expanded", "false");

  burger.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(isOpen));
  });

  // Close on nav link click
  nav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    });
  });
}
