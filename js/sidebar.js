document.addEventListener("DOMContentLoaded",()=>{

    const sidebar=document.getElementById("sidebar");

    const toggle=document.getElementById("menu-toggle");

    toggle.onclick=()=>{

        sidebar.classList.toggle("open");

    };

});