
"use strict";

/* ==================================
   BERRY MATCHA MEDICAL CLINIC
   Main JavaScript
================================== */

const $ = (id) => document.getElementById(id);

const STORAGE = {
  diary: "berryMatchaDiary",
  checkup: "berryMatchaCheckup"
};

function readStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function saveStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function showResult(id, title, message, urgent = false) {
  const element = $(id);
  if (!element) return;

  element.classList.remove("hidden", "urgent");

  if (urgent) element.classList.add("urgent");

  element.innerHTML = `
    <h3>${title}</h3>
    <p>${message}</p>
  `;

  element.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/* ==================================
   INTRO & NAVIGATION
================================== */

function openClinic() {
  $("intro").classList.add("hidden");
  $("app").classList.remove("hidden");
  showPage("dashboard");
}

function showPage(pageId) {
  const target = $(pageId);

  if (!target || !target.classList.contains("page")) return;

  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  target.classList.add("active");

  document.querySelectorAll(".nav").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.page === pageId
    );
  });

  $("sidebar").classList.remove("open");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  if (pageId === "diary") renderDiaries();
  if (pageId === "history") renderHistory();
}

function initializeNavigation() {
  $("enterButton").addEventListener("click", openClinic);

  document.addEventListener("click", event => {
    const navButton = event.target.closest("[data-page]");
    const goButton = event.target.closest("[data-go]");

    if (navButton) {
      showPage(navButton.dataset.page);
    }

    if (goButton) {
      showPage(goButton.dataset.go);
    }
  });

  $("mobileMenu").addEventListener("click", () => {
    $("sidebar").classList.toggle("open");
  });
}

/* ==================================
   GENERAL PRACTICE
================================== */

function handleGeneralConsultation() {
  const name = $("patientName").value.trim();
  const symptom = $("symptom").value;
  const duration = $("duration").value.trim();
  const severity = $("severity").value;
  const additional = $("otherSymptoms").value.trim();

  if (!name || !symptom || !duration || !severity) {
    alert("Mohon lengkapi nama, keluhan, lama keluhan, dan tingkat keluhan.");
    return;
  }

  const advice = {
    "sakit kepala": "Sakit kepala dapat memiliki berbagai penyebab. Cobalah beristirahat dan cukup minum. Jika sering terjadi atau memburuk, periksakan diri.",
    "demam": "Demam dapat terjadi ketika tubuh sedang melawan infeksi. Istirahat dan cukup cairan dapat membantu. Periksakan diri jika demam tinggi, menetap, atau disertai kondisi yang mengkhawatirkan.",
    "batuk": "Batuk dapat disebabkan oleh berbagai kondisi. Minum cukup air dan istirahat. Jika disertai sesak napas atau memburuk, segera cari bantuan medis.",
    "sakit perut": "Sakit perut memiliki banyak kemungkinan penyebab. Perhatikan makanan dan kondisi tubuh. Jika nyeri berat atau menetap, segera periksakan diri.",
    "pusing": "Pusing dapat dipengaruhi berbagai faktor. Duduk atau berbaring dengan aman dan hindari aktivitas berisiko sampai membaik. Jika berat atau berulang, konsultasikan kepada dokter.",
    "lelah": "Tubuh lelah dapat berkaitan dengan aktivitas, istirahat, atau kondisi kesehatan. Usahakan tidur cukup, makan teratur, dan periksakan diri jika terus berlanjut.",
    "lainnya": "Keluhan ini memerlukan informasi lebih lanjut untuk dipahami. Catat perubahan yang terjadi dan konsultasikan dengan tenaga kesehatan."
  };

  const urgent = severity === "berat";

  const message = `
    <strong>Nama pasien:</strong> ${escapeHTML(name)}<br>
    <strong>Keluhan:</strong> ${escapeHTML(symptom)}<br>
    <strong>Lama keluhan:</strong> ${escapeHTML(duration)}<br>
    <strong>Tingkat keluhan:</strong> ${escapeHTML(severity)}<br>
    <strong>Keluhan tambahan:</strong> ${escapeHTML(additional || "Tidak ada keterangan")}<br><br>
    <strong>Informasi kesehatan:</strong><br>
    ${advice[symptom]}
    <br><br>
    ${urgent
      ? "Karena keluhan kamu tergolong berat, segera minta bantuan orang dewasa tepercaya dan periksakan diri ke fasilitas kesehatan."
      : "Informasi ini bukan diagnosis. Jika keluhan tidak membaik atau membuatmu khawatir, konsultasikan dengan dokter."
    }
  `;

  showResult("generalResult", "🩺 Informasi Konsultasi", message, urgent);
}

/* ==================================
   PSYCHOLOGY
================================== */

