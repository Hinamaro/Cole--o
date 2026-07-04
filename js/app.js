const container = document.getElementById("collections");

document.addEventListener("DOMContentLoaded", async () => {

    const collections = await getCollections();

    renderCollections(collections);

});

function renderCollections(collections){

    container.innerHTML = "";

    collections.forEach(collection => {

        container.appendChild(createCard(collection));

    });

}

function createCard(collection) {

    const card = document.createElement("div");
    card.className = "collection-card";

    card.innerHTML = `
        <img
            class="collection-banner"
            src="${collection.banner}"
            alt="${collection.nome}"
        >

        <div class="collection-info">

            <h2>${collection.nome}</h2>

            <span>0 / ${collection.volumes} volumes</span>

            <div class="progress">
                <div class="progress-fill"></div>
            </div>

        </div>
    `;

    card.addEventListener("click", () => {
        window.location.href = `collection.html?id=${collection.id}`;
    });

    return card;
}
async function getCollections() {

    const res = await fetch("data/collections.json");

    return await res.json();

}


function calculateStats(collections, userData) {

    let totalVolumes = 0;
    let ownedVolumes = 0;

    collections.forEach(col => {

        totalVolumes += col.volumes;

        const data = userData[col.id] || {};

        ownedVolumes += Object.values(data).filter(v => v).length;

    });

    return {
        totalVolumes,
        ownedVolumes,
        percent: totalVolumes ? Math.round((ownedVolumes / totalVolumes) * 100) : 0
    };
}

function renderDashboard(stats) {

    const header = document.querySelector(".header");

    const dashboard = document.createElement("div");
    dashboard.className = "dashboard";

    dashboard.innerHTML = `
        <div class="stat">
            <h3>${stats.totalVolumes}</h3>
            <p>Total de volumes</p>
        </div>

        <div class="stat">
            <h3>${stats.ownedVolumes}</h3>
            <p>Possuídos</p>
        </div>

        <div class="stat">
            <h3>${stats.percent}%</h3>
            <p>Progresso geral</p>
        </div>
    `;

    header.appendChild(dashboard);
}
