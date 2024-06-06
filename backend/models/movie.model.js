const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    movieid: Number,
    title: String,
    published: Boolean,
    released: Boolean,
    poster_url: String,
    release_date: String,
    publish_date: String,
    artists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }],
    genres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre' }],
    duration: Number,
    critic_rating: Number,
    trailer_url: String,
    wiki_url: String,
    story_line: String,
    shows: [{
        id: Number,
        theatre: { name: String, city: String },
        language: String,
        show_timing: String,
        available_seats: String,
        unit_price: Number
    }]
});

module.exports = mongoose.model('Movie', movieSchema);
