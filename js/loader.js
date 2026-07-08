window.addEventListener("load", () => {

    const loader = document.getElementById("loader");

    if (!loader) return;

    setTimeout(() => {

        loader.classList.add("hide");

        setTimeout(() => {

            loader.remove();

        }, 900);

    }, 3200);

});