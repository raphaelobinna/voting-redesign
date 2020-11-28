const mongoose = require('mongoose');

const voterSchema = new mongoose.Schema({
    name: {
        type: String
    },
    votes: {
        type: Number
    }
})

const judgeSchema = new mongoose.Schema({
    pollOwner : {
        type: String
    },
    MVP: {
        type: String
    },
    MVPimage: {
        type: String
    },
    TotalVotes: {
        type: Number
    },
    Votes : [voterSchema],
    created : {
        type: Date,
        default: Date.now
    },
});
module.exports = mongoose.model('Judge', judgeSchema);