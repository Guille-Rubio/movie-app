const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    id_movie: {
        type: String,
        required: false,
        trim: true
    },
    Title: {
        type: String,
        required: true,
        trim: true
    },
    Poster: {
        type: String,
        required: true,
        trim: true
    },
    Year: {
        type: String,
        required: true,
        trim: true,
        validate: function (year) { return year < new Date().getFullYear() }
    },
    Director: {
        type: String,
        required: true,
        trim: true
    },
    Genre: {
        type: String,
        required: true,
        trim: true
    },
    Runtime: {
        type: String,
        required: true,
        trim: true
    },
    Plot: {
        type: String,
        required: true,
        trim: true
    },
    Actors: {
        type: String,
        required: false,
        trim: true
    },
    Ratings: {
        type: Array,
        required: false,
        trim: true
    },
    Opinions: {
        type: String,
        required: false,
        trim: true
    },

})


const Movie = mongoose.model("favourites", MovieSchema)


module.exports = Movie

