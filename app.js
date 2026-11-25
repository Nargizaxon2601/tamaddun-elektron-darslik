const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");

    navLinks.querySelectorAll("a").forEach((item) => {
      item.classList.remove("active");
    });

    link.classList.add("active");
  });
});

// Modal oynasi
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");

function openModal(title, text) {
  modalTitle.textContent = title;
  modalText.textContent = text;
  modal.hidden = false;
}

function closeModal() {
  modal.hidden = true;
}

// Kirish va ro‘yxatdan o‘tish
document.getElementById("loginBtn").addEventListener("click", () => {
  openModal(
    "Kirish",
    "O‘quvchi kabinetiga kirish funksiyasi keyingi bosqichda qo‘shiladi."
  );
});

document.getElementById("registerBtn").addEventListener("click", () => {
  openModal(
    "Ro‘yxatdan o‘tish",
    "Ro‘yxatdan o‘tish formasi keyingi bosqichda ulanadi."
  );
});

document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("modalOk").addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

// Fan kartochkalari
document.querySelectorAll("[data-subject]").forEach((button) => {
  button.addEventListener("click", () => {
    const subject = button.dataset.subject.toLowerCase();
    window.location.href =
      "darslar.html?subject=" + encodeURIComponent(subject);
  });
});

// Fan kartochkasining boshqa joyini bosish
document.querySelectorAll(".subject-card").forEach((card) => {
  card.addEventListener("click", (event) => {
    if (event.target.closest("button")) return;

    const button = card.querySelector("[data-subject]");

    if (button) {
      button.click();
    }
  });
});

// O‘rganish bosqichlari
const featureDetails = {
  "O‘qi va tushun":
    "Bu yerda kitobdagi yangi mavzu matni, rasmlar va video materiallar joylashtiriladi.",

  "Fikr yurit":
    "O‘quvchi vaziyatni o‘qiydi, javob variantlarini tanlaydi va qarorining sababini tushunadi.",

  "Amalda bajar":
    "Bolalar jismoniy mashqlar va amaliy topshiriqlarni ekrandagi ko‘rsatmalar asosida bajaradilar.",

  "Yutuqqa erish":
    "Dars yakunida o‘quvchi ball, rag‘bat va bajargan topshiriqlari bo‘yicha natija oladi.",
};

document.querySelectorAll("[data-feature]").forEach((card) => {
  function showFeature() {
    const title = card.dataset.feature;
    openModal(title, featureDetails[title]);
  }

  card.addEventListener("click", showFeature);

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      showFeature();
    }
  });
});

// Qadriyatlar
const valueDescriptions = {
  "Mehr-shafqat":
    "Boshqalarga mehr ko‘rsatish va kerak bo‘lganda yordam berish.",

  "Do‘stlik": "Do‘stni tinglash, hurmat qilish va birga ishlash.",

  Vatanparvarlik:
    "O‘z yurtimizni sevish, uning tabiati va boyliklarini asrash.",

  Hurmat:
    "Oila, ustozlar, tengdoshlar va atrofdagilarga hurmat bilan munosabatda bo‘lish.",

  "Mas’uliyat":
    "O‘z vazifasini bajarish va tanlovlari uchun javobgarlikni his qilish.",

  "Bilimga intilish": "Savol berish, izlanish va yangi narsalarni o‘rganish.",
};

document.querySelectorAll(".value-chip").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".value-chip").forEach((item) => {
      item.classList.remove("selected");
    });

    button.classList.add("selected");

    const title = button.dataset.value.replace(/^[^ ]+\s/, "");

    openModal(
      title,
      valueDescriptions[title] ||
        "Bu qadriyatni kundalik hayotda qo‘llashga harakat qilamiz."
    );
  });
});
