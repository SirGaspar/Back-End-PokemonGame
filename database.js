const Sequelize = require('sequelize');
module.exports = new Sequelize('pokemon_world_war', 'root', 'gaspar1125x', {
    host: 'localhost',
    dialect: 'mysql',
    define: { timestamps: false },
});