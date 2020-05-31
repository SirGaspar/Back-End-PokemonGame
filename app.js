const express = require('express');
const cors = require('cors');
const db = require('./database');
const mongoose = require('mongoose');

// Routes
const userRouter = require('./routes/users');
const pokemonRouter = require('./routes/pokemon');
const itemsRouter = require('./routes/items');
const naturesRouter = require('./routes/natures');
const userItemsRouter = require('./routes/userItems')
const mongoUserRouter = require('./routes/mongoUser')
const mongoItemsRouter = require('./routes/mongoItems')

// Models
const Users = require('./models/user.model');

// Services
const encounterService = require('./services/encounter.service');
const userService = require('./services/user.service');
const pokemonService = require('./services/pokemon.service');

const app = express();
app.use(cors({credentials: true, origin: 'http://localhost:4200'}));
app.use(express.json());
app.use('/api/users', userRouter);
app.use('/api/pokemon', pokemonRouter);
app.use('/api/items', itemsRouter);
app.use('/api/natures', naturesRouter);
app.use('/api/userItems', userItemsRouter);
app.use('/api/mongoUsers', mongoUserRouter);
app.use('/api/mongoItems', mongoItemsRouter);

server = app.listen(3000, () => {

    const maps = [];
    const encounters = [];

    console.log('Listening on 3000');
    db.authenticate().then(() => { console.log('Conectado ao MySQL') }).catch(() => { console.log('Erro ao conectar ao MySQL') });

    const io = require('socket.io').listen(server, { origins: 'http://localhost:4200'});
    io.on('connection', (socket) => {
        const socketUserId = socket.id;
        socket.on('joinMap', (frame, map, x, y, username, atualPlace, userId) => {
            socket.emit('connectionStarted', socketUserId);
            socket.join(`${map}`, () => {
                const mapInstanceIndex = maps.findIndex((mapInstance) => mapInstance.map === map);
                if (mapInstanceIndex === -1) {
                    maps.push({ map, users: [{user: socketUserId, username: username, frame: frame, xCoordenate: x, yCoordenate: y, atualPlace: atualPlace, userId: userId}] });
                } else {
                    maps[mapInstanceIndex].users.push({user: socketUserId, username: username, frame: frame, xCoordenate: x, yCoordenate: y, atualPlace: atualPlace, userId: userId});
                }
                const atualMapInstace = maps.find((instanceMap) => instanceMap.map === map);
                io.to(map).emit('mapChanged', (atualMapInstace));
            });
        });

        socket.on('leaveMap', (map, x, y, atualPlace, userId) => {
            socket.leave(`${map}`, () => {
                const mapInstanceIndex = maps.findIndex((mapInstance) => mapInstance.map === map);
                maps[mapInstanceIndex].users.forEach((user, index) => {
                    if (user.user === socketUserId) {
                        if (!user.atualPlace) { user.atualPlace = atualPlace }
                        if (!user.userId) { user.userId = userId }
                        userService.updatePosition(user);
                        maps[mapInstanceIndex].users.splice(index, 1);
                    }
                });
                const atualMapInstace = maps.find((instanceMap) => instanceMap.map === map);
                io.to(map).emit('mapChanged', (atualMapInstace));
            });
        });

        socket.on('playerWalking', (frame, map, x, y, atualPlace) => {
            const mapInstanceIndex = maps.findIndex((mapInstance) => mapInstance.map === map);
            maps[mapInstanceIndex].users.forEach((user) => {
                if (user.user === socketUserId) {
                    user.frame = frame;
                    user.xCoordenate = x;
                    user.yCoordenate = y;
                    user.atualPlace = atualPlace;
                }
            });
            const atualMapInstace = maps.find((instanceMap) => instanceMap.map === map);
            io.to(map).emit('mapChanged', (atualMapInstace));
        });

        socket.on('sendMessage', (data) => {
            io.emit('receivedMessage', data);
        });

        socket.on('newEncounter', (mapConfiguration) => {
            const encounter = encounterService.generateEncounter(mapConfiguration)
            const encounterInstanceIndex = encounters.findIndex((encounterInstance) => encounterInstance.socketUserId === socketUserId);
            if (encounterInstanceIndex === -1) {
                encounters.push({encounter, socketUserId });
            } else {
                encounters[encounterInstanceIndex].encounter = encounter;
            }
            io.emit('newEncounter', { pokemon: encounter.enemyPokemonInfo, loot: encounter.loot });
        });

        socket.on('finishEncounter', (result) => {
            const encounterInstanceIndex = encounters.findIndex((encounterInstance) => encounterInstance.socketUserId === socketUserId);
            if (result.result === 'killed' || result.result === 'caught') {
                userService.updateExp({ userId: result.userId, exp: result.pokemon.exp * result.pokemon.level });
                userService.updatePokemonExp({ userId: result.userId, pokemonId: result.usedPokemon._id, exp: result.pokemon.exp });
            }
            if (result.result === 'killed') {
                userService.updateCoins({ userId: result.userId, coins: encounters[encounterInstanceIndex].encounter.loot.coins }, false);
                encounters[encounterInstanceIndex].encounter.loot.totalLoot.forEach((loot) => {
                    userService.addItemForUser({ userId: result.userId, itemId: loot.id, quantity: loot.qtd, rarity: loot.rarity, pokemonAllowed: loot.pokemonAllowed }, false);
                });
                io.emit('finishEncounter');
            } else if (result.result === 'caught') {
                const preparedPokemon = pokemonService.transformPokemonToPersist(encounters[encounterInstanceIndex].encounter.enemyPokemonInfo, result.ball);
                preparedPokemon['_id'] = mongoose.Types.ObjectId();
                userService.addPokemonForUser({ userId: result.userId, pokemon: preparedPokemon}, false);
                io.emit('finishEncounter', { pokemon: preparedPokemon });
            } else {
                io.emit('finishEncounter');
            }
        });

        socket.on('releasePokemon', (data) => {
            const released = userService.releasePokemonFromMainList(data);
            if (released) io.emit('releasePokemon', true);
            else io.emit('releasePokemon', false);
        })

        socket.on('equipItem', (data) => {
            userService.equipItem({ userId: data.userId, item: data.item, pokemonId: data.pokemonId });
            io.emit('equipItem');
        })

        socket.on('cureAllPokemon', (data) => {
            data.pokemonList.forEach((pokemon) => {
                if (!(Object.keys(pokemon).length === 0 && pokemon.constructor === Object)) {
                    userService.cureAllPokemon({ userId: data.userId, pokemon: pokemon });
                }
            });
        })

        socket.on('disconnect', () => {
            maps.forEach((map) => {
                map.users.forEach((user) => {
                    if (user.atualPlace) {
                        if (user.user === socket.id && user.atualPlace[1] !== 'general') {
                            userService.updatePosition(user);
                        }
                    }
                })
                map.users = map.users.filter((user) => {return user.user !== socket.id});
            });
        });
    })
});

