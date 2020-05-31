const mongoose = require('../mongoDatabase');

const ItemSchema = new mongoose.Schema({
    itemId: { type: String, required: true },
    itemType: { type: String, required: true },
    itemName: { type: String, required: true },
    itemSprite: { type: String, required: true },
    itemDescription: { type: String, required: true },
    itemBasePrice: { type: Number, required: true },
    itemEffect: { type: String, required: false, default: null },
    equipmentType: { type: String, required: false, default: null },
});

const Item = mongoose.model('Item', ItemSchema);

module.exports = Item;