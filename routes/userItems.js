const express = require('express');
const userItemsRouter = express.Router();

const UserItems = require('../models/userItem.model');

userItemsRouter.get('/', (req, res) => {
    UserItems.findAll().then((items) => {
        res.send(items);
    }).catch((error) => {
        res.send('Error: ' + error);
    })
});

userItemsRouter.get('/:id', (req, res) => {
    UserItems.findAll({ where: { userId: req.params.id } }).then((items) => {
        if (!items) {
            return res.status(404).send('Items Not Found');
        } else {
            res.send(items);
        }
    }).catch((error) => {
        res.send('Error: ' + error);
    })
});

module.exports = userItemsRouter;