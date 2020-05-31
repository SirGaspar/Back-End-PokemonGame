const Sequelize = require('sequelize');
const db = require('../database');

module.exports = db.define('natureTable', {
    natureId: { type: Sequelize.INTEGER, primaryKey: true, allowNull: false },
    natureName: { type: Sequelize.STRING, allowNull: false },
}, { tableName: 'natureTable' });