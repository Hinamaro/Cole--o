const ACHIEVEMENTS = [

{

id:"first-volume",

icon:"📖",

title:"Primeiro Volume",

description:"Marque seu primeiro volume.",

check(stats){

return stats.owned >= 1;

}

},

{

id:"ten-volumes",

icon:"📚",

title:"Colecionador",

description:"Possua 10 volumes.",

check(stats){

return stats.owned >= 10;

}

},

{

id:"fifty-volumes",

icon:"📚",

title:"Biblioteca Crescente",

description:"Possua 50 volumes.",

check(stats){

return stats.owned >= 50;

}

},

{

id:"hundred-volumes",

icon:"🏛️",

title:"Arquivista",

description:"Possua 100 volumes.",

check(stats){

return stats.owned >= 100;

}

},

{

id:"first-complete",

icon:"🏆",

title:"Coleção Completa",

description:"Complete sua primeira coleção.",

check(stats){

return stats.completed >= 1;

}

}

];


function unlockAchievement(id){

    const profile = getProfile();

    if(profile.achievements.includes(id))
        return;

    profile.achievements.push(id);

    saveProfile(profile);

    addXP(50);

    showAchievement(id);

}


function showAchievement(id){

    const achievement =
        ACHIEVEMENTS.find(a => a.id === id);

    if(!achievement) return;

    const toast =
        document.getElementById("achievement-toast");

    toast.querySelector(".achievement-icon")
        .textContent = achievement.icon;

    toast.querySelector("h3")
        .textContent = achievement.title;

    toast.querySelector("p")
        .textContent = achievement.description;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },4500);

}

async function checkAchievements(){

    const stats =
        await calculateLibraryStats();

    ACHIEVEMENTS.forEach(achievement=>{

        if(achievement.check(stats)){

            unlockAchievement(achievement.id);

        }

    });

}

window.checkAchievements = checkAchievements;