/* ==========================
   LOADER
========================== */

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");

  setTimeout(() => {
    loader.style.opacity = "0";

    setTimeout(() => {
      loader.style.display = "none";
    }, 500);
  }, 1200);
});

/* ==========================
   HEADER SCROLL EFFECT
========================== */

const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 80) {
    header.style.top = "10px";
  } else {
    header.style.top = "20px";
  }
});

/* ==========================
   MOBILE MENU
========================== */

const menuBtn = document.querySelector(".menu-btn");

const navbar = document.querySelector(".navbar");

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    navbar.classList.toggle("active");
  });
}

/* ==========================
   HERO PARALLAX
========================== */

const heroImage = document.querySelector(".hero-right img");

window.addEventListener("mousemove", (e) => {
  if (!heroImage) return;

  let x = (window.innerWidth / 2 - e.pageX) / 40;

  let y = (window.innerHeight / 2 - e.pageY) / 40;

  heroImage.style.transform = `translate(${x}px, ${y}px)`;
});

/* ==========================
   FLOATING CARDS
========================== */

const cards = document.querySelectorAll(
  ".feature-card, .value-box, .lesson-card"
);

cards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-10px) scale(1.03)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0) scale(1)";
  });
});

/* ==========================
   REVEAL ON SCROLL
========================== */

const reveals = document.querySelectorAll(
  ".feature-card,\
.value-box,\
.lesson-card,\
.cta,\
.footer-grid div"
);

function revealElements() {
  reveals.forEach((item) => {
    const top = item.getBoundingClientRect().top;

    const screenHeight = window.innerHeight;

    if (top < screenHeight - 120) {
      item.style.opacity = "1";

      item.style.transform = "translateY(0)";
    }
  });
}

reveals.forEach((item) => {
  item.style.opacity = "0";

  item.style.transform = "translateY(50px)";

  item.style.transition = "all .8s ease";
});

window.addEventListener("scroll", revealElements);

revealElements();

/* ==========================
   BUTTON RIPPLE EFFECT
========================== */

const buttons = document.querySelectorAll("button");

buttons.forEach((button) => {
  button.addEventListener("click", function (e) {
    const circle = document.createElement("span");

    circle.classList.add("ripple");

    const rect = this.getBoundingClientRect();

    circle.style.left = e.clientX - rect.left + "px";

    circle.style.top = e.clientY - rect.top + "px";

    this.appendChild(circle);

    setTimeout(() => {
      circle.remove();
    }, 600);
  });
});

/* ==========================
   LESSON CARD CLICK EFFECT
========================== */

const lessonCards = document.querySelectorAll(".lesson-card");

lessonCards.forEach((card) => {
  card.addEventListener("click", () => {
    card.style.transform = "scale(.95)";

    setTimeout(() => {
      card.style.transform = "scale(1)";
    }, 150);
  });
});

/* ==========================
   CLOUD PARALLAX
========================== */

window.addEventListener("scroll", () => {
  const scroll = window.scrollY;

  document.querySelectorAll(".cloud").forEach((cloud, index) => {
    cloud.style.transform = `translateX(${scroll * (0.15 + index * 0.05)}px)`;
  });
});

/* ==========================
   COUNTER ANIMATION
========================== */

function animateValue(element, start, end, duration) {
  let startTime = null;

  function animation(currentTime) {
    if (!startTime) startTime = currentTime;

    let progress = Math.min((currentTime - startTime) / duration, 1);

    element.textContent = Math.floor(progress * (end - start) + start);

    if (progress < 1) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

/* ==========================
   CTA BUTTON GLOW
========================== */

const ctaButton = document.querySelector(".start-btn");

if (ctaButton) {
  setInterval(() => {
    ctaButton.style.boxShadow = "0 0 30px rgba(255,195,40,.8)";

    setTimeout(() => {
      ctaButton.style.boxShadow = "none";
    }, 1000);
  }, 2000);
}

/* ==========================
   NAVBAR ACTIVE LINK
========================== */

const navLinks = document.querySelectorAll(".navbar a");

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((item) => {
      item.classList.remove("active-link");
    });

    link.classList.add("active-link");
  });
});

/* ==========================
   CONSOLE MESSAGE
========================== */

console.log(
  "%cTAMADDUN PLATFORM READY 🚀",

  "color:#1d74ff;font-size:18px;font-weight:bold"
);