function handlePsychology() {
  const emotion = $("emotion").value;
  const sleep = $("sleep").value;
  const stress = $("stress").value;
  const thoughts = $("thoughts").value.trim();

  if (!emotion || !sleep || !stress) {
    alert("Mohon isi perasaan, kualitas tidur, dan tingkat tekanan terlebih dahulu.");
    return;
  }

  const reflections = {
    happy: "Senang mengetahui kamu merasa bahagia. Nikmati momen baik ini dan tetap berikan waktu untuk dirimu sendiri.",
    calm: "Perasaan tenang adalah hal yang baik. Pertahankan kebiasaan yang membuatmu nyaman dan seimbang.",
    sad: "Tidak apa-apa merasa sedih. Berikan waktu untuk memahami perasaanmu dan bercerita kepada orang yang kamu percaya.",
    anxious: "Saat merasa cemas, cobalah berhenti sejenak, bernapas perlahan, dan fokus pada hal yang bisa kamu lakukan sekarang.",
    angry: "Saat marah, beri dirimu waktu untuk menenangkan diri sebelum mengambil keputusan atau merespons keadaan.",
    tired: "Kelelahan juga perlu diperhatikan. Kamu boleh beristirahat dan tidak harus menyelesaikan semuanya sekaligus."
  };

  let message = `
    <strong>Refleksi perasaan:</strong><br>
    ${reflections[emotion]}
    <br><br>
    <strong>Kualitas tidur:</strong> ${escapeHTML(sleep)}<br>
    <strong>Tingkat tekanan:</strong> ${escapeHTML(stress)}<br>
  `;

  if (sleep === "kurang") {
    message += "<br>Cobalah membuat rutinitas tidur yang teratur dan berikan tubuh waktu istirahat.";
  }

  if (stress === "tinggi") {
    message += "<br>Tekanan yang terasa tinggi tidak harus kamu hadapi sendirian. Bicarakan dengan orang tepercaya atau tenaga profesional.";
  }

  if (thoughts) {
    message += `<br><br><strong>Catatanmu:</strong><br>${escapeHTML(thoughts).replace(/\n/g, "<br>")}`;
  }

  message += "<br><br>Ini adalah refleksi umum, bukan hasil diagnosis psikologis.";

  showResult("psychologyResult", "🌷 Refleksi Dirimu", message);
}

/* ==================================
   PHARMACY
================================== */

const medicineInformation = {
  paracetamol: {
    title: "Paracetamol",
    description: "Paracetamol merupakan obat yang digunakan untuk membantu meredakan nyeri dan menurunkan demam.",
    note: "Perhatikan aturan pakai pada kemasan. Jangan menggabungkan beberapa obat yang sama-sama mengandung paracetamol tanpa saran tenaga kesehatan."
  },

  oralit: {
    title: "Oralit",
    description: "Oralit merupakan larutan yang mengandung garam dan gula untuk membantu mengganti cairan serta elektrolit yang hilang, misalnya saat diare.",
    note: "Larutkan sesuai petunjuk kemasan. Jika mengalami tanda dehidrasi berat, segera cari pertolongan medis."
  },

  antasida: {
    title: "Antasida",
    description: "Antasida merupakan obat yang membantu menetralkan asam lambung dan meredakan keluhan tertentu akibat asam lambung.",
    note: "Ikuti petunjuk kemasan dan tanyakan kepada apoteker jika sedang menggunakan obat lain."
  },

  "obat batuk": {
    title: "Obat Batuk",
    description: "Obat batuk memiliki jenis dan kegunaan yang berbeda, tergantung penyebab serta jenis batuk.",
    note: "Tidak semua obat batuk cocok untuk setiap orang. Konsultasikan dengan apoteker atau dokter sebelum menggunakannya."
  }
};

function initializePharmacy() {
  document.querySelectorAll("[data-medicine]").forEach(button => {
    button.addEventListener("click", () => {
      const key = button.dataset.medicine;
      const medicine = medicineInformation[key];

      if (!medicine) return;

      showResult(
        "medicineResult",
        `💊 ${medicine.title}`,
        `${medicine.description}<br><br><strong>Perhatian:</strong> ${medicine.note}`
      );
    });
  });

  $("medicineSearch").addEventListener("input", event => {
    const keyword = event.target.value.toLowerCase();

    document.querySelectorAll(".medicine-card").forEach(card => {
      const searchable = (
        card.dataset.search + " " + card.innerText
      ).toLowerCase();

      card.style.display = searchable.includes(keyword)
        ? ""
        : "none";
    });
  });
}

/* ==================================
   DAILY CHECKUP
================================== */

function handleDailyCheckup() {
  const body = $("bodyCondition").value;
  const mood = $("dailyMood").value;
  const sleep = $("dailySleep").value;
  const food = $("dailyFood").value;
  const water = $("dailyWater").value;

  if (!body || !mood || !sleep || !food || !water) {
    alert("Mohon lengkapi semua bagian pemeriksaan harian.");
    return;
  }

  const record = {
    id: Date.now(),
    date: new Date().toLocaleDateString("id-ID"),
    body,
    mood,
    sleep,
    food,
    water
  };

  const records = readStorage(STORAGE.checkup);
  records.unshift(record);
  saveStorage(STORAGE.checkup, records);

  showResult(
    "dailyResult",
    "🌿 Pemeriksaan Berhasil Disimpan",
    `
      <strong>Kondisi tubuh:</strong> ${escapeHTML(body)}<br>
      <strong>Suasana hati:</strong> ${escapeHTML(mood)}<br>
      <strong>Tidur:</strong> ${escapeHTML(sleep)}<br>
      <strong>Pola makan:</strong> ${escapeHTML(food)}<br>
      <strong>Air putih:</strong> ${escapeHTML(water)}<br><br>
      Terima kasih sudah memperhatikan kesehatanmu hari ini.
    `
  );
}

