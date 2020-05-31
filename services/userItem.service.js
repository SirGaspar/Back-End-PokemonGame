const Sequelize = require('sequelize');
const UserItems = require('../models/userItem.model');

function getItemsByUser(reqUser, res) {
    UserItems.findAll({ where: { userId: reqUser.userId } }).then((items) => {
        if (items) {
            console.log(items);
        }
    });
}

function addItemForUser(reqUser, res) {
    UserItems.findOne({ where: { userId: reqUser.userId, itemId: reqUser.itemId } }).then((item) => {
        if (item) {
            item.update({ quantity: Sequelize.literal(`quantity + ${reqUser.quantity}`)}).then((result) => {
                if (res) res.status(200).send();
            });
        } else {
            UserItems.create({ userId: reqUser.userId, itemId: reqUser.itemId, quantity: reqUser.quantity });
        }
    });
}

module.exports = {
    getItemsByUser,
    addItemForUser,
};