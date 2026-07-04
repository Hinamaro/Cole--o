function getUserData() {
    return JSON.parse(localStorage.getItem("shelf")) || {};
}

function saveUserData(data) {
    localStorage.setItem("shelf", JSON.stringify(data));
}

function exportData() {

    const data = localStorage.getItem("shelf") || "{}";

    const blob = new Blob([data], { type: "application/json" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "shelf-backup.json";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
}

function importData(file) {

    const reader = new FileReader();

    reader.onload = (event) => {

        try {

            const data = JSON.parse(event.target.result);

            localStorage.setItem("shelf", JSON.stringify(data));

            alert("Biblioteca restaurada com sucesso!");

            location.reload();

        } catch (err) {
            alert("Arquivo inválido.");
        }

    };

    reader.readAsText(file);
}


window.getUserData = getUserData;
window.saveUserData = saveUserData;
window.exportData = exportData;
window.importData = importData;