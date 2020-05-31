const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../authConfig');
const User = require('../models/mongoUser.model');
const mongoUserRouter = express.Router();
const mongoose = require('mongoose');

mongoUserRouter.post('/register', async (req, res) => {
    const { email } = req.body;
    try {
        if (await User.findOne({ email })) {
            return res.status(400).send({ message: 'User already exists.' })
        }
        const user = await User.create(req.body)
        user.password = undefined;
        return res.send(user);
    } catch (error) {
        return res.status(400).send({ message: 'Registration failed.' });
    }
});

mongoUserRouter.put('/register', async (req, res) => {
    const { userId, username, gender, faction } = req.body;
    const query = {'username': username, 'gender': gender, 'faction': faction};
    try {
        if (await User.findOne({ username })) {
            return res.status(400).send({ message: 'Username already exists.' })
        }
        User.findByIdAndUpdate(userId, query, {new: true}, (err, user) => {
                if (err) return res.status(500).send(err);
                return res.status(200).send(user);
        });
    } catch (error) {
        return res.status(400).send({ message: 'Update failed.' });
    }
});

mongoUserRouter.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user) 
    return res.status(400).send({ message: 'User not found.' })
    if (!await bcrypt.compare(password, user.password))
    return res.status(400).send({ message: 'Invalid password.' })
    const token = jwt.sign({ id: user.id }, authConfig.secret, { expiresIn: 86400 });
    user.password = undefined;
    res.status(200).send({user, token});
});

mongoUserRouter.post('/pokemons', async (req, res) => {
    const { id } = req.body;
    const user = await User.findById(mongoose.Types.ObjectId(id));
    if (!user) return res.status(400).send({ message: 'User not found.' })
    res.status(200).send(user.pokemons);
});

module.exports = mongoUserRouter;