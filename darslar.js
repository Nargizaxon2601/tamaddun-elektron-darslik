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
  const lesson2Pages = () => Array.from(document.querySelectorAll("[data-l2-page]"));
  const lessonOf = (page) => Number(page.dataset.lesson || 2);
  const lessonPages = (L) => lesson2Pages().filter((page) => lessonOf(page) === L);
  const LESSON_TITLES = { 2: "Qog‘oz varag‘i bilan ishlash", 3: "Manzara yaratamiz: Uycha va daraxtlar" };
  const safetyScreens = () => Array.from(document.querySelectorAll("[data-safety-page]"));
  const hasSafetyScreen = () => safetyScreens().length > 0;
  const hideSafetyScreen = () => safetyScreens().forEach((screen) => screen.classList.add("hidden"));
  const hasExerciseScreen = () => Boolean(document.getElementById("exerciseScreen"));
  const hasBuildScreen = () => Boolean(document.getElementById("buildScreen"));
  const hideExerciseScreen = () => { ["exerciseScreen", "buildScreen", "drumScreen", "finalScreen"].forEach((id) => { const el = document.getElementById(id); if (el) el.classList.add("hidden"); }); document.querySelectorAll("[data-l2-page]").forEach((el) => el.classList.add("hidden")); };
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
        const isLesson2 = number >= 2 && lessonPages(number).length > 0;
        const isAvailable = (number === 1 && firstLesson) || isLesson2;
        const isDone = Boolean(number === 1 && firstLesson && finishedLessons.has(firstLesson.id));
        const state = isAvailable ? (isDone ? " Bajarilgan" : " Mavjud dars") : " Kontent tayyorlanmoqda";
        const label = number === 11 ? "11-manzil" : number + "-dars";
        return '<button type="button" class="q1-map-station station-' + number +
          (isDone ? ' is-done' : '') + '" data-station-id="texnologiya-1-q1-station-' + number + '"' +
          (isLesson2 ? ' data-lesson2="' + number + '"' : (isAvailable ? ' data-lesson-id="' + firstLesson.id + '"' : '')) +
          ' aria-label="' + label + '.' + state + '"><span class="sr-only">' + label +
          (isLesson2 ? ' — ' + (LESSON_TITLES[number] || "dars") + ', darsni ochish' : (isAvailable ? ' — ' + firstLesson.title + ', darsni ochish' : ' — kontent tayyorlanmoqda')) +
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
          if (button.dataset.lesson2) {
            openLessonPage(Number(button.dataset.lesson2), 0);
            return;
          }
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
  // ===== 2-DARS: "Qog‘oz varag‘i bilan ishlash" — rasmli interaktiv sahifalar =====
  // Bir nechta dars shu tizimdan foydalanadi: data-lesson="3" (yo'q bo'lsa — 2-dars)
  function hideLesson2() { lesson2Pages().forEach((page) => page.classList.add("hidden")); }
  // Nuqtalar darsning 8 bosqichini ko'rsatadi; bir bosqichda bir nechta sahifa bo'lishi mumkin (data-l2-stage)
  const lesson2Stage = (page, k) => (page.dataset.l2Stage !== undefined ? Number(page.dataset.l2Stage) : k);
  function updateLessonDots(L, k) {
    const page = lessonPages(L)[k];
    const stage = lesson2Stage(page, k);
    page.querySelectorAll("[data-l2-dot]").forEach((dot) => {
      const i = Number(dot.dataset.l2Dot);
      dot.classList.toggle("is-done", i < stage);
      dot.classList.toggle("is-current", i === stage);
      if (i === stage) dot.setAttribute("aria-current", "step"); else dot.removeAttribute("aria-current");
    });
  }
  function openLessonStage(L, i, feedback) {
    const k = lessonPages(L).findIndex((page, j) => lesson2Stage(page, j) === i);
    if (k >= 0) openLessonPage(L, k);
    else if (feedback) feedback.textContent = (i + 1) + "-bosqich tez orada qo‘shiladi!";
  }
  function openLessonPage(L, k) {
    const pages = lessonPages(L);
    if (!pages.length) return;
    k = Math.max(0, Math.min(k, pages.length - 1));
    document.body.classList.remove("lesson-intro-active");
    document.body.classList.add("lesson-problem-active");
    ["lessonIntroScreen", "problemSituationScreen", "learningScreen", "quarterScreen", "quarterMapScreen"].forEach((id) => $(id).classList.add("hidden"));
    hideKnowledgeScreen();
    hideSafetyScreen();
    hideExerciseScreen();
    const page = pages[k];
    lesson2Pages().forEach((other) => other.classList.toggle("hidden", other !== page));
    page.querySelectorAll(".knowledge-hero").forEach((hero) => { hero.classList.remove("is-selected"); hero.setAttribute("aria-pressed", "false"); });
    updateLessonDots(L, k);
    window.scrollTo(0, 0);
  }
  const openLesson2Page = (k) => openLessonPage(2, k);
  function lesson2ToMap() {
    hideLesson2();
    document.body.classList.remove("lesson-intro-active", "lesson-problem-active");
    $("quarterMapScreen").classList.remove("hidden");
    renderQuarterMap();
    window.scrollTo(0, 0);
  }
  [...new Set(lesson2Pages().map(lessonOf))].forEach((L) => lessonPages(L).forEach((page, k) => {
    const feedback = page.querySelector(".l2-feedback");
    const seen = new Set();
    const items = page.querySelectorAll(".l2-item");
    items.forEach((item, i) => {
      item.addEventListener("click", () => {
        items.forEach((other) => { other.classList.toggle("is-active", other === item); });
        seen.add(i);
        item.classList.add("is-seen");
        item.setAttribute("aria-pressed", "true");
        feedback.textContent = item.dataset.say + (seen.size === items.length ? " 🎉 Barchasi bilan tanishdingiz!" : "");
      });
    });
    const checks = page.querySelectorAll(".l2-check");
    checks.forEach((check) => {
      check.addEventListener("click", () => {
        const on = !check.classList.contains("is-checked");
        check.classList.toggle("is-checked", on);
        check.setAttribute("aria-pressed", String(on));
        const n = page.querySelectorAll(".l2-check.is-checked").length;
        feedback.textContent = n === checks.length
          ? "🎉 Barakalla! Hamma savollar ustida o‘ylab ko‘rdingiz."
          : (on ? (check.dataset.say || "🤔 " + check.getAttribute("aria-label") + " O‘ylab ko‘ring va javobingizni ayting!") : "Belgi olib tashlandi.") + " Belgilandi: " + n + " / " + checks.length;
      });
    });
    page.querySelectorAll("[data-l2-dot]").forEach((dot) => {
      dot.addEventListener("click", () => openLessonStage(L, Number(dot.dataset.l2Dot), feedback));
    });
    page.querySelector(".l2-back").addEventListener("click", () => (k === 0 || page.querySelector(".l2-back").dataset.home ? lesson2ToMap() : openLessonPage(L, k - 1)));
    page.querySelector(".l2-next").addEventListener("click", () => {
      if (page.querySelector(".l2-next").dataset.home) lesson2ToMap();
      else if (k < lessonPages(L).length - 1) openLessonPage(L, k + 1);
      else feedback.textContent = "Keyingi bosqich tez orada qo‘shiladi! Hozircha ← tugmasi bilan orqaga qaytishingiz mumkin.";
    });
  }));
  // 2-dars 3-bosqich: «Sehrli ustaning xaltasi» (surib saralash) va «Savol–javob»
  (function setupBagAndQa() {
    const game = document.getElementById("bagGame");
    if (!game) return;
    const page = game.closest("[data-l2-page]");
    const scene = page.querySelector(".l2-scene");
    const feedback = page.querySelector(".l2-feedback");
    const W = 1670, H = 942;
    const BAG_POS = { x: 300, y: 470 };
    const CATS = { tool: "Ish qurollari", material: "Materiallar", safety: "Xavfsizlik qoidalari" };
    const ITEMS = [
      ["✂️", "Qaychi", "tool"], ["🧴", "Yelim", "tool"], ["✏️", "Qalam", "tool"], ["🔪", "Steklar", "tool"],
      ["🟫", "Plastilin", "material"], ["📦", "Karton", "material"], ["📄", "Rangli qog‘oz", "material"], ["🌰", "G‘udda", "material"], ["🍁", "Barg", "material"],
      ["✋", "Qaychini ehtiyot bo‘lib ishlataman", "safety"], ["🚫", "Yelimni tatib ko‘rmayman", "safety"], ["🧹", "Dars tugagach anjomlarni joyiga qo‘yaman", "safety"]
    ];
    let deck = [];
    let item = null; // {el, data, x, y}
    let score = 0, done = 0;
    let drag = null;
    const scoreEl = game.querySelector(".bag-score");
    const sack = game.querySelector(".bag-sack");
    const cats = Array.from(game.querySelectorAll(".bag-cat"));
    const toImg = (e) => { const r = scene.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H }; };
    const place = () => { item.el.style.left = (item.x / W * 100) + "%"; item.el.style.top = (item.y / H * 100) + "%"; };
    function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const r = Math.floor(Math.random() * (i + 1)); [a[i], a[r]] = [a[r], a[i]]; } return a; }
    function newRound() { deck = shuffle(ITEMS); score = 0; done = 0; scoreEl.textContent = "⭐ 0"; }
    function pull() {
      if (item) { feedback.textContent = "Avval chiqqan buyumni mos guruhga olib boring!"; flash(item.el); return; }
      if (!deck.length) newRound();
      const data = deck.pop();
      sack.classList.remove("is-shake"); void sack.offsetWidth; sack.classList.add("is-shake");
      const el = document.createElement("div");
      el.className = "bag-item";
      el.dataset.cat = data[2];
      el.setAttribute("role", "button");
      el.setAttribute("tabindex", "0");
      el.setAttribute("aria-label", data[1] + ". Mos guruhga olib boring");
      el.innerHTML = "<b>" + data[0] + "</b>" + data[1];
      scene.appendChild(el);
      item = { el, data, x: BAG_POS.x, y: BAG_POS.y };
      place();
      bindItem();
      feedback.textContent = "Xaltadan «" + data[1] + "» chiqdi! Uni mos guruhga surib olib boring yoki guruhni bosing.";
    }
    function flash(el) { el.classList.remove("is-wrong"); void el.offsetWidth; el.classList.add("is-wrong"); setTimeout(() => el.classList.remove("is-wrong"), 450); }
    function judge(cat) {
      if (!item) { feedback.textContent = "Avval sehrli xaltani bosing!"; return; }
      const right = item.data[2] === cat.dataset.cat;
      if (right) {
        score++; done++;
        scoreEl.textContent = "⭐ " + score;
        cat.classList.add("is-right"); setTimeout(() => cat.classList.remove("is-right"), 700);
        item.el.remove(); item = null;
        feedback.textContent = done === ITEMS.length
          ? "🎉 Barakalla! Xaltadagi hamma " + ITEMS.length + " ta buyumni to‘g‘ri joyladingiz! Yana o‘ynash uchun xaltani bosing."
          : "✅ To‘g‘ri! Bu — " + CATS[cat.dataset.cat].toLowerCase() + ". Yulduzchalar: " + score + ". Xaltani yana bosing!";
        if (done === ITEMS.length) deck = [];
      } else {
        flash(cat);
        item.el.classList.add("is-back"); item.x = BAG_POS.x; item.y = BAG_POS.y; place();
        setTimeout(() => item && item.el.classList.remove("is-back"), 400);
        feedback.textContent = "🤔 «" + item.data[1] + "» bu guruhga mos emas. Yana o‘ylab ko‘ring!";
      }
    }
    function bindItem() {
      const el = item.el;
      el.addEventListener("pointerdown", (e) => {
        if (e.button > 0) return;
        e.preventDefault();
        drag = { id: e.pointerId, moved: false, start: toImg(e) };
        el.classList.add("is-dragging");
        try { el.setPointerCapture(e.pointerId); } catch (err) {}
      });
      el.addEventListener("pointermove", (e) => {
        if (!drag || drag.id !== e.pointerId || !item) return;
        const p = toImg(e);
        if (Math.hypot(p.x - drag.start.x, p.y - drag.start.y) > 6) drag.moved = true;
        item.x = p.x; item.y = p.y; place();
        cats.forEach((c) => c.classList.remove("is-target"));
        const over = document.elementsFromPoint(e.clientX, e.clientY).find((n) => n.classList && n.classList.contains("bag-cat"));
        if (over) over.classList.add("is-target");
      });
      const end = (e) => {
        if (!drag || drag.id !== e.pointerId) return;
        const moved = drag.moved; drag = null;
        el.classList.remove("is-dragging");
        cats.forEach((c) => c.classList.remove("is-target"));
        if (!item) return;
        const over = document.elementsFromPoint(e.clientX, e.clientY).find((n) => n.classList && n.classList.contains("bag-cat"));
        if (over) { judge(over); return; }
        if (moved) { item.el.classList.add("is-back"); item.x = BAG_POS.x; item.y = BAG_POS.y; place(); setTimeout(() => item && item.el.classList.remove("is-back"), 400); }
        feedback.textContent = "«" + item.data[1] + "»ni guruhlardan biriga olib boring: ish qurollari, materiallar yoki xavfsizlik qoidalari.";
      };
      el.addEventListener("pointerup", end);
      el.addEventListener("pointercancel", end);
    }
    sack.addEventListener("click", pull);
    cats.forEach((cat) => cat.addEventListener("click", () => judge(cat)));
    newRound();

    // «Savol–javob»
    const QA = [
      ["Qog‘ozni qirqish uchun nima kerak?", ["Qaychi", "Yelim", "Plastilin"]],
      ["Partani iflos qilmaslik uchun ustiga nima to‘shaymiz?", ["Qog‘oz yoki kleyonka", "Barg", "Paxta"]],
      ["Tabiiy materiallarni toping.", ["G‘udda va barglar", "Qaychi va yelim", "Qalam va daftar"]],
      ["Mo‘yqalamni ishlatib bo‘lgach nima qilamiz?", ["Suvda yuvib, quritib qo‘yamiz", "Partaga tashlab qo‘yamiz", "Yelimga botirib qo‘yamiz"]],
      ["Plastilin bilan ishlaganda partani nima asraydi?", ["Plastilin taxtachasi", "Qaychi", "Paxta"]],
      ["«Kuzgi kirpicha»ni nimalardan yasadik?", ["G‘udda va plastilindan", "Faqat qog‘ozdan", "Kartondan"]],
      ["Darsda yordam kerak bo‘lsa nima qilamiz?", ["Qo‘limizni ko‘taramiz", "Baqiramiz", "O‘rnimizdan turib ketamiz"]]
    ];
    const panel = $("qaPanel");
    let qi = 0, qScore = 0, order = [];
    function showQ() {
      const [q, answers] = QA[order[qi]];
      $("qaCount").textContent = "Savol " + (qi + 1) + " / " + QA.length;
      $("qaScore").textContent = "⭐ " + qScore;
      $("qaText").textContent = q;
      $("qaNext").classList.add("hidden");
      const box = $("qaOptions");
      box.innerHTML = "";
      let firstTry = true, answered = false;
      shuffle(answers.map((t, i) => ({ t, right: i === 0 }))).forEach((opt) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = opt.t;
        b.addEventListener("click", () => {
          if (answered) { feedback.textContent = opt.right ? "✅ To‘g‘ri javob! «Keyingi savol» tugmasini bosing." : "Bu savolning to‘g‘ri javobi yashil rangda belgilangan."; return; }
          if (opt.right) {
            answered = true;
            if (firstTry) qScore++;
            $("qaScore").textContent = "⭐ " + qScore;
            b.classList.add("is-right");
            const last = qi === QA.length - 1;
            $("qaNext").textContent = last ? "↻ Qaytadan boshlash" : "Keyingi savol →";
            $("qaNext").classList.remove("hidden");
            feedback.textContent = last
              ? "🎉 Savol–javob tugadi! Birinchi urinishda topilgan javoblar: " + qScore + " / " + QA.length + "."
              : "✅ To‘g‘ri javob! Keyingi savolga o‘ting.";
          } else {
            firstTry = false;
            b.classList.add("is-wrong");
            feedback.textContent = "🤔 Bu javob to‘g‘ri emas. Yana o‘ylab ko‘ring!";
          }
        });
        box.appendChild(b);
      });
    }
    function startQa() { order = shuffle(QA.map((_, i) => i)); qi = 0; qScore = 0; panel.classList.remove("hidden"); showQ(); feedback.textContent = "Savolni o‘qing va to‘g‘ri javobni tanlang."; }
    $("qaOpen").addEventListener("click", startQa);
    $("qaNext").addEventListener("click", () => { if (qi < QA.length - 1) { qi++; showQ(); } else startQa(); });
  })();
  // 2-dars 4-bosqich 1/4: qog'oz varag'ining tomonlari va burchaklari
  (function setupPaperSides() {
    const board = document.getElementById("paperBoard");
    if (!board) return;
    const scene = board.parentElement;
    const page = scene.closest("[data-l2-page]");
    const feedback = page.querySelector(".l2-feedback");
    const quizBtn = document.getElementById("paperQuiz");
    const scoreEl = document.getElementById("paperScore");
    const labels = Array.from(scene.querySelectorAll(".paper-label"));
    const marks = Array.from(scene.querySelectorAll(".paper-mark"));
    const NAMES = {}; labels.forEach((l) => { NAMES[l.dataset.part] = l.dataset.name; });
    const ALL = Object.keys(NAMES);
    const seen = new Set();
    let quiz = null;
    const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);
    function clearMarks() { marks.forEach((m) => m.classList.remove("is-on", "is-good", "is-bad")); labels.forEach((l) => l.classList.remove("is-on")); board.classList.remove("is-win"); }
    function show(part) {
      clearMarks();
      scene.querySelector('.paper-mark[data-part="' + part + '"]').classList.add("is-on");
      scene.querySelector('.paper-label[data-part="' + part + '"]').classList.add("is-on");
      seen.add(part);
      const corner = part.length === 2;
      feedback.textContent = "👉 " + cap(NAMES[part]) + (corner ? " — ikki tomon uchrashgan joy." : " — qog‘ozning bir cheti.") +
        (seen.size === ALL.length ? " 🎉 Hamma tomon va burchaklarni ko‘rdingiz! Endi «🎯 Topib ko‘r!» tugmasini bosing." : " Ko‘rildi: " + seen.size + " / " + ALL.length);
    }
    function ask() {
      clearMarks();
      const part = quiz.order[quiz.i];
      quizBtn.textContent = "Toping: " + NAMES[part];
      quizBtn.classList.add("is-running");
      scoreEl.textContent = "⭐ " + quiz.score + " / " + ALL.length;
      feedback.textContent = "🎯 " + (quiz.i + 1) + "-savol: qog‘ozdagi «" + NAMES[part] + "»ni bosing!";
    }
    function startQuiz() {
      const order = ALL.slice();
      for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
      quiz = { order, i: 0, score: 0, miss: false };
      scoreEl.classList.remove("hidden");
      ask();
    }
    function answer(part) {
      const want = quiz.order[quiz.i];
      const mark = scene.querySelector('.paper-mark[data-part="' + part + '"]');
      clearMarks();
      if (part === want) {
        if (!quiz.miss) quiz.score++;
        quiz.miss = false;
        quiz.i++;
        scoreEl.textContent = "⭐ " + quiz.score + " / " + ALL.length;
        if (quiz.i >= ALL.length) {
          board.classList.add("is-win");
          feedback.textContent = "🏆 Barakalla! Hammasini topdingiz. Birinchi urinishda: " + quiz.score + " / " + ALL.length + ". Yana o‘ynash uchun tugmani bosing.";
          quizBtn.textContent = "↻ Yana o‘ynash";
          quizBtn.classList.remove("is-running");
          quiz = null;
          return;
        }
        ask();
        mark.classList.add("is-good");
        feedback.textContent = "✅ To‘g‘ri! Bu — " + NAMES[part] + ". Endi qog‘ozdagi «" + NAMES[quiz.order[quiz.i]] + "»ni bosing!";
      } else {
        quiz.miss = true;
        mark.classList.add("is-bad");
        feedback.textContent = "🤔 Bu — " + NAMES[part] + ". Bizga «" + NAMES[want] + "» kerak. Yana urinib ko‘ring!";
      }
    }
    scene.querySelectorAll(".paper-zone, .paper-label").forEach((el) => {
      el.addEventListener("click", () => (quiz ? answer(el.dataset.part) : show(el.dataset.part)));
    });
    quizBtn.addEventListener("click", () => {
      if (quiz) { feedback.textContent = "🎯 Qog‘ozdagi «" + NAMES[quiz.order[quiz.i]] + "»ni bosing! Qaytadan boshlash uchun yana bir marta bosing."; quiz.restart = (quiz.restart || 0) + 1; if (quiz.restart > 1) startQuiz(); return; }
      startQuiz();
    });
  })();
  // 2-dars 4-bosqich 2/4: qadamlarni to'g'ri tartibda bosish
  document.querySelectorAll(".l2-scene").forEach((foldScene) => (function setupFoldSteps() {
    const steps = Array.from(foldScene.querySelectorAll(".fold-step"));
    if (!steps.length) return;
    const scene = foldScene;
    const page = scene.closest("[data-l2-page]");
    const feedback = page.querySelector(".l2-feedback");
    const restart = scene.querySelector(".fold-restart");
    const doneText = scene.dataset.foldDone || "Barakalla! Siz qog‘ozni to‘g‘ri buklab, 4 ta tasma qirqdingiz!";
    let next = 1;
    function reset() {
      next = 1;
      steps.forEach((s) => s.classList.remove("is-done", "is-current", "is-wrong"));
      scene.querySelectorAll(".fold-badge").forEach((b) => b.classList.remove("is-on"));
      scene.querySelectorAll(".xt-cover[data-step]").forEach((c) => c.classList.remove("is-open"));
      scene.classList.remove("fold-cutting");
      restart.classList.add("hidden");
      feedback.textContent = feedback.dataset.hint;
    }
    steps.forEach((step) => {
      step.addEventListener("click", () => {
        const n = Number(step.dataset.step);
        if (n < next) { feedback.textContent = "✅ " + n + "-qadam: " + step.dataset.say + (next > steps.length ? "" : " Endi " + next + "-qadamni toping!"); return; }
        if (n !== next) {
          step.classList.remove("is-wrong"); void step.offsetWidth; step.classList.add("is-wrong");
          setTimeout(() => step.classList.remove("is-wrong"), 500);
          feedback.textContent = "🤔 Shoshilmang! Bu " + next + "-qadam emas. Avval nima qilinishini o‘ylab ko‘ring.";
          return;
        }
        steps.forEach((s) => s.classList.remove("is-current"));
        step.classList.add("is-done", "is-current");
        scene.querySelector('.fold-badge[data-step="' + n + '"]').classList.add("is-on");
        const cover = scene.querySelector('.xt-cover[data-step="' + n + '"]');
        if (cover) cover.classList.add("is-open");
        next++;
        if (next > steps.length) {
          scene.classList.remove("fold-cutting"); void scene.offsetWidth; scene.classList.add("fold-cutting");
          feedback.textContent = "✅ " + n + "-qadam: " + step.dataset.say + " 🎉 " + doneText;
          restart.classList.remove("hidden");
        } else {
          feedback.textContent = "✅ " + n + "-qadam: " + step.dataset.say + " Endi " + next + "-qadamni toping!";
        }
      });
    });
    restart.addEventListener("click", reset);
  })());
  // 2-dars 4-bosqich 3/4: har qatorda qadamlarni tartib bilan bosib shakl yasash, so'ng «Shaklni top»
  (function setupShapeSteps() {
    const steps = Array.from(document.querySelectorAll(".shape-step"));
    if (!steps.length) return;
    const scene = steps[0].parentElement;
    const page = scene.closest("[data-l2-page]");
    const feedback = page.querySelector(".l2-feedback");
    const quizBtn = document.getElementById("shapeQuiz");
    const ROWS = ["rect", "square", "circle"];
    const next = { rect: 1, square: 1, circle: 1 };
    let quiz = null;
    const rowSteps = (row) => steps.filter((s) => s.dataset.row === row);
    const lastOf = (row) => rowSteps(row)[rowSteps(row).length - 1];
    const doneRows = () => ROWS.filter((r) => next[r] > rowSteps(r).length);
    function clearQuiz() { steps.forEach((s) => s.classList.remove("is-target")); }
    function ask() {
      const row = quiz.order[quiz.i];
      quizBtn.textContent = "Toping: " + lastOf(row).dataset.shape;
      feedback.textContent = "🎯 " + (quiz.i + 1) + "/3: tayyor «" + lastOf(row).dataset.shape + "» shaklini bosing!";
    }
    function startQuiz() {
      const order = ROWS.slice();
      for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
      quiz = { order, i: 0, score: 0, miss: false };
      quizBtn.classList.add("is-running");
      clearQuiz();
      ask();
    }
    function answerQuiz(step) {
      const want = quiz.order[quiz.i];
      const isFinal = step === lastOf(step.dataset.row);
      if (isFinal && step.dataset.row === want) {
        if (!quiz.miss) quiz.score++;
        quiz.miss = false;
        clearQuiz();
        step.classList.add("is-target");
        quiz.i++;
        if (quiz.i >= ROWS.length) {
          feedback.textContent = "🏆 Barakalla! Hamma shakllarni topdingiz: " + quiz.score + " / 3. Yana o‘ynash uchun tugmani bosing.";
          quizBtn.textContent = "↻ Yana o‘ynash";
          quizBtn.classList.remove("is-running");
          quiz = null;
          return;
        }
        ask();
        feedback.textContent = "✅ To‘g‘ri! " + feedback.textContent;
      } else {
        quiz.miss = true;
        step.classList.remove("is-wrong"); void step.offsetWidth; step.classList.add("is-wrong");
        setTimeout(() => step.classList.remove("is-wrong"), 500);
        feedback.textContent = "🤔 Bu emas. Tayyor «" + lastOf(want).dataset.shape + "» qaysi rasmda? Har qatorning oxirgi rasmiga qarang!";
      }
    }
    steps.forEach((step) => {
      step.addEventListener("click", () => {
        if (quiz) { answerQuiz(step); return; }
        const row = step.dataset.row;
        const n = Number(step.dataset.step);
        const shape = step.dataset.shape;
        if (n < next[row]) { feedback.textContent = "✅ " + shape[0].toUpperCase() + shape.slice(1) + ", " + n + "-qadam: " + step.dataset.say; return; }
        if (n !== next[row]) {
          step.classList.remove("is-wrong"); void step.offsetWidth; step.classList.add("is-wrong");
          setTimeout(() => step.classList.remove("is-wrong"), 500);
          feedback.textContent = "🤔 Shoshilmang! Bu qatorda avval " + next[row] + "-rasmni bosing.";
          return;
        }
        steps.forEach((s) => s.classList.remove("is-current"));
        step.classList.add("is-done", "is-current");
        scene.querySelector('.shape-badge[data-row="' + row + '"][data-step="' + n + '"]').classList.add("is-on");
        next[row]++;
        if (next[row] > rowSteps(row).length) {
          scene.querySelector('.shape-name[data-row="' + row + '"]').classList.add("is-on");
          const d = doneRows().length;
          feedback.textContent = "🎉 " + step.dataset.say + " " + shape[0].toUpperCase() + shape.slice(1) + " hosil bo‘ldi! " +
            (d === ROWS.length ? "Uchala shaklni yasadingiz! Endi «🎯 Shaklni top!» tugmasini bosing." : "Yasalgan shakllar: " + d + " / 3.");
        } else {
          feedback.textContent = "✅ " + n + "-qadam: " + step.dataset.say + " Endi shu qatordagi " + next[row] + "-rasmni bosing.";
        }
      });
    });
    quizBtn.addEventListener("click", startQuiz);
  })();
  // 2-dars 4-bosqich 4/4: qaychi bilan shakl o'zgartirish va albomga surib yopishtirish
  (function setupAlbum() {
    const panel = document.getElementById("albumPanel");
    if (!panel) return;
    const scene = panel.parentElement;
    const page = scene.closest("[data-l2-page]");
    const feedback = page.querySelector(".l2-feedback");
    const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);
    const made = new Set();
    scene.querySelectorAll(".tf-src").forEach((btn) => {
      btn.addEventListener("click", () => {
        const row = btn.dataset.row;
        scene.querySelectorAll(".tf-src").forEach((b) => b.classList.toggle("is-on", b.dataset.row === row && !b.classList.contains("tf-txt")));
        scene.querySelectorAll('.tf-cut[data-row="' + row + '"], .tf-merge[data-row="' + row + '"]').forEach((c) => { c.classList.remove("is-run"); void c.offsetWidth; c.classList.add("is-run"); });
        feedback.textContent = "✂️ " + btn.dataset.say;
        setTimeout(() => {
          scene.querySelector('.tf-name[data-row="' + row + '"]').classList.add("is-on");
          made.add(row);
          feedback.textContent = "🎉 " + cap(btn.dataset.name) + " hosil bo‘ldi! " + btn.dataset.say +
            (made.size === 3 ? " Endi albomni ochib, shakllarni yopishtiring!" : " Yangi shakllar: " + made.size + " / 3.");
        }, 850);
      });
    });
    const tray = document.getElementById("albumTray");
    const scoreEl = document.getElementById("albumScore");
    const SHAPES = [["circle", "Doira", "#9b7bf0"], ["half", "Yarimdoira", "#ff8fb1"], ["square", "Kvadrat", "#4fb3ff"], ["tri", "Uchburchak", "#ffb21a"], ["rect", "To‘g‘ri to‘rtburchak", "#4cd964"], ["oval", "Oval", "#ff7a59"]];
    let score = 0, picked = null;
    function fill() {
      tray.innerHTML = "";
      score = 0; picked = null;
      scoreEl.textContent = "⭐ 0 / 6";
      panel.querySelectorAll(".alb-slot").forEach((slot) => { slot.classList.remove("is-filled", "is-hover"); slot.querySelectorAll(".shp.is-glued").forEach((s) => s.remove()); slot.querySelector(".shp").style.display = ""; });
      const list = SHAPES.slice().sort(() => Math.random() - 0.5);
      list.forEach(([key, name, color]) => {
        const p = document.createElement("div");
        p.className = "alb-piece";
        p.dataset.shape = key;
        p.dataset.name = name;
        p.setAttribute("role", "button");
        p.setAttribute("tabindex", "0");
        p.setAttribute("aria-label", name + " — albomdagi joyiga suring");
        p.innerHTML = '<i class="shp shp-' + key + '" style="--c:' + color + '"></i>';
        bindPiece(p);
        tray.appendChild(p);
      });
    }
    function place(piece, slot) {
      if (!slot || slot.classList.contains("is-filled")) { piece.style.transform = ""; return; }
      if (slot.dataset.shape === piece.dataset.shape) {
        const shp = piece.querySelector(".shp");
        shp.classList.add("is-glued");
        slot.querySelector(".shp").style.display = "none";
        slot.insertBefore(shp, slot.firstChild);
        slot.classList.add("is-filled");
        piece.remove();
        picked = null;
        score++;
        scoreEl.textContent = "⭐ " + score + " / 6";
        feedback.textContent = score === 6
          ? "🏆 Barakalla! Hamma shakllar albomga tartib bilan yopishtirildi! Albomni yopish uchun ✕ ni bosing."
          : "✅ To‘g‘ri! «" + piece.dataset.name + "» albomga yopishtirildi. Yopishtirildi: " + score + " / 6.";
      } else {
        piece.style.transform = "";
        slot.classList.remove("is-wrong"); void slot.offsetWidth; slot.classList.add("is-wrong");
        setTimeout(() => slot.classList.remove("is-wrong"), 500);
        feedback.textContent = "🤔 Bu joyga «" + slot.querySelector("small").textContent + "» kerak. «" + piece.dataset.name + "»ning joyini toping!";
      }
    }
    function slotAt(x, y) { return document.elementsFromPoint(x, y).map((el) => el.closest && el.closest(".alb-slot")).find(Boolean) || null; }
    function bindPiece(p) {
      let sx = 0, sy = 0, moved = false, id = null;
      p.addEventListener("pointerdown", (e) => {
        id = e.pointerId; sx = e.clientX; sy = e.clientY; moved = false;
        p.setPointerCapture(id);
        e.preventDefault();
      });
      p.addEventListener("pointermove", (e) => {
        if (e.pointerId !== id) return;
        const dx = e.clientX - sx, dy = e.clientY - sy;
        if (!moved && Math.hypot(dx, dy) < 6) return;
        moved = true;
        p.classList.add("is-drag");
        p.style.pointerEvents = "none";
        p.style.transform = "translate(" + dx + "px," + dy + "px) scale(1.08)";
        panel.querySelectorAll(".alb-slot").forEach((s) => s.classList.remove("is-hover"));
        const s = slotAt(e.clientX, e.clientY);
        if (s && !s.classList.contains("is-filled")) s.classList.add("is-hover");
      });
      const end = (e) => {
        if (e.pointerId !== id) return;
        id = null;
        p.classList.remove("is-drag");
        p.style.pointerEvents = "";
        panel.querySelectorAll(".alb-slot").forEach((s) => s.classList.remove("is-hover"));
        if (moved) { place(p, e.type === "pointerup" ? slotAt(e.clientX, e.clientY) : null); return; }
        tray.querySelectorAll(".alb-piece").forEach((x) => x.classList.toggle("is-picked", x === p));
        picked = p;
        feedback.textContent = "👉 «" + p.dataset.name + "» tanlandi. Endi albomdagi joyini bosing yoki surib olib boring.";
      };
      p.addEventListener("pointerup", end);
      p.addEventListener("pointercancel", end);
    }
    panel.querySelectorAll(".alb-slot").forEach((slot) => {
      slot.addEventListener("click", () => {
        if (picked) place(picked, slot);
        else if (!slot.classList.contains("is-filled")) feedback.textContent = "Bu joyga «" + slot.querySelector("small").textContent + "» yopishtiriladi. O‘ngdagi shakllardan birini surib olib keling!";
      });
    });
    document.getElementById("albumOpen").addEventListener("click", () => {
      panel.classList.remove("hidden");
      if (score === 6 || !tray.children.length) fill();
      feedback.textContent = "📒 O‘ngdagi shakllarni barmoq yoki sichqoncha bilan albomdagi mos joyga surib olib boring!";
    });
    document.getElementById("albumClose").addEventListener("click", () => {
      panel.classList.add("hidden");
      feedback.textContent = score === 6 ? "🏆 Albom tayyor! → tugmasi bilan keyingi bosqichga o‘ting." : "Albomni yana ochib, o‘yinni davom ettirishingiz mumkin.";
    });
  })();
  // 2-dars 5-bosqich: jismoniy daqiqa — har mashq uchun sanoq, «Hammasini boshlash»
  (function setupExercises() {
    new Set(Array.from(document.querySelectorAll(".ex-card"), (c) => c.parentElement)).forEach((scene) => {
    const cards = Array.from(scene.querySelectorAll(".ex-card"));
    const page = scene.closest("[data-l2-page]");
    const feedback = page.querySelector(".l2-feedback");
    const allBtn = scene.querySelector(".ex-all");
    const finishBtn = scene.querySelector(".ex-finish");
    const q = (cls, i) => scene.querySelector("." + cls + '[data-ex="' + i + '"]');
    const done = new Set();
    let run = null;
    function stop(msg) {
      if (!run) return;
      clearTimeout(run.timer);
      if (run.i === -1) {
        run = null;
        allBtn.classList.remove("is-running");
        allBtn.querySelector("span").textContent = "▶ Hammasini boshlash";
        if (msg) feedback.textContent = msg;
        return;
      }
      cards[run.i].classList.remove("is-running");
      const c = q("ex-count", run.i);
      c.classList.remove("is-running");
      c.textContent = done.has(run.i) ? "✓ Bajarildi" : "▶ Boshlash";
      q("ex-big", run.i).classList.remove("is-pop");
      run = null;
      allBtn.classList.remove("is-running");
      allBtn.querySelector("span").textContent = "▶ Hammasini boshlash";
      if (msg) feedback.textContent = msg;
    }
    function beat() {
      if (!run) return;
      if (page.classList.contains("hidden")) { stop(); return; }
      const card = cards[run.i];
      const reps = Number(card.dataset.reps);
      const cues = card.dataset.cue.split("|");
      run.rep++;
      if (run.rep > reps) { finish(); return; }
      const big = q("ex-big", run.i);
      big.textContent = run.rep;
      big.classList.remove("is-pop"); void big.offsetWidth; big.classList.add("is-pop");
      card.classList.remove("is-beat"); void card.offsetWidth; card.classList.add("is-beat");
      q("ex-count", run.i).textContent = run.rep + " / " + reps;
      feedback.textContent = "🏃 " + (run.i + 1) + "-mashq: " + card.dataset.say + ". " + cues[(run.rep - 1) % cues.length] + " (" + run.rep + " / " + reps + ")";
      run.timer = setTimeout(beat, Number(card.dataset.ms));
    }
    function finish() {
      const i = run.i, auto = run.auto;
      done.add(i);
      cards[i].classList.add("is-done");
      q("ex-done", i).classList.add("is-on");
      q("ex-count", i).classList.add("is-done");
      stop();
      const nextI = cards.findIndex((_, j) => j > i);
      if (auto && nextI >= 0) {
        feedback.textContent = "✅ Barakalla! Endi " + (nextI + 1) + "-mashq…";
        run = { i: -1, auto: true, timer: setTimeout(() => { run = null; start(nextI, true); }, 1300) };
        allBtn.classList.add("is-running");
        allBtn.querySelector("span").textContent = "⏸ To‘xtatish";
        return;
      }
      if (finishBtn) finishBtn.classList.toggle("is-ready", done.size === cards.length);
      feedback.textContent = done.size === cards.length
        ? (scene.dataset.exDone || "🏆 Barakalla! 5 ta mashqning hammasini bajardingiz. Endi kuch va diqqat bilan darsni davom ettiramiz!")
        : "✅ " + (i + 1) + "-mashq bajarildi! Bajarilgan mashqlar: " + done.size + " / " + cards.length + ".";
    }
    function start(i, auto) {
      stop();
      run = { i, rep: 0, auto, timer: 0 };
      cards[i].classList.add("is-running");
      q("ex-count", i).classList.add("is-running");
      q("ex-count", i).classList.remove("is-done");
      q("ex-count", i).textContent = "Tayyorlaning…";
      if (auto) { allBtn.classList.add("is-running"); allBtn.querySelector("span").textContent = "⏸ To‘xtatish"; }
      feedback.textContent = "🙋 " + (i + 1) + "-mashq: " + cards[i].dataset.say + " (" + cards[i].dataset.reps + " marta). Tayyorlaning!";
      run.timer = setTimeout(beat, 1000);
    }
    cards.forEach((card, i) => {
      card.addEventListener("click", () => {
        if (run && run.i === i) { stop("⏸ Mashq to‘xtatildi. Qaytadan boshlash uchun kartochkani yana bosing."); return; }
        start(i, false);
      });
    });
    allBtn.addEventListener("click", () => {
      if (run) {
        if (run.i === -1 || run.auto) { stop("⏸ Mashqlar to‘xtatildi. Qaytadan boshlash uchun yana bosing."); return; }
      }
      start(0, true);
    });
    if (finishBtn) finishBtn.addEventListener("click", () => {
      if (done.size === cards.length) {
        feedback.textContent = scene.dataset.exDone || "🏆 Barakalla!";
        finishBtn.classList.remove("is-cheer"); void finishBtn.offsetWidth; finishBtn.classList.add("is-cheer");
        return;
      }
      const left = cards.map((_, j) => j).filter((j) => !done.has(j)).map((j) => j + 1);
      feedback.textContent = "💪 Hali " + left.join(", ") + "-mashq" + " qoldi (" + done.size + " / " + cards.length + "). Kartochkani bosing yoki «Hammasini boshlash»ni tanlang!";
      left.forEach((n) => { const c = cards[n - 1]; c.classList.remove("is-beat"); void c.offsetWidth; c.classList.add("is-beat"); });
    });
    page.querySelector(".l2-back").addEventListener("click", () => stop());
    page.querySelector(".l2-next").addEventListener("click", () => stop());
    page.querySelectorAll(".knowledge-dot").forEach((d) => d.addEventListener("click", () => stop()));
    });
  })();
  // 2-dars 6-bosqich: ish maydonida geometrik shakllardan kompozitsiya (surib joylash)
  (function setupComposition() {
    const board = document.getElementById("cmpBoard");
    if (!board) return;
    const scene = board.parentElement;
    const page = scene.closest("[data-l2-page]");
    const feedback = page.querySelector(".l2-feedback");
    const W = 1671, H = 941;
    const BOARD = { x1: 385, y1: 296, x2: 1155, y2: 796 };
    const SIZE = { sq: [80, 80], circle: [80, 80], half: [100, 50], tri: [70, 65], trir: [70, 65], rect: [270, 60], oval: [125, 65] };
    const NAMES = { sq: "kvadrat", circle: "doira", half: "yarimdoira", tri: "uchburchak", trir: "uchburchak", rect: "to‘g‘ri to‘rtburchak", oval: "oval" };
    const LAYOUT = [["sq", 0, 352], ["sq", 95, 352], ["circle", 190, 352], ["half", 0, 458], ["tri", 115, 450], ["trir", 200, 450], ["rect", 0, 530], ["oval", 0, 606], ["oval", 145, 606]];
    const COLORS = { l: "#8e4fd6", r: "#2fa8f0" };
    const slots = [];
    [["l", 442], ["r", 827]].forEach(([side, hx]) => {
      LAYOUT.forEach(([shape, dx, y]) => {
        const [w, h] = SIZE[shape];
        const g = document.createElement("span");
        g.className = "cmp-ghost shape-" + shape + " " + shape + " side-" + side;
        g.style.cssText = "left:" + ((hx + dx) / W * 100) + "%;top:" + (y / H * 100) + "%;width:" + (w / W * 100) + "%;height:" + (h / H * 100) + "%";
        scene.insertBefore(g, board.nextSibling);
        slots.push({ side, shape, cx: hx + dx + w / 2, cy: y + h / 2, piece: null, ghost: g });
      });
    });
    let color = COLORS.l;
    const progress = document.getElementById("cmpProgress");
    const filled = () => slots.filter((s) => s.piece).length;
    function update(msg) {
      const n = filled();
      progress.textContent = "⭐ " + n + " / " + slots.length;
      board.classList.toggle("is-win", n === slots.length);
      if (n === slots.length) feedback.textContent = "🏆 Barakalla! Kitobdagi namunaga o‘xshash chiroyli kompozitsiya tayyor! Siz haqiqiy usta ekansiz!";
      else if (msg) feedback.textContent = msg;
    }
    function toScene(e) {
      const r = scene.getBoundingClientRect();
      return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H };
    }
    function setPos(p, x, y) { p.dataset.x = x; p.dataset.y = y; p.style.left = (x / W * 100) + "%"; p.style.top = (y / H * 100) + "%"; }
    function makePiece(shape, c) {
      const [w, h] = SIZE[shape];
      const p = document.createElement("div");
      p.className = "cmp-piece shape-" + shape;
      p.dataset.shape = shape;
      p.style.setProperty("--c", c);
      p.dataset.color = c;
      p.style.width = (w / W * 100) + "%";
      p.style.height = (h / H * 100) + "%";
      p.setAttribute("role", "img");
      p.setAttribute("aria-label", NAMES[shape]);
      scene.appendChild(p);
      p.addEventListener("pointerdown", (e) => { e.preventDefault(); startDrag(p, e, false); });
      return p;
    }
    function release(p) { slots.forEach((s) => { if (s.piece === p) s.piece = null; }); }
    function snap(p, slot) {
      release(p);
      slot.piece = p;
      setPos(p, slot.cx, slot.cy);
      p.classList.remove("is-snap"); void p.offsetWidth; p.classList.add("is-snap");
    }
    function drop(p, x, y, fresh) {
      const inside = x > BOARD.x1 && x < BOARD.x2 && y > BOARD.y1 && y < BOARD.y2 - 50;
      if (!inside) {
        release(p);
        p.remove();
        update(fresh ? "Shaklni ish maydoniga (oq varaqqa) olib boring!" : "🗑 Shakl ish maydonidan olib tashlandi.");
        return;
      }
      const side = p.dataset.color === COLORS.l ? "l" : "r";
      const near = slots.filter((s) => s.shape === p.dataset.shape && (!s.piece || s.piece === p) && Math.hypot(s.cx - x, s.cy - y) < 75)
        .sort((a, b) => Math.hypot(a.cx - x, a.cy - y) - Math.hypot(b.cx - x, b.cy - y));
      const good = near.find((s) => s.side === side);
      if (good) {
        snap(p, good);
        update("✅ " + NAMES[p.dataset.shape][0].toUpperCase() + NAMES[p.dataset.shape].slice(1) + " o‘z joyiga yopishtirildi!");
      } else {
        release(p);
        setPos(p, x, y);
        update(near.length
          ? "🤔 Bu tomonga " + (side === "l" ? "ko‘k" : "binafsha") + " shakl kerak! " + (side === "l" ? "Binafsha" : "Ko‘k") + " shakllar " + (side === "l" ? "chap" : "o‘ng") + " tomonga joylanadi."
          : "🎨 Shakl ish maydoniga qo‘yildi. Namunadagi chiziqli joyga olib borsangiz, yopishib qoladi!");
      }
    }
    function startDrag(p, e, fresh, onTap) {
      const id = e.pointerId;
      let moved = false;
      const s0 = toScene(e);
      const ox = fresh ? 0 : Number(p.dataset.x) - s0.x, oy = fresh ? 0 : Number(p.dataset.y) - s0.y;
      p.classList.add("is-drag");
      const move = (ev) => {
        if (ev.pointerId !== id) return;
        const s = toScene(ev);
        if (!moved && Math.hypot(s.x - s0.x, s.y - s0.y) < 4) return;
        moved = true;
        p.style.visibility = "";
        setPos(p, s.x + ox, s.y + oy);
      };
      const up = (ev) => {
        if (ev.pointerId !== id) return;
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        window.removeEventListener("pointercancel", up);
        p.classList.remove("is-drag");
        if (!moved) { if (onTap && ev.type === "pointerup") onTap(); else if (fresh) p.remove(); return; }
        if (ev.type === "pointercancel") { drop(p, -1, -1, fresh); return; }
        drop(p, Number(p.dataset.x), Number(p.dataset.y), fresh);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
      window.addEventListener("pointercancel", up);
    }
    function tapPlace(p, shape) {
      // bosish: rangiga mos tomondagi birinchi bo'sh joyga qo'yamiz
      const side = color === COLORS.l ? "l" : "r";
      const slot = slots.find((sl) => sl.side === side && sl.shape === shape && !sl.piece);
      p.style.visibility = "";
      if (slot) { snap(p, slot); update("✅ " + NAMES[shape][0].toUpperCase() + NAMES[shape].slice(1) + " ish maydoniga yopishtirildi! Uni surib boshqa joyga ham qo‘yishingiz mumkin."); }
      else { p.remove(); update("Bu tomonda bunday shakl uchun bo‘sh joy qolmadi. Boshqa rangni tanlang yoki shaklni surib, xohlagan joyingizga qo‘ying!"); }
    }
    scene.querySelectorAll(".cmp-src").forEach((src) => {
      src.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        const s0 = toScene(e);
        const p = makePiece(src.dataset.shape, color);
        setPos(p, s0.x, s0.y);
        p.style.visibility = "hidden";
        startDrag(p, e, true, () => tapPlace(p, src.dataset.shape));
      });
    });
    scene.querySelectorAll(".cmp-color").forEach((btn) => {
      btn.addEventListener("click", () => {
        color = btn.dataset.color;
        scene.querySelectorAll(".cmp-color").forEach((b) => b.classList.toggle("is-on", b === btn));
        feedback.textContent = color === COLORS.l ? "🟪 Binafsha rang tanlandi — shakllar chap tomonga." : "🟦 Ko‘k rang tanlandi — shakllar o‘ng tomonga.";
      });
    });
    document.getElementById("cmpGhost").addEventListener("click", () => {
      const off = scene.classList.toggle("cmp-noghost");
      feedback.textContent = off ? "👁 Namuna chiziqlari yashirildi. Endi o‘zingiz joylashtirib ko‘ring!" : "👁 Namuna chiziqlari ko‘rsatildi.";
    });
    document.getElementById("cmpClear").addEventListener("click", () => {
      scene.querySelectorAll(".cmp-piece").forEach((p) => p.remove());
      slots.forEach((s) => { s.piece = null; });
      update("🗑 Ish maydoni tozalandi. Qaytadan boshlang!");
    });
  })();
  // 2-dars 7-bosqich: «Arqon tortish» — ikki jamoa, to'g'ri javob arqonni o'z tomoniga tortadi
  (function setupTugOfWar() {
    const field = document.getElementById("tugField");
    if (!field) return;
    const scene = field.parentElement;
    const page = scene.closest("[data-l2-page]");
    const feedback = page.querySelector(".l2-feedback");
    const bar = document.getElementById("tugBar");
    const mark = document.getElementById("tugMark");
    const win = document.getElementById("tugWin");
    const GOAL = 5;
    const BANK = [
      ["Qog‘ozning nechta tomoni bor?", ["4 ta", "2 ta", "3 ta"]],
      ["Qog‘oz varag‘ining nechta burchagi bor?", ["4 ta", "3 ta", "5 ta"]],
      ["Qog‘ozni teng ikkiga buklaganda nima hosil bo‘ladi?", ["To‘g‘ri to‘rtburchak", "Doira", "Uchburchak"]],
      ["Kvadratni diagonali bo‘ylab kessak, nima hosil bo‘ladi?", ["Ikkita uchburchak", "Ikkita doira", "Oval"]],
      ["Doirani teng ikkiga bo‘lsak, nima hosil bo‘ladi?", ["Ikkita yarimdoira", "Ikkita kvadrat", "Uchburchak"]],
      ["Kvadratning burchaklarini yumaloq qirqsak, nima hosil bo‘ladi?", ["Doira", "Uchburchak", "Kvadrat"]],
      ["Ikkita bir xil kvadratni yonma-yon qo‘ysak, nima hosil bo‘ladi?", ["To‘g‘ri to‘rtburchak", "Doira", "Uchburchak"]],
      ["To‘g‘ri to‘rtburchakning burchaklarini qirqsak, nima hosil bo‘ladi?", ["Oval", "Kvadrat", "Uchburchak"]],
      ["Buklangan joyni nima bilan tekislaymiz?", ["Barmoq bilan", "Qaychi bilan", "Yelim bilan"]],
      ["Qog‘ozni nima bilan qirqamiz?", ["Qaychi bilan", "Qalam bilan", "Chizg‘ich bilan"]],
      ["Shakllarni albomga nima bilan yopishtiramiz?", ["Yelim bilan", "Suv bilan", "Plastilin bilan"]],
      ["Qaychini qanday ishlatamiz?", ["Ehtiyot bo‘lib", "Yugurib", "O‘ynab"]],
      ["Qog‘ozni buklaganda nimaga e’tibor beramiz?", ["Chetlari mos tushishiga", "Rangiga", "Hidiga"]],
      ["Qog‘oz tasmasini ikki marta buklab qirqsak, nechta bo‘lak chiqadi?", ["4 ta", "2 ta", "6 ta"]],
      ["Ishlaganda qanday bo‘lishimiz kerak?", ["Tartibli va e’tiborli", "Shoshqaloq", "Beparvo"]],
      ["Doiraning nechta burchagi bor?", ["Burchagi yo‘q", "4 ta", "3 ta"]],
      ["Uchburchakning nechta burchagi bor?", ["3 ta", "4 ta", "2 ta"]],
      ["Qog‘oz varag‘ining tepa tomoni qayerda?", ["Yuqorida", "Pastda", "Chapda"]]
    ];
    const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    const teams = {};
    let pos = 0, over = false;
    const NAMES = { 1: "Ko‘k jamoa", 2: "To‘q sariq jamoa" };
    function draw() {
      const m = 50 + pos * (44 / GOAL);
      bar.style.setProperty("--m", m + "%");
      mark.style.left = m + "%";
      field.style.setProperty("--p", pos * 1);
    }
    function ask(t) {
      const team = teams[t];
      if (!team.deck.length) team.deck = shuffle(BANK.map((_, i) => i));
      const [q, answers] = BANK[team.deck.pop()];
      team.q.textContent = q;
      team.opts.innerHTML = "";
      team.busy = false;
      shuffle(answers.map((text, i) => ({ text, right: i === 0 }))).forEach((o, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.innerHTML = "<i>" + "ABC"[i] + "</i>";
        b.appendChild(document.createTextNode(o.text));
        if (o.right) b.dataset.r = "1";
        b.addEventListener("click", () => answer(t, b, o.right));
        team.opts.appendChild(b);
      });
      team.panel.classList.remove("is-flash"); void team.panel.offsetWidth; team.panel.classList.add("is-flash");
    }
    function answer(t, btn, right) {
      const team = teams[t];
      if (over) { feedback.textContent = "O‘yin tugadi! «↻ Yana o‘ynash» tugmasini bosing."; return; }
      if (team.busy) return;
      team.busy = true;
      if (right) {
        btn.classList.add("is-right");
        team.score++;
        team.scoreEl.textContent = "⭐ " + team.score;
        pos += t === "1" ? -1 : 1;
        draw();
        field.classList.remove("is-pull"); void field.offsetWidth; field.classList.add("is-pull");
        if (Math.abs(pos) >= GOAL) { finish(t); return; }
        feedback.textContent = "💪 " + NAMES[t] + " to‘g‘ri javob berdi — arqon " + (t === "1" ? "chapga" : "o‘ngga") + " siljidi!";
      } else {
        btn.classList.add("is-wrong");
        feedback.textContent = "😮 " + NAMES[t] + ", bu javob noto‘g‘ri! Keyingi savolga tayyorlaning.";
      }
      setTimeout(() => { if (!over) ask(t); }, right ? 900 : 1400);
    }
    function finish(t) {
      over = true;
      document.getElementById("tugWinText").textContent = (t === "1" ? "1-jamoa (Ko‘k jamoa)" : "2-jamoa (To‘q sariq jamoa)") + " g‘olib! Tabriklaymiz! 🎉";
      win.classList.remove("hidden");
      feedback.textContent = "🏆 " + NAMES[t] + " arqonni o‘z tomoniga tortib, bellashuvda g‘olib bo‘ldi! Ikkala jamoa ham barakalla!";
    }
    function reset() {
      pos = 0; over = false;
      win.classList.add("hidden");
      ["1", "2"].forEach((t) => {
        const panel = scene.querySelector('.tug-panel[data-team="' + t + '"]');
        teams[t] = { panel, q: panel.querySelector(".tug-q"), opts: panel.querySelector(".tug-opts"), scoreEl: panel.querySelector(".tug-score"), deck: shuffle(BANK.map((_, i) => i)), score: 0, busy: false };
        teams[t].scoreEl.textContent = "⭐ 0";
        ask(t);
      });
      draw();
    }
    document.getElementById("tugAgain").addEventListener("click", () => { reset(); feedback.textContent = "↻ Yangi bellashuv boshlandi! Omad, jamoalar!"; });
    reset();
  })();
  // 2-dars 8-bosqich: darsni yakunlash — yulduzcha bilan baholash, medallar, uyga vazifa, konfetti
  (function setupLesson2Final() {
    const stars = Array.from(document.querySelectorAll(".rate-star"));
    if (!stars.length) return;
    const scene = stars[0].parentElement;
    const page = scene.closest("[data-l2-page]");
    const feedback = page.querySelector(".l2-feedback");
    const box = document.getElementById("l2FinalConfetti");
    const ROWS = ["Faollik", "Topshiriqlarni aniq bajarish", "Jamoada hamkorlik"];
    const PRAISE = ["Harakat qiling, keyingi safar albatta zo‘r bo‘ladi!", "Yaxshi! Yana ozgina harakat qilsak bo‘ladi.", "A’lo! Siz bugun zo‘r ishladingiz!"];
    const rating = [0, 0, 0];
    function confetti(count = 22) {
      const bits = ["⭐", "🎉", "✨", "🌟", "🟦", "🔺", "🟣"];
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
    function paint(r) {
      stars.filter((s) => Number(s.dataset.row) === r).forEach((s) => {
        const on = Number(s.dataset.star) <= rating[r];
        s.classList.toggle("is-on", on);
        s.setAttribute("aria-pressed", String(on));
      });
    }
    stars.forEach((star) => {
      star.addEventListener("click", () => {
        const r = Number(star.dataset.row), n = Number(star.dataset.star);
        rating[r] = rating[r] === n ? n - 1 : n;
        paint(r);
        star.classList.remove("is-pop"); void star.offsetWidth; star.classList.add("is-pop");
        const done = rating.filter(Boolean).length;
        if (done === 3) {
          const total = rating.reduce((a, b) => a + b, 0);
          feedback.textContent = "🌟 Baholash tugadi: " + total + " / 9 yulduzcha! " + (total >= 8 ? "Ajoyib natija! Endi medalingizni tanlang." : "Barakalla! Endi medal tanlang.");
          if (total >= 8) confetti(16);
        } else {
          feedback.textContent = "⭐ " + ROWS[r] + ": " + rating[r] + " yulduzcha. " + (rating[r] ? PRAISE[rating[r] - 1] : "") + " Baholangan: " + done + " / 3";
        }
      });
    });
    const medals = Array.from(scene.querySelectorAll(".l2-medal"));
    medals.forEach((medal) => {
      medal.addEventListener("click", () => {
        medals.forEach((other) => {
          const on = other === medal;
          other.classList.toggle("is-selected", on);
          other.classList.toggle("is-dim", !on);
          other.setAttribute("aria-pressed", String(on));
        });
        feedback.textContent = medal.dataset.say;
        confetti(medal.dataset.medal === "oltin" ? 24 : 10);
      });
    });
    scene.querySelector(".l2-ribbon").addEventListener("click", () => {
      feedback.textContent = "🎗 Faol o‘quvchilar rag‘batlantirildi! Bugun hammangiz zo‘r ishladingiz!";
      confetti(14);
    });
    scene.querySelectorAll(".hw-shape").forEach((shape) => {
      shape.addEventListener("click", () => {
        shape.classList.remove("is-pop"); void shape.offsetWidth; shape.classList.add("is-pop");
        feedback.textContent = "✏️ Bu — " + shape.dataset.name + ". Uni daftaringizga chizib, nomini yozing!";
      });
    });
    const sign = scene.querySelector(".l2-sign");
    sign.addEventListener("click", () => {
      sign.classList.remove("is-wave"); void sign.offsetWidth; sign.classList.add("is-wave");
      confetti(30);
      feedback.textContent = "👋 Darsimiz yakunlandi! Faol ishtirokingiz uchun rahmat! Uycha tugmasini bosib, Kuzgi sayohat xaritasiga qayting.";
    });
    // sahifa ochilganda kichik bayram
    new MutationObserver(() => { if (!page.classList.contains("hidden")) setTimeout(() => confetti(14), 300); }).observe(page, { attributes: true, attributeFilter: ["class"] });
  })();
  // 3-dars 1-bosqich: manzaradagi shakllarni nomlash va «Shakllarni izla» o'yini
  (function setupSceneHunt() {
    const hunt = document.getElementById("sceneHunt");
    if (!hunt) return;
    const scene = hunt.parentElement;
    const page = scene.closest("[data-l2-page]");
    const feedback = page.querySelector(".l2-feedback");
    const scoreEl = document.getElementById("sceneHuntScore");
    const shapes = Array.from(scene.querySelectorAll(".scene-shape"));
    const TYPES = { circle: "doira", tri: "uchburchak", kvadrat: "kvadrat", rect: "to‘g‘ri to‘rtburchak" };
    const seen = new Set();
    let game = null;
    const tick = (key, on) => scene.querySelector('.scene-tick[data-key="' + key + '"]').classList.toggle("is-on", on);
    function clearMarks() { shapes.forEach((s) => s.classList.remove("is-active")); scene.querySelectorAll(".scene-tick").forEach((t) => t.classList.remove("is-on")); }
    function askType() {
      const type = game.order[game.t];
      const total = shapes.filter((s) => s.dataset.type === type).length;
      game.found = new Set();
      clearMarks();
      hunt.textContent = "Toping: " + TYPES[type] + " (0/" + total + ")";
      feedback.textContent = "🔎 Manzaradagi hamma " + TYPES[type] + "larni toping! Jami " + total + " ta.";
    }
    function startGame() {
      const order = Object.keys(TYPES).sort(() => Math.random() - 0.5);
      game = { order, t: 0, score: 0, miss: 0, found: new Set() };
      hunt.classList.add("is-running");
      scoreEl.classList.remove("hidden");
      scoreEl.textContent = "⭐ 0 / " + shapes.length;
      askType();
    }
    function huntClick(s) {
      const type = game.order[game.t];
      if (game.found.has(s.dataset.key)) { feedback.textContent = "Bu shaklni allaqachon topdingiz! Boshqasini izlang."; return; }
      if (s.dataset.type !== type) {
        game.miss++;
        s.classList.remove("is-wrong"); void s.offsetWidth; s.classList.add("is-wrong");
        setTimeout(() => s.classList.remove("is-wrong"), 500);
        feedback.textContent = "🤔 Bu — " + TYPES[s.dataset.type] + ". Bizga " + TYPES[type] + " kerak!";
        return;
      }
      game.found.add(s.dataset.key);
      game.score++;
      tick(s.dataset.key, true);
      scoreEl.textContent = "⭐ " + game.score + " / " + shapes.length;
      const total = shapes.filter((x) => x.dataset.type === type).length;
      hunt.textContent = "Toping: " + TYPES[type] + " (" + game.found.size + "/" + total + ")";
      if (game.found.size < total) { feedback.textContent = "✅ To‘g‘ri! " + s.dataset.say + " Yana " + (total - game.found.size) + " ta qoldi."; return; }
      game.t++;
      if (game.t >= game.order.length) {
        feedback.textContent = "🏆 Barakalla! Manzaradagi hamma shakllarni topdingiz! Xatolar: " + game.miss + ". Endi → tugmasi bilan davom eting.";
        hunt.textContent = "↻ Yana o‘ynash";
        hunt.classList.remove("is-running");
        game = null;
        return;
      }
      const msg = "🎉 Hamma " + TYPES[type] + "lar topildi! ";
      askType();
      feedback.textContent = msg + feedback.textContent;
    }
    shapes.forEach((s) => {
      s.addEventListener("click", () => {
        if (game) { huntClick(s); return; }
        shapes.forEach((x) => x.classList.toggle("is-active", x === s));
        seen.add(s.dataset.key);
        feedback.textContent = "🔷 " + s.dataset.say + (seen.size === shapes.length ? " 🎉 Hamma shakllar bilan tanishdingiz! Endi «🔎 Shakllarni izla!» tugmasini bosing." : " (" + seen.size + " / " + shapes.length + ")");
      });
    });
    hunt.addEventListener("click", startGame);
  })();
  // 3-dars 2-bosqich: stoldagi shakllarni doskadagi chiziqli joylarga surib, kuz manzarasini yaratish
  (function setupProblemScene() {
    const scoreEl = document.getElementById("mvScore");
    if (!scoreEl) return;
    const scene = scoreEl.parentElement;
    const page = scene.closest("[data-l2-page]");
    const feedback = page.querySelector(".l2-feedback");
    const W = 1671, H = 941;
    const TYPE = { circle: "doira", tri: "uchburchak", sq: "kvadrat", rect: "to‘g‘ri to‘rtburchak" };
    const targets = Array.from(scene.querySelectorAll(".mv-target")).map((el) => {
      const l = parseFloat(el.style.left) / 100 * W, t = parseFloat(el.style.top) / 100 * H;
      const w = parseFloat(el.style.width) / 100 * W, h = parseFloat(el.style.height) / 100 * H;
      return { el, key: el.dataset.key, type: el.dataset.type, color: el.dataset.color, name: el.dataset.name, x1: l, y1: t, x2: l + w, y2: t + h, piece: null };
    });
    const toScene = (e) => { const r = scene.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H }; };
    const filled = () => targets.filter((t) => t.piece).length;
    function setBox(p, x1, y1, x2, y2) {
      p.style.left = ((x1 + x2) / 2 / W * 100) + "%"; p.style.top = ((y1 + y2) / 2 / H * 100) + "%";
      p.style.width = ((x2 - x1) / W * 100) + "%"; p.style.height = ((y2 - y1) / H * 100) + "%";
    }
    function targetAt(x, y) {
      return targets.filter((t) => x >= t.x1 - 15 && x <= t.x2 + 15 && y >= t.y1 - 15 && y <= t.y2 + 15)
        .sort((a, b) => (a.x2 - a.x1) * (a.y2 - a.y1) - (b.x2 - b.x1) * (b.y2 - b.y1))[0] || null;
    }
    function check(t, src) {
      if (t.piece) return "Bu joy allaqachon to‘ldirilgan!";
      if (t.type !== src.dataset.type) return "🤔 " + t.name + " uchun " + TYPE[t.type] + " kerak, bu esa — " + TYPE[src.dataset.type] + ".";
      if (t.color && t.color !== src.dataset.color) return "🎨 Shakl to‘g‘ri, lekin rangi mos emas! " + t.name + " uchun boshqa rangli " + TYPE[t.type] + " kerak.";
      return "";
    }
    function place(t, src, p) {
      t.piece = p;
      p.dataset.key = t.key;
      p.classList.add("is-placed");
      setBox(p, t.x1, t.y1, t.x2, t.y2);
      const n = filled();
      scoreEl.textContent = "⭐ " + n + " / " + targets.length;
      if (n === targets.length) {
        scene.querySelectorAll(".mv-piece").forEach((x) => x.classList.add("is-shine"));
        feedback.textContent = "🏆 Barakalla! Muammo hal bo‘ldi: doiradan quyosh va daraxt, uchburchakdan tom va archa, kvadratdan devor va deraza, to‘g‘ri to‘rtburchakdan daraxt tanasi yasaldi!";
      } else {
        feedback.textContent = "✅ To‘g‘ri! " + t.name + " — " + TYPE[t.type] + "dan yasaladi. Joylashtirildi: " + n + " / " + targets.length;
      }
    }
    function flash(t, msg) {
      t.el.classList.remove("is-wrong"); void t.el.offsetWidth; t.el.classList.add("is-wrong");
      setTimeout(() => t.el.classList.remove("is-wrong"), 500);
      feedback.textContent = msg;
    }
    scene.querySelectorAll(".mv-src").forEach((src) => {
      src.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        const id = e.pointerId;
        const s0 = toScene(e);
        const r = src.getBoundingClientRect(), sr = scene.getBoundingClientRect();
        const pw = r.width / sr.width * W * 0.8, ph = r.height / sr.height * H * 0.8;
        const p = document.createElement("div");
        p.className = "mv-piece shape-" + src.dataset.type + " is-drag";
        p.style.setProperty("--c", src.dataset.color);
        p.style.visibility = "hidden";
        setBox(p, s0.x - pw / 2, s0.y - ph / 2, s0.x + pw / 2, s0.y + ph / 2);
        scene.appendChild(p);
        let moved = false, hover = null;
        const move = (ev) => {
          if (ev.pointerId !== id) return;
          const s = toScene(ev);
          if (!moved && Math.hypot(s.x - s0.x, s.y - s0.y) < 5) return;
          moved = true;
          p.style.visibility = "";
          p.style.left = (s.x / W * 100) + "%"; p.style.top = (s.y / H * 100) + "%";
          if (hover) hover.el.classList.remove("is-hover");
          hover = targetAt(s.x, s.y);
          if (hover && !hover.piece) hover.el.classList.add("is-hover"); else hover = null;
        };
        const up = (ev) => {
          if (ev.pointerId !== id) return;
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", up);
          window.removeEventListener("pointercancel", up);
          if (hover) hover.el.classList.remove("is-hover");
          p.classList.remove("is-drag");
          if (!moved) {
            // bosish: mos keladigan birinchi bo'sh joyga qo'yamiz
            const t = targets.find((x) => !x.piece && !check(x, src));
            if (t) { p.style.visibility = ""; place(t, src, p); }
            else { p.remove(); feedback.textContent = "«" + src.dataset.name + "» uchun bo‘sh joy qolmadi. Boshqa shaklni tanlang!"; }
            return;
          }
          const s = toScene(ev);
          const t = ev.type === "pointerup" ? targetAt(s.x, s.y) : null;
          if (!t) { p.remove(); feedback.textContent = "Shaklni doskadagi chiziqli joyga olib boring!"; return; }
          const err = check(t, src);
          if (err) { p.remove(); flash(t, err); return; }
          place(t, src, p);
        };
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
        window.addEventListener("pointercancel", up);
      });
    });
    scene.addEventListener("click", (e) => {
      const p = e.target.closest && e.target.closest(".mv-piece.is-placed");
      if (!p) return;
      const t = targets.find((x) => x.piece === p);
      if (t) feedback.textContent = "🔷 " + t.name + " — " + TYPE[t.type] + ".";
    });
    document.getElementById("mvReset").addEventListener("click", () => {
      scene.querySelectorAll(".mv-piece").forEach((p) => p.remove());
      targets.forEach((t) => { t.piece = null; });
      scoreEl.textContent = "⭐ 0 / " + targets.length;
      feedback.textContent = "↻ Doska tozalandi. Qaytadan boshlang!";
    });
  })();
  // 3-dars 3-bosqich: «Xatoni top» o'yini va «Sehrli qog'oz» metodi
  (function setupFindMistake() {
    const scoreEl = document.getElementById("xtScore");
    if (!scoreEl) return;
    const scene = scoreEl.parentElement;
    const page = scene.closest("[data-l2-page]");
    const feedback = page.querySelector(".l2-feedback");
    const WHY = {
      1: "Chapdagi rasmda qog‘oz shoshib, qiyshiq va notekis qirqilgan. O‘ngdagi rasmda esa chiziq bo‘ylab tekis qirqilgan.",
      2: "Chapdagi rasmda qog‘ozning chetlari bir-biriga mos tushmagan. O‘ngdagi rasmda chetlar teng, buklangan joy tekis."
    };
    const solved = new Set();
    let miss = 0;
    scene.querySelectorAll(".xt-card").forEach((card) => {
      card.addEventListener("click", () => {
        const r = card.dataset.row;
        if (solved.has(r)) { feedback.textContent = (card.dataset.kind === "bad" ? "❌ " : "✅ ") + WHY[r]; return; }
        if (card.dataset.kind === "good") {
          miss++;
          card.classList.remove("is-wrong"); void card.offsetWidth; card.classList.add("is-wrong");
          feedback.textContent = "🤔 Bu rasmda hammasi to‘g‘ri bajarilgan. Diqqat bilan qarang — xato boshqa rasmda!";
          return;
        }
        solved.add(r);
        scene.querySelectorAll('.xt-card[data-row="' + r + '"]').forEach((c) => c.classList.add(c.dataset.kind === "bad" ? "is-bad" : "is-good"));
        scene.querySelectorAll('.xt-cover[data-row="' + r + '"]').forEach((c) => c.classList.add("is-open"));
        scoreEl.textContent = "⭐ " + solved.size + " / 2";
        feedback.textContent = "🔎 Topdingiz! " + WHY[r] + (solved.size === 2 ? " 🎉 Ikkala xatoni ham topdingiz!" : " Endi keyingi qatordagi xatoni toping.");
      });
    });
    scene.querySelectorAll(".sq-step").forEach((step) => {
      step.addEventListener("click", () => {
        scene.querySelectorAll(".sq-step").forEach((s) => s.classList.toggle("is-active", s === step));
        feedback.textContent = "✂️ " + step.dataset.say;
      });
    });
    const guessed = new Set();
    scene.querySelectorAll(".sq-magic").forEach((magic) => {
      const r = magic.dataset.row;
      const pick = scene.querySelector('.sq-pick[data-row="' + r + '"]');
      const [right, ...rest] = magic.dataset.opts.split("|");
      magic.addEventListener("click", () => {
        scene.querySelectorAll(".sq-pick").forEach((p) => p.classList.add("hidden"));
        pick.innerHTML = "<p>Qanday shakl chiqadi?</p>";
        [right, ...rest].sort(() => Math.random() - 0.5).forEach((opt) => {
          const b = document.createElement("button");
          b.type = "button";
          b.textContent = opt;
          b.addEventListener("click", () => {
            if (opt !== right) {
              b.classList.remove("is-wrong"); void b.offsetWidth; b.classList.add("is-wrong");
              feedback.textContent = "🤔 Yo‘q, " + opt.toLowerCase() + " chiqmaydi. Qadamlarni qaytadan ko‘rib chiqing va yana taxmin qiling!";
              return;
            }
            pick.classList.add("hidden");
            magic.classList.add("is-open");
            guessed.add(r);
            feedback.textContent = "🪄 Sehr! To‘g‘ri taxmin — " + right.toLowerCase() + " hosil bo‘ldi!" + (guessed.size === 2 ? " 🎉 Ikkala sehrli qog‘ozni ham ochdingiz!" : " Endi ikkinchi sehrli qog‘ozni oching.");
          });
          pick.appendChild(b);
        });
        pick.classList.remove("hidden");
        feedback.textContent = "🪄 Qadamlarga qarang va taxmin qiling: qirqgandan keyin qanday shakl hosil bo‘ladi?";
      });
    });
  })();
  // 3-dars 4-bosqich 2/2: «Manzara tarkibi» kartochkalari namunadagi qismlarni yoritadi (va aksincha)
  (function setupPictureParts() {
    const cards = Array.from(document.querySelectorAll(".pic-card"));
    if (!cards.length) return;
    const scene = cards[0].parentElement;
    const page = scene.closest("[data-l2-page]");
    const feedback = page.querySelector(".l2-feedback");
    const seen = new Set();
    function show(part) {
      scene.querySelectorAll(".pic-mark").forEach((m) => m.classList.toggle("is-on", m.dataset.part === part));
      cards.forEach((c) => c.classList.toggle("is-active", c.dataset.part === part));
      const card = cards.find((c) => c.dataset.part === part);
      card.classList.add("is-seen");
      seen.add(part);
      feedback.textContent = card.dataset.say + (seen.size === cards.length ? " 🎉 Manzaraning hamma qismlarini o‘rgandingiz!" : " (" + seen.size + " / " + cards.length + ")");
    }
    scene.querySelectorAll(".pic-card, .pic-part").forEach((el) => el.addEventListener("click", () => show(el.dataset.part)));
  })();
  // 3-dars 6-bosqich: Amaliy ish — shakllarni ish maydoniga surib, uycha, daraxtlar va quyoshli manzara yaratamiz
  (function setupLandscape() {
    const board = document.querySelector(".ls-board");
    if (!board) return;
    const scene = board.parentElement;
    const page = scene.closest("[data-l2-page]");
    const feedback = page.querySelector(".l2-feedback");
    const W = 1672, H = 941;
    const B = { x1: 470, y1: 382, x2: 1143, y2: 873 };
    const SIZE = { sq: [80, 80], rect: [110, 46], tri: [90, 80], circle: [80, 80], half: [110, 55] };
    const NAMES = { sq: "kvadrat", rect: "to‘g‘ri to‘rtburchak", tri: "uchburchak", circle: "doira", half: "yarimdoira" };
    const slots = [
      { id: "wall", step: 1, shape: "sq", cx: 805, cy: 705, w: 180, h: 170, c: "#ffd43b", z: 5, say: "uy devori (kvadrat)" },
      { id: "roof", step: 1, shape: "tri", cx: 805, cy: 560, w: 230, h: 120, c: "#e53935", z: 6, say: "uy tomi (uchburchak)" },
      { id: "door", step: 2, shape: "rect", cx: 845, cy: 738, w: 50, h: 104, c: "#8d5a2b", z: 7, say: "eshik (to‘g‘ri to‘rtburchak)" },
      { id: "window", step: 2, shape: "sq", cx: 763, cy: 680, w: 54, h: 54, c: "#42a5f5", z: 7, say: "deraza (kichik kvadrat)" },
      { id: "trunkL", step: 3, shape: "rect", cx: 590, cy: 745, w: 28, h: 100, c: "#8d5a2b", z: 5, say: "daraxt tanasi (to‘g‘ri to‘rtburchak)" },
      { id: "crownL", step: 3, shape: "circle", cx: 590, cy: 640, w: 120, h: 120, c: "#ff8a1f", z: 6, say: "daraxt toji (doira)" },
      { id: "trunkR", step: 3, shape: "rect", cx: 1040, cy: 752, w: 28, h: 86, c: "#8d5a2b", z: 5, say: "daraxt tanasi (to‘g‘ri to‘rtburchak)" },
      { id: "crownR", step: 3, shape: "half", cx: 1040, cy: 672, w: 150, h: 76, c: "#ffd43b", z: 6, say: "daraxt toji (yarimdoira)" },
      { id: "sun", step: 4, shape: "circle", cx: 560, cy: 470, w: 90, h: 90, c: "#ffc928", z: 5, say: "quyosh (doira)" }
    ];
    const STEP_SAY = {
      1: "1-qadam: Uycha shakllarini tayyorlang — devor uchun katta kvadrat, tom uchun uchburchak.",
      2: "2-qadam: Uycha detallarini yopishtiring — eshik (to‘g‘ri to‘rtburchak) va deraza (kichik kvadrat).",
      3: "3-qadam: Daraxtlarni joylashtiring — tanasi to‘g‘ri to‘rtburchak, toji doira yoki yarimdoira.",
      4: "4-qadam: Quyoshni tayyorlab, osmonga — yuqori burchakka qo‘shing (doira).",
      5: "5-qadam: Barcha qismlarni fon qog‘ozga tartibli yopishtirib, manzara hosil qiling!"
    };
    const pct = (v, t) => (v / t * 100) + "%";
    function place(el, cx, cy, w, h) { el.style.left = pct(cx - w / 2, W); el.style.top = pct(cy - h / 2, H); el.style.width = pct(w, W); el.style.height = pct(h, H); }
    slots.forEach((s) => {
      const g = document.createElement("span");
      g.className = "ls-ghost shape-" + s.shape;
      g.dataset.step = s.step;
      place(g, s.cx, s.cy, s.w, s.h);
      g.style.zIndex = 3;
      scene.insertBefore(g, board.nextSibling);
      s.ghost = g; s.piece = null;
    });
    const progress = scene.querySelector(".ls-progress");
    const bg = board.querySelector(".ls-bg");
    const filled = () => slots.filter((s) => s.piece).length;
    let won = false;
    function update(msg) {
      const n = filled();
      progress.textContent = "⭐ " + n + " / " + slots.length;
      [1, 2, 3, 4].forEach((k) => {
        const ok = slots.filter((s) => s.step === k).every((s) => s.piece);
        scene.querySelector('.ls-done[data-step="' + k + '"]').classList.toggle("is-on", ok);
      });
      const all = n === slots.length;
      scene.querySelector('.ls-done[data-step="5"]').classList.toggle("is-on", all && bg.classList.contains("is-on"));
      board.classList.toggle("is-win", all);
      if (all && !won) {
        won = true;
        if (!bg.classList.contains("is-on")) { bg.classList.add("is-on"); scene.querySelector('.ls-done[data-step="5"]').classList.add("is-on"); }
        feedback.textContent = "🏆 Barakalla! Uycha, daraxtlar va quyoshli manzarangiz tayyor! Siz haqiqiy usta ekansiz!";
        confetti();
        return;
      }
      if (!all) won = false;
      if (msg) feedback.textContent = msg;
    }
    function confetti() {
      const box = document.createElement("div");
      box.className = "final-confetti";
      for (let i = 0; i < 26; i++) {
        const s = document.createElement("span");
        s.textContent = ["🍂", "🍁", "⭐", "🌟", "🎉"][i % 5];
        s.style.left = (Math.random() * 96) + "%";
        s.style.animationDuration = (2 + Math.random() * 2) + "s";
        s.style.animationDelay = (Math.random() * .8) + "s";
        box.appendChild(s);
      }
      scene.appendChild(box);
      setTimeout(() => box.remove(), 5000);
    }
    function toScene(e) {
      const r = scene.getBoundingClientRect();
      return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H };
    }
    function setPos(p, x, y) {
      p.dataset.x = x; p.dataset.y = y;
      place(p, x, y, Number(p.dataset.w), Number(p.dataset.h));
    }
    function makePiece(shape, color) {
      const p = document.createElement("div");
      const [w, h] = SIZE[shape];
      p.className = "cmp-piece ls-piece shape-" + shape;
      p.dataset.shape = shape; p.dataset.w = w; p.dataset.h = h;
      p.style.setProperty("--c", color);
      p.style.zIndex = 9;
      p.setAttribute("role", "img");
      p.setAttribute("aria-label", NAMES[shape]);
      scene.appendChild(p);
      p.addEventListener("pointerdown", (e) => { e.preventDefault(); startDrag(p, e, false); });
      return p;
    }
    function release(p) { slots.forEach((s) => { if (s.piece === p) s.piece = null; }); }
    function snap(p, s) {
      release(p);
      s.piece = p;
      p.dataset.w = s.w; p.dataset.h = s.h;
      p.style.setProperty("--c", s.c);
      p.style.zIndex = s.z;
      setPos(p, s.cx, s.cy);
      p.classList.remove("is-snap"); void p.offsetWidth; p.classList.add("is-snap");
    }
    const cap = (t) => t[0].toUpperCase() + t.slice(1);
    function drop(p, x, y, fresh) {
      const inside = x > B.x1 && x < B.x2 && y > B.y1 && y < B.y2;
      if (!inside) {
        release(p); p.remove();
        update(fresh ? "Shaklni ish maydoniga (oq varaqqa) olib boring!" : "🗑 Shakl ish maydonidan olib tashlandi.");
        return;
      }
      const near = slots.filter((s) => s.shape === p.dataset.shape && (!s.piece || s.piece === p) && Math.hypot(s.cx - x, s.cy - y) < Math.max(s.w, s.h) * .55 + 40)
        .sort((a, b) => Math.hypot(a.cx - x, a.cy - y) - Math.hypot(b.cx - x, b.cy - y));
      if (near.length) { snap(p, near[0]); update("✅ " + cap(near[0].say) + " o‘z joyiga yopishtirildi!"); return; }
      release(p);
      const [w, h] = SIZE[p.dataset.shape];
      p.dataset.w = w; p.dataset.h = h; p.style.zIndex = 9;
      setPos(p, x, y);
      const other = slots.find((s) => !s.piece && Math.hypot(s.cx - x, s.cy - y) < Math.max(s.w, s.h) * .55 + 20);
      update(other ? "🤔 Bu joyga " + NAMES[p.dataset.shape] + " emas, " + other.say + " kerak!" : "🎨 " + cap(NAMES[p.dataset.shape]) + " ish maydoniga qo‘yildi. Chiziqli joyga yaqin olib borsangiz, yopishib qoladi!");
    }
    function startDrag(p, e, fresh, onTap) {
      const id = e.pointerId;
      let moved = false;
      const s0 = toScene(e);
      const ox = fresh ? 0 : Number(p.dataset.x) - s0.x, oy = fresh ? 0 : Number(p.dataset.y) - s0.y;
      p.classList.add("is-drag");
      const move = (ev) => {
        if (ev.pointerId !== id) return;
        const s = toScene(ev);
        if (!moved && Math.hypot(s.x - s0.x, s.y - s0.y) < 4) return;
        moved = true;
        p.style.visibility = "";
        setPos(p, s.x + ox, s.y + oy);
      };
      const up = (ev) => {
        if (ev.pointerId !== id) return;
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        window.removeEventListener("pointercancel", up);
        p.classList.remove("is-drag");
        if (!moved) { if (onTap && ev.type === "pointerup") onTap(); else if (fresh) p.remove(); return; }
        if (ev.type === "pointercancel") { drop(p, -1, -1, fresh); return; }
        drop(p, Number(p.dataset.x), Number(p.dataset.y), fresh);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
      window.addEventListener("pointercancel", up);
    }
    function tapPlace(p, shape) {
      const s = slots.find((sl) => sl.shape === shape && !sl.piece);
      p.style.visibility = "";
      if (s) { snap(p, s); update("✅ " + cap(s.say) + " joyiga qo‘yildi! Uni surib, boshqa joyga ham ko‘chirishingiz mumkin."); }
      else { p.remove(); update("Bu shakl uchun bo‘sh joy qolmadi. Shaklni surib, xohlagan joyingizga qo‘yishingiz mumkin!"); }
    }
    scene.querySelectorAll(".ls-src").forEach((src) => {
      src.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        const s0 = toScene(e);
        const p = makePiece(src.dataset.shape, src.dataset.color);
        setPos(p, s0.x, s0.y);
        p.style.visibility = "hidden";
        startDrag(p, e, true, () => tapPlace(p, src.dataset.shape));
      });
      src.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        tapPlace(makePiece(src.dataset.shape, src.dataset.color), src.dataset.shape);
      });
    });
    function toggleFon(on) {
      const v = bg.classList.toggle("is-on", on);
      update(v ? "🖼 Asos qog‘oz (fon) ish maydoniga qo‘yildi: osmon va yashil o‘tloq. Endi shakllarni yopishtiramiz!" : "🖼 Fon olib tashlandi.");
    }
    scene.querySelector(".ls-fon").addEventListener("click", () => toggleFon());
    let lit = 0;
    scene.querySelectorAll(".ls-step").forEach((btn) => {
      btn.addEventListener("click", () => {
        const k = Number(btn.dataset.step);
        clearTimeout(lit);
        scene.querySelectorAll(".ls-step").forEach((b) => b.classList.toggle("is-on", b === btn));
        slots.forEach((s) => s.ghost.classList.toggle("is-lit", k === 5 ? !s.piece : s.step === k));
        const left = slots.filter((s) => (k === 5 || s.step === k) && !s.piece);
        feedback.textContent = STEP_SAY[k] + (left.length ? " Yonib turgan joylarga " + left.map((s) => s.say).join(", ") + " qo‘ying." : " ✅ Bu qadam bajarilgan!");
        if (k === 5 && !bg.classList.contains("is-on")) feedback.textContent += " Avval «Asos qog‘oz (fon)»ni bosing!";
        lit = setTimeout(() => { slots.forEach((s) => s.ghost.classList.remove("is-lit")); scene.querySelectorAll(".ls-step").forEach((b) => b.classList.remove("is-on")); }, 4000);
      });
    });
    scene.querySelector(".ls-ghostbtn").addEventListener("click", () => {
      const off = scene.classList.toggle("ls-noghost");
      feedback.textContent = off ? "👁 Chiziqlar yashirildi. Endi o‘zingiz joylashtirib ko‘ring!" : "👁 Chiziqlar ko‘rsatildi.";
    });
    scene.querySelector(".ls-sample").addEventListener("click", () => {
      bg.classList.add("is-on");
      slots.filter((s) => !s.piece).forEach((s, i) => setTimeout(() => {
        if (s.piece) return;
        snap(makePiece(s.shape, s.c), s);
        update("✨ Namuna: " + s.say + "…");
      }, i * 260));
    });
    scene.querySelector(".ls-clear").addEventListener("click", () => {
      scene.querySelectorAll(".ls-piece").forEach((p) => p.remove());
      slots.forEach((s) => { s.piece = null; });
      bg.classList.remove("is-on");
      won = false;
      update("🗑 Ish maydoni tozalandi. Qaytadan boshlang!");
    });
    update();
  })();
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
