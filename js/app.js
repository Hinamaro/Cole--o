let container;

document.addEventListener("DOMContentLoaded", async () => {

    container = document.getElementById("collections");

    initSettings();

    try {

        const collections = await getCollections();

        renderCollections(collections);
        await renderHeroStats();
        updateProfileUI();

    } catch (err) {

        console.error(err);

        container.innerHTML = `
            <p class="error">
                Não foi possível carregar as coleções.
            </p>
        `;

    }

});

function initSettings() {

    const settingsBtn =
        document.getElementById("settings-btn");

    settingsBtn?.addEventListener("click", openSettings);

    document
        .getElementById("settings-cancel")
        ?.addEventListener("click", closeSettings);

    document
        .getElementById("settings-save")
        ?.addEventListener("click", () => {

            const value =
                document
                .getElementById("profile-name-input")
                .value;

            setProfileName(value);

            closeSettings();

        });

}

function renderCollections(collections) {

    container.innerHTML = "";

    collections.forEach(collection => {

        container.appendChild(createCard(collection));

    });

    

}

requestAnimationFrame(() => {

    document.querySelectorAll(".progress-fill").forEach(bar => {

        bar.style.width = `${bar.dataset.progress}%`;

    });

});

function createCard(collection) {

    const userData = getUserData();

    const owned = Object.values(userData[collection.id] || {})
        .filter(v => v).length;

    const percent = Math.round((owned / collection.volumes) * 100);

    const card = document.createElement("div");

    card.className = "collection-card";
    card.style.setProperty(
    "--collection-color",
    collection.color
);

    card.innerHTML = `

    <div class="banner-wrapper">

        <img
            class="collection-banner"
            src="${collection.images.card}"
        >

        <div class="banner-shine"></div>

    </div>

    <div class="collection-info">

        <h2>${collection.nome}</h2>

        <span class="status-badge">
            ● ${collection.status}
        </span>

        <span>

            📚 ${owned} de ${collection.volumes} volumes

        </span>

        <small>

            ✨ ${percent}% concluído

        </small>

        <div class="progress">

            <div
                class="progress-fill"
                data-progress="${percent}"
                style="width:${percent}%"
            ></div>

        </div>

        <button class="open-btn">

            📖 Abrir coleção →

        </button>

    </div>

`;

card.addEventListener("mousemove", e => {

    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateY =
        (x / rect.width - .5) * 10;

    const rotateX =
        (rect.height / 2 - y) / 8;

    card.style.transform = `
        perspective(900px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-8px)
    `;

});

card.addEventListener("mouseleave", () => {

    card.style.transform = "";

});

    card.onclick = () => {

        window.location.href =
            `collection.html?id=${collection.id}`;

    };

    return card;

}


async function renderHeroStats(){

    const hero =
        document.getElementById("hero-stats");

    const stats =
        await calculateLibraryStats();

    hero.innerHTML = `

<div class="stat-card">

<div class="stat-title">
📚 Coleções
</div>

<div class="stat-value">
${stats.collections}
</div>

</div>

<div class="stat-card">

<div class="stat-title">
📖 Volumes
</div>

<div class="stat-value">
${stats.totalVolumes}
</div>

</div>

<div class="stat-card">

<div class="stat-title">
⭐ Na Estante
</div>

<div class="stat-value">
${stats.owned}
</div>

</div>

<div class="stat-card">

<div class="stat-title">
📈 Biblioteca
</div>

<div class="stat-value">
${stats.percentage}%
</div>

</div>

<div class="stat-card">

<div class="stat-title">
🏆 Mais avançada
</div>

<div class="stat-value">
${stats.bestCollection}
</div>

</div>

<div class="stat-card">

<div class="stat-title">
🛒 Próxima compra
</div>

<div class="stat-value">

${
stats.nextCollection
?
`${stats.nextCollection} Vol. ${stats.nextVolume}`
:
"Tudo completo 🎉"
}

</div>

</div>

`;

}