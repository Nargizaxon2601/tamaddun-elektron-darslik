const wheel = document.getElementById("wheel");

const spinBtn = document.getElementById("spinBtn");

const questionArea = document.getElementById("questionArea");

const starCount = document.getElementById("starCount");

const progressText = document.getElementById("progressText");

const finishBtn = document.getElementById("finishBtn");

let stars = 0;
let answered = 0;
let rotation = 0;

const questions = [
  {
    title: "🇺🇿 Vatan",
    question: "Vatan nima?",
    answers: ["Stadion", "Tug‘ilib o‘sgan yurtimiz", "Do‘kon"],
    correct: 1,
  },

  {
    title: "👑 Bobur",
    question: "Bobur kim bo‘lgan?",
    answers: ["Shoh va shoir", "Sportchi", "Rassom"],
    correct: 0,
  },

  {
    title: "🍈 Qovun",
    question: "Bobur qaysi mevani sog‘ingan?",
    answers: ["Olma", "Uzum", "Qovun"],
    correct: 2,
  },

  {
    title: "🏙 Poytaxt",
    question: "O‘zbekiston poytaxti qaysi shahar?",
    answers: ["Samarqand", "Toshkent", "Buxoro"],
    correct: 1,
  },

  {
    title: "🚩 Bayroq",
    question: "Bayroq nimani bildiradi?",
    answers: ["Davlat ramzi", "O‘yinchoq", "Kitob"],
    correct: 0,
  },

  {
    title: "🗺 Xarita",
    question: "Xaritada nima ko‘rsatiladi?",
    answers: ["Hududlar", "Multfilm", "Musiqa"],
    correct: 0,
  },
];

spinBtn.addEventListener("click", spinWheel);

function spinWheel() {
  if (answered >= 3) {
    return;
  }

  spinBtn.disabled = true;

  const randomIndex = Math.floor(Math.random() * questions.length);

  rotation += 1800 + Math.floor(Math.random() * 360);

  wheel.style.transform = `rotate(${rotation}deg)`;

  setTimeout(function () {
    showQuestion(questions[randomIndex]);

    spinBtn.disabled = false;
  }, 4000);
}

function showQuestion(item) {
  let html = `
        <h2>${item.title}</h2>

        <h3 style="
        font-size:32px;
        margin-bottom:25px;">
        ${item.question}
        </h3>
    `;

  item.answers.forEach((answer, index) => {
    html += `
        <button
        class="option"
        onclick="checkAnswer(
        this,
        ${index},
        ${item.correct}
        )">

        ${answer}

        </button>
        `;
  });

  questionArea.innerHTML = html;
}

function checkAnswer(btn, selected, correct) {
  const options = document.querySelectorAll(".option");

  options.forEach((option) => {
    option.disabled = true;
  });

  if (selected === correct) {
    btn.classList.add("correct");

    stars++;

    starCount.innerHTML = stars;
  } else {
    btn.classList.add("wrong");

    options[correct].classList.add("correct");
  }

  answered++;

  progressText.innerHTML = answered + " / 3 savol";

  updateProgress();

  if (answered >= 3) {
    finishBtn.style.opacity = "1";

    finishBtn.style.pointerEvents = "auto";

    setTimeout(() => {
      questionArea.innerHTML = `
            <div style="
            text-align:center;
            padding-top:100px;">

            <h1 style="
            color:#16a34a;
            font-size:60px;">

            🏆 Tabriklaymiz!

            </h1>

            <h2 style="
            font-size:40px;">

            Siz
            ${stars}
            ta yulduz
            to‘pladingiz

            </h2>

            <p style="
            font-size:28px;
            margin-top:20px;">

            Vatan bilimdoni!

            </p>

            </div>
            `;
    }, 1500);
  }
}

function updateProgress() {
  const steps = document.querySelectorAll(".progress-step");

  steps.forEach((step, index) => {
    step.classList.remove("active");

    if (index < answered) {
      step.classList.add("active");
    }
  });
}
