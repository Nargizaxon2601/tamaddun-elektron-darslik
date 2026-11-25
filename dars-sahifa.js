const stages = [...document.querySelectorAll(".stage")];
const progressFill = document.getElementById("progressFill");
const percent = document.getElementById("percent");
const points = document.getElementById("points");
const completed = document.getElementById("completed");
const stepCounter = document.getElementById("stepCounter");

const workTitle = document.getElementById("workTitle");
const workDescription = document.getElementById("workDescription");
const workStatus = document.getElementById("workStatus");
const nextBtn = document.getElementById("nextBtn");

let currentStep = -1;
let earned = 0;
const finished = new Set();

const stageInfo = [
  [
    "Darsga kirish",
    "Bu bosqichda o‘quvchilar dars mavzusiga qiziqtiriladi. Kirish savollari va tanishtiruv materiallari keyin qo‘shiladi.",
  ],
  [
    "Vaziyat va tahlil",
    "Bu yerda hayotiy vaziyat, qahramonlar va muhokama savollari joylashtiriladi.",
  ],
  [
    "Takrorlash o‘yini",
    "Avvalgi mavzuni eslash uchun interaktiv o‘yin shu yerda bo‘ladi.",
  ],
  [
    "Yangi mavzu",
    "Bu bo‘limda darslikdagi matn, rasmlar va tushuntirishlar joylashtiriladi.",
  ],
  [
    "Jismoniy daqiqa",
    "Bolalar ekrandagi ko‘rsatmalarga qarab qo‘l, bosh, yelka va tana harakatlarini bajaradilar.",
  ],
  [
    "Amaliy mashg‘ulot",
    "Bu yerda video yoki bosqichma-bosqich ko‘rsatma orqali amaliy ish bajariladi.",
  ],
  [
    "Mustahkamlash o‘yini",
    "Yangi bilimlarni mustahkamlash uchun qiziqarli interaktiv o‘yin joylashtiriladi.",
  ],
  [
    "Yakun va rag‘bat",
    "Dars xulosasi, uyga vazifa va o‘quvchi yutuqlari shu bo‘limda ko‘rsatiladi.",
  ],
];

function updateProgress() {
  const count = finished.size;
  const value = Math.round((count / stages.length) * 100);

  progressFill.style.width = value + "%";
  percent.textContent = value + "%";
  points.textContent = earned;
  completed.textContent = count;
  stepCounter.textContent = count + " / 8 bajarildi";
}

function selectStage(index) {
  if (index < 0 || index >= stages.length) return;

  currentStep = index;

  stages.forEach((stage, i) => {
    stage.classList.toggle("selected", i === index);
  });

  workTitle.textContent = stageInfo[index][0];
  workDescription.textContent = stageInfo[index][1];
  workStatus.textContent = index + 1 + "-bosqich tanlandi";
  nextBtn.textContent = finished.has(index)
    ? "Bajarilgan ✓"
    : "Bosqichni bajarish ✓";

  document.getElementById("workArea").scrollIntoView({
    behavior: "smooth",
    block: "nearest",
  });
}

stages.forEach((stage, index) => {
  stage.addEventListener("click", () => selectStage(index));
});

document.getElementById("startBtn").addEventListener("click", () => {
  selectStage(0);
});

nextBtn.addEventListener("click", () => {
  if (currentStep === -1) {
    selectStage(0);
    return;
  }

  if (!finished.has(currentStep)) {
    finished.add(currentStep);
    earned += 10;
    stages[currentStep].classList.add("done");
    updateProgress();
    workStatus.textContent = "Ajoyib! Bosqich bajarildi 🎉";
    nextBtn.textContent = "Keyingi bosqich →";
    return;
  }

  if (currentStep < stages.length - 1) {
    selectStage(currentStep + 1);
  } else {
    workTitle.textContent = "Tabriklaymiz! 🏆";
    workDescription.textContent =
      "Barcha bosqichlarni bajardingiz. Dars yakunlandi!";
    workStatus.textContent = "8 ta bosqich bajarildi";
    nextBtn.textContent = "Dars yakunlandi";
  }
});

updateProgress();
