const express = require('express');
const Item = require('../models/mongoItem.model');
const mongoItemRouter = express.Router();

mongoItemRouter.get('/', async (req, res) => {
    const itemList = await Item.find({});
    if (!itemList) 
    return res.status(400).send({ message: 'Items not found.' })
    res.status(200).send(itemList);
});

mongoItemRouter.post('/register', async (req, res) => {
    const { itemId } = req.body;
    try {
        if (await Item.findOne({ itemId })) {
            return res.status(400).send({ message: 'Item already exists.' })
        }
        const item = await Item.create(req.body)
        return res.send(item);
    } catch (error) {
        return res.status(400).send({ message: 'Item Registration failed.' });
    }
});

module.exports = mongoItemRouter;