const tg = window.Telegram.WebApp;
tg.expand(); // تمديد التطبيق ليملأ الشاشة

const guildsData = [
    { name: "نقابة اكليبس", img: "https://via.placeholder.com/60", desc: "تفاعل اسطوري ونظام جوائز." },
    { name: "نقابة الظلال", img: "https://via.placeholder.com/60", desc: "وصف النقابة الثانية هنا." }
];

function showSection(id) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.add('hidden'));
    if(id === 'guilds') {
        document.getElementById('guilds-section').classList.remove('hidden');
    } else {
        document.getElementById('other-content').classList.remove('hidden');
        document.getElementById('section-title').innerText = "قسم " + id.toUpperCase();
    }
}

function toggleGuildsGrid() {
    const grid = document.getElementById('guilds-grid');
    if (grid.style.display === "grid") {
        grid.style.display = "none";
    } else {
        grid.style.display = "grid";
        renderGuilds();
    }
}

function renderGuilds() {
    const container = document.getElementById('guilds-grid');
    container.innerHTML = guildsData.map(g => `
        <div class="guild-card">
            <img src="${g.img}" class="guild-pic">
            <br>
            <button class="loyalty-btn" onclick="handleLoyalty()">Loyalty</button>
            <p style="font-size: 11px;">${g.desc}</p>
        </div>
    `).join('');
}

// أمر الولاء (لا يتم تعديله إلا بطلبك)
function handleLoyalty() {
    tg.showAlert("تم تسجيل الولاء لنقابة اكليبس! ⏣");
}

function openEditMenu() {
    alert("واجهة تعديل النقابات قيد التطوير...");
}
