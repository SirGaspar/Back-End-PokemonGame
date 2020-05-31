const Sequelize = require('sequelize');
const db = require('../database');

const User = db.define('userTable', {
    userId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    profileId: { type: Sequelize.INTEGER, references: 'profileTable', referencesKey: 'profileId', allowNull: false },
    email: { type: Sequelize.STRING, allowNull: false },
    password: { type: Sequelize.STRING, allowNull: false },
    username: { type: Sequelize.STRING, allowNull: false },
    exp: { type: Sequelize.BIGINT, allowNull: false, defaultValue: 0 },
    coins: { type: Sequelize.BIGINT, allowNull: false, defaultValue: 0 },
    premmium: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: 0 },
    regionPositionId: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
    placeTypePositionId: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
    mapPositionId: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
    xCoordenate: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    yCoordenate: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
}, { tableName: 'userTable' });

User.associate = (models) => {
    User.belongsToMany(models.Items, {
        through: 'UserItem',
        as: 'items',
        foreignKey: 'userId'
    });
};

module.exports = User