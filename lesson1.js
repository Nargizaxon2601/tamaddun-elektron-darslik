document.addEventListener("DOMContentLoaded", () => {
  const storyCard = document.querySelector(".story-card");

  if (storyCard) {
    storyCard.style.opacity = "0";
    storyCard.style.transform = "translateY(40px)";

    setTimeout(() => {
      storyCard.style.transition = "all .8s ease";

      storyCard.style.opacity = "1";
      storyCard.style.transform = "translateY(0)";
    }, 300);
  }
});

/* ==========================
   STEP ANIMATION
========================== */

const activeStep = document.querySelector(".step.active");

if (activeStep) {
  setInterval(() => {
    activeStep.style.transform = "scale(1.1)";

    setTimeout(() => {
      activeStep.style.transform = "scale(1)";
    }, 500);
  }, 1500);
}

/* ==========================
   NEXT BUTTON EFFECT
========================== */

const nextBtn = document.querySelector(".next-btn");

if (nextBtn) {
  nextBtn.addEventListener("mouseenter", () => {
    nextBtn.style.boxShadow = "0 10px 30px rgba(23,168,75,.4)";
  });

  nextBtn.addEventListener("mouseleave", () => {
    nextBtn.style.boxShadow = "none";
  });
}

/* ==========================
   PARALLAX IMAGE
========================== */

const lessonImage = document.querySelector(".lesson-right img");

window.addEventListener("mousemove", (e) => {
  if (!lessonImage) return;

  let x = (window.innerWidth / 2 - e.pageX) / 60;

  let y = (window.innerHeight / 2 - e.pageY) / 60;

  lessonImage.style.transform = `translate(${x}px,${y}px)`;
});

/* ==========================
   BUTTON RIPPLE
========================== */

document.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    const ripple = document.createElement("span");

    ripple.classList.add("ripple");

    const rect = this.getBoundingClientRect();

    ripple.style.left = e.clientX - rect.left + "px";

    ripple.style.top = e.clientY - rect.top + "px";

    this.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
});

/* ==========================
   CONSOLE
========================== */

console.log(
  "%cLESSON 1 READY 🚀",

  "color:#1d74ff;font-size:18px;font-weight:bold"
);
