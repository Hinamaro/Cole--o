const PROFILE_KEY = "profile";

const TITLES = [

    { level: 1, title: "Visitante" },

    { level: 2, title: "Aprendiz" },

    { level: 3, title: "Bibliotecário" },

    { level: 5, title: "Arquivista" },

    { level: 8, title: "Curador" },

    { level: 12, title: "Guardião de Plêiades" },

    { level: 20, title: "Lorde da Biblioteca" }

];

function createProfile() {

    return {

        name: "Colecionador",

        xp: 0,

        level: 1,

        title: "Visitante",

        achievements: []

    };

}

function getProfile() {

    const saved = localStorage.getItem(PROFILE_KEY);

    let profile;

    if (!saved) {

        profile = createProfile();

    } else {

        profile = JSON.parse(saved);

    }

    // Garante campos novos em perfis antigos
    if (!profile.level) profile.level = 1;
    if (!profile.xp) profile.xp = 0;
    if(!profile.achievements)
    profile.achievements = [];
    if (!profile.name) profile.name = "Colecionador";

    // Corrige perfis antigos
    while (profile.xp >= xpToNextLevel(profile.level)) {

        profile.xp -= xpToNextLevel(profile.level);
        profile.level++;

    }

    profile.title = getTitle(profile.level);

    saveProfile(profile);

    return profile;

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

function getTitle(level){

    let current = TITLES[0].title;

    TITLES.forEach(rank=>{

        if(level >= rank.level){

            current = rank.title;

        }

    });

    return current;

}

function addXP(amount){

    const profile = getProfile();

    profile.xp += amount;

    while(profile.xp >= xpToNextLevel(profile.level)){

        profile.xp -= xpToNextLevel(profile.level);

        profile.level++;

    }

    profile.title = getTitle(profile.level);

    saveProfile(profile);

    updateProfileUI();

}

function xpToNextLevel(level){

    return level * 150;

}

async function updateProfileUI(){

    const profile = getProfile();

    const avatar =
        document.getElementById("profile-avatar");

    if(avatar){

        avatar.className = "avatar";

        if(profile.level >= 50){

            avatar.classList.add("level50");

        }

        else if(profile.level >= 20){

            avatar.classList.add("level20");

        }

        else if(profile.level >= 10){

            avatar.classList.add("level10");

        }

        else if(profile.level >= 5){

            avatar.classList.add("level5");

        }

        else{

            avatar.classList.add("level1");

        }

    }


    const stats =
        await calculateLibraryStats();


    const name = document.getElementById("profile-name");

    if(name){
        name.textContent = profile.name;
    }

    const title = document.getElementById("profile-title");

    if(title){
        title.textContent = profile.title;
    }

    const level = document.getElementById("profile-level");

    if(level){
        level.textContent = `Nível ${profile.level}`;
    }

    const fill = document.getElementById("xp-fill");
    const text = document.getElementById("xp-text");

    const required = xpToNextLevel(profile.level);

    const current = profile.xp;

    const percent = Math.min(
        (current / required) * 100,
        100
    );

    if(fill){
        fill.style.width = percent + "%";
    }

    if(text){
        text.textContent = `${current} / ${required} XP`;
    }

    // ===== Estatísticas do perfil =====

    const collections =
        document.getElementById("profile-collections");

    const volumes =
        document.getElementById("profile-volumes");

    const achievements =
        document.getElementById("profile-achievements");

    if(collections){
        collections.textContent = stats.collections;
    }

    if(volumes){
        volumes.textContent = stats.owned;
    }

    if(achievements){
        achievements.textContent =
            profile.achievements.length;
    }

}

function setProfileName(name){

    const profile = getProfile();

    profile.name = name.trim() || "Colecionador";

    saveProfile(profile);

    updateProfileUI();

}


function openSettings(){

    const modal =
        document.getElementById("settings-modal");

    if(!modal) return;

    document.getElementById(
        "profile-name-input"
    ).value = getProfile().name;

    modal.classList.remove("hidden");

}

function closeSettings(){

    document
        .getElementById("settings-modal")
        .classList.add("hidden");

}

window.xpToNextLevel = xpToNextLevel;

window.openSettings = openSettings;
window.closeSettings = closeSettings;

window.setProfileName = setProfileName;

window.updateProfileUI = updateProfileUI;
window.getProfile = getProfile;
window.saveProfile = saveProfile;
window.addXP = addXP;