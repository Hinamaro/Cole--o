function getUserData() {
    return JSON.parse(localStorage.getItem("shelf")) || {};
}

function saveUserData(data) {
    localStorage.setItem("shelf", JSON.stringify(data));
}

function exportData() {

    const library = getUserData();

    const totalCollections = Object.keys(library).length;

    let ownedVolumes = 0;

    Object.values(library).forEach(collection => {

        ownedVolumes += Object.values(collection)
            .filter(v => v).length;

    });

    const backup = {

        app: "Biblioteca de Plêiades",

        version: 1,

        createdAt: new Date().toISOString(),

        stats: {

            collections: totalCollections,

            ownedVolumes: ownedVolumes

        },

        library: library

    };

    const json = JSON.stringify(backup, null, 4);

    const blob = new Blob([json], {
        type: "application/json"
    });

    const url = URL.createObjectURL(blob);

    const now = new Date();

    const fileName =
        `Biblioteca-de-Pleiades_${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}_${String(now.getHours()).padStart(2,"0")}-${String(now.getMinutes()).padStart(2,"0")}.json`;

    const a = document.createElement("a");

    a.href = url;
    a.download = fileName;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);

}

async function importData(file) {

    const reader = new FileReader();

    reader.onload = async (event) => {

        try{

            const backup = JSON.parse(event.target.result);

            let library;

            let html;

            if(!backup.version){

                library = backup;

                const collections = Object.keys(library).length;

                let volumes = 0;

                Object.values(library).forEach(col=>{

                    volumes += Object.values(col)
                    .filter(v=>v).length;

                });

                html = `
                    <p><strong>Tipo:</strong> Backup antigo</p>

                    <p><strong>Coleções:</strong> ${collections}</p>

                    <p><strong>Volumes:</strong> ${volumes}</p>

                    <br>

                    <p>Esta ação substituirá sua biblioteca atual.</p>
                `;

            }else{

                library = backup.library;

                html = `
                    <p><strong>Data:</strong><br>${new Date(backup.createdAt).toLocaleString("pt-BR")}</p>

                    <p><strong>Coleções:</strong> ${backup.stats.collections}</p>

                    <p><strong>Volumes:</strong> ${backup.stats.ownedVolumes}</p>

                    <p><strong>Versão:</strong> ${backup.version}</p>

                    <br>

                    <p>Esta ação substituirá sua biblioteca atual.</p>
                `;

            }

            const ok = await showModal(

                "📚 Restaurar Biblioteca",

                html

            );

            if(!ok) return;

            saveUserData(library);

            location.reload();

        }

        catch(err){

    console.error(err);

    alert(err.message);

}

    };

    reader.readAsText(file);

}


function showModal(title, html) {

    return new Promise(resolve => {

        const modal = document.getElementById("modal");

if (!modal) {

    throw new Error(
        "O modal de restauração não foi encontrado na página."
    );

}

        document.getElementById("modal-title").innerHTML = title;
        document.getElementById("modal-body").innerHTML = html;

        modal.classList.remove("hidden");

        document.getElementById("modal-confirm").onclick = () => {

            modal.classList.add("hidden");

            resolve(true);

        };

        document.getElementById("modal-cancel").onclick = () => {

            modal.classList.add("hidden");

            resolve(false);

        };

    });

}

function compressLibrary(library) {

    const result = {};

    Object.entries(library).forEach(([collectionId, volumes]) => {

        result[collectionId] = Object.entries(volumes)
            .filter(([_, owned]) => owned)
            .map(([volume]) => Number(volume));

    });

    return result;

}


function decompressLibrary(data) {

    const library = {};

    Object.entries(data).forEach(([collectionId, volumes]) => {

        library[collectionId] = {};

        volumes.forEach(volume => {

            library[collectionId][volume] = true;

        });

    });

    return library;

}




function exportQrCode() {

    const compressed = compressLibrary(library);

const ownedVolumes = Object.values(library)
    .reduce((total, collection) => {

        return total + Object.values(collection)
            .filter(v => v).length;

    }, 0);

const qrData = {

    app: "Biblioteca de Plêiades",

    version: 2,

    createdAt: new Date().toISOString(),

    stats: {

        collections: Object.keys(library).length,

        ownedVolumes

    },

    library: compressed

};

    // Limpa QR antigo
    document.getElementById("qr-code").innerHTML = "";

    // Gera o QR
    new QRCode(document.getElementById("qr-code"), {
        text: JSON.stringify(qrData),
        width: 250,
        height: 250
    });

    // Informações
    document.getElementById("qr-info").innerHTML = `
        📚 ${Object.keys(library).length} coleção(ões)
        <br>
        🕒 ${new Date().toLocaleString("pt-BR")}
    `;

    // Abre o modal
    document.getElementById("qr-modal").classList.remove("hidden");

}

function startQrScanner() {

    const modal = document.getElementById("scan-modal");

    modal.classList.remove("hidden");

    const scanner = new Html5Qrcode("reader");

    scanner.start(

        { facingMode: "environment" },

        {
            fps: 10,
            qrbox: 250
        },

        (decodedText) => {

            scanner.stop();

            modal.classList.add("hidden");

            importQrBackup(decodedText);

        }

    );

}

function importQrBackup(text) {

    try {

        const backup = JSON.parse(text);

        const library = decompressLibrary(backup.l);

        saveUserData(library);

        alert("Biblioteca importada!");

        location.reload();

    }

    catch {

        alert("QR Code inválido.");

    }

}

window.getUserData = getUserData;
window.saveUserData = saveUserData;
window.exportData = exportData;
window.importData = importData;
window.exportQrCode = exportQrCode;
window.startQrScanner = startQrScanner;


