const mongoose = require('../mongoDatabase');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true, lowercase: true },
    password: { type: String, required: true, select: false },
    username: { type: String, required: true, unique: true },
    exp: { type: Number, required: false, default: 0 },
    coins: { type: Number, required: false, default: 0 },
    premmium: { type: Boolean, default: false },
    regionPositionId: { type: Number, required: false, default: 1 },
    placeTypePositionId: { type: Number, required: false, default: 1 },
    mapPositionId: { type: Number, required: false, default: 1 },
    xCoordenate: { type: Number, required: false, default: 0 },
    yCoordenate: { type: Number, required: false, default: 0 },
    items: { type: Array, required: false, default: [] },
    pokemons: { type: Array, required: false, default: [] },
    storedPokemons: { type: Array, required: false, default: [] },
    faction: { type: String, default: null },
    gender: { type: String, default: null },
    reputation: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

UserSchema.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;