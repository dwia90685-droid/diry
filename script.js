
function enterApp() {
    document.getElementById("intro").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
}

function showPage(page, button) {
    document.querySelectorAll(".page").forEach(section => {
        section.classList.add("hidden");
    });

    document.getElementById(page).classList.remove("hidden");

    document.querySelectorAll(".nav").forEach(nav => {
        nav.classList.remove("active");
    });

    if (button) button.classList.add("active");

    window.scrollTo({top: 0, behavior: "smooth"});
}

// DIARY

let diaries = JSON.parse(localStorage.getItem("berryDiaries")) || [];

document.getElementById("diaryDate").value =
    new Date().toISOString().split("T")[0];

function saveDiary() {
    let title = document.getElementById("diaryTitle").value.trim();
    let mood = document.getElementById("mood").value;
    let date = document.getElementById("diaryDate").value;
    let content = document.getElementById("diaryContent").value.trim();

    if (!title || !content || !date) {
        alert("Lengkapi judul, tanggal, dan cerita diary terlebih dahulu!");
        return;
    }

    diaries.unshift({
        id: Date.now(),
        title,
        mood,
        date,
        content
    });

    localStorage.setItem("berryDiaries", JSON.stringify(diaries));

    document.getElementById("diaryTitle").value = "";
    document.getElementById("diaryContent").value = "";

    renderDiaries();
    alert("Diary berhasil disimpan 🌸");
}

function renderDiaries() {
    let list = document.getElementById("diaryList");

    document.getElementById("totalDiary").textContent = diaries.length;

    if (diaries.length === 0) {
        list.innerHTML = "<p>Belum ada cerita. Mulai tulis diary pertamamu 🌷</p>";
        return;
    }

    list.innerHTML = diaries.map(item => `
        <div class="diary-item">
            <h3>${escapeHTML(item.title)}</h3>
            <small>${escapeHTML(item.date)} · ${escapeHTML(item.mood)}</small>
            <p>${escapeHTML(item.content).replace(/\n/g, "<br>")}</p>
            <button class="delete-btn" onclick="deleteDiary(${item.id})">Hapus</button>
        </div>
    `).join("");
}

function deleteDiary(id) {
    if (!confirm("Hapus catatan diary ini?")) return;

    diaries = diaries.filter(item => item.id !== id);

    localStorage.setItem("berryDiaries", JSON.stringify(diaries));
    renderDiaries();
}

// HEALTH NOTES

let healthNotes = JSON.parse(localStorage.getItem("berryHealth")) || [];

function saveHealth() {
    let title = document.getElementById("healthTitle").value.trim();
    let content = document.getElementById("healthContent").value.trim();

    if (!title || !content) {
        alert("Isi judul dan catatan terlebih dahulu!");
        return;
    }

    healthNotes.unshift({
        id: Date.now(),
        title,
        content,
        date: new Date().toLocaleDateString("id-ID")
    });

    localStorage.setItem("berryHealth", JSON.stringify(healthNotes));

    document.getElementById("healthTitle").value = "";
    document.getElementById("healthContent").value = "";

    renderHealth();
    alert("Catatan kesehatan berhasil disimpan 🌿");
}

function renderHealth() {
    document.getElementById("healthList").innerHTML =
        healthNotes.map(item => `
            <div class="diary-item">
                <h3>${escapeHTML(item.title)}</h3>
                <small>${escapeHTML(item.date)}</small>
                <p>${escapeHTML(item.content).replace(/\n/g, "<br>")}</p>
                <button class="delete-btn" onclick="deleteHealth(${item.id})">Hapus</button>
            </div>
        `).join("");
}

function deleteHealth(id) {
    if (!confirm("Hapus catatan ini?")) return;

    healthNotes = healthNotes.filter(item => item.id !== id);

    localStorage.setItem("berryHealth", JSON.stringify(healthNotes));
    renderHealth();
}

// SAFE DISPLAY

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

renderDiaries();
renderHealth();
