let container;

document.addEventListener("DOMContentLoaded", async () => {

    container = document.getElementById("collections");

    try {

        const collections = await getCollections();

        renderCollections(collections);
        renderHeroStats(collections);
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

function renderCollections(collections) {

    container.innerHTML = "";

    collections.forEach(collection => {

        container.appendChild(createCard(collection));

    });

    

}

setTimeout(() => {

    document.querySelectorAll(".progress-fill").forEach(bar => {

        bar.style.width = bar.dataset.progress + "%";

    });

},50);

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


function renderHeroStats(collections){

    const hero = document.getElementById("hero-stats");

    const userData = getUserData();

    let totalVolumes = 0;
    let ownedVolumes = 0;

    let bestCollection = null;
    let bestPercent = -1;

    let nextCollection = null;
    let nextVolume = null;

    collections.forEach(collection => {

        totalVolumes += collection.volumes;

        const owned = Object.values(
            userData[collection.id] || {}
        ).filter(Boolean).length;

        ownedVolumes += owned;

        const percent =
            Math.round((owned / collection.volumes) * 100);

        if(percent > bestPercent){

            bestPercent = percent;
            bestCollection = collection.nome;

        }

        if(nextCollection === null){

            const data =
                userData[collection.id] || {};

            for(let i=1;i<=collection.volumes;i++){

                if(!data[i]){

                    nextCollection = collection.nome;
                    nextVolume = i;
                    break;

                }

            }

        }

    });

    const completion =
        Math.round((ownedVolumes / totalVolumes) * 100);

    hero.innerHTML = `

<div class="stat-card">
<div class="stat-title">📚 Coleções</div>
<div class="stat-value">${collections.length}</div>
</div>

<div class="stat-card">
<div class="stat-title">📖 Volumes</div>
<div class="stat-value">${totalVolumes}</div>
</div>

<div class="stat-card">
<div class="stat-title">⭐ Na Estante</div>
<div class="stat-value">${ownedVolumes}</div>
</div>

<div class="stat-card">
<div class="stat-title">📈 Biblioteca</div>
<div class="stat-value">${completion}%</div>
</div>

<div class="stat-card">
<div class="stat-title">🏆 Mais avançada</div>
<div class="stat-value">${bestCollection}</div>
</div>

<div class="stat-card">
<div class="stat-title">🛒 Próxima compra</div>
<div class="stat-value">

${nextCollection
    ? `${nextCollection} Vol. ${nextVolume}`
    : "Tudo completo 🎉"}

</div>
</div>

`;

}