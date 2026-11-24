
"use strict";

// ==========================================
// BERRY MATCHA HEALTH CLINIC
// FINAL JAVASCRIPT
// ==========================================

// HELPER

const $ = (id) => document.getElementById(id);

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

function readData(key) {
    try {
        const value = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(value) ? value : [];
    } catch {
        return [];
    }
}

function saveData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch {
        alert("Penyimpanan browser tidak tersedia atau penuh.");
        return false;
    }
}

let diaries = readData("berryDiaries");
let examinations = readData("berryExaminations");

const pageTitles = {
    dashboard: "Dashboard",
    general: "Dokter Umum",
    psychology: "Psikolog",
    psychiatry: "Psikiater",
    pharmacy: "Apotek",
    checkup: "Pemeriksaan Harian",
    diary: "Diary Pasien",
    history: "Riwayat Pemeriksaan",
    about: "Tentang Klinik"
};

// ==========================================
// INTRO
// ==========================================

function enterClinic() {
    $("intro").classList.add("hidden");
    $("app").classList.remove("hidden");

    navigate("dashboard");
}

// ==========================================
// NAVIGATION
// ==========================================

function navigate(page) {

    const target = $(page);

    if (!target || !target.classList.contains("page")) {
        return;
    }

    document.querySelectorAll(".page").forEach(section => {
        section.classList.remove("active");
    });

    target.classList.add("active");

    document.querySelectorAll(".nav").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.page === page
        );
    });

    $("pageTitle").textContent = pageTitles[page] || "Berry Matcha";

    if (page === "diary") renderDiaries();
    if (page === "history") renderHistory();
    if (page === "dashboard") updateDashboard();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// ==========================================
// RESULT DISPLAY
// ==========================================

