const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    heroName: String,
    heroImage: String,
    created : {
        type: Date,
        default: Date.now
    },
});
 
module.exports = mongoose.model('Hero', heroSchema);