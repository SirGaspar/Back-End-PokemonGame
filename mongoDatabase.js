const moongose = require('mongoose');

moongose.connect('mongodb://localhost/pokemonGame');
moongose.Promise = global.Promise;

module.exports = moongose;