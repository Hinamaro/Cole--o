const PROFILE_KEY = "profile";

const TITLES = [
    { xp: 0, title: "Visitante" },
    { xp: 100, title: "Aprendiz" },
    { xp: 300, title: "Bibliotecário" },
    { xp: 700, title: "Arquivista" },
    { xp: 1200, title: "Curador" },
    { xp: 2500, title: "Guardião de Plêiades" },
    { xp: 5000, title: "Lorde da Biblioteca" }
];

function createProfile() {

    return {

        xp: 0,

        level: 1,

        title: "Visitante",

        achievements: []

    };

}

function getProfile() {

    const saved = localStorage.getItem(PROFILE_KEY);

    if (!saved) {

        const profile = createProfile();

        saveProfile(profile);
        updateProfileUI();

        return profile;

    }

    return JSON.parse(saved);

}

function saveProfile(profile) {

    localStorage.setItem(

        PROFILE_KEY,

        JSON.stringify(profile)

    );

}

function getLevel(xp) {

    return Math.floor(xp / 100) + 1;

}

function getTitle(xp) {

    let current = TITLES[0].title;

    TITLES.forEach(rank => {

        if (xp >= rank.xp) {

            current = rank.title;

        }

    });

    return current;

}

function addXP(amount) {

    const profile = getProfile();

    profile.xp += amount;

    profile.level = getLevel(profile.xp);

    profile.title = getTitle(profile.xp);

    saveProfile(profile);

    return profile;

}

function updateProfileUI(){

    const profile = getProfile();

    const title =
        document.getElementById("profile-title");

    const fill =
        document.getElementById("xp-fill");

    const text =
        document.getElementById("xp-text");

    if(!title) return;

    title.textContent = profile.title;

    const currentXP =
        profile.xp % 100;

    fill.style.width = currentXP + "%";

    text.textContent =
        `${currentXP} / 100 XP`;

}

window.updateProfileUI = updateProfileUI;
window.getProfile = getProfile;
window.saveProfile = saveProfile;
window.addXP = addXP;