/* ==================================
   DIARY
================================== */

function handleSaveDiary() {
  const title = $("diaryTitle").value.trim();
  const date = $("diaryDate").value;
  const mood = $("diaryMood").value;
  const content = $("diaryContent").value.trim();

  if (!title || !date || !mood || !content) {
    alert("Mohon lengkapi judul, tanggal, suasana hati, dan cerita.");
    return;
  }

  const diary = {
    id: Date.now(),
    title,
    date,
    mood,
    content,
    createdAt: new Date().toISOString()
  };

  const diaries = readStorage(STORAGE.diary);
  diaries.unshift(diary);
  saveStorage(STORAGE.diary, diaries);

  $("diaryTitle").value = "";
  $("diaryMood").value = "";
  $("diaryContent").value = "";
  $("diaryDate").value = new Date().toISOString().slice(0, 10);

  renderDiaries();

  alert("Cerita berhasil disimpan 🌸");
}

function renderDiaries() {
  const diaries = readStorage(STORAGE.diary);
  $("diaryCount").textContent = diaries.length;

  if (!diaries.length) {
    $("diaryList").innerHTML = `
      <div class="empty-state">
        <span>📔</span>
        Belum ada cerita tersimpan. Mulai tulis diary pertamamu!
      </div>
    `;
    return;
  }

  $("diaryList").innerHTML = diaries.map(diary => `
    <article class="history-item">
      <h3>🌸 ${escapeHTML(diary.title)}</h3>
      <div class="history-meta">
        ${escapeHTML(diary.date)} · ${escapeHTML(diary.mood)}
      </div>
      <p>${escapeHTML(diary.content).replace(/\n/g, "<br>")}</p>
      <button class="delete-btn" data-delete-diary="${diary.id}">
        <i class="fa-solid fa-trash"></i> Hapus cerita
      </button>
    </article>
  `).join("");
}

function deleteDiary(id) {
  const diaries = readStorage(STORAGE.diary);
  const updated = diaries.filter(item => item.id !== id);

  saveStorage(STORAGE.diary, updated);
  renderDiaries();
  renderHistory();
}

/* ==================================
   HISTORY
================================== */

function renderHistory() {
  const diaries = readStorage(STORAGE.diary);
  const checkups = readStorage(STORAGE.checkup);

  const items = [
    ...diaries.map(item => ({
      type: "Diary Pasien",
      date: item.date,
      title: item.title,
      description: item.content,
      icon: "📔",
      timestamp: item.id
    })),

    ...checkups.map(item => ({
      type: "Pemeriksaan Harian",
      date: item.date,
      title: "Catatan Kesehatan",
      description: `Tubuh: ${item.body} · Mood: ${item.mood} · Tidur: ${item.sleep}`,
      icon: "🩺",
      timestamp: item.id
    }))
  ].sort((a, b) => b.timestamp - a.timestamp);

  if (!items.length) {
    $("historyList").innerHTML = `
      <div class="empty-state">
        <span>🌿</span>
        Belum ada riwayat aktivitas.
      </div>
    `;
    return;
  }

  $("historyList").innerHTML = items.map(item => `
    <article class="history-item">
      <div class="history-meta">${item.icon} ${escapeHTML(item.type)} · ${escapeHTML(item.date)}</div>
      <h3>${escapeHTML(item.title)}</h3>
      <p>${escapeHTML(item.description).replace(/\n/g, "<br>")}</p>
    </article>
  `).join("");
}

/* ==================================
   INITIALIZATION
================================== */

function initializeClinic() {
  const now = new Date();

  $("todayDate").textContent = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  $("welcomeDate").textContent = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  $("diaryDate").value = now.toISOString().slice(0, 10);

  initializeNavigation();
  initializePharmacy();

  $("generalButton").addEventListener("click", handleGeneralConsultation);
  $("psychologyButton").addEventListener("click", handlePsychology);
  $("dailyButton").addEventListener("click", handleDailyCheckup);
  $("saveDiaryButton").addEventListener("click", handleSaveDiary);

  $("diaryList").addEventListener("click", event => {
    const button = event.target.closest("[data-delete-diary]");

    if (!button) return;

    const id = Number(button.dataset.deleteDiary);

    if (confirm("Yakin ingin menghapus cerita ini?")) {
      deleteDiary(id);
    }
  });

  renderDiaries();
  renderHistory();
}

document.addEventListener("DOMContentLoaded", initializeClinic);
vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
