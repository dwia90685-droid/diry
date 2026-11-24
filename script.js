
// =====================================
// BERRY MATCHA HEALTH CLINIC
// =====================================

// INTRO

function enterClinic() {
    document.getElementById("intro").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
}

// DATE

const now = new Date();

document.getElementById("todayDate").textContent =
    now.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

document.getElementById("diaryDate").value =
    now.toLocaleDateString("en-CA");

// NAVIGATION

const pageNames = {
    dashboard: "Dashboard",
    general: "Dokter Umum",
    psychology: "Psikologi",
    psychiatry: "Psikiatri",
    pharmacy: "Apotek",
    checkup: "Pemeriksaan Harian",
    diary: "Diary Pasien",
    about: "Tentang Klinik"
};

function navigate(page, button) {

    document.querySelectorAll(".page").forEach(item => {
        item.classList.remove("active");
    });

    const selectedPage = document.getElementById(page);

    if (!selectedPage) return;

    selectedPage.classList.add("active");

    document.querySelectorAll(".nav").forEach(item => {
        item.classList.remove("active");
    });

    const selectedButton = button ||
        document.querySelector(`.nav[data-page="${page}"]`);

    if (selectedButton) {
        selectedButton.classList.add("active");
    }

    document.getElementById("pageTitle").textContent =
        pageNames[page] || "Berry Matcha";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// STORAGE

function readStorage(key) {
    try {
        const data = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

let diaries = readStorage("berryClinicDiaries");
let examinations = readStorage("berryClinicExaminations");

function saveStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch {
        alert("Penyimpanan penuh atau tidak tersedia. Silakan periksa browser.");
        return false;
    }
}

// SAFE TEXT

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

function showResult(id, title, label, paragraphs, urgent = false) {

    const box = document.getElementById(id);

    box.classList.remove("hidden", "urgent");

    if (urgent) box.classList.add("urgent");

    box.innerHTML = `
        <span class="result-label">${escapeHTML(label)}</span>
        <h3>${escapeHTML(title)}</h3>
        ${paragraphs.map(text =>
            `<p>${escapeHTML(text)}</p>`
        ).join("")}
    `;

    box.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

// =====================================
// GENERAL PRACTITIONER
// =====================================

const symptomInformation = {

    headache: {
        title: "Informasi Keluhan Sakit Kepala",
        advice: [
            "Beristirahatlah di tempat yang nyaman dan cukup tenang.",
            "Minum air putih secukupnya dan perhatikan pola makan.",
            "Kurangi aktivitas yang membuat keluhan semakin mengganggu."
        ]
    },

    cough: {
        title: "Informasi Keluhan Batuk atau Pilek",
        advice: [
            "Istirahat dan cukupi kebutuhan cairan.",
            "Hindari asap rokok, debu, dan hal yang memicu iritasi.",
            "Jika keluhan memburuk atau disertai sesak napas, segera periksa ke tenaga kesehatan."
        ]
    },

    fever: {
        title: "Informasi Keluhan Demam",
        advice: [
            "Istirahat dan minum cukup cairan.",
            "Pantau suhu tubuh menggunakan termometer.",
            "Mintalah bantuan orang tua atau orang dewasa untuk mendapatkan pemeriksaan jika demam menetap atau kondisi memburuk."
        ]
    },

    stomach: {
        title: "Informasi Keluhan Sakit Perut",
        advice: [
            "Beristirahat dan perhatikan makanan yang dikonsumsi.",
            "Minum cukup air dan hindari makanan yang memperburuk keluhan.",
            "Segera periksa jika nyeri berat, muntah terus-menerus, atau terdapat tanda bahaya lainnya."
        ]
    },

    dizzy: {
        title: "Informasi Keluhan Pusing",
        advice: [
            "Hentikan aktivitas dan duduk atau berbaring di tempat aman.",
            "Minum air jika mampu dan jangan memaksakan aktivitas.",
            "Mintalah bantuan jika pusing berulang, berat, atau disertai gejala lain."
        ]
    },

    fatigue: {
        title: "Informasi Keluhan Badan Lemas",
        advice: [
            "Berikan tubuh waktu untuk beristirahat.",
            "Usahakan makan secara teratur dan minum cukup.",
            "Jika lemas berlangsung lama atau semakin berat, periksakan diri ke tenaga kesehatan."
        ]
    },

    other: {
        title: "Informasi Keluhan Kesehatan",
        advice: [
            "Catat keluhan yang dirasakan dan kapan keluhan dimulai.",
            "Hindari aktivitas yang memperburuk kondisi.",
            "Mintalah pemeriksaan tenaga kesehatan untuk mengetahui penyebab keluhan."
        ]
    }
};

function checkGeneral() {

    const name = document.getElementById("patientName").value.trim();
    const symptom = document.getElementById("symptom").value;
    const duration = document.getElementById("duration").value;
    const severity = document.getElementById("severity").value;
    const other = document.getElementById("otherSymptoms").value.trim();

    if (!name || !symptom || !duration || !severity) {
        alert("Mohon lengkapi formulir pemeriksaan terlebih dahulu.");
        return;
    }

    const information = symptomInformation[symptom];

    let result = [...information.advice];

    result.unshift(
        `Terima kasih, ${name}. Keluhan yang kamu pilih: ${information.title}.`
    );

    result.push(
        `Durasi keluhan: ${duration}.`
    );

    if (other) {
        result.push("Gejala tambahan: " + other);
    }

    let urgent = false;
    let label = "INFORMASI KESEHATAN";

    if (severity === "mild") {
        label = "KELUHAN YANG DILAPORKAN: RINGAN";
        result.push(
            "Pantau perkembangan kondisi. Jika tidak membaik atau muncul gejala baru, konsultasikan dengan tenaga kesehatan."
        );
    }

    if (severity === "moderate") {
        label = "KELUHAN YANG DILAPORKAN: SEDANG";
        result.push(
            "Sebaiknya minta bantuan orang dewasa dan pertimbangkan pemeriksaan langsung oleh dokter."
        );
    }

    if (severity === "severe") {
        label = "PERLU PENILAIAN MEDIS SEGERA";
        urgent = true;
        result.push(
            "Jangan hanya mengandalkan perawatan mandiri. Minta bantuan orang dewasa dan segera periksakan diri ke fasilitas kesehatan. Jika terdapat gejala darurat, pergi ke IGD."
        );
    }

    showResult(
        "generalResult",
        information.title,
        label,
        result,
        urgent
    );

    addExamination("Dokter Umum", information.title);
}

// =====================================
// PSYCHOLOGY
// =====================================

const emotionMessages = {

    happy: "Senang mengetahui kamu merasa bahagia. Nikmati momen positif dan tetap jaga keseimbangan aktivitas.",

    calm: "Kondisi yang tenang dapat menjadi kesempatan untuk mengenali kebutuhan dan tujuan dirimu.",

    sad: "Tidak apa-apa jika kamu sedang merasa sedih. Beri dirimu waktu dan pertimbangkan berbicara dengan orang yang kamu percaya.",

    anxious: "Ketika merasa cemas, cobalah berhenti sejenak, bernapas perlahan, dan fokus pada hal yang dapat kamu lakukan saat ini.",

    angry: "Saat merasa marah, kamu bisa mengambil jeda sebelum merespons sesuatu. Cobalah mengenali hal yang memicu emosi tersebut.",

    tired: "Kelelahan emosional dapat membuat aktivitas terasa berat. Berikan waktu untuk beristirahat dan mencari dukungan."
};

function checkPsychology() {

    const emotion = document.getElementById("emotion").value;
    const sleep = document.getElementById("sleep").value;
    const stress = document.getElementById("stress").value;
    const thoughts = document.getElementById("thoughts").value.trim();

    if (!emotion || !sleep || !stress) {
        alert("Lengkapi pilihan pemeriksaan emosional terlebih dahulu.");
        return;
    }

    let result = [emotionMessages[emotion]];

    if (sleep === "good") {
        result.push("Kualitas tidurmu dilaporkan baik. Pertahankan rutinitas istirahat yang nyaman.");
    }

    if (sleep === "average") {
        result.push("Perhatikan kembali jadwal tidur dan usahakan memiliki waktu istirahat yang cukup.");
    }

    if (sleep === "poor") {
        result.push("Jika kesulitan tidur terus berlanjut dan mengganggu aktivitas, pertimbangkan untuk berbicara dengan tenaga profesional.");
    }

    if (stress === "no") {
        result.push("Tetap sisihkan waktu untuk kegiatan yang membuatmu nyaman.");
    }

    if (stress === "sometimes") {
        result.push("Kenali situasi yang membuatmu merasa terbebani dan cari cara sehat untuk menghadapinya.");
    }

    if (stress === "often") {
        result.push("Jika tekanan sering muncul, cobalah bercerita kepada orang tepercaya atau berkonsultasi dengan psikolog.");
    }

    if (thoughts) {
        result.push("Catatan refleksi telah kamu isi. Kamu bisa menyimpannya dalam diary pribadi untuk membantu memahami perasaanmu.");
    }

    result.push(
        "Hasil ini merupakan refleksi diri, bukan tes psikologi klinis atau diagnosis."
    );

    showResult(
        "psychologyResult",
        "Your Emotional Reflection ♡",
        "PERSONAL WELLNESS REFLECTION",
        result
    );

    addExamination("Psikologi", "Refleksi emosional harian");
}

// =====================================
// DAILY CHECK-UP
// =====================================

function dailyCheckup() {

    const body = document.getElementById("bodyCondition").value;
    const mood = document.getElementById("dailyMood").value;
    const sleep = document.getElementById("dailySleep").value;
    const food = document.getElementById("dailyFood").value;
    const water = document.getElementById("dailyWater").value;

    if (!body || !mood || !sleep || !food || !water) {
        alert("Silakan isi seluruh bagian pemeriksaan harian.");
        return;
    }

    let messages = [];

    if (body === "fit") {
        messages.push("Kamu melaporkan tubuh terasa sehat dan bugar. Pertahankan kebiasaan sehat.");
    }

    if (body === "normal") {
        messages.push("Perhatikan kondisi tubuh dan tetap jaga pola hidup seimbang.");
    }

    if (body === "tired") {
        messages.push("Tubuh terasa lelah. Berikan waktu untuk istirahat dan jangan memaksakan aktivitas.");
    }

    if (body === "unwell") {
        messages.push("Kamu sedang merasa kurang sehat. Perhatikan keluhan dan mintalah bantuan orang dewasa jika diperlukan.");
    }

    if (sleep === "Nyenyak") {
        messages.push("Kualitas tidur dilaporkan baik.");
    } else {
        messages.push("Perhatikan kembali kualitas dan jadwal tidurmu.");
    }

    if (food === "Sudah") {
        messages.push("Kamu sudah makan secara teratur. Pertahankan kebiasaan tersebut.");
    } else {
        messages.push("Usahakan tidak melewatkan waktu makan.");
    }

    if (water === "Sudah") {
        messages.push("Kebutuhan cairan sudah diperhatikan.");
    } else {
        messages.push("Cobalah memenuhi kebutuhan cairan secara bertahap sepanjang hari.");
    }

    messages.push(
        "Pemeriksaan ini merupakan catatan kebiasaan dan kondisi harian, bukan penilaian medis."
    );

    showResult(
        "dailyResult",
        "Daily Health Summary 🌿",
        "YOUR DAILY REPORT",
        messages
    );

    addExamination("Pemeriksaan Harian", "Pemeriksaan kondisi harian");
}

// =====================================
// MEDICINE INFORMATION
// =====================================

const medicines = {

    paracetamol: {
        title: "Paracetamol",
        category: "Pereda nyeri dan demam",
        description: "Paracetamol merupakan obat yang digunakan untuk meredakan nyeri ringan hingga sedang dan menurunkan demam.",
        use: "Penggunaannya harus mengikuti petunjuk pada kemasan atau arahan dokter maupun apoteker.",
        warning: "Penggunaan berlebihan dapat menyebabkan kerusakan hati. Perhatikan kandungan paracetamol pada obat kombinasi agar tidak mengonsumsi bahan aktif yang sama secara berlebihan."
    },

    oralit: {
        title: "Oralit",
        category: "Larutan rehidrasi oral",
        description: "Oralit digunakan untuk membantu mengganti cairan dan elektrolit yang hilang akibat diare.",
        use: "Larutkan sesuai petunjuk kemasan menggunakan jumlah air yang ditentukan. Jangan mengubah konsentrasi larutan.",
        warning: "Jika diare disertai darah, muntah terus-menerus, tanda dehidrasi, atau kondisi memburuk, segera periksakan diri."
    },

    antasida: {
        title: "Antasida",
        category: "Obat untuk keluhan asam lambung",
        description: "Antasida membantu menetralkan asam lambung dan digunakan pada keluhan tertentu seperti nyeri ulu hati.",
        use: "Ikuti petunjuk produk dan tanyakan kepada apoteker mengenai waktu penggunaan serta jarak dengan obat lain.",
        warning: "Tidak semua sakit perut disebabkan oleh asam lambung. Konsultasikan jika keluhan berat atau sering berulang."
    },

    batuk: {
        title: "Obat Batuk",
        category: "Informasi obat batuk",
        description: "Obat batuk memiliki jenis dan kegunaan yang berbeda, tergantung batuk berdahak, batuk kering, usia, dan penyebabnya.",
        use: "Pemilihan produk sebaiknya dibantu apoteker berdasarkan usia dan kondisi pengguna.",
        warning: "Jangan menggabungkan beberapa obat batuk atau pilek tanpa memeriksa kandungannya. Sebagian produk memiliki batasan usia."
    }

};

function medicineDetail(id) {

    const medicine = medicines[id];

    if (!medicine) return;

    const box = document.getElementById("medicineResult");

    box.classList.remove("hidden", "urgent");

    box.innerHTML = `
        <span class="result-label">MEDICINE INFORMATION</span>
        <h3>${escapeHTML(medicine.title)}</h3>
        <p><b>Kategori:</b> ${escapeHTML(medicine.category)}</p>
        <p><b>Kegunaan:</b> ${escapeHTML(medicine.description)}</p>
        <p><b>Petunjuk penggunaan:</b> ${escapeHTML(medicine.use)}</p>
        <p><b>Perhatian:</b> ${escapeHTML(medicine.warning)}</p>
        <p>Informasi ini bersifat edukatif. Tanyakan kepada apoteker atau dokter sebelum menggunakan obat.</p>
    `;

    box.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

function searchMedicine() {

    const query = document.getElementById("medicineSearch")
        .value.toLowerCase().trim();

    document.querySelectorAll(".medicine-card").forEach(card => {

        const content = card.dataset.search.toLowerCase();

        card.style.display =
            content.includes(query) ? "block" : "none";

    });
}

// =====================================
// PATIENT DIARY
// =====================================

function saveDiary() {

    const title = document.getElementById("diaryTitle").value.trim();
    const date = document.getElementById("diaryDate").value;
    const mood = document.getElementById("diaryMood").value;
    const content = document.getElementById("diaryContent").value.trim();

    if (!title || !date || !content) {
        alert("Lengkapi judul, tanggal, dan isi diary.");
        return;
    }

    const entry = {
        id: Date.now(),
        title,
        date,
        mood,
        content
    };

    const updated = [entry, ...diaries];

    if (!saveStorage("berryClinicDiaries", updated)) return;

    diaries = updated;

    document.getElementById("diaryTitle").value = "";
    document.getElementById("diaryContent").value = "";

    renderDiaries();
    updateDashboard();

    alert("Diary berhasil disimpan 🌸");
}

function renderDiaries() {

    const list = document.getElementById("diaryList");

    if (!diaries.length) {
        list.innerHTML = `
            <div class="info-panel">
                <h3>🌸 Belum ada diary</h3>
                <p>Catatan pribadimu akan muncul di sini setelah disimpan.</p>
            </div>
        `;
        return;
    }

    list.innerHTML = diaries.map(item => `
        <div class="history-item">
            <h3>${escapeHTML(item.title)}</h3>
            <small>
                ${escapeHTML(item.date)} · ${escapeHTML(item.mood)}
            </small>
            <p>${escapeHTML(item.content).replace(/\n/g, "<br>")}</p>
            <button class="delete-btn" onclick="deleteDiary(${Number(item.id)})">
                <i class="fa-solid fa-trash"></i> Hapus Catatan
            </button>
        </div>
    `).join("");
}

function deleteDiary(id) {

    if (!confirm("Apakah kamu yakin ingin menghapus diary ini?")) return;

    const updated = diaries.filter(item => item.id !== id);

    if (!saveStorage("berryClinicDiaries", updated)) return;

    diaries = updated;

    renderDiaries();
    updateDashboard();
}

// =====================================
// EXAMINATION HISTORY
// =====================================

function addExamination(department, description) {

    const updated = [
        {
            id: Date.now(),
            department,
            description,
            date: new Date().toLocaleString("id-ID")
        },
        ...examinations
    ];

    if (!saveStorage("berryClinicExaminations", updated)) return;

    examinations = updated;
    updateDashboard();
}

function updateDashboard() {

    document.getElementById("checkupCount").textContent =
        examinations.length;

    document.getElementById("diaryCount").textContent =
        diaries.length;
}

// =====================================
// INITIALIZE
// =====================================

renderDiaries();
updateDashboard();
