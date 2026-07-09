// 1. pegar ID da URL
const params = new URLSearchParams(window.location.search);
const collectionId = params.get("id");
let currentFilter = "all";
let shelfMode = false;


// 2. inicialização
document.addEventListener("DOMContentLoaded", async () => {

    const collections = await getCollections();
    const collection = collections.find(c => c.id === collectionId);

    renderHeader(collection);
    renderVolumes(collection);

    document.getElementById("mark-all").addEventListener("click", () => {
    markAll(collection);
});
document.getElementById("unmark-all").addEventListener("click", () => {
    unmarkAll(collection);
});

const exportQrBtn = document.getElementById("export-qr-btn");

if (exportQrBtn) {
    exportQrBtn.addEventListener("click", exportQrCode);
}

const closeQr = document.getElementById("close-qr");

if (closeQr) {

    closeQr.addEventListener("click", () => {

        document
            .getElementById("qr-modal")
            .classList.add("hidden");

    });

}

const importQrBtn =
    document.getElementById("import-qr-btn");

if (importQrBtn) {

    importQrBtn.addEventListener(

        "click",

        startQrScanner

    );

}

const closeScanner =
    document.getElementById("close-scanner");

if (closeScanner) {

    closeScanner.addEventListener("click", () => {

        document
            .getElementById("scan-modal")
            .classList.add("hidden");

    });

}

document.querySelectorAll("[data-filter]").forEach(btn => {

    btn.addEventListener("click", () => {
        setFilter(btn.dataset.filter, collection);
    });
    

});

});

// 3. renderizar banner/topo
function renderHeader(collection) {

    const header = document.getElementById("collection-header");

    document.getElementById("toggle-shelf").addEventListener("click", () => {

    shelfMode = !shelfMode;

    document.body.classList.toggle("shelf-mode", shelfMode);

    renderVolumes(collection);

});

    const owned = calculateProgress(collection.id);
    const percent = Math.round((owned / collection.volumes) * 100) || 0;

    header.innerHTML = `
        <div class="hero">

            <img src="assets/banners/re-zero.webp" />

            <div class="overlay">

                <h1>${collection.nome}</h1>

                <p>${owned} / ${collection.volumes} volumes (${percent}%)</p>

                <div class="progress-bar">
                    <div class="progress-fill" style="width:${percent}%"></div>
                </div>

            </div>

        </div>
    `;
}

    function calculateProgress(collectionId) {

    const data = getUserData();
    const collection = data[collectionId] || {};

    return Object.values(collection).filter(v => v).length;

}

function renderVolumes(collection) {

    const container = document.getElementById("volumes");

    const userData = getUserData();
    const collectionData = userData[collection.id] || {};

    container.innerHTML = "";

    let nextFound = false;

    for (let i = 1; i <= collection.volumes; i++) {

        const isOwned = collectionData[i];

        // filtros
        if (currentFilter === "owned" && !isOwned) continue;
        if (currentFilter === "missing" && isOwned) continue;

        const card = document.createElement("div");
        card.className = shelfMode ? "volume-card shelf" : "volume-card";

        const imgPath = `assets/covers/${collection.id}/${String(i).padStart(3, "0")}.webp`;

        card.classList.add(isOwned ? "owned" : "missing");

        if (!isOwned && !nextFound) {
            card.classList.add("next");
            nextFound = true;
        }

        card.innerHTML = shelfMode ? `
            <img src="${imgPath}">
        ` : `
            <img src="${imgPath}">
            <span>Volume ${i}</span>
            <div class="${isOwned ? "owned" : "not-owned"}">
                ${isOwned ? "✔" : "✖"}
            </div>
        `;

        card.addEventListener("click", () => {

            card.classList.add("clicked");

            toggleVolume(collection.id, i);

            setTimeout(() => {
                renderVolumes(collection);
                renderHeader(collection);
            }, 120);

        });

        container.appendChild(card);
    }
}

function toggleVolume(collectionId, volume) {

    const data = getUserData();

    if (!data[collectionId]) {
        data[collectionId] = {};
    }

    data[collectionId][volume] = !data[collectionId][volume];

    saveUserData(data);
}

function markAll(collection) {

    const data = getUserData();

    if (!data[collection.id]) {
        data[collection.id] = {};
    }

    for (let i = 1; i <= collection.volumes; i++) {
        data[collection.id][i] = true;
    }

    saveUserData(data);

    renderVolumes(collection);
    renderHeader(collection);
}

function setFilter(filter, collection) {
    currentFilter = filter;
    renderVolumes(collection);
}

async function unmarkAll(collection) {

    const data = getUserData();

    if (!data[collection.id]) {
        data[collection.id] = {};
    }

    for (let i = 1; i <= collection.volumes; i++) {
        data[collection.id][i] = false;
    }

    saveUserData(data);

    checkAchievements();

    updateProfileUI();

    renderVolumes(collection);
    renderHeader(collection);
}

document.addEventListener("DOMContentLoaded", () => {

    const exportBtn = document.getElementById("export-btn");
    const importBtn = document.getElementById("import-btn");
    const importFile = document.getElementById("import-file");

    if (exportBtn) {
        exportBtn.addEventListener("click", exportData);
    }

    if (importBtn && importFile) {
        importBtn.addEventListener("click", () => {
            importFile.click();
        });
    }

    if (importFile) {
        importFile.addEventListener("change", (e) => {

            const file = e.target.files[0];

            if (file) importData(file);

        });
    }

});