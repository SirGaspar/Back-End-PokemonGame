const express = require('express');
const itemsRouter = express.Router();

const Items = require('../models/item.model');

itemsRouter.get('/', (req, res) => {
    Items.findAll().then((items) => {
        res.send(items);
    }).catch((error) => {
        res.send('Error: ' + error);
    })
});

itemsRouter.get('/:id', (req, res) => {
    Items.findOne({ where: { itemId: req.params.id } }).then((item) => {
        if (!item) {
            return res.status(404).send('Item Not Found');
        } else {
            res.send(item);
        }
    }).catch((error) => {
        res.send('Error: ' + error);
    })
});

module.exports = itemsRouter;