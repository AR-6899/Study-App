const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
    Title: { type: String, require: true },
    Artist: { type: String, require: true },
    Album: { type: String, require: true },
    location: { type: String, require: true }
});

const Music = mongoose.model('Music', musicSchema);

module.exports = Music;