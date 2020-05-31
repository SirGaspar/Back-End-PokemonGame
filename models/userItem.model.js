const Sequelize = require('sequelize');
const db = require('../database');

const UserItem = db.define('userItemTable', {
    userId: { type: Sequelize.INTEGER, primaryKey: true, references: 'userTable', referencesKey: 'userId', allowNull: false },
    itemId: { type: Sequelize.STRING, primaryKey: true, references: 'itemTable', referencesKey: 'itemId', allowNull: false },
    quantity: { type: Sequelize.INTEGER, allowNull: false },
}, { tableName: 'userItemTable' });

module.exports = UserItem;