document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);

  let grade = 1;
  const availableSubjects = ["tarbiya", "texnologiya"];
  const requestedSubject = new URLSearchParams(window.location.search).get("subject");
  let subject = availableSubjects.includes(requestedSubject) ? requestedSubject : "";
  let lessonIndex = 0;
  let stageIndex = 0;
  let situationChoice = "";
  const knownTools = new Set();
  const safetyDone = [];
  let safetyResume = 0;
  const hasKnowledgeScreen = () => Boolean(document.getElementById("knowledgeScreen"));
  const safetyScreens = () => Array.from(document.querySelectorAll("[data-safety-page]"));
  const hasSafetyScreen = () => safetyScreens().length > 0;
  const hideSafetyScreen = () => safetyScreens().forEach((screen) => screen.classList.add("hidden"));
  const hasExerciseScreen = () => Boolean(document.getElementById("exerciseScreen"));
  const hasBuildScreen = () => Boolean(document.getElementById("buildScreen"));
  const hideExerciseScreen = () => ["exerciseScreen", "buildScreen", "drumScreen", "finalScreen"].forEach((id) => { const el = document.getElementById(id); if (el) el.classList.add("hidden"); });
  const hideKnowledgeScreen = () => { if (hasKnowledgeScreen()) $("knowledgeScreen").classList.add("hidden"); };
  const knowledgeTools = [["Qaychi", "Qaychi qog‘oz va kartonni qirqish uchun kerak. U bilan ehtiyot bo‘lib ishlaymiz!"], ["Yelim", "Yelim qog‘oz va karton bo‘laklarini bir-biriga yopishtiradi."], ["Qalam", "Qalam bilan chizamiz, belgi qo‘yamiz va shakllarni chizib olamiz."], ["Bo‘yoq", "Bo‘yoq bilan rasm va buyumlarimizni rang-barang qilamiz."], ["Mo‘yqalam", "Mo‘yqalam bo‘yoqni qog‘ozga surtish uchun ishlatiladi."], ["Plastilin", "Plastilindan turli shakl va hayvonchalar yasaymiz."], ["Qog‘oz", "Rangli qog‘ozdan applikatsiya va o‘yinchoqlar yasaymiz."], ["Karton", "Karton qalin va mustahkam, undan qutichalar yasash mumkin."]];
  let score = 0;
  let completed = new Set();
  let exerciseDone = new Set();
  let quizUsed = new Set();
  let drumQuestion = null;
  let drumAnswered = false;
  let drumSpinning = false;
  let drumRotation = 0;

  let activeQuarter=0;const finishedLessons=new Set();let activeMapCourse=null;
  const courseMap={texnologiya:{name:"Texnologiya",grade:1,quarters:[
  {id:"texnologiya-1-q1",number:1,name:"Sarguzashtlar o‘rmoni",icon:"🌳",palette:"forest",description:"Yashil yo‘laklar bo‘ylab yangi bilimlarni kashf eting."},
  {id:"texnologiya-1-q2",number:2,name:"Sehrli tog‘lar",icon:"⛰️",palette:"mountain",description:"Baland cho‘qqilarga olib boruvchi bilim yo‘li."},
  {id:"texnologiya-1-q3",number:3,name:"Mo‘jizalar vodiysi",icon:"🌊",palette:"ocean",description:"Moviy to‘lqinlar orasida yangi manzillar kutmoqda."},
  {id:"texnologiya-1-q4",number:4,name:"Qadimiy qal’a",icon:"🏰",palette:"castle",description:"Qadimiy qal’a sari sarguzashtni davom ettiring."}],
  lessons:[{id:"texnologiya-1-dars-01",title:"Texnologiyaga ilk qadam",quarterId:"texnologiya-1-q1",openable:true}]}};
  const stageNames = [
    "Darsga kirish",
    "Vaziyat va tahlil",
    "Kundalik bilimlar",
    "Yangi mavzu",
    "Jismoniy daqiqa",
    "Amaliy ish",
    "Mustahkamlovchi o‘yin",
    "Yakun va rag‘bat",
  ];
  const stageIcons = ["💡", "💬", "🔎", "📖", "🏃", "✂️", "🎮", "🏆"];
  const stageColors = [
    "stage-color-1",
    "stage-color-2",
    "stage-color-3",
    "stage-color-4",
    "stage-color-5",
    "stage-color-6",
    "stage-color-7",
    "stage-color-8",
  ];

  const tools = {
    scissors: {
      icon: "✂️",
      title: "Qaychi",
      text: "Qaychi qog‘oz va kartonni ehtiyotkorlik bilan qirqishga yordam beradi.",
      safety:
        "Qaychini doimo g‘ilofda saqlang. Birovga uzatayotganda dastasini oldinga tuting.",
    },
    glue: {
      icon: "🧴",
      title: "Yelim",
      text: "Yelim buyumlarning detallarini bir-biriga yopishtirish uchun ishlatiladi.",
      safety:
        "Yelimni yupqa qilib surting. Ish tugagach qopqog‘ini yoping va qo‘llaringizni yuving.",
    },
    pencil: {
      icon: "✏️",
      title: "Qalamlar",
      text: "Qalamlar rasm chizish, chiziq tortish va buyumning xomaki shaklini belgilash uchun kerak.",
      safety:
        "Qalamni ehtiyotkorlik bilan ishlating. Uchlangan tomonini boshqalarga qaratmang.",
    },
    paint: {
      icon: "🎨",
      title: "Bo‘yoqlar",
      text: "Bo‘yoqlar rasmni yorqin va rang-barang qilishga yordam beradi.",
      safety:
        "Bo‘yoqlarni og‘izga solmang. Ishdan so‘ng qo‘llaringizni yuving.",
    },
    brush: {
      icon: "🖌️",
      title: "Mo‘yqalam",
      text: "Mo‘yqalam bo‘yoqlar bilan ishlashda yordam beradi.",
      safety: "Ishlatib bo‘lgach, mo‘yqalamni suvda yuving va quritib qo‘ying.",
    },
    board: {
      icon: "🟫",
      title: "Plastilin taxtachasi",
      text: "Plastilin taxtachasi partani iflos qilmasdan saranjom ishlash uchun kerak.",
      safety: "Ish tugagach, taxtachani tozalab, joyiga qo‘ying.",
    },
    plasticine: {
      icon: "🟣",
      title: "Plastilin",
      text: "Plastilin shakllar yasash uchun mo‘ljallangan yumshoq material.",
      safety:
        "Plastilinni og‘izga solmang. Ishdan keyin qo‘llaringizni yuving.",
    },
    stack: {
      icon: "🔧",
      title: "Steklar",
      text: "Steklar plastilinni kesish, naqsh solish va detallarni ajratish uchun ishlatiladi.",
      safety:
        "Steklarni ehtiyotkorlik bilan ishlating va ish tugagach yig‘ishtiring.",
    },
    cardboard: {
      icon: "📦",
      title: "Karton",
      text: "Karton tabriknomalar va turli buyumlar yasash uchun ishlatiladigan qalin qog‘oz.",
      safety: "Karton qirralarini ehtiyotkorlik bilan ushlang.",
    },
    cotton: {
      icon: "☁️",
      title: "Paxta",
      text: "Paxta yumshoq material bo‘lib, undan bulut, qor va hayvon juni kabi tasvirlar yasash mumkin.",
      safety: "Paxtani og‘iz va burunga yaqinlashtirmang.",
    },
  };

  const exercises = [
    { title: "Qo‘llarni yuqoriga ko‘taring!", image: "exercise-1.png" },
    { title: "O‘ngga va chapga egiling!", image: "exercise-2.png" },
    { title: "Joyingizda 5 marta sakrang!", image: "exercise-3.png" },
    { title: "Katta tabassum qiling!", image: "exercise-4.png" },
    { title: "«Men Vatanimni sevaman!» deb ayting!", image: "exercise-5.png" },
  ];

  const questions = [
    {
      q: "Qaychi nima uchun ishlatiladi?",
      a: [
        "Qog‘oz va kartonni qirqish uchun",
        "Rasmni bo‘yash uchun",
        "Suv quyish uchun",
        "Yelim surtish uchun",
      ],
      c: 0,
      e: "Qaychi qog‘oz va kartonni qirqish uchun ishlatiladi.",
    },
    {
      q: "Yelim qanday surtilishi lozim?",
      a: ["Juda qalin", "Yupqa qilib", "Faqat chetiga", "Umuman surtilmaydi"],
      c: 1,
      e: "Yelimni yupqa qilib surtish kerak.",
    },
    {
      q: "Mo‘yqalam ishlatilgandan keyin nima qilinadi?",
      a: [
        "Stolda qoldiriladi",
        "Suvda yuvib quritiladi",
        "Buklab qo‘yiladi",
        "Yashirib qo‘yiladi",
      ],
      c: 1,
      e: "Mo‘yqalamni suvda yuvib, quritib qo‘yish kerak.",
    },
    {
      q: "Plastilin nima uchun mo‘ljallangan?",
      a: [
        "Shakllar yasash uchun",
        "Qog‘oz qirqish uchun",
        "Yozish uchun",
        "O‘lchash uchun",
      ],
      c: 0,
      e: "Plastilin turli shakllar yasash uchun ishlatiladi.",
    },
    {
      q: "Tabiiy materialni toping.",
      a: ["Ruchka", "Plastik idish", "Barg", "Daftar"],
      c: 2,
      e: "Barg tabiatdan olinadigan tabiiy materialdir.",
    },
    {
      q: "Plastilin taxtachasi nima uchun kerak?",
      a: [
        "Partani iflos qilmaslik uchun",
        "Rasmni bo‘yash uchun",
        "Qog‘ozni qirqish uchun",
        "Yelimni saqlash uchun",
      ],
      c: 0,
      e: "Taxtacha ish joyini toza saqlashga yordam beradi.",
    },
    {
      q: "Qalamlar nima uchun kerak?",
      a: [
        "Yopishtirish uchun",
        "Chizish va belgilash uchun",
        "Qirqish uchun",
        "Yuvish uchun",
      ],
      c: 1,
      e: "Qalamlar rasm chizish va chiziq belgilash uchun ishlatiladi.",
    },
    {
      q: "Ish tugagach nima qilish kerak?",
      a: [
        "Qurollarni sochib ketish",
        "Ish joyini tartibga keltirish",
        "Yelimni ochiq qoldirish",
        "Qaychini stol chetiga qo‘yish",
      ],
      c: 1,
      e: "Ish tugagach, ish qurollarini yig‘ishtirib, joyni tartibga keltirish kerak.",
    },
  ];

  const lesson = {
    title: "Texnologiyaga ilk qadam",
    subtitle:
      "Texnologiya darslarida xavfsizlik texnikasi va ish qurollari bilan tanishuv",
    goal: "Texnologiya darslaridagi xavfsizlik qoidalari, ish qurollari va tabiiy materiallar bilan tanishish.",
    greeting:
      "Salom, bilimdon! Atrofimizdagi buyumlar qanday yaratilishini hech o‘ylab ko‘rganmisiz? Bugun texnologiya olamiga ilk qadam qo‘yamiz!",
    objects: ["🪑|Stul", "☕|Chashka", "📖|Kitob", "🎒|Sumka", "🚗|O‘yinchoq"],
    stages: [
      {
        title: "Darsga kirish",
        image: "_hero_banner.png",
        advice: "Atrofingizdagi buyumlarga diqqat bilan qarang.",
        content: `
          <h3>Salom, bilimdon! 👋</h3>
          <p>Bugun biz texnologiya olamiga qiziqarli sayohat qilamiz.</p>
          <p>Atrofimizdagi ko‘plab buyumlar inson mehnati va turli ish qurollari yordamida yaratiladi.</p>
          <p>Ularni yaratishda qaychi, qalam, yelim, bo‘yoq va boshqa qurollar yordam beradi.</p>
          <div class="homework-box">✨ Tayyormisiz? Unda sayohatni boshlaymiz!</div>`,
      },
      {
        title: "Vaziyat va tahlil",
        image: "classroom.png",
        advice: "Ishni boshlashdan oldin ish joyingizni tartibga keltiring.",
        type: "situation",
        content: `
          <h3>Tasavvur qiling!</h3>
          <p>Siz qog‘ozdan chiroyli buyum yasamoqchisiz. Stol ustida qaychi, yelim, rangli qog‘ozlar va qalamlar turibdi.</p>
          <h3>Ishni boshlashdan oldin nima qilishingiz kerak?</h3>
          <div class="situation-options">
            <button data-situation="0">A. Ish joyimni tayyorlayman, qurollarni tartib bilan joylashtiraman.</button>
            <button data-situation="1">B. Darhol qaychini olib qog‘ozni qirqishni boshlayman.</button>
            <button data-situation="2">C. Barcha buyumlarni stol ustiga tartibsiz tashlayman.</button>
            <button data-situation="3">D. Faqat yelimni olib ish boshlayman.</button>
          </div>
          <div id="situationFeedback" class="feedback-box"></div>`,
      },
      {
        // Bu bosqich alohida rasmli sahifada ochiladi (#knowledgeScreen)
        title: "Kundalik bilimlarni aniqlash",
        image: "",
        advice: "",
        content: "",
      },
      {
        title: "Yangi mavzu bayoni",
        image: "safety-tools.png",
        advice:
          "Har bir ish qurolining vazifasi va xavfsiz ishlatish qoidasini o‘rganing.",
        type: "workshop",
        content: `
          <div class="workshop-intro">
            <span class="eyebrow">🧰 IJODKOR USTAXONASI</span>
            <h3>Ish qurollarini kashf etamiz!</h3>
            <p>Quyidagi buyumlardan birini tanlang. Uning vazifasi va xavfsizlik qoidasini bilib oling.</p>
          </div>
          <div class="tool-gallery">
            ${Object.entries(tools)
              .map(
                ([key, t]) => `
              <button class="tool-card ${
                key === "scissors" ? "active" : ""
              }" data-tool="${key}">
                <span class="tool-picture">${t.icon}</span>
                <b>${t.title}</b>
              </button>`
              )
              .join("")}
          </div>
          <div class="tool-detail">
            <div class="tool-detail-visual" id="toolDetailIcon">✂️</div>
            <div>
              <span class="eyebrow">TANLANGAN ISH QUROLI</span>
              <h3 id="toolDetailTitle">Qaychi</h3>
              <p id="toolDetailText">${tools.scissors.text}</p>
              <div class="tool-safety" id="toolDetailSafety">⚠️ ${
                tools.scissors.safety
              }</div>
            </div>
          </div>
          <div class="workshop-task">
            <h3>🧠 Kichik topshiriq</h3>
            <p>Qog‘ozni qirqish uchun qaysi ish quroli kerak?</p>
            <div class="tool-task-options">
              <button data-tool-answer="glue">🧴 Yelim</button>
              <button data-tool-answer="scissors">✂️ Qaychi</button>
              <button data-tool-answer="brush">🖌️ Mo‘yqalam</button>
            </div>
            <div id="toolTaskFeedback"></div>
          </div>`,
      },
      {
        title: "Jismoniy daqiqa",
        image: "exercise-1.png",
        advice:
          "Harakatlarni o‘zingiz bajaring. Har bir mashqdan keyin belgi qo‘ying.",
        type: "exercise",
        content: `
          <h3>🏃 Harakat qilamiz!</h3>
          <p>Har bir mashqni rasmga qarab bajaring. Bajarilgach, tugmasini bosing.</p>
          <div class="exercise-progress" id="exerciseProgress">0 / 5 ta mashq bajarildi</div>
          <div class="exercise-grid">
            ${exercises
              .map(
                (ex, i) => `
              <article class="exercise-card" data-exercise-card="${i}">
                <img src="images/${ex.image}" alt="${ex.title}">
                <h4>${i + 1}. ${ex.title}</h4>
                <button data-exercise="${i}">Bajarish ✓</button>
              </article>`
              )
              .join("")}
          </div>
          <div class="feedback-box" id="exerciseFeedback">Barcha 5 ta mashqni bajaring.</div>`,
      },
      {
        title: "Amaliy ish",
        image: "paper-craft.png",
        advice: "Amaliy ishda tozalik va xavfsizlikka rioya qiling.",
        content: `
          <h3>🌿 Tabiiy materiallarni tayyorlaymiz</h3>
          <p>O‘qituvchingiz bilan tabiiy materiallarni kuzating va ularni tayyorlash tartibi bilan tanishing.</p>
          <div class="practical-steps">
            <div class="practical-step"><span>1</span><p><b>Yig‘ish.</b> Barglar, shoxchalar va urug‘larni tanlang.</p></div>
            <div class="practical-step"><span>2</span><p><b>Ajratish.</b> Materiallarni turi va holatiga qarab ajrating.</p></div>
            <div class="practical-step"><span>3</span><p><b>Tozalash.</b> Materiallardagi chang va kirlarni ehtiyotkorlik bilan tozalang.</p></div>
            <div class="practical-step"><span>4</span><p><b>Quritish.</b> Materiallarni quritishga qo‘ying.</p></div>
            <div class="practical-step"><span>5</span><p><b>Saqlash.</b> Qurigan materiallarni tartibli joyda saqlang.</p></div>
          </div>
          <div class="homework-box">⚠️ O‘tkir ish qurollaridan faqat o‘qituvchi nazoratida foydalaning.</div>`,
      },
      {
        title: "Mustahkamlovchi o‘yin",
        image: "technology-tools-game.png",
        advice: "Barabanni aylantiring, savolni o‘qing va javobni tanlang.",
        type: "drum",
        content: `
          <div class="drum-game">
            <span class="eyebrow">🎡 SIRLI BARABAN</span>
            <h3>Bilimingizni sinab ko‘ring!</h3>
            <p>Barabanni aylantiring. U sizga tasodifiy savol tanlaydi.</p>
            <div class="drum-wheel-wrap">
              <span class="drum-pointer">▼</span>
              <div class="drum-wheel" id="drumWheel">
                <div class="drum-center">❓</div>
              </div>
            </div>
            <button class="spin-btn" id="spinDrum">🎯 Barabanni aylantirish</button>
            <div class="quiz-score">⭐ To‘plangan ball: <span id="drumScore">0</span></div>
            <div id="drumQuestionArea"></div>
          </div>`,
      },
      {
        title: "Yakun va rag‘bat",
        image: "reward.png",
        advice: "Har bir yangi bilim — katta yutuq!",
        content: `
          <div class="final-card">
            <div class="trophy">🏆</div>
            <h3>Barakalla, yosh ijodkor!</h3>
            <p>Bugun siz texnologiya darslarida ishlatiladigan ish qurollari, xavfsizlik qoidalari va tabiiy materiallar bilan tanishdingiz.</p>
            <h3 id="finalScore">0 ball</h3>
            <p>🏡 <b>Uyga vazifa:</b> darsda tanishgan ish qurollarining nomlarini takrorlang. Tabiiy materiallardan namunalar toping.</p>
            <div class="homework-box">Har bir ijodkorning muvaffaqiyati bilim, diqqat va mehnatdan boshlanadi!</div>
          </div>`,
      },
    ],
  };

  function updateSubjectSelection() {
    document.querySelectorAll(".subject-choice").forEach((button) => {
      const selected = button.dataset.subject === subject;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  function openSelectedSubject(){
    if(!subject)return;
    if(grade!==1||subject!=="texnologiya"){const n=subject==="tarbiya"?"Tarbiya":"Texnologiya";alert(n+" · "+grade+"-sinf uchun dars mazmuni hali tayyor emas. Hozir faqat 1-sinf Texnologiya darsi mavjud.");return}
    activeMapCourse=courseMap[subject];renderQuarterHub();$("catalogScreen").classList.add("hidden");$("quarterMapScreen").classList.add("hidden");$("learningScreen").classList.add("hidden");$("quarterScreen").classList.remove("hidden");window.scrollTo(0,0)
  }
  function renderQuarterHub() {
    const course = activeMapCourse;
    $("adventureTitle").textContent = course.name + " olami xaritasi";
    $("adventureSubtitle").textContent = course.grade + "-sinf · Xarita hududini tanlang";

    const hotspots = course.quarters.map((quarter) => {
      const count = course.lessons.filter((lesson) => lesson.quarterId === quarter.id).length;
      const countLabel = count
        ? '<span class="map-hotspot-count">' + count + ' ta dars</span>'
        : "";
      return '<button class="map-hotspot hotspot-' + quarter.number + '" data-quarter-id="' + quarter.id +
        '" aria-label="' + quarter.number + '-chorak: ' + quarter.name + '">' +
        '<span class="sr-only">' + quarter.number + '-chorak — ' + quarter.name + '</span>' +
        countLabel + '</button>';
    }).join("");

    $("quarterGrid").innerHTML =
      '<div class="map-artwork">' +
      '<img src="images/adventure-map-main.png" alt="TAMADDUN ta’lim sarguzashti xaritasi: to‘rt chorak hududi">' +
      hotspots + '</div>';

    document.querySelectorAll("[data-quarter-id]").forEach((button) => {
      button.addEventListener("click", () => openQuarter(button.dataset.quarterId));
    });
  }

  function openQuarter(id){activeQuarter=activeMapCourse.quarters.findIndex(q=>q.id===id);if(activeQuarter<0)return;renderQuarterMap();$("quarterScreen").classList.add("hidden");$("learningScreen").classList.add("hidden");$("quarterMapScreen").classList.remove("hidden");window.scrollTo(0,0)}
  function renderQuarterMap() {
    const quarter = activeMapCourse.quarters[activeQuarter];
    const lessons = activeMapCourse.lessons.filter((lesson) => lesson.quarterId === quarter.id);
    const isFirstTechnologyQuarter = activeMapCourse.name === "Texnologiya" && quarter.number === 1;
    $("quarterMapHeading").className = "adventure-heading map-heading " + quarter.palette;
    $("quarterMapTitle").textContent = quarter.number + "-chorak — " + quarter.name;
    $("quarterMapDescription").textContent = isFirstTechnologyQuarter
      ? "Xaritadagi manzilni tanlang. Mavjud dars ochiladi, qolganlari tayyorlanmoqda."
      : quarter.description;

    if (isFirstTechnologyQuarter) {
      const firstLesson = lessons.find((lesson) => lesson.openable);
      const stations = Array.from({ length: 11 }, (_, index) => {
        const number = index + 1;
        const isAvailable = number === 1 && firstLesson;
        const isDone = Boolean(isAvailable && finishedLessons.has(firstLesson.id));
        const state = isAvailable ? (isDone ? " Bajarilgan" : " Mavjud dars") : " Kontent tayyorlanmoqda";
        const label = number === 11 ? "11-manzil" : number + "-dars";
        return '<button type="button" class="q1-map-station station-' + number +
          (isDone ? ' is-done' : '') + '" data-station-id="texnologiya-1-q1-station-' + number + '"' +
          (isAvailable ? ' data-lesson-id="' + firstLesson.id + '"' : '') +
          ' aria-label="' + label + '.' + state + '"><span class="sr-only">' + label +
          (isAvailable ? ' — ' + firstLesson.title + ', darsni ochish' : ' — kontent tayyorlanmoqda') +
          '</span></button>';
      }).join("");

      $("adventureMap").innerHTML =
        '<div class="quarter-adventure-map" aria-label="1-chorak interaktiv dars xaritasi">' +
          '<div class="q1-map-canvas">' +
            '<img src="images/TAMADDUN_1-chorak_Kuz_sarguzashti_xarita.png" ' +
              'alt="1-chorak: Kuz sarguzashti xaritasi. 1 dan 11 gacha dars manzillari">' +
            stations +
          '</div>' +
        '</div>' +
        '<p class="q1-map-hint" id="q1MapStatus" aria-live="polite">Darsni boshlash uchun xaritadagi manzilni bosing.</p>';

      document.querySelectorAll("[data-station-id]").forEach((button) => {
        button.addEventListener("click", () => {
          if (button.dataset.lessonId) {
            startLesson(button.dataset.lessonId);
            return;
          }
          const status = $("q1MapStatus");
          status.textContent = "Bu manzil darsi kontent kiritilgach ochiladi.";
          document.querySelectorAll("[data-station-id]").forEach((station) => station.classList.remove("is-selected"));
          button.classList.add("is-selected");
        });
      });
    } else {
      $("adventureMap").innerHTML =
        '<div class="quarter-content ' + quarter.palette + '">' +
          '<div class="quarter-content-heading"><span>' + quarter.icon + '</span><div><b>' +
            quarter.number + '-CHORAK</b><h2>' + quarter.name + '</h2></div></div>' +
          '<div class="quarter-destinations"><h3>Dars manzillari</h3>' +
            (lessons.length
              ? lessons.map((lesson) => {
                  const done = finishedLessons.has(lesson.id);
                  return '<button class="map-station ' + (done ? "is-done" : "is-open") +
                    '" data-lesson-id="' + lesson.id + '"><span class="station-icon">' +
                    (done ? "🏆" : "📍") + '</span><span class="station-copy"><strong>' +
                    lesson.title + '</strong><small>' +
                    (done ? "Bajarilgan" : "Mavjud · ochish mumkin") +
                    '</small></span><span class="station-arrow">→</span></button>';
                }).join("")
              : '<p class="quarter-empty">Bu hudud uchun dars kontenti hali mavjud emas.</p>') +
            '<div class="map-station is-pending"><span class="station-icon">✨</span>' +
              '<span class="station-copy"><strong>Yangi manzil</strong>' +
              '<small>Kontent tayyorlanmoqda</small></span></div>' +
          '</div>' +
        '</div>';
      document.querySelectorAll("[data-lesson-id]").forEach((button) => {
        button.addEventListener("click", () => startLesson(button.dataset.lessonId));
      });
    }

    $("previousQuarter").disabled = activeQuarter === 0;
    $("nextQuarter").disabled = activeQuarter === activeMapCourse.quarters.length - 1;
  }

  function startLesson(id) {
    if (!activeMapCourse.lessons.some((lesson) => lesson.id === id && lesson.openable)) return;
    document.body.classList.remove("lesson-problem-active");
    $("problemSituationScreen").classList.add("hidden");hideKnowledgeScreen();hideSafetyScreen();hideExerciseScreen();
    lessonIndex = 0;
    resetLesson();
    $("quarterScreen").classList.add("hidden");
    $("quarterMapScreen").classList.add("hidden");
    $("learningScreen").classList.add("hidden");
    document.body.classList.add("lesson-intro-active");
    $("lessonIntroScreen").classList.remove("hidden");
    window.scrollTo(0, 0);
  }

  function openProblemSituation() {
    if (!completed.has(0)) completeStage(0);
    stageIndex = 1;
    document.body.classList.remove("lesson-intro-active");
    document.body.classList.add("lesson-problem-active");
    $("lessonIntroScreen").classList.add("hidden");
    $("learningScreen").classList.add("hidden");
    hideKnowledgeScreen();hideSafetyScreen();hideExerciseScreen();
    $("problemSituationScreen").classList.remove("hidden");
    document.querySelectorAll("[data-problem-choice]").forEach((button) => {
      const selected = button.dataset.problemChoice === situationChoice;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    $("problemContinue").disabled = false;
    $("problemFeedback").textContent = situationChoice === "safe"
      ? "To‘g‘ri! Qaychini ehtiyotkor ishlatamiz va ish joyini tartibli saqlaymiz."
      : "Ikki holatni solishtiring. Qaysi biri xavfsiz?";
    window.scrollTo(0, 0);
  }

  function openLessonContent() {
    document.body.classList.remove("lesson-intro-active", "lesson-problem-active");
    $("lessonIntroScreen").classList.add("hidden");
    $("problemSituationScreen").classList.add("hidden");hideKnowledgeScreen();hideSafetyScreen();hideExerciseScreen();
    $("quarterScreen").classList.add("hidden");
    $("quarterMapScreen").classList.add("hidden");
    $("learningScreen").classList.remove("hidden");
    $("sidebarSubject").textContent = activeMapCourse.name;
    $("sidebarIcon").textContent = "✂️";
    $("sidebarGrade").textContent = grade + "-sinf";
    drawLessonMenu();
    renderStage();
    window.scrollTo(0, 0);
  }

  $("introBackToMap").addEventListener("click", () => {
    document.body.classList.remove("lesson-intro-active", "lesson-problem-active");
    $("problemSituationScreen").classList.add("hidden");hideKnowledgeScreen();hideSafetyScreen();hideExerciseScreen();
    $("lessonIntroScreen").classList.add("hidden");
    $("quarterMapScreen").classList.remove("hidden");
    renderQuarterMap();
    window.scrollTo(0, 0);
  });
  $("introContinue").addEventListener("click", openProblemSituation);
  $("problemBackToIntro").addEventListener("click", () => {
    document.body.classList.remove("lesson-problem-active");
    document.body.classList.add("lesson-intro-active");
    $("problemSituationScreen").classList.add("hidden");hideKnowledgeScreen();hideSafetyScreen();hideExerciseScreen();
    $("lessonIntroScreen").classList.remove("hidden");
    window.scrollTo(0, 0);
  });
  document.querySelectorAll("[data-problem-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      situationChoice = button.dataset.problemChoice;
      document.querySelectorAll("[data-problem-choice]").forEach((choice) => {
        const selected = choice === button;
        choice.classList.toggle("is-selected", selected);
        choice.setAttribute("aria-pressed", String(selected));
      });
      const isSafe = situationChoice === "safe";
      $("problemFeedback").textContent = isSafe
        ? "To‘g‘ri! Qaychini ehtiyotkor ishlatamiz va ish joyini tartibli saqlaymiz."
        : "Ehtiyotsiz qaychi jarohat yetkazishi mumkin. Xavfsiz holatni tanlang.";
    });
  });
  document.querySelectorAll(".problem-mascot-hotspot").forEach((button) => {
    button.addEventListener("click", () => {
      const selected = !button.classList.contains("is-selected");
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  });
  $("problemContinue").addEventListener("click", () => {
    if (!completed.has(1)) completeStage(1);
    if (!hasKnowledgeScreen()) { stageIndex = 2; openLessonContent(); return; }
    openKnowledgeCheck();
  });

  // Kundalik bilimlarni aniqlash sahifasi (muammoli vaziyatdan keyin)
  function updateKnowledgeState(message) {
    document.querySelectorAll("[data-check]").forEach((button) => {
      const checked = knownTools.has(Number(button.dataset.check));
      button.classList.toggle("is-checked", checked);
      button.setAttribute("aria-pressed", String(checked));
    });
    document.querySelectorAll("[data-dot]").forEach((dot) => {
      const i = Number(dot.dataset.dot);
      dot.classList.toggle("is-done", i < 2);
      dot.classList.toggle("is-current", i === 2);
      dot.disabled = !(i <= 3 || completed.has(i - 2));
      if (i === 2) dot.setAttribute("aria-current", "step"); else dot.removeAttribute("aria-current");
    });
    $("knowledgeFeedback").textContent = message || (knownTools.size === 0
      ? "Buyum kartochkasini bosing yoki pastda o‘zingiz tanigan buyumlarni belgilang."
      : knownTools.size === knowledgeTools.length
        ? "Barakalla! Siz barcha 8 ta buyumni taniysiz. Davom etish tugmasini bosing."
        : "Belgilandi: " + knownTools.size + " / " + knowledgeTools.length + ". Davom etish uchun o‘ngdagi tugmani bosing.");
  }

  function openKnowledgeCheck() {
    stageIndex = 2;
    document.body.classList.remove("lesson-intro-active");
    document.body.classList.add("lesson-problem-active");
    ["lessonIntroScreen", "problemSituationScreen", "learningScreen", "quarterScreen", "quarterMapScreen"].forEach((id) => $(id).classList.add("hidden"));
    hideSafetyScreen();
    hideExerciseScreen();
    $("knowledgeScreen").classList.remove("hidden");
    document.querySelectorAll(".knowledge-card").forEach((card) => card.classList.remove("is-active"));
    document.querySelectorAll(".knowledge-hero").forEach((hero) => { hero.classList.remove("is-selected"); hero.setAttribute("aria-pressed", "false"); });
    updateKnowledgeState();
    window.scrollTo(0, 0);
  }

  function leaveKnowledgeCheck(toStage) {
    if (!completed.has(2)) completeStage(2);
    stageIndex = toStage;
    openLessonContent();
  }

  document.querySelectorAll(".knowledge-card").forEach((card) => {
    card.addEventListener("click", () => {
      const i = Number(card.dataset.tool);
      document.querySelectorAll(".knowledge-card").forEach((other) => other.classList.toggle("is-active", other === card));
      const cell = document.querySelector('[data-check="' + i + '"]');
      cell.classList.remove("is-flash");
      void cell.offsetWidth;
      cell.classList.add("is-flash");
      updateKnowledgeState(knowledgeTools[i][1] + " Agar uni taniysiz, pastda belgilang.");
    });
  });
  document.querySelectorAll("[data-check]").forEach((button) => {
    button.addEventListener("click", () => {
      const i = Number(button.dataset.check);
      if (knownTools.has(i)) knownTools.delete(i); else knownTools.add(i);
      updateKnowledgeState();
    });
    button.addEventListener("animationend", () => button.classList.remove("is-flash"));
  });
  document.querySelectorAll(".knowledge-hero").forEach((hero) => {
    hero.addEventListener("click", () => {
      const selected = !hero.classList.contains("is-selected");
      hero.classList.toggle("is-selected", selected);
      hero.setAttribute("aria-pressed", String(selected));
    });
  });
  document.querySelectorAll("[data-dot]").forEach((dot) => {
    dot.addEventListener("click", () => {
      const i = Number(dot.dataset.dot);
      if (i === 0) $("problemBackToIntro").click();
      else if (i === 1) openProblemSituation();
      else if (i === 3 && hasSafetyScreen()) openSafetyPage(0);
      else if (i >= 3) leaveKnowledgeCheck(i - 1);
    });
  });
  if (hasKnowledgeScreen()) {
    $("knowledgeBack").addEventListener("click", openProblemSituation);
    $("knowledgeContinue").addEventListener("click", () => {
      if (!completed.has(2)) completeStage(2);
      if (hasSafetyScreen()) openSafetyPage(0);
      else leaveKnowledgeCheck(2);
    });
  }

  // 4-bosqich: yangi bilimlar sahifalari (1/7, 2/7, ...) — har biri alohida rasmli sahifa
  function updateSafetyState(k, message) {
    const screen = safetyScreens()[k];
    const done = safetyDone[k];
    const rules = screen.querySelectorAll("[data-rule]");
    rules.forEach((rule) => {
      const checked = done.has(Number(rule.dataset.rule));
      rule.classList.toggle("is-checked", checked);
      rule.setAttribute("aria-pressed", String(checked));
    });
    screen.querySelectorAll("[data-safety-dot]").forEach((dot) => {
      const i = Number(dot.dataset.safetyDot);
      dot.classList.toggle("is-done", i < 3);
      dot.classList.toggle("is-current", i === 3);
      dot.disabled = i > 7 || !(i <= 4 || completed.has(i - 1));
      if (i === 3) dot.setAttribute("aria-current", "step"); else dot.removeAttribute("aria-current");
    });
    const feedback = screen.querySelector(".safety-feedback");
    feedback.textContent = message || (done.size === 0
      ? feedback.dataset.hint
      : done.size === rules.length
        ? "Barakalla! Hamma qoidalar belgilandi. Davom etish tugmasini bosing."
        : "Bajarildi: " + done.size + " / " + rules.length + ". Qolgan qoidalarni ham belgilang.");
  }
  function openSafetyPage(k = 0) {
    const screens = safetyScreens();
    k = Math.max(0, Math.min(k, screens.length - 1));
    stageIndex = 3;
    safetyResume = k;
    document.body.classList.remove("lesson-intro-active");
    document.body.classList.add("lesson-problem-active");
    ["lessonIntroScreen", "problemSituationScreen", "learningScreen", "quarterScreen", "quarterMapScreen"].forEach((id) => $(id).classList.add("hidden"));
    hideKnowledgeScreen();
    hideExerciseScreen();
    screens.forEach((screen, i) => screen.classList.toggle("hidden", i !== k));
    screens[k].querySelectorAll(".knowledge-hero").forEach((hero) => { hero.classList.remove("is-selected"); hero.setAttribute("aria-pressed", "false"); });
    updateSafetyState(k);
    window.scrollTo(0, 0);
  }
  function leaveSafetyPage(toStage) {
    if (!completed.has(2)) completeStage(2);
    if (!completed.has(3)) completeStage(3);
    stageIndex = toStage;
    openLessonContent();
  }
  safetyScreens().forEach((screen, k) => {
    safetyDone[k] = new Set();
    screen.querySelectorAll("[data-rule]").forEach((rule) => {
      rule.addEventListener("click", () => {
        const i = Number(rule.dataset.rule);
        const done = safetyDone[k];
        const total = screen.querySelectorAll("[data-rule]").length;
        if (done.has(i)) { done.delete(i); updateSafetyState(k); }
        else { done.add(i); updateSafetyState(k, done.size === total ? null : rule.dataset.say); }
      });
      rule.addEventListener("animationend", () => rule.classList.remove("is-flash"));
    });
    screen.querySelectorAll("[data-mood]").forEach((face) => {
      face.addEventListener("click", () => {
        screen.querySelectorAll("[data-mood]").forEach((other) => {
          const selected = other === face;
          other.classList.toggle("is-selected", selected);
          other.setAttribute("aria-pressed", String(selected));
        });
        updateSafetyState(k, face.dataset.say);
      });
    });
    screen.querySelectorAll("[data-object-rule]").forEach((object) => {
      object.addEventListener("click", () => {
        const rule = screen.querySelector('[data-rule="' + object.dataset.objectRule + '"]');
        rule.classList.remove("is-flash");
        void rule.offsetWidth;
        rule.classList.add("is-flash");
        updateSafetyState(k, "Bu buyum shu qoidaga tegishli: " + rule.getAttribute("aria-label") + ". Qoidani bosib belgilang.");
      });
    });
    screen.querySelectorAll("[data-safety-dot]").forEach((dot) => {
      dot.addEventListener("click", () => {
        const i = Number(dot.dataset.safetyDot);
        if (i === 0) $("problemBackToIntro").click();
        else if (i === 1) openProblemSituation();
        else if (i === 2) openKnowledgeCheck();
        else if (i >= 4) leaveSafetyPage(i);
      });
    });
    screen.querySelector(".safety-back").addEventListener("click", () => {
      if (k > 0) openSafetyPage(k - 1);
      else if (hasKnowledgeScreen()) openKnowledgeCheck();
      else openProblemSituation();
    });
    screen.querySelector(".safety-next").addEventListener("click", () => {
      if (k < safetyScreens().length - 1) openSafetyPage(k + 1);
      else leaveSafetyPage(4);
    });
  });
  // 7/7 Sinov o'yini: ish qurolini mos vazifaga surib ulash (sichqoncha yoki barmoq)
  (function setupMatchGame() {
    const game = document.getElementById("matchGame");
    if (!game) return;
    const screen = game.closest("[data-safety-page]");
    const feedback = screen.querySelector(".safety-feedback");
    const svg = game.querySelector(".match-lines");
    const tasks = game.dataset.tasks.split("|");
    const W = 1672, H = 941, TILE_X = 886, TILE_W = 418, TILE_H = 102;
    const tileTops = [285, 389, 492, 595, 699];
    const rowY = [335, 438, 542, 646, 750];
    const LEFT_X = 735, RIGHT_X = 868;
    const NS = "http://www.w3.org/2000/svg";
    let order = [0, 1, 2, 3, 4]; // order[slot] = qaysi vazifa shu qatorda turibdi
    let matched = new Map(); // tool -> slot
    let tries = 0;
    let drag = null;

    const leftItems = Array.from(game.querySelectorAll(".match-left"));
    const rightItems = Array.from(game.querySelectorAll(".match-right"));

    function shuffle() {
      do {
        for (let i = order.length - 1; i > 0; i--) {
          const r = Math.floor(Math.random() * (i + 1));
          [order[i], order[r]] = [order[r], order[i]];
        }
      } while (order.some((task, slot) => task === slot));
    }
    function drawTiles() {
      game.querySelectorAll(".match-tile").forEach((tile) => {
        const task = order[Number(tile.dataset.slot)];
        tile.style.backgroundPosition = (TILE_X / (W - TILE_W) * 100) + "% " + (tileTops[task] / (H - TILE_H) * 100) + "%";
      });
      rightItems.forEach((item) => item.setAttribute("aria-label", tasks[order[Number(item.dataset.slot)]]));
    }
    function line(x1, y1, x2, y2, cls) {
      const l = document.createElementNS(NS, "line");
      l.setAttribute("x1", x1); l.setAttribute("y1", y1); l.setAttribute("x2", x2); l.setAttribute("y2", y2);
      l.setAttribute("class", cls);
      svg.appendChild(l);
      return l;
    }
    function toSvg(event) {
      const r = game.getBoundingClientRect();
      return { x: (event.clientX - r.left) / r.width * W, y: (event.clientY - r.top) / r.height * H };
    }
    function say(text) { feedback.textContent = text; }
    function render() {
      svg.innerHTML = "";
      matched.forEach((slot, tool) => line(LEFT_X, rowY[tool], RIGHT_X, rowY[slot], "is-ok"));
      leftItems.forEach((item) => item.classList.toggle("is-matched", matched.has(Number(item.dataset.index))));
      const usedSlots = new Set(matched.values());
      rightItems.forEach((item) => item.classList.toggle("is-matched", usedSlots.has(Number(item.dataset.slot))));
      game.classList.toggle("is-won", matched.size === 5);
    }
    function reset() {
      matched = new Map();
      tries = 0;
      shuffle();
      drawTiles();
      render();
      say(feedback.dataset.hint);
    }
    function itemAt(x, y, side) {
      const el = document.elementsFromPoint(x, y).find((node) => node.classList && node.classList.contains("match-item"));
      return el && el.dataset.side === side ? el : null;
    }
    function tryMatch(tool, slot) {
      const toolItem = leftItems[tool];
      const slotItem = rightItems[slot];
      tries++;
      if (order[slot] === tool) {
        matched.set(tool, slot);
        render();
        if (matched.size === 5) {
          const mistakes = tries - 5;
          say("🎉 Barakalla! Hammasini to‘g‘ri topdingiz: 5 / 5" + (mistakes === 0 ? ", birorta ham xatosiz!" : ". Xatolar soni: " + mistakes + "."));
        } else {
          say("✅ To‘g‘ri! " + toolItem.getAttribute("aria-label") + " — " + tasks[tool].toLowerCase() + ". To‘g‘ri: " + matched.size + " / 5");
        }
      } else {
        [toolItem, slotItem].forEach((el) => {
          el.classList.remove("is-wrong");
          void el.offsetWidth;
          el.classList.add("is-wrong");
        });
        const bad = line(LEFT_X, rowY[tool], RIGHT_X, rowY[slot], "is-bad");
        setTimeout(() => bad.remove(), 600);
        say("🤔 Yo‘q, " + toolItem.getAttribute("aria-label") + " bu ish uchun emas. Yana urinib ko‘ring! To‘g‘ri: " + matched.size + " / 5");
      }
    }
    function isDone(item) {
      return item.dataset.side === "left" ? matched.has(Number(item.dataset.index)) : new Set(matched.values()).has(Number(item.dataset.slot));
    }
    function anchor(item) {
      return item.dataset.side === "left"
        ? { x: LEFT_X, y: rowY[Number(item.dataset.index)] }
        : { x: RIGHT_X, y: rowY[Number(item.dataset.slot)] };
    }
    function clearTargets() { game.querySelectorAll(".is-target, .is-picked").forEach((el) => el.classList.remove("is-target", "is-picked")); }

    [...leftItems, ...rightItems].forEach((item) => {
      item.addEventListener("animationend", () => item.classList.remove("is-wrong"));
      item.addEventListener("pointerdown", (event) => {
        if (isDone(item) || (event.button !== undefined && event.button > 0)) return;
        event.preventDefault();
        const a = anchor(item);
        const p = toSvg(event);
        drag = { item, id: event.pointerId, line: line(a.x, a.y, p.x, p.y, "is-drag"), moved: false };
        item.classList.add("is-picked");
        try { item.setPointerCapture(event.pointerId); } catch (e) {}
      });
      item.addEventListener("pointermove", (event) => {
        if (!drag || drag.id !== event.pointerId) return;
        const p = toSvg(event);
        drag.line.setAttribute("x2", p.x);
        drag.line.setAttribute("y2", p.y);
        drag.moved = true;
        game.querySelectorAll(".is-target").forEach((el) => el.classList.remove("is-target"));
        const other = itemAt(event.clientX, event.clientY, item.dataset.side === "left" ? "right" : "left");
        if (other && !isDone(other)) other.classList.add("is-target");
      });
      const finish = (event) => {
        if (!drag || drag.id !== event.pointerId) return;
        const from = drag.item;
        drag.line.remove();
        const wasMoved = drag.moved;
        drag = null;
        clearTargets();
        const other = itemAt(event.clientX, event.clientY, from.dataset.side === "left" ? "right" : "left");
        if (other && !isDone(other)) {
          const tool = Number((from.dataset.side === "left" ? from : other).dataset.index);
          const slot = Number((from.dataset.side === "left" ? other : from).dataset.slot);
          tryMatch(tool, slot);
          picked = null;
        } else if (!wasMoved) {
          // bosib tanlash usuli: avval bir tomondan, keyin ikkinchi tomondan bosing
          if (picked && picked.dataset.side !== from.dataset.side) {
            const tool = Number((from.dataset.side === "left" ? from : picked).dataset.index);
            const slot = Number((from.dataset.side === "left" ? picked : from).dataset.slot);
            picked = null;
            tryMatch(tool, slot);
          } else {
            picked = from;
            from.classList.add("is-picked");
            say("Endi " + (from.dataset.side === "left" ? "mos vazifani" : "mos ish qurolini") + " bosing yoki chiziqni surib olib boring.");
          }
        } else {
          picked = null;
          say("Chiziqni boshqa tomondagi qatorga olib borib qo‘ying. To‘g‘ri: " + matched.size + " / 5");
        }
      };
      item.addEventListener("pointerup", finish);
      item.addEventListener("pointercancel", (event) => {
        if (!drag || drag.id !== event.pointerId) return;
        drag.line.remove();
        drag = null;
        clearTargets();
      });
    });
    let picked = null;
    game.querySelector(".match-reset").addEventListener("click", () => { picked = null; reset(); });
    reset();
  })();
  // 5-bosqich: Quvnoq jismoniy mashqlar (rasmli sahifa)
  const exerciseDoneSet = new Set();
  let exerciseTimer = null;
  function stopExercise() {
    if (exerciseTimer) clearInterval(exerciseTimer);
    exerciseTimer = null;
    document.querySelectorAll(".exercise-card.is-running").forEach((card) => card.classList.remove("is-running"));
  }
  function updateExerciseState() {
    document.querySelectorAll("[data-exercise]").forEach((card) => {
      const done = exerciseDoneSet.has(Number(card.dataset.exercise));
      card.classList.toggle("is-done", done);
      card.setAttribute("aria-pressed", String(done));
    });
    document.querySelectorAll("[data-ex-dot]").forEach((dot) => {
      const i = Number(dot.dataset.exDot);
      dot.classList.toggle("is-done", i < 4);
      dot.classList.toggle("is-current", i === 4);
      dot.disabled = !(i <= 5 || completed.has(i - 1));
      if (i === 4) dot.setAttribute("aria-current", "step"); else dot.removeAttribute("aria-current");
    });
  }
  function openExercisePage() {
    stageIndex = 4;
    document.body.classList.remove("lesson-intro-active");
    document.body.classList.add("lesson-problem-active");
    ["lessonIntroScreen", "problemSituationScreen", "learningScreen", "quarterScreen", "quarterMapScreen"].forEach((id) => $(id).classList.add("hidden"));
    hideKnowledgeScreen();
    hideSafetyScreen();
    ["buildScreen", "drumScreen", "finalScreen"].forEach((id) => { const el = document.getElementById(id); if (el) el.classList.add("hidden"); });
    $("exerciseScreen").classList.remove("hidden");
    $("exerciseScreen").querySelectorAll(".knowledge-hero").forEach((hero) => { hero.classList.remove("is-selected"); hero.setAttribute("aria-pressed", "false"); });
    updateExerciseState();
    $("exerciseFeedback").textContent = exerciseDoneSet.size === 5
      ? "Barakalla! Hamma mashqlarni bajardingiz. Davom etish tugmasini bosing."
      : $("exerciseFeedback").dataset.hint;
    window.scrollTo(0, 0);
  }
  function leaveExercisePage(toStage) {
    stopExercise();
    if (!completed.has(4)) completeStage(4);
    stageIndex = toStage;
    openLessonContent();
  }
  if (hasExerciseScreen()) {
    document.querySelectorAll("[data-exercise]").forEach((card) => {
      card.addEventListener("click", () => {
        const wasRunning = card.classList.contains("is-running");
        stopExercise();
        if (wasRunning) {
          $("exerciseFeedback").textContent = "Mashq to‘xtatildi. Qayta boshlash uchun kartochkani bosing.";
          return;
        }
        const i = Number(card.dataset.exercise);
        const total = Number(card.dataset.count);
        const isSeconds = card.dataset.mode === "sec";
        const counter = card.querySelector(".ex-counter");
        const name = card.getAttribute("aria-label").replace(" mashqini boshlash", "");
        let n = isSeconds ? total : 1;
        const show = () => {
          counter.textContent = n;
          counter.classList.remove("is-tick");
          void counter.offsetWidth;
          counter.classList.add("is-tick");
          $("exerciseFeedback").textContent = isSeconds
            ? "«" + name + "»: oyoq uchida turing… " + n + " soniya qoldi"
            : "«" + name + "»: " + n + " / " + total + " marta";
        };
        card.classList.add("is-running");
        show();
        exerciseTimer = setInterval(() => {
          const finished = isSeconds ? n <= 1 : n >= total;
          if (finished) {
            stopExercise();
            exerciseDoneSet.add(i);
            updateExerciseState();
            $("exerciseFeedback").textContent = exerciseDoneSet.size === 5
              ? "🎉 Barakalla! Hamma 5 ta mashqni bajardingiz. Tanamiz chiniqdi, endi davom etamiz!"
              : "✅ Zo‘r! «" + name + "» bajarildi. Bajarildi: " + exerciseDoneSet.size + " / 5";
            return;
          }
          n += isSeconds ? -1 : 1;
          show();
        }, isSeconds ? 1000 : 1300);
      });
    });
    document.querySelectorAll("[data-ex-dot]").forEach((dot) => {
      dot.addEventListener("click", () => {
        const i = Number(dot.dataset.exDot);
        stopExercise();
        if (i === 0) $("problemBackToIntro").click();
        else if (i === 1) openProblemSituation();
        else if (i === 2) openKnowledgeCheck();
        else if (i === 3) openSafetyPage(safetyScreens().length - 1);
        else if (i >= 5) leaveExercisePage(i);
      });
    });
    $("exerciseBack").addEventListener("click", () => {
      stopExercise();
      if (hasSafetyScreen()) openSafetyPage(safetyScreens().length - 1);
      else { stageIndex = 3; openLessonContent(); }
    });
    $("exerciseContinue").addEventListener("click", () => leaveExercisePage(5));
  }
  // 6-bosqich: Amaliy ish — "Kuzgi kirpicha"ni surib yasash (sichqoncha yoki barmoq)
  const buildApi = (function setupBuild() {
    const scene = document.getElementById("buildScene");
    if (!scene) return { reset() {} };
    const W = 1671, H = 941;
    const BOARD = { x1: 655, y1: 128, x2: 1150, y2: 500 };
    const SIZES = { gudda: [190, 145], plastilin: [120, 80], koz: [24, 24], burun: [28, 28], barg: [100, 65], meva: [78, 48] };
    const NAMES = { gudda: "G‘udda", plastilin: "Plastilin", koz: "Ko‘z", burun: "Burun", barg: "Barglar", meva: "Mevalar" };
    const board = scene.querySelector(".build-board");
    const feedback = document.getElementById("buildFeedback");
    const steps = Array.from(scene.querySelectorAll(".build-step"));
    let pieces = []; // {el, kind, x, y, flip}
    let drag = null;
    let lastDone = 0;

    const toImg = (event) => {
      const r = scene.getBoundingClientRect();
      return { x: (event.clientX - r.left) / r.width * W, y: (event.clientY - r.top) / r.height * H };
    };
    const inBoard = (p) => p.x > BOARD.x1 && p.x < BOARD.x2 && p.y > BOARD.y1 && p.y < BOARD.y2;
    const clampBoard = (p) => ({ x: Math.min(BOARD.x2 - 10, Math.max(BOARD.x1 + 10, p.x)), y: Math.min(BOARD.y2 - 10, Math.max(BOARD.y1 + 10, p.y)) });
    function place(piece) {
      const [w, h] = SIZES[piece.kind];
      piece.el.style.left = (piece.x / W * 100) + "%";
      piece.el.style.top = (piece.y / H * 100) + "%";
      piece.el.style.width = (w / W * 100) + "%";
      piece.el.style.height = (h / H * 100) + "%";
      piece.el.classList.toggle("is-flip", piece.flip);
    }
    function makePiece(kind, x, y) {
      const el = document.createElement("div");
      el.className = "build-piece";
      el.dataset.kind = kind;
      el.setAttribute("role", "img");
      el.setAttribute("aria-label", NAMES[kind]);
      el.innerHTML = '<img src="images/kirpi/' + kind + '.webp" alt="" draggable="false">';
      scene.appendChild(el);
      const piece = { el, kind, x, y, flip: kind === "plastilin" };
      pieces.push(piece);
      place(piece);
      bindPiece(piece);
      return piece;
    }
    function removePiece(piece) {
      piece.el.remove();
      pieces = pieces.filter((p) => p !== piece);
    }
    const near = (a, b, dist) => Math.hypot(a.x - b.x, a.y - b.y) < dist;
    function evaluate() {
      const of = (k) => pieces.filter((p) => p.kind === k);
      const guddas = of("gudda"), heads = of("plastilin");
      const s1 = guddas.length > 0;
      const s2 = s1 && heads.some((h) => guddas.some((g) => near(h, g, 175)));
      const onHead = (k) => of(k).some((p) => heads.some((h) => near(p, h, 85)));
      const s3 = s2 && onHead("koz") && onHead("burun");
      const s4 = s3 && [...of("barg"), ...of("meva")].some((p) => guddas.some((g) => near(p, g, 130)));
      return [s1, s2, s3, s4];
    }
    const STEP_HINTS = [
      "1-qadam: g‘uddani ish maydoniga olib boring.",
      "2-qadam: plastilindan boshni g‘uddaning yoniga qo‘yib, birlashtiring.",
      "3-qadam: ko‘z va burunni plastilin boshga joylashtiring.",
      "4-qadam: barg yoki mevalarni g‘udda ustiga qo‘yib bezating."
    ];
    const STEP_PRAISE = ["Zo‘r! G‘udda tayyor.", "Barakalla! Bosh g‘uddaga birlashdi.", "Ajoyib! Kirpichaning ko‘zi va burni bor.", "Voy, qanday chiroyli bezadingiz!"];
    function refresh(message) {
      const st = evaluate();
      const done = st.filter(Boolean).length;
      const next = st.indexOf(false);
      steps.forEach((step, i) => {
        step.classList.toggle("is-done", st[i]);
        step.classList.toggle("is-next", i === next);
      });
      if (done < 4) board.classList.remove("is-won");
      if (message) feedback.textContent = message;
      else if (done > lastDone) feedback.textContent = "✅ " + STEP_PRAISE[done - 1] + (next >= 0 ? " Endi " + STEP_HINTS[next].charAt(0).toLowerCase() + STEP_HINTS[next].slice(1) : " Endi «Tekshirish» tugmasini bosing!");
      lastDone = done;
    }
    function startDrag(piece, event, fromPalette) {
      event.preventDefault();
      drag = { piece, id: event.pointerId, moved: false, fromPalette, start: toImg(event) };
      piece.el.classList.add("is-dragging");
      try { (fromPalette ? event.currentTarget : piece.el).setPointerCapture(event.pointerId); } catch (e) {}
    }
    function moveDrag(event) {
      if (!drag || drag.id !== event.pointerId) return;
      const p = toImg(event);
      if (Math.hypot(p.x - drag.start.x, p.y - drag.start.y) > 6) drag.moved = true;
      drag.piece.x = p.x; drag.piece.y = p.y;
      place(drag.piece);
      const over = inBoard(p);
      board.classList.toggle("is-over", over);
      drag.piece.el.classList.toggle("is-outside", !over);
    }
    function endDrag(event) {
      if (!drag || drag.id !== event.pointerId) return;
      const { piece, moved, fromPalette } = drag;
      drag = null;
      board.classList.remove("is-over");
      piece.el.classList.remove("is-dragging", "is-outside");
      const p = toImg(event);
      if (fromPalette && !moved) {
        // bosib qo'yish: ish maydonining o'rtasiga qo'yamiz
        const spot = { x: 900 + (pieces.length % 4) * 22 - 33, y: 315 + (pieces.length % 3) * 18 - 18 };
        piece.x = spot.x; piece.y = spot.y; place(piece);
        refresh();
        return;
      }
      if (!fromPalette && !moved) {
        piece.flip = !piece.flip; place(piece);
        feedback.textContent = NAMES[piece.kind] + " aylantirildi. Uni surib joyiga qo‘ying.";
        return;
      }
      if (!inBoard(p)) {
        removePiece(piece);
        refresh(fromPalette ? "Materialni ish maydoni ichiga olib boring." : NAMES[piece.kind] + " ish maydonidan olib tashlandi.");
        return;
      }
      const c = clampBoard(p); piece.x = c.x; piece.y = c.y; place(piece);
      refresh();
    }
    function bindPiece(piece) {
      piece.el.addEventListener("pointerdown", (event) => { if (event.button > 0) return; startDrag(piece, event, false); });
      piece.el.addEventListener("pointermove", moveDrag);
      piece.el.addEventListener("pointerup", endDrag);
      piece.el.addEventListener("pointercancel", endDrag);
    }
    scene.querySelectorAll(".build-source").forEach((source) => {
      source.addEventListener("pointerdown", (event) => {
        if (event.button > 0) return;
        const p = toImg(event);
        const piece = makePiece(source.dataset.piece, p.x, p.y);
        startDrag(piece, event, true);
      });
      source.addEventListener("pointermove", moveDrag);
      source.addEventListener("pointerup", endDrag);
      source.addEventListener("pointercancel", endDrag);
    });
    function reset() {
      pieces.slice().forEach(removePiece);
      lastDone = 0;
      board.classList.remove("is-won");
      refresh(feedback.dataset.hint);
    }
    $("buildReset").addEventListener("click", reset);
    $("buildCheck").addEventListener("click", () => {
      const st = evaluate();
      const next = st.indexOf(false);
      if (next === -1) {
        board.classList.add("is-won");
        if (!completed.has(5)) completeStage(5);
        feedback.textContent = "🎉 Barakalla! «Kuzgi kirpicha» tayyor! Siz ajoyib usta bo‘ldingiz.";
      } else {
        refresh("🤔 Hali tayyor emas. " + STEP_HINTS[next]);
      }
    });
    reset();
    return { reset, refresh };
  })();
  function updateBuildDots() {
    document.querySelectorAll("[data-build-dot]").forEach((dot) => {
      const i = Number(dot.dataset.buildDot);
      dot.classList.toggle("is-done", i < 5);
      dot.classList.toggle("is-current", i === 5);
      dot.disabled = !(i <= 6 || completed.has(i - 1));
      if (i === 5) dot.setAttribute("aria-current", "step"); else dot.removeAttribute("aria-current");
    });
  }
  function openBuildPage() {
    stageIndex = 5;
    document.body.classList.remove("lesson-intro-active");
    document.body.classList.add("lesson-problem-active");
    ["lessonIntroScreen", "problemSituationScreen", "learningScreen", "quarterScreen", "quarterMapScreen"].forEach((id) => $(id).classList.add("hidden"));
    hideKnowledgeScreen();
    hideSafetyScreen();
    hideExerciseScreen();
    $("buildScreen").classList.remove("hidden");
    $("buildScreen").querySelectorAll(".knowledge-hero").forEach((hero) => { hero.classList.remove("is-selected"); hero.setAttribute("aria-pressed", "false"); });
    updateBuildDots();
    window.scrollTo(0, 0);
  }
  function leaveBuildPage(toStage) {
    if (!completed.has(5)) completeStage(5);
    stageIndex = toStage;
    openLessonContent();
  }
  if (hasBuildScreen()) {
    document.querySelectorAll("[data-build-dot]").forEach((dot) => {
      dot.addEventListener("click", () => {
        const i = Number(dot.dataset.buildDot);
        if (i === 0) $("problemBackToIntro").click();
        else if (i === 1) openProblemSituation();
        else if (i === 2) openKnowledgeCheck();
        else if (i === 3) openSafetyPage(safetyScreens().length - 1);
        else if (i === 4) openExercisePage();
        else if (i >= 6) leaveBuildPage(i);
      });
    });
    $("buildBack").addEventListener("click", () => (hasExerciseScreen() ? openExercisePage() : (stageIndex = 4, openLessonContent())));
    $("buildContinue").addEventListener("click", () => leaveBuildPage(6));
  }
  // 7-bosqich: Baraban metodi — baraban haqiqatan aylanadi, chiqqan savolga javob beriladi
  const drumApi = (function setupDrum() {
    const wheel = document.getElementById("drumWheel");
    if (!wheel) return { reset() {} };
    const disk = wheel.querySelector("img");
    const pin = document.querySelector("#drumScene .drum-pin");
    const spinBtn = $("drumSpin");
    const panel = $("drumQuestion");
    const feedback = $("drumFeedback");
    // sektorlar soat strelkasi bo'yicha, tepadan boshlab (har biri 45°)
    const sectors = [
      { icon: "🧴", q: "Yelim nima uchun kerak?", a: ["Yopishtirish uchun", "Kesish uchun", "Chizish uchun"] },
      { icon: "📄", q: "Rangli qog‘ozdan nima yasash mumkin?", a: ["Applikatsiya", "Choy", "Non"] },
      { icon: "🍂", q: "Daraxt barglari qanday material?", a: ["Tabiiy material", "Temir", "Shisha"] },
      { icon: "🌰", q: "Tabiiy materiallarga nimalar kiradi?", a: ["G‘udda va barglar", "Qaychi va yelim", "Telefon va kitob"] },
      { icon: "🧱", q: "Plastilindan nima qilamiz?", a: ["Turli shakllar yasaymiz", "Qog‘oz qirqamiz", "Rasm yuvamiz"] },
      { icon: "🙌", q: "Ish paytida qaysi qoida to‘g‘ri?", a: ["Qaychini ehtiyot bo‘lib ishlataman", "Yelimni tatib ko‘raman", "Ish joyini sochib tashlayman"] },
      { icon: "⚙️", q: "Ish qurollari nima uchun kerak?", a: ["Narsalar yasash uchun", "Sindirib o‘ynash uchun", "Yashirib qo‘yish uchun"] },
      { icon: "✂️", q: "Qaysi asbob qog‘ozni kesish uchun kerak?", a: ["Qaychi", "Yelim", "Qalam"] }
    ];
    let angle = 0;
    let spinning = false;
    let stars = 0;
    let answered = new Set();
    let current = -1;

    function setStars() {
      document.querySelectorAll("#drumScene .drum-star").forEach((star, i) => star.classList.toggle("is-on", i < stars));
    }
    function shuffle(list) {
      const a = list.slice();
      for (let i = a.length - 1; i > 0; i--) { const r = Math.floor(Math.random() * (i + 1)); [a[i], a[r]] = [a[r], a[i]]; }
      return a;
    }
    function ask(k) {
      current = k;
      const s = sectors[k];
      $("drumQuestionIcon").textContent = s.icon;
      $("drumQuestionText").textContent = s.q;
      $("drumAgain").classList.add("hidden");
      const box = $("drumOptions");
      box.innerHTML = "";
      shuffle(s.a.map((text, i) => ({ text, right: i === 0 }))).forEach((opt) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = opt.text;
        b.addEventListener("click", () => {
          if (opt.right) {
            box.querySelectorAll("button").forEach((x) => { x.disabled = true; });
            b.classList.add("is-right");
            answered.add(k);
            if (stars < 3) stars++;
            setStars();
            if (stars >= 3) {
              if (!completed.has(6)) completeStage(6);
              feedback.textContent = "🎉 Barakalla! 3 ta yulduzcha yig‘dingiz! Siz haqiqiy bilimdonsiz.";
            } else {
              feedback.textContent = "✅ To‘g‘ri! Yulduzcha oldingiz: " + stars + " / 3. Yana aylantiring!";
            }
            $("drumAgain").classList.remove("hidden");
            $("drumAgain").focus();
          } else {
            b.classList.add("is-wrong");
            b.disabled = true;
            feedback.textContent = "🤔 Bu javob to‘g‘ri emas. Yana bir bor o‘ylab ko‘ring!";
          }
        });
        box.appendChild(b);
      });
      panel.classList.remove("hidden");
      feedback.textContent = "Savolni o‘qing va to‘g‘ri javobni tanlang.";
      const first = box.querySelector("button");
      if (first) first.focus({ preventScroll: true });
    }
    function spin() {
      if (spinning) return;
      panel.classList.add("hidden");
      const pool = sectors.map((_, i) => i).filter((i) => !answered.has(i));
      const target = (pool.length ? pool : sectors.map((_, i) => i))[Math.floor(Math.random() * (pool.length || sectors.length))];
      const center = target * 45 + 22.5;
      const jitter = (Math.random() - 0.5) * 30;
      const base = angle - (angle % 360);
      const finalAngle = base + 360 * (5 + Math.floor(Math.random() * 2)) + ((360 - center + jitter) % 360 + 360) % 360;
      const start = angle;
      const duration = 4200 + Math.random() * 800;
      const t0 = performance.now();
      let lastSector = Math.floor(((start % 360) + 360) % 360 / 45);
      spinning = true;
      spinBtn.disabled = true;
      wheel.classList.add("is-spinning");
      feedback.textContent = "Baraban aylanmoqda…";
      const ease = (t) => 1 - Math.pow(1 - t, 4);
      function frame(now) {
        const t = Math.min(1, (now - t0) / duration);
        angle = start + (finalAngle - start) * ease(t);
        disk.style.transform = "rotate(" + angle + "deg)";
        const sec = Math.floor(((angle % 360) + 360) % 360 / 45);
        if (sec !== lastSector) {
          lastSector = sec;
          pin.classList.remove("is-tick");
          void pin.getBoundingClientRect();
          pin.classList.add("is-tick");
        }
        if (t < 1) { requestAnimationFrame(frame); return; }
        spinning = false;
        spinBtn.disabled = false;
        wheel.classList.remove("is-spinning");
        const landed = Math.floor((((360 - (angle % 360)) % 360) + 360) % 360 / 45) % 8;
        ask(landed);
      }
      requestAnimationFrame(frame);
    }
    wheel.addEventListener("click", spin);
    spinBtn.addEventListener("click", spin);
    $("drumAgain").addEventListener("click", spin);
    function reset() {
      stars = 0;
      answered = new Set();
      panel.classList.add("hidden");
      setStars();
      feedback.textContent = feedback.dataset.hint;
    }
    reset();
    return { reset, sectors, landedFor: () => current };
  })();
  function openDrumPage() {
    stageIndex = 6;
    document.body.classList.remove("lesson-intro-active");
    document.body.classList.add("lesson-problem-active");
    ["lessonIntroScreen", "problemSituationScreen", "learningScreen", "quarterScreen", "quarterMapScreen"].forEach((id) => $(id).classList.add("hidden"));
    hideKnowledgeScreen();
    hideSafetyScreen();
    hideExerciseScreen();
    $("drumScreen").classList.remove("hidden");
    $("drumScreen").querySelectorAll(".knowledge-hero").forEach((hero) => { hero.classList.remove("is-selected"); hero.setAttribute("aria-pressed", "false"); });
    document.querySelectorAll("[data-drum-dot]").forEach((dot) => {
      const i = Number(dot.dataset.drumDot);
      dot.classList.toggle("is-done", i < 6);
      dot.classList.toggle("is-current", i === 6);
      dot.disabled = false;
      if (i === 6) dot.setAttribute("aria-current", "step"); else dot.removeAttribute("aria-current");
    });
    window.scrollTo(0, 0);
  }
  function leaveDrumPage(toStage) {
    if (!completed.has(6)) completeStage(6);
    stageIndex = toStage;
    openLessonContent();
  }
  if (document.getElementById("drumScreen")) {
    document.querySelectorAll("[data-drum-dot]").forEach((dot) => {
      dot.addEventListener("click", () => {
        const i = Number(dot.dataset.drumDot);
        if (i === 0) $("problemBackToIntro").click();
        else if (i === 1) openProblemSituation();
        else if (i === 2) openKnowledgeCheck();
        else if (i === 3) openSafetyPage(safetyScreens().length - 1);
        else if (i === 4) openExercisePage();
        else if (i === 5) openBuildPage();
        else if (i === 7) leaveDrumPage(7);
      });
    });
    $("drumBack").addEventListener("click", () => (hasBuildScreen() ? openBuildPage() : (stageIndex = 5, openLessonContent())));
    $("drumContinue").addEventListener("click", () => leaveDrumPage(7));
  }
  // 8-bosqich: Dars yakuni — baholash, bugungi darsda, uyga vazifa, uycha -> 1-chorak xaritasi
  const finalApi = (function setupFinal() {
    const scene = document.getElementById("finalScene");
    if (!scene) return { reset() {} };
    const feedback = $("finalFeedback");
    const say = (text) => { feedback.textContent = text; };
    const itemsDone = new Set();
    function confetti(count = 26) {
      const box = $("finalConfetti");
      const bits = ["⭐", "🍂", "🍁", "🎉", "✨", "🌟"];
      for (let i = 0; i < count; i++) {
        const s = document.createElement("span");
        s.textContent = bits[i % bits.length];
        s.style.left = Math.random() * 96 + "%";
        s.style.animationDuration = 1.8 + Math.random() * 1.6 + "s";
        s.style.animationDelay = Math.random() * 0.5 + "s";
        box.appendChild(s);
        setTimeout(() => s.remove(), 4200);
      }
    }
    scene.querySelectorAll("[data-medal]").forEach((medal) => {
      medal.addEventListener("click", () => {
        scene.querySelectorAll("[data-medal]").forEach((other) => {
          const on = other === medal;
          other.classList.toggle("is-selected", on);
          other.classList.toggle("is-dim", !on);
          other.setAttribute("aria-pressed", String(on));
        });
        say(medal.dataset.say);
        if (medal.dataset.medal === "alo") confetti(18);
      });
    });
    scene.querySelectorAll("[data-final-item]").forEach((item) => {
      item.addEventListener("click", () => {
        const i = Number(item.dataset.finalItem);
        if (itemsDone.has(i)) itemsDone.delete(i); else itemsDone.add(i);
        item.classList.toggle("is-checked", itemsDone.has(i));
        item.setAttribute("aria-pressed", String(itemsDone.has(i)));
        say(itemsDone.size === 4
          ? "🎉 Ajoyib! Bugungi darsning hammasini esladingiz!"
          : "✅ " + item.getAttribute("aria-label") + ". Esladingiz: " + itemsDone.size + " / 4");
        if (itemsDone.size === 4) confetti(14);
      });
    });
    const cardText = {
      home: "🏠 Uyga vazifa: ota-onangiz bilan birga tabiiy materiallardan yana bir ijodiy buyum yasang va sinfda taqdim eting.",
      next: "📅 Keyingi darsda rangli qog‘oz va kartondan qiziqarli buyumlar yasashni o‘rganamiz!"
    };
    scene.querySelectorAll("[data-final-card]").forEach((card) => {
      card.addEventListener("click", () => {
        scene.querySelectorAll("[data-final-card]").forEach((other) => other.classList.toggle("is-active", other === card));
        say(cardText[card.dataset.finalCard]);
      });
    });
    const sign = scene.querySelector(".final-sign");
    sign.addEventListener("click", () => {
      sign.classList.remove("is-wave");
      void sign.offsetWidth;
      sign.classList.add("is-wave");
      confetti();
      say("👋 Keyingi sayohatda ko‘rishguncha! Uycha tugmasini bosib, Kuzgi sayohat xaritasiga qayting.");
    });
    function reset() {
      itemsDone.clear();
      scene.querySelectorAll(".is-selected, .is-dim, .is-checked, .is-active").forEach((el) => el.classList.remove("is-selected", "is-dim", "is-checked", "is-active"));
      scene.querySelectorAll("[aria-pressed]").forEach((el) => el.setAttribute("aria-pressed", "false"));
      say(feedback.dataset.hint);
    }
    return { reset, confetti };
  })();
  function openFinalPage() {
    stageIndex = 7;
    if (!completed.has(7)) completeStage(7);
    document.body.classList.remove("lesson-intro-active");
    document.body.classList.add("lesson-problem-active");
    ["lessonIntroScreen", "problemSituationScreen", "learningScreen", "quarterScreen", "quarterMapScreen"].forEach((id) => $(id).classList.add("hidden"));
    hideKnowledgeScreen();
    hideSafetyScreen();
    hideExerciseScreen();
    $("finalScreen").classList.remove("hidden");
    $("finalScreen").querySelectorAll(".knowledge-hero").forEach((hero) => { hero.classList.remove("is-selected"); hero.setAttribute("aria-pressed", "false"); });
    document.querySelectorAll("[data-final-dot]").forEach((dot) => {
      const i = Number(dot.dataset.finalDot);
      dot.classList.toggle("is-done", i < 7);
      dot.classList.toggle("is-current", i === 7);
      if (i === 7) dot.setAttribute("aria-current", "step"); else dot.removeAttribute("aria-current");
    });
    setTimeout(() => finalApi.confetti(16), 300);
    window.scrollTo(0, 0);
  }
  if (document.getElementById("finalScreen")) {
    document.querySelectorAll("[data-final-dot]").forEach((dot) => {
      dot.addEventListener("click", () => {
        const i = Number(dot.dataset.finalDot);
        if (i === 0) $("problemBackToIntro").click();
        else if (i === 1) openProblemSituation();
        else if (i === 2) openKnowledgeCheck();
        else if (i === 3) openSafetyPage(safetyScreens().length - 1);
        else if (i === 4) openExercisePage();
        else if (i === 5) openBuildPage();
        else if (i === 6) openDrumPage();
      });
    });
    $("finalBack").addEventListener("click", () => openDrumPage());
    // Uycha: 1-chorak "Kuzgi sayohat" xaritasiga qaytish
    $("finalHome").addEventListener("click", () => $("returnToMap").click());
  }
  $("backToQuarters").addEventListener("click",()=>{$("quarterMapScreen").classList.add("hidden");$("quarterScreen").classList.remove("hidden");renderQuarterHub();window.scrollTo(0,0)});
  $("previousQuarter").addEventListener("click",()=>{if(activeQuarter>0)openQuarter(activeMapCourse.quarters[activeQuarter-1].id)});$("nextQuarter").addEventListener("click",()=>{if(activeQuarter<3)openQuarter(activeMapCourse.quarters[activeQuarter+1].id)});
  $("returnToMap").addEventListener("click",()=>{document.body.classList.remove("lesson-intro-active","lesson-problem-active");$("problemSituationScreen").classList.add("hidden");hideKnowledgeScreen();hideSafetyScreen();hideExerciseScreen();$("lessonIntroScreen").classList.add("hidden");$("learningScreen").classList.add("hidden");$("quarterMapScreen").classList.remove("hidden");renderQuarterMap();window.scrollTo(0,0)});
  function chooseGrade(value, openWhenReady = false) {
    grade = Number(value);
    document
      .querySelectorAll(".grade-choice")
      .forEach((button) =>
        button.classList.toggle("active", Number(button.dataset.grade) === grade)
      );
    $("topGrade").textContent = grade + "-sinf";

    if (openWhenReady) openSelectedSubject();
  }

  document
    .querySelectorAll(".grade-choice")
    .forEach((button) =>
      button.addEventListener("click", () =>
        chooseGrade(button.dataset.grade, true)
      )
    );

  document.querySelectorAll(".subject-choice").forEach((button) => {
    button.addEventListener("click", () => {
      subject = button.dataset.subject;
      updateSubjectSelection();
      openSelectedSubject();
    });
  });

  if (subject) updateSubjectSelection();

  function resetLesson() {
    stageIndex = 0;
    situationChoice = "";
    knownTools.clear();
    safetyDone.forEach((done) => done.clear());
    safetyResume = 0;
    exerciseDoneSet.clear();
    if (typeof buildApi !== "undefined") buildApi.reset();
    if (typeof drumApi !== "undefined") drumApi.reset();
    if (typeof finalApi !== "undefined") finalApi.reset();
    score = 0;
    completed = new Set();
    exerciseDone = new Set();
    quizUsed = new Set();
    drumQuestion = null;
    drumAnswered = false;
    drumSpinning = false;
    drumRotation = 0;
  }

  function drawLessonMenu() {
    const menu = $("lessonMenu");
    menu.innerHTML = "";
    const names = [
      "Texnologiyaga ilk qadam",
      "Qog‘oz varag‘i bilan ishlash",
      "Uycha va daraxtlar",
      "To‘lqinlar uzra suzayotgan kemacha",
    ];
    names.forEach((name, i) => {
      const b = document.createElement("button");
      b.className = i === lessonIndex ? "active" : "";
      b.innerHTML = `<span class="lesson-index">${
        i + 1
      }</span><span><strong>${name}</strong><small>${
        i + 1
      }-dars</small></span>`;
      b.addEventListener("click", () => {
        if (i !== 0) {
          alert(
            "Bu darsning mazmuni darslik asosida keyingi bosqichda qo‘shiladi."
          );
          return;
        }
        lessonIndex = i;
        resetLesson();
        drawLessonMenu();
        renderStage();
      });
      menu.appendChild(b);
    });
  }

  function renderStage() {
    if (stageIndex === 2 && hasKnowledgeScreen()) {
      openKnowledgeCheck();
      return;
    }
    if (stageIndex === 3 && hasSafetyScreen()) {
      openSafetyPage(safetyResume);
      return;
    }
    if (stageIndex === 4 && hasExerciseScreen()) {
      openExercisePage();
      return;
    }
    if (stageIndex === 5 && hasBuildScreen()) {
      openBuildPage();
      return;
    }
    if (stageIndex === 6 && document.getElementById("drumScreen")) {
      openDrumPage();
      return;
    }
    if (stageIndex === 7 && document.getElementById("finalScreen")) {
      openFinalPage();
      return;
    }
    if (stageIndex === 1) {
      openProblemSituation();
      return;
    }
    const stage = lesson.stages[stageIndex];
    $("lessonNumber").textContent =
      stageIcons[stageIndex] + " " + (stageIndex + 1) + "-BOSQICH";
    $("heroGoal").textContent = lesson.goal;
    $("heroTitle").textContent = stage.title;
    $("heroGreeting").textContent = lesson.greeting;
    $("heroQuestionTitle").textContent = lesson.title;
    $("objectStrip").innerHTML = lesson.objects
      .map((item) => {
        const [emoji, name] = item.split("|");
        return `<div>${emoji}<b>${name}</b></div>`;
      })
      .join("");

    $("heroImage").src = "images/_hero_banner.png";
    $("stageImage").src = "images/" + stage.image;
    $("stageImage").alt = stage.title;
    $("stageEyebrow").textContent = stageIndex + 1 + "-BOSQICH";
    $("stageTitle").textContent = stage.title;
    $("stageCount").textContent = stageIndex + 1 + " / 8";
    $("stageContent").innerHTML = stage.content;
    $("adviceText").textContent = stage.advice;

    $("heroImage").onerror = () => {
      $("heroImage").src = "images/classroom.png";
    };
    $("stageImage").onerror = () => {
      $("stageImage").style.visibility = "hidden";
    };
    $("stageImage").onload = () => {
      $("stageImage").style.visibility = "visible";
    };

    $("previousStage").disabled = stageIndex === 0;
    $("nextStage").disabled = stageIndex === 7 || !completed.has(stageIndex);
    $("doneStage").textContent = completed.has(stageIndex)
      ? "Bajarildi ✓"
      : "Bajardim ✓";

    renderBottomStages();
    bindStageInteractions();
    updateProgress();

    if (stageIndex === 7) $("finalScore").textContent = score + " ball";
  }

  function bindStageInteractions() {
    if (stageIndex === 1) bindSituation();
    if (stageIndex === 3) bindWorkshop();
    if (stageIndex === 4) bindExercises();
    if (stageIndex === 6) bindDrum();
  }

  function bindSituation() {
    const feedback = $("situationFeedback");
    document.querySelectorAll("[data-situation]").forEach((button) => {
      button.addEventListener("click", () => {
        const correct = button.dataset.situation === "0";
        document.querySelectorAll("[data-situation]").forEach((b) => {
          b.classList.remove("correct", "incorrect");
          b.disabled = false;
        });
        if (correct) {
          button.classList.add("correct");
          feedback.innerHTML =
            "<b>Barakalla! To‘g‘ri javob!</b><p>Ish joyini tayyorlash va qurollarni tartib bilan joylashtirish xavfsiz va qulay ishlashga yordam beradi.</p>";
          completeStage(1);
        } else {
          button.classList.add("incorrect");
          feedback.innerHTML =
            "<b>Bu javob to‘g‘ri emas.</b><p>Yana bir bor o‘ylab ko‘ring. Ishni boshlashdan oldin ish joyini tayyorlash kerak.</p>";
        }
      });
    });
  }

  function bindWorkshop() {
    document.querySelectorAll("[data-tool]").forEach((button) => {
      button.addEventListener("click", () => {
        const info = tools[button.dataset.tool];
        document
          .querySelectorAll("[data-tool]")
          .forEach((b) => b.classList.remove("active"));
        button.classList.add("active");
        $("toolDetailIcon").textContent = info.icon;
        $("toolDetailTitle").textContent = info.title;
        $("toolDetailText").textContent = info.text;
        $("toolDetailSafety").textContent = "⚠️ " + info.safety;
      });
    });

    document.querySelectorAll("[data-tool-answer]").forEach((button) => {
      button.addEventListener("click", () => {
        const feedback = $("toolTaskFeedback");
        document
          .querySelectorAll("[data-tool-answer]")
          .forEach((b) => b.classList.remove("correct", "incorrect"));
        if (button.dataset.toolAnswer === "scissors") {
          button.classList.add("correct");
          feedback.innerHTML =
            "<b>Barakalla! To‘g‘ri javob! 🎉</b><p>Qaychi qog‘oz va kartonni qirqish uchun ishlatiladi.</p>";
          completeStage(3);
        } else {
          button.classList.add("incorrect");
          feedback.innerHTML =
            "<b>Yana bir bor urinib ko‘ring.</b><p>Qog‘ozni qirqish uchun qaysi qurol ishlatiladi?</p>";
        }
      });
    });
  }

  function bindExercises() {
    const buttons = document.querySelectorAll("[data-exercise]");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.exercise);
        if (exerciseDone.has(index)) return;
        exerciseDone.add(index);
        button.textContent = "Bajarildi ✓";
        button.closest(".exercise-card").classList.add("done");
        $("exerciseProgress").textContent =
          exerciseDone.size + " / 5 ta mashq bajarildi";
        $("exerciseFeedback").textContent =
          exerciseDone.size === 5
            ? "Ajoyib! Barcha mashqlarni bajardingiz! 🎉"
            : "Barakalla! Keyingi mashqni ham bajaring.";
        if (exerciseDone.size === 5) completeStage(4);
      });
    });
  }

  function bindDrum() {
    const spin = $("spinDrum");
    spin.disabled = quizUsed.size === questions.length;
    $("drumScore").textContent = score;

    spin.addEventListener("click", () => {
      if (drumSpinning || quizUsed.size === questions.length) return;
      drumSpinning = true;
      spin.disabled = true;
      spin.textContent = "Baraban aylanmoqda...";
      const wheel = $("drumWheel");
      drumRotation += 1440 + Math.floor(Math.random() * 360);
      wheel.style.transform = `rotate(${drumRotation}deg)`;

      setTimeout(() => {
        const available = questions
          .map((_, i) => i)
          .filter((i) => !quizUsed.has(i));
        const index = available[Math.floor(Math.random() * available.length)];
        drumQuestion = index;
        quizUsed.add(index);
        drumAnswered = false;
        drumSpinning = false;
        spin.textContent = "🎯 Yana aylantirish";
        spin.disabled = false;
        showDrumQuestion();
      }, 2100);
    });

    if (drumQuestion !== null) showDrumQuestion();
  }

  function showDrumQuestion() {
    const q = questions[drumQuestion];
    const area = $("drumQuestionArea");
    area.innerHTML = `
      <div class="drum-question">
        <span class="eyebrow">TANLANGAN SAVOL</span>
        <h3>${q.q}</h3>
        <div class="drum-options">
          ${q.a
            .map(
              (answer, i) =>
                `<button data-drum-answer="${i}">${String.fromCharCode(
                  65 + i
                )}. ${answer}</button>`
            )
            .join("")}
        </div>
        <div id="drumFeedback"></div>
      </div>`;

    area.querySelectorAll("[data-drum-answer]").forEach((button) => {
      button.addEventListener("click", () => {
        if (drumAnswered) return;
        drumAnswered = true;
        const chosen = Number(button.dataset.drumAnswer);
        const correct = chosen === q.c;

        area.querySelectorAll("[data-drum-answer]").forEach((b, i) => {
          b.disabled = true;
          if (i === q.c) b.classList.add("correct");
          else if (i === chosen) b.classList.add("incorrect");
        });

        if (correct) score += 10;
        $("drumScore").textContent = score;
        $("drumFeedback").className = "drum-feedback";
        $("drumFeedback").innerHTML = correct
          ? "<b>Barakalla! +10 ball 🎉</b><p>" + q.e + "</p>"
          : "<b>Bu safar noto‘g‘ri javob.</b><p>" + q.e + "</p>";

        if (quizUsed.size === questions.length) {
          completeStage(6);
          area.insertAdjacentHTML(
            "beforeend",
            '<p class="feedback-box">Barcha savollar yakunlandi! Barakalla!</p>'
          );
        }
        updateProgress();
        $("spinDrum").disabled = quizUsed.size === questions.length;
      });
    });
  }

  function completeStage(index) {
    if (completed.has(index)) return;
    completed.add(index);
    score += 5;
    updateProgress();
    renderBottomStages();
    if (completed.size === 8 && activeMapCourse) finishedLessons.add(activeMapCourse.lessons[0].id);
    if (index === stageIndex) {
      $("doneStage").textContent = "Bajarildi ✓";
      $("nextStage").disabled = stageIndex === 7;
    }
  }

  function renderBottomStages() {
    $("bottomStageNav").innerHTML = stageNames
      .map(
        (name, i) => `
      <button class="${stageColors[i]} ${stageIndex === i ? "active" : ""} ${
          completed.has(i) ? "done" : ""
        }" data-stage="${i}">
        <span class="stage-emoji">${stageIcons[i]}</span>
        <span class="stage-num">${completed.has(i) ? "✓" : i + 1}</span>
        <b>${name}</b>
      </button>`
      )
      .join("");

    document.querySelectorAll("[data-stage]").forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.stage);
        if (index > 0 && !completed.has(index - 1)) {
          alert("Avval oldingi bosqichni bajaring.");
          return;
        }
        stageIndex = index;
        renderStage();
      });
    });
  }

  function updateProgress() {
    const total = 8;
    const done = completed.size;
    $("progressFill").style.width = (done / total) * 100 + "%";
    $("progressFraction").textContent = done + " / " + total;
    $("scoreValue").textContent = score;
    $("completedValue").textContent = done;
    $("streakValue").textContent = done;
  }

  $("previousStage").addEventListener("click", () => {
    if (stageIndex === 3 && hasSafetyScreen()) {
      openSafetyPage(safetyResume);
      return;
    }
    if (stageIndex === 2 && hasKnowledgeScreen()) {
      openKnowledgeCheck();
      return;
    }
    if (stageIndex > 0) {
      stageIndex--;
      renderStage();
    }
  });

  $("nextStage").addEventListener("click", () => {
    if (stageIndex < 7 && completed.has(stageIndex)) {
      stageIndex++;
      renderStage();
    }
  });

  $("doneStage").addEventListener("click", () => {
    if (stageIndex === 4 && exerciseDone.size !== 5) {
      alert("Jismoniy daqiqadagi 5 ta mashqning barchasini bajaring.");
      return;
    }
    if (stageIndex === 6 && quizUsed.size !== questions.length) {
      alert("Barabanda barcha savollarga javob bering.");
      return;
    }
    completeStage(stageIndex);
  });

  // Boshlanish holati
  $("catalogScreen").classList.remove("hidden");
  $("learningScreen").classList.add("hidden");
  chooseGrade(1);
});
