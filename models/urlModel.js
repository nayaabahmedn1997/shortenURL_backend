const mongoose = require('mongoose');



const urlSchema = mongoose.Schema({
    shortID: {
        type: String,
        required: true,
        unique: true
    },
    redirectURL: {
        type: String,
    },
    visitHistory: [
        {

            visitedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    clickCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const urlModel = mongoose.model('url', urlSchema);

module.exports = urlModel;