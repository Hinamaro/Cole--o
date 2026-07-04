let container;

document.addEventListener("DOMContentLoaded", async () => {

    container = document.getElementById("collections");

    try {

        const collections = await getCollections();

        renderCollections(collections);


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

    card.innerHTML = `

        <img class="collection-banner" src="${collection.images.card}">


        <div class="collection-info">

            <h2>${collection.nome}</h2>

            <p>${collection.status}</p>

            <span>${owned} / ${collection.volumes} volumes</span>

            <div class="progress">

                <div
                    class="progress-fill"
                    style="width:${percent}%"
                ></div>

            </div>

        </div>

    `;

    card.onclick = () => {

        window.location.href =
            `collection.html?id=${collection.id}`;

    };

    return card;

}