function showResult(id, title, label, messages, urgent = false) {

    const box = $(id);

    box.classList.remove("hidden", "urgent");

    if (urgent) {
        box.classList.add("urgent");
    }

    box.innerHTML = `
        <span class="result-label">${escapeHTML(label)}</span>
        <h3>${escapeHTML(title)}</h3>

        ${messages.map(message => `
            <p>${escapeHTML(message)}</p>
        `).join("")}
    `;

    box.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

// ==========================================
// EXAMINATION HISTORY
// ==========================================

function addExamination(department, description) {

    const record = {
        id: Date.now(),
        department,
        description,
        date: new Date().toLocaleString("id-ID")
    };

    const updated = [record, ...examinations];

    if (!saveData("berryExaminations", updated)) {
        return;
    }

    examinations = updated;
    updateDashboard();
    renderHistory();
}

function renderHistory() {

    const list = $("historyList");

    if (!examinations.length) {
        list.innerHTML = `
            <div class="info-panel">
                <h3>🌸 Belum ada riwayat</h3>
                <p>Riwayat pemeriksaan akan muncul setelah kamu mengisi pemeriksaan.</p>
            </div>
        `;
        return;
    }

    list.innerHTML = examinations.map(item => `
        <article class="history-item">
            <h3>${escapeHTML(item.department)}</h3>
            <small>${escapeHTML(item.date)}</small>
            <p>${escapeHTML(item.description)}</p>
        </article>
    `).join("");
}

function updateDashboard() {

    $("checkupCount").textContent = examinations.length;
    $("diaryCount").textContent = diaries.length;
}

// ==========================================
// DOKTER UMUM
// ==========================================

const symptomData = {

    headache: {
        title: "Sakit Kepala",
        advice: [
            "Beristirahatlah di tempat yang nyaman.",
            "Minum air putih secukupnya.",
            "Kurangi aktivitas yang membuat keluhan semakin berat.",
            "Jika sakit kepala berat, mendadak, berulang, atau disertai gangguan penglihatan maupun kelemahan tubuh, segera cari pertolongan medis."
        ]
    },

    fever: {
        title: "Demam",
        advice: [
            "Istirahat dan cukupi kebutuhan cairan.",
            "Pantau suhu tubuh menggunakan termometer.",
            "Gunakan pakaian yang nyaman.",
            "Jika demam menetap, memburuk, atau disertai tanda bahaya, periksakan diri ke dokter."
        ]
    },

    cough: {
        title: "Batuk atau Pilek",
        advice: [
            "Istirahat dengan cukup.",
            "Minum cairan secara teratur.",
            "Hindari asap rokok dan debu.",
            "Jika mengalami sesak napas atau kondisi semakin buruk, segera cari pertolongan medis."
        ]
    },

    stomach: {
        title: "Sakit Perut",
        advice: [
            "Perhatikan makanan dan minuman yang dikonsumsi.",
            "Istirahat dan cukup minum.",
            "Catat lokasi dan waktu munculnya nyeri.",
            "Jika nyeri berat, muntah terus-menerus, atau terdapat darah dalam tinja, segera periksa."
        ]
    },

    dizzy: {
        title: "Pusing",
        advice: [
            "Duduk atau berbaring di tempat aman.",
            "Hindari mengemudi atau aktivitas berisiko saat pusing.",
            "Minum air jika mampu.",
            "Jika pusing disertai pingsan, kelemahan anggota tubuh, atau kesulitan bicara, segera cari bantuan medis."
        ]
    },

    fatigue: {
        title: "Badan Lemas",
        advice: [
            "Berikan waktu tubuh untuk beristirahat.",
            "Makan secara teratur.",
            "Cukupi kebutuhan cairan.",
            "Jika lemas berlanjut atau semakin berat, periksakan diri ke tenaga kesehatan."
        ]
    },

    other: {
        title: "Keluhan Kesehatan Lainnya",
        advice: [
            "Catat gejala yang dirasakan.",
            "Perhatikan kapan keluhan mulai muncul.",
            "Hindari aktivitas yang memperburuk keadaan.",
            "Konsultasikan keluhan kepada tenaga kesehatan untuk penilaian lebih lanjut."
        ]
    }
};

function checkGeneral() {

    const name = $("patientName").value.trim();
    const symptom = $("symptom").value;
    const duration = $("duration").value;
    const severity = $("severity").value;
    const additional = $("otherSymptoms").value.trim();

    if (!name || !symptom || !duration || !severity) {
        alert("Mohon lengkapi seluruh data pemeriksaan.");
        return;
    }

    const selected = symptomData[symptom];

    let messages = [
        `Halo ${name}, berikut informasi mengenai keluhan ${selected.title.toLowerCase()}.`,
        ...selected.advice,
        `Durasi keluhan yang dilaporkan: ${duration}.`
    ];

    if (additional) {
        messages.push("Gejala tambahan: " + additional);
    }

    let label = "INFORMASI KESEHATAN";
    let urgent = false;

    if (severity === "mild") {
        label = "KELUHAN DILAPORKAN RINGAN";
        messages.push(
            "Pantau kondisi tubuh dan periksakan diri jika tidak membaik."
        );
    }

    if (severity === "moderate") {
        label = "PERLU DIPERHATIKAN";
        messages.push(
            "Sebaiknya mintalah bantuan orang dewasa dan pertimbangkan pemeriksaan langsung oleh dokter."
        );
    }

    if (severity === "severe") {
        label = "PERLU PENILAIAN MEDIS SEGERA";
        urgent = true;
        messages.push(
            "Jangan mengandalkan perawatan mandiri saja. Segera minta bantuan orang dewasa dan datangi fasilitas kesehatan. Jika mengalami gejala darurat, pergi ke IGD."
        );
    }

    messages.push(
        "Hasil ini bukan diagnosis dan tidak menentukan penyebab penyakit."
    );

    showResult(
        "generalResult",
        selected.title,
        label,
        messages,
        urgent
    );

    addExamination("Dokter Umum", selected.title);
}

// ==========================================
// PSIKOLOGI
// ==========================================

const emotionData = {

    happy: "Kamu melaporkan perasaan bahagia. Nikmati hal-hal positif dan tetap berikan perhatian pada kebutuhan dirimu.",

    calm: "Perasaan tenang dapat menjadi kesempatan untuk mengenali tujuan dan kebutuhan pribadi.",

    sad: "Tidak apa-apa jika sedang merasa sedih. Berikan dirimu waktu dan cobalah berbicara dengan orang yang kamu percaya.",

    anxious: "Saat merasa cemas, cobalah berhenti sejenak, bernapas perlahan, dan fokus pada hal yang bisa dilakukan saat ini.",

    angry: "Ketika marah, ambil jeda sebelum merespons sesuatu. Cobalah mengenali situasi yang memicu perasaan tersebut.",

    tired: "Kelelahan emosional dapat membuat aktivitas terasa berat. Berikan waktu untuk beristirahat dan mencari dukungan."
};

function checkPsychology() {

    const emotion = $("emotion").value;
    const sleep = $("sleep").value;
    const stress = $("stress").value;
    const thoughts = $("thoughts").value.trim();

    if (!emotion || !sleep || !stress) {
        alert("Lengkapi formulir refleksi emosional terlebih dahulu.");
        return;
    }

    let messages = [emotionData[emotion]];

    if (sleep === "good") {
        messages.push(
            "Kamu melaporkan tidur yang nyenyak. Pertahankan kebiasaan istirahat yang nyaman."
        );
    }

    if (sleep === "average") {
        messages.push(
            "Perhatikan kembali jadwal tidur dan usahakan memiliki waktu istirahat yang cukup."
        );
    }

    if (sleep === "poor") {
        messages.push(
            "Jika kesulitan tidur terus berlangsung, pertimbangkan berkonsultasi dengan tenaga profesional."
        );
    }

    if (stress === "no") {
        messages.push(
            "Tetap luangkan waktu untuk kegiatan yang membuatmu nyaman."
        );
    }

    if (stress === "sometimes") {
        messages.push(
            "Kenali situasi yang membuatmu terbebani dan cari cara sehat untuk menghadapinya."
        );
    }

    if (stress === "often") {
        messages.push(
            "Jika tekanan sering dirasakan, cobalah berbicara kepada orang tepercaya atau psikolog."
        );
    }

    if (thoughts) {
        messages.push(
            "Kamu sudah menuliskan hal yang sedang dipikirkan. Kamu bisa menyimpannya dalam diary untuk refleksi pribadi."
        );
    }

    messages.push(
        "Refleksi ini bukan diagnosis, bukan tes psikologi klinis, dan bukan pengganti konsultasi profesional."
    );

    showResult(
        "psychologyResult",
        "Emotional Wellness Reflection",
        "REFLEKSI PERASAAN",
        messages
    );

    addExamination(
        "Psikologi",
        "Refleksi kondisi emosional"
    );
}

// ==========================================
// PEMERIKSAAN HARIAN
// ==========================================

function dailyCheckup() {

    const body = $("bodyCondition").value;
    const mood = $("dailyMood").value;
    const sleep = $("dailySleep").value;
    const food = $("dailyFood").value;
    const water = $("dailyWater").value;

    if (!body || !mood || !sleep || !food || !water) {
        alert("Mohon lengkapi semua bagian pemeriksaan harian.");
        return;
    }

    let messages = [];

    const bodyMessages = {
        fit: "Kamu melaporkan kondisi tubuh yang bugar. Pertahankan kebiasaan sehat.",
        normal: "Perhatikan kebutuhan tubuh dan jaga pola hidup seimbang.",
        tired: "Kamu merasa lelah. Berikan tubuh waktu untuk beristirahat.",
        unwell: "Kamu sedang merasa kurang sehat. Perhatikan gejala dan mintalah bantuan jika diperlukan."
    };

    messages.push(bodyMessages[body]);
    messages.push("Suasana hati hari ini: " + mood + ".");

    messages.push(
        sleep === "Nyenyak"
            ? "Kamu melaporkan tidur yang nyenyak."
            : "Perhatikan kualitas tidur dan usahakan jadwal tidur yang teratur."
    );

    messages.push(
        food === "Sudah"
            ? "Kamu sudah makan. Pertahankan kebiasaan makan teratur."
            : "Usahakan tidak melewatkan waktu makan."
    );

    messages.push(
        water === "Sudah"
            ? "Kamu sudah memperhatikan kebutuhan cairan."
            : "Cobalah minum air secara bertahap sepanjang hari."
    );

    messages.push(
        "Ini merupakan catatan kebiasaan harian, bukan pemeriksaan medis atau diagnosis."
    );

    showResult(
        "dailyResult",
        "Daily Health Summary",
        "LAPORAN KESEHATAN HARIAN",
        messages
    );

    addExamination(
        "Pemeriksaan Harian",
        "Catatan kondisi tubuh, suasana hati, tidur, makan, dan minum."
    );
}

// ==========================================
// INFORMASI OBAT
// ==========================================

const medicineData = {

    paracetamol: {
        title: "Paracetamol",
        category: "Pereda nyeri dan demam",
        description: "Digunakan untuk meredakan nyeri dan menurunkan demam.",
        use: "Ikuti petunjuk kemasan atau arahan dokter dan apoteker. Pastikan tidak mengonsumsi beberapa produk dengan kandungan paracetamol secara bersamaan tanpa arahan profesional.",
        warning: "Penggunaan berlebihan dapat menyebabkan kerusakan hati."
    },

    oralit: {
        title: "Oralit",
        category: "Larutan rehidrasi oral",
        description: "Membantu mengganti cairan dan elektrolit yang hilang akibat diare.",
        use: "Larutkan sesuai petunjuk kemasan menggunakan jumlah air yang telah ditentukan.",
        warning: "Segera periksa jika diare disertai darah, dehidrasi, atau muntah terus-menerus."
    },

    antasida: {
        title: "Antasida",
        category: "Obat penetral asam lambung",
        description: "Membantu menetralkan asam lambung pada keluhan tertentu.",
        use: "Ikuti petunjuk produk dan tanyakan kepada apoteker mengenai waktu penggunaan serta interaksi dengan obat lain.",
        warning: "Tidak semua sakit perut disebabkan oleh asam lambung."
    },

    batuk: {
        title: "Obat Batuk",
        category: "Informasi obat batuk",
        description: "Obat batuk memiliki jenis berbeda berdasarkan batuk kering atau berdahak.",
        use: "Pemilihan obat sebaiknya dibantu dokter atau apoteker berdasarkan usia dan kondisi pengguna.",
        warning: "Periksa kandungan obat agar tidak menggabungkan bahan aktif yang sama."
    }
};

function medicineDetail(id) {

    const medicine = medicineData[id];

    if (!medicine) return;

    const box = $("medicineResult");

    box.classList.remove("hidden", "urgent");

    box.innerHTML = `
        <span class="result-label">MEDICINE INFORMATION</span>

        <h3>${escapeHTML(medicine.title)}</h3>

        <p><b>Kategori:</b> ${escapeHTML(medicine.category)}</p>

        <p><b>Kegunaan:</b> ${escapeHTML(medicine.description)}</p>

        <p><b>Petunjuk:</b> ${escapeHTML(medicine.use)}</p>

        <p><b>Perhatian:</b> ${escapeHTML(medicine.warning)}</p>

        <p>Informasi ini bersifat edukatif. Konsultasikan penggunaan obat kepada dokter atau apoteker.</p>
    `;

    box.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

function searchMedicine() {

    const keyword = $("medicineSearch").value
        .toLowerCase()
        .trim();

    document.querySelectorAll(".medicine-card").forEach(card => {

        const content = card.dataset.search.toLowerCase();

        card.style.display =
            content.includes(keyword) ? "" : "none";
    });
}

// ==========================================
// DIARY PASIEN
// ==========================================

function saveDiary() {

    const title = $("diaryTitle").value.trim();
    const date = $("diaryDate").value;
    const mood = $("diaryMood").value;
    const content = $("diaryContent").value.trim();

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

    if (!saveData("berryDiaries", updated)) {
        return;
    }

    diaries = updated;

    $("diaryTitle").value = "";
    $("diaryContent").value = "";

    renderDiaries();
    updateDashboard();

    alert("Diary berhasil disimpan 🌸");
}

function renderDiaries() {

    const list = $("diaryList");

    if (!diaries.length) {
        list.innerHTML = `
            <div class="info-panel">
                <h3>🌸 Belum ada diary</h3>
                <p>Catatan pribadimu akan tampil di sini setelah disimpan.</p>
            </div>
        `;
        return;
    }

    list.innerHTML = diaries.map(item => `
        <article class="history-item">

            <h3>${escapeHTML(item.title)}</h3>

            <small>
                ${escapeHTML(item.date)} ·
                ${escapeHTML(item.mood)}
            </small>

            <p>${escapeHTML(item.content).replace(/\n/g, "<br>")}</p>

            <button class="delete-btn" data-delete="${Number(item.id)}">
                <i class="fa-solid fa-trash"></i>
                Hapus Catatan
            </button>

        </article>
    `).join("");
}

function deleteDiary(id) {

    if (!confirm("Yakin ingin menghapus catatan diary ini?")) {
        return;
    }

    const updated = diaries.filter(item => item.id !== id);

    if (!saveData("berryDiaries", updated)) {
        return;
    }

    diaries = updated;

    renderDiaries();
    updateDashboard();
}

// ==========================================
// EVENT LISTENERS
// ==========================================

// INTRO BUTTON

$("enterButton").addEventListener("click", enterClinic);

// NAVIGATION BUTTONS

document.querySelectorAll("[data-page]").forEach(button => {

    button.addEventListener("click", () => {
        navigate(button.dataset.page);
    });

});

// DASHBOARD SERVICE CARDS AND SHORTCUTS

document.querySelectorAll("[data-go]").forEach(button => {

    button.addEventListener("click", () => {
        navigate(button.dataset.go);
    });

});

// MEDICAL BUTTONS

$("generalButton").addEventListener("click", checkGeneral);

$("psychologyButton").addEventListener("click", checkPsychology);

$("dailyButton").addEventListener("click", dailyCheckup);

// PHARMACY

$("medicineSearch").addEventListener("input", searchMedicine);

$("medicineGrid").addEventListener("click", event => {

    const button = event.target.closest("[data-medicine]");

    if (!button) return;

    medicineDetail(button.dataset.medicine);
});

// DIARY

$("saveDiaryButton").addEventListener("click", saveDiary);

$("diaryList").addEventListener("click", event => {

    const button = event.target.closest("[data-delete]");

    if (!button) return;

    deleteDiary(Number(button.dataset.delete));
});

// ==========================================
// INITIALIZE
// ==========================================

function initializeClinic() {

    const today = new Date();

    $("todayDate").textContent =
        today.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    $("diaryDate").value =
        today.toLocaleDateString("en-CA");

    renderDiaries();
    renderHistory();
    updateDashboard();

}

initializeClinic();
