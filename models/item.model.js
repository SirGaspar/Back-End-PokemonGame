const Sequelize = require('sequelize');
const db = require('../database');

const Item = db.define('itemTable', {
    itemId: { type: Sequelize.STRING, primaryKey: true, allowNull: false },
    itemTypeId: { type: Sequelize.INTEGER, references: 'itemTypeTable', referencesKey: 'itemTypeId', allowNull: false },
    itemName: { type: Sequelize.STRING, allowNull: false },
    itemSprite: { type: Sequelize.STRING, allowNull: false },
    itemDescription: { type: Sequelize.STRING, allowNull: false },
    itemEffect: { type: Sequelize.STRING, allowNull: true },
}, { tableName: 'itemTable' });

Item.associate = (models) => {
    Item.belongsToMany(models.Users, {
        through: 'UserItem',
        as: 'users',
        foreignKey: 'itemId'
    });
};

module.exports = Item;