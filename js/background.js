const STAR_COUNT = 260;

const starsContainer = document.createElement("div");

starsContainer.id = "stars";

document.body.appendChild(starsContainer);

const nebula1 = document.createElement("div");
nebula1.className = "nebula one";

const nebula2 = document.createElement("div");
nebula2.className = "nebula two";

const nebula3 = document.createElement("div");
nebula3.className = "nebula three";

document.body.appendChild(nebula1);
document.body.appendChild(nebula2);
document.body.appendChild(nebula3);

for (let i = 0; i < STAR_COUNT; i++) {

    const star = document.createElement("span");

    const size = Math.random()*4+.5;

    star.className = "star";

    star.style.width = size + "px";
    star.style.height = size + "px";

    star.style.left = Math.random() * 100 + "vw";
    star.style.top = Math.random() * 100 + "vh";

    star.style.animationDelay = Math.random() * 8 + "s";
    star.style.animationDuration = (3 + Math.random() * 6) + "s";

    star.style.opacity = 0.2 + Math.random() * 0.8;

    const colors = [

    "#ffffff",

    "#dbe7ff",

    "#fff8d8",

    "#b7d8ff"

];

star.style.background =
    colors[Math.floor(Math.random()*colors.length)];

    starsContainer.appendChild(star);

}

document.addEventListener("mousemove", e => {

    const x = (e.clientX / window.innerWidth - .5) * 30;
    const y = (e.clientY / window.innerHeight - .5) * 30;

    nebula1.style.transform =
        `translate(${x}px,${y}px)`;

    nebula2.style.transform =
        `translate(${-x}px,${-y}px)`;

    nebula3.style.transform =
        `translate(${x*.5}px,${-y*.5}px)`;

});