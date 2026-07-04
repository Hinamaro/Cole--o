async function getCollections() {
    const response = await fetch("data/collections.json");

    if (!response.ok) {
        throw new Error("Não foi possível carregar as coleções.");
    }

    return await response.json();
}