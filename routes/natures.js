const express = require('express');
const naturesRouter = express.Router();

const Natures = require('../models/nature.model');

naturesRouter.get('/', (req, res) => {
    Natures.findAll().then((natures) => {
        res.send(natures);
    }).catch((error) => {
        res.send('Error: ' + error);
    })
});

module.exports = naturesRouter;