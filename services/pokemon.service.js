function transformPokemonToPersist(pokemon, ball) {
    return {
        pokemonId: pokemon.id,
        exp: (pokemon.level * pokemon.level * pokemon.level),
        hp: 1,
        rarity: defineRarity(),
        hpIv: pokemon.hpIV, atkIv: pokemon.atkIV, defIv: pokemon.defIV, spAtkIv: pokemon.spAtkIV, spDefIv: pokemon.spDefIV, speedIv: pokemon.speedIV,
        jewellery: null, helmet: null, armor: null, foot: null, leftHand: null, rightHand: null,
        ball,
        shiny: false,
        effect: null,
        hpEv: 0, atkEv: 0, defEv: 0, spAtkEv: 0, spDefEv: 0, speedEv: 0,
    }
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

module.exports = {
    transformPokemonToPersist,
};