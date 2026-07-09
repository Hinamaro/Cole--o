async function calculateLibraryStats(){

    const collections = await getCollections();

    const library = getUserData();

    let stats = {

        collections: collections.length,

        totalVolumes:0,

        owned:0,

        completed:0,

        percentage:0,

        bestCollection:null,

        bestPercent:-1,

        nextCollection:null,

        nextVolume:null

    };

    collections.forEach(collection=>{

        stats.totalVolumes += collection.volumes;

        const userCollection =
            library[collection.id] || {};

        const ownedVolumes =
            Object.values(userCollection)
            .filter(Boolean).length;

        stats.owned += ownedVolumes;

        const percent =
            Math.round(
                (ownedVolumes / collection.volumes) * 100
            );

        if(percent > stats.bestPercent){

            stats.bestPercent = percent;

            stats.bestCollection = collection.nome;

        }

        if(
            ownedVolumes === collection.volumes &&
            collection.volumes > 0
        ){

            stats.completed++;

        }

        if(stats.nextCollection === null){

            for(
                let i=1;
                i<=collection.volumes;
                i++
            ){

                if(!userCollection[i]){

                    stats.nextCollection =
                        collection.nome;

                    stats.nextVolume = i;

                    break;

                }

            }

        }

    });

    stats.percentage =
        Math.round(
            (stats.owned / stats.totalVolumes) * 100
        );

    return stats;

}

window.calculateLibraryStats =
    calculateLibraryStats;