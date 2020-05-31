const express = require('express');
const pokemonRouter = express.Router();

const Joi = require('joi');

const pokemon = require('./../pokemon.json');

pokemonRouter.get('/', (req, res) => {
    res.send(pokemon);
});

pokemonRouter.get('/:id', (req, res) => {
    const selectedPokemon = pokemon.find(pokemon => pokemon.id === parseInt(req.params.id))
    if (!selectedPokemon) return res.status(404).send('Pokemon não encontrado');
    res.send(selectedPokemon);
});

pokemonRouter.post('/', (req, res) => {
    const result = validatePokemon(req.body);
    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    }
    const newPokemon = {
        id: pokemon.length + 1,
        name: req.body.name,
        exp: req.body.exp,
        drops: [],
    }
    pokemon.push(newPokemon);
    res.send(newPokemon);
});

pokemonRouter.put('/:id', (req, res) => {
    const selectedPokemon = pokemon.find(pokemon => pokemon.id === parseInt(req.params.id))
    if (!selectedPokemon) return res.status(404).send('Pokemon não encontrado');
    const result = validatePokemon(selectedPokemon);
    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    }
    selectedPokemon.name = req.body.name;
    selectedPokemon.exp = req.body.exp;
    res.send(selectedPokemon);
});

pokemonRouter.delete('/:id', (req, res) => {
    const selectedPokemon = pokemon.find(pokemon => pokemon.id === parseInt(req.params.id))
    if (!selectedPokemon) return res.status(404).send('Pokemon não encontrado');

    const index = pokemon.indexOf(selectedPokemon);
    pokemon.splice(index, 1);

    res.send(selectedPokemon);
})

function validatePokemon(pokemon) {
    const schema = {
        name: Joi.string().min(2).required(),
        exp: Joi.string().min(1).required(),
    }
    return Joi.validate(pokemon, schema);
}

module.exports = pokemonRouter;