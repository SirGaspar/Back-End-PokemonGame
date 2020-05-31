const express = require('express');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
const usersRouter = express.Router();
const Users = require('../models/user.model');
const userService = require('../services/user.service');

usersRouter.post('/login', (req, res) => {
    Users.findOne({ where: { email: req.body.email } }).then((user) => {
        // if (bcrypt.compareSync(req.body.password, user.password)) {
        // if ((req.body.password === user.password)) {
        //     let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
        //             expiresIn: 1440,
        //     });
        //     res.json({ token: token });
        // } else {
        //     res.send('User do not exist');
        // }
        if (!user) {
            return res.status(404).send('User Not Found');
        } else {
            res.json({
                userId: user.userId,
                username: user.username,
                coins: user.coins,
                exp: user.exp,
                premmium: user.premmium,
                regionPositionId: user.regionPositionId,
                placeTypePositionId: user.placeTypePositionId,
                mapPositionId: user.mapPositionId,
                xCoordenate: user.xCoordenate,
                yCoordenate: user.yCoordenate,
            });
        }
    }).catch((error) => {
        res.send('Error: ' + error);
    });
});

usersRouter.post('/coins', (req, res) => {
    userService.updateCoins(req.body, res);
})

usersRouter.post('/exp', (req, res) => {
    User.update({ exp: req.body.exp }, { where: { userId: req.body.userId }});
})

usersRouter.post('/place', (req, res) => {
    User.update({ regionPositionId: req.body.regionPositionId, placeTypePositionId: req.body.placeTypePositionId,
        mapPositionId: req.body.mapPositionId }, { where: { userId: req.body.userId }});
})

usersRouter.post('/coordenates', (req, res) => {
    User.update({ xCoordenate: req.body.xCoordenate, yCoordenate: req.body.yCoordenate }, { where: { userId: req.body.userId }});
})

module.exports = usersRouter;