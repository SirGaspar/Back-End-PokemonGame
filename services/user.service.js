const Users = require('../models/mongoUser.model');
const mongoose = require('mongoose');

function updatePosition(req, res) {
    if (!req.atualPlace) {
        console.log("Something wrong when updating position! (place unavailable)");
    } else {
        const placeType = req.atualPlace[1] === 'cities' ? 0 : req.atualPlace[1] === 'routes' ? 1 : 2;
        Users.findOneAndUpdate(
            { _id: req.userId },
            { $set: { regionPositionId: req.atualPlace[0], placeTypePositionId: placeType, mapPositionId: req.atualPlace[2],
                xCoordenate: req.xCoordenate, yCoordenate: req.yCoordenate } },
            {new: true},
        (err, user) => {
            if (err) console.log("Something wrong when updating position!");
            if (!user) console.log("updatePosition: User not found");
        });
    }
}

function updateCoins(req, res) {
    Users.findOneAndUpdate(
        { _id: req.userId }, // Find
        { $inc: { 'coins': req.coins } }, // Update -- increment coins
        {new: true},
    (err, user) => {
        if (err) console.log("Something wrong when updating coins!");
        if (!user) console.log("updateCoins: User not found");
    });
}

function updateExp(req, res) {
    Users.findOneAndUpdate(
        { _id: req.userId }, // Find
        { $inc: { 'exp': req.exp } }, // Update -- increment exp
        {new: true},
    (err, user) => {
        if (err) console.log("Something wrong when updating experience!");
        if (!user) console.log("updateExp: User not found");
    });
}

function updatePokemonExp(req, res) {
    const _id = mongoose.Types.ObjectId(req.pokemonId)
    Users.findOneAndUpdate(
        { _id: req.userId, 'pokemons._id': _id }, // Find
        { $inc: { 'pokemons.$.exp': req.exp } }, // Update -- increment exp
        {new: true},
    (err, user) => {
        if (err) console.log("Something wrong when updating Pokemon experience!");
        if (!user) console.log("updatePokemonExp: User not found");
    });
}

function evolvePokemon(req, res) {
    const _id = mongoose.Types.ObjectId(req.pokemonId)
    Users.findOneAndUpdate(
        { _id: req.userId, 'pokemons._id': _id }, // Find
        { $set: { 'pokemons.$.pokemonId': req.newPokemonId } }, // Update -- increment exp
        {new: true},
    (err, user) => {
        if (err) console.log("Something wrong when evolving Pokemon!");
        if (!user) console.log("evolvePokemon: User not found");
    });
}

function addItemForUser(req, res) {
    Users.findOneAndUpdate(
        { _id: req.userId, 'items.itemId': req.itemId, 'items.rarity': req.rarity, 'items.pokemonAllowed': req.pokemonAllowed }, // Find
        { $inc: { 'items.$.quantity': req.quantity } }, // Update -- increment quantity
        {new: true},
    (err, item) => {
        if (err) console.log("Something wrong when updating item!");
        if (!item) {
            Users.update(
                { _id: req.userId }, 
                { $push: { 'items': { 'itemId': req.itemId, 'rarity': req.rarity, 'pokemonAllowed': req.pokemonAllowed, 'quantity': req.quantity } }}, // Insert
                (insertError, item) => {
                    if (insertError) console.log("Something wrong when pushing item!");
                }
            );
        }
    });
}

function equipItem(req, res) {
    const pokemonId = mongoose.Types.ObjectId(req.pokemonId)
    Users.findOne({ _id: req.userId }).then((user) => {
        if (!user) console.log("equipItem: User not found");
        else {
            let itemFound = false;
            user.items.forEach(itemInArray => {
                if (itemInArray.itemId === req.item.itemId && itemInArray.rarity === req.item.rarity && itemInArray.pokemonAllowed === req.item.pokemonAllowed) {
                    itemFound = itemInArray;
                    console.log('Item Found: ', itemInArray)
                    const equipmentAtribute = `pokemons.$.${itemFound.equipmentType}`;
                    console.log(equipmentAtribute);
                }
            });
            if (!itemFound) console.log("Item not found");
            else {
                if (itemFound.quantity > 1) {
                    console.log('ItemId: ', req.item.itemId)
                    console.log('ItemRarity: ', req.item.rarity)
                    console.log('ItemAllowed: ', req.item.pokemonAllowed)
                    Users.findOneAndUpdate(
                        { _id: req.userId, 'items.itemId': req.item.itemId, 'items.rarity': req.item.rarity, 'items.pokemonAllowed': req.item.pokemonAllowed },
                        { $inc: { 'items.$.quantity': -1 } },
                        {new: true},
                    (err) => { if (err) console.log("Something wrong when decreasing item from Items!") });
                } else {
                    Users.findOneAndUpdate(
                        { _id: req.userId },
                        { $pull: { items: { 'items.itemId': req.item.itemId, 'items.rarity': req.item.rarity, 'items.pokemonAllowed': req.item.pokemonAllowed } } },
                        {new: true},
                    (err, user) => { if (err || !user) { console.log("Something wrong when removing item from Items!") }});
                }
                Users.findOneAndUpdate(
                    { _id: req.userId, 'pokemons._id': pokemonId },
                    { $set: { equipmentAtribute: itemFound } },
                    {new: true},
                (err, user) => { if (err || !user) { console.log("Something wrong when equiping item on Pokemon!") }});
            } 
        }
    });       
}

function addPokemonForUser(req, res) {
    Users.findOne({ _id: req.userId }).then((user) => {
        if (!user) console.log("addPokemonForUser: User not found");
        else {
            const pokemon = req.pokemon
            if (user.pokemons.length > 5) {
                addStoredPokemonForUser(req, pokemon);
            } else {
                Users.findOneAndUpdate(
                    { _id: req.userId }, // Find
                    { $push: { 'pokemons': pokemon } }, // Update -- push Pokemon
                    {new: true},
                (err, user) => {
                    if (err) console.log("Something wrong when pushing Pokemon!");
                    if (!user) console.log("addPokemonForUser: User not found");
                });
            }
        }
    }).catch((error) => {
        console.log('addPokemonForUser ERROR: ', error);
    });
}

function addStoredPokemonForUser(req, pokemon) {
    Users.findOneAndUpdate(
        { _id: req.userId }, // Find
        { $push: { 'storedPokemons': pokemon } }, // Update -- push Pokemon
        {new: true},
    (err, user) => {
        if (err) console.log("Something wrong when pushing Pokemon to store!");
        if (!user) console.log("addStoredPokemonForUser: User not found");
    });
}

function releasePokemonFromMainList(req) {
    const _id = mongoose.Types.ObjectId(req.pokemonId)
    Users.findOneAndUpdate(
        { _id: req.userId }, // Find
        { $pull: { pokemons: { _id: _id } } }, // Update -- pull Pokemon
        {new: true},
    (err, user) => {
        if (err || !user) {
            console.log(err)
        }
    });
}

function cureAllPokemon(req) {
    const pokemonId = mongoose.Types.ObjectId(req.pokemon._id)
    Users.findOneAndUpdate(
        { _id: req.userId, 'pokemons._id': pokemonId, },
        { $set: { 'pokemons.$.hp': req.pokemon.maxHP } },
        {new: true},
    (err) => { if (err) console.log("Something wrong when healing Pokemon!") });
}

module.exports = {
    updatePosition,
    updateCoins,
    updateExp,
    updatePokemonExp,
    evolvePokemon,
    addItemForUser,
    addPokemonForUser,
    addStoredPokemonForUser,
    releasePokemonFromMainList,
    equipItem,
    cureAllPokemon,
};