function generateEncounter(mapConfiguration) {
    const enemyPokemonInfo = randomizeAtributtes(generateEnemy(mapConfiguration), mapConfiguration);
    const loot = determineLoot(enemyPokemonInfo);
    return { enemyPokemonInfo, loot }
}

// Randomiza a raridade do Pokemon encontrado e retorna um Pokemon da lista encontrada
function generateEnemy(mapConfiguration) {
    let possiblePokemon = [];
    var randomValue = Math.floor(Math.random() * 100) + 0.001
    if (randomValue < 75) {
        // Common Pokemon
        possiblePokemon = verifyRoutePokemon(0, mapConfiguration);
    } else if (randomValue < 95) {
        // Uncommon Pokemon
        possiblePokemon = verifyRoutePokemon(1, mapConfiguration);
    } else if (randomValue < 99) {
        // Rare Pokemon
        possiblePokemon = verifyRoutePokemon(2, mapConfiguration);
    } else if (randomValue < 99.7) {
        // SuperRare Pokemon
        possiblePokemon = verifyRoutePokemon(3, mapConfiguration);
    } else {
        // Legendary Pokemon
        possiblePokemon = verifyRoutePokemon(4, mapConfiguration);
    }
    return possiblePokemon[Math.floor(Math.random()*possiblePokemon.length)];
}

// Verifica se existe Pokemon de determinada raridade na Rota e retorna os possíveis Pokemon
// Caso não exista Pokemon da raridade solicitada, tenta a raridade mais próxima abaixo
function verifyRoutePokemon(categoryIndex, mapConfiguration) { 
    var rarities = Object.keys(mapConfiguration.pokemon);
    if (mapConfiguration.pokemon[`${rarities[categoryIndex]}`].length === 0) {
    return verifyRoutePokemon(categoryIndex - 1, mapConfiguration);
    } else {
    return mapConfiguration.pokemon[`${rarities[categoryIndex]}`]
    }
}

function randomizeAtributtes(newPokemon, mapConfiguration) {
    newPokemon['level'] = Math.floor(Math.random() * mapConfiguration.maxLevel) + mapConfiguration.minLevel;
    newPokemon['hpIV'] = Math.floor(Math.random() * 10) + 1;
    newPokemon['atkIV'] = Math.floor(Math.random() * 10) + 1;
    newPokemon['defIV'] = Math.floor(Math.random() * 10) + 1;
    newPokemon['spAtkIV'] = Math.floor(Math.random() * 10) + 1;
    newPokemon['spDefIV'] = Math.floor(Math.random() * 10) + 1;
    newPokemon['speedIV'] = Math.floor(Math.random() * 10) + 1;
    return newPokemon
}

function determineLoot(enemyPokemonInfo) {
    const totalLoot = [];
    const minCoinValue = enemyPokemonInfo.coins === 1 ? 1 : enemyPokemonInfo.coins - (enemyPokemonInfo.coins / 2);
    const maxCoinValue = enemyPokemonInfo.coins === 1 ? 1 : enemyPokemonInfo.coins + (enemyPokemonInfo.coins / 2);
    const coins = Math.ceil(Math.floor(Math.random() * maxCoinValue) + minCoinValue);
    enemyPokemonInfo.loot.forEach((loot) => {
        const percentValue = Math.floor(Math.random() * 100) + 0.001
        if (percentValue <= loot.chance) {
            const qtd = Math.floor(Math.random() * loot.maxQtd) + loot.minQtd;
            totalLoot.push({ id: loot.id, qtd,
                rarity: loot.type === 'equipment' ? defineRarity() : null, pokemonAllowed: loot.type === 'equipment' ? definePokeAllowed() : null });
        }
    });
    return { coins, totalLoot };
}

function defineRarity() {
    var randomValue = Math.floor(Math.random() * 100) + 0.001
    if (randomValue < 75) {
        return 'Common';
    } else if (randomValue < 95) {
        return 'Uncommon';
    } else if (randomValue < 99) {
        return 'Rare';
    } else if (randomValue < 99.7) {
        return 'Legendary';
    } else {
        return 'Mythical';
    }
}

function definePokeAllowed() {
    return Math.floor(Math.random() * 151) + 1;
}

module.exports.generateEncounter = generateEncounter;