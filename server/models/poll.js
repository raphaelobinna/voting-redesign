const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    hero: {
        type: String
       
    },
    voted: {
        type: mongoose.Schema.Types.ObjectId,
         ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    },
});
 
module.exports = mongoose.model('Poll', pollSchema);