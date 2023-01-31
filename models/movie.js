const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    id_movie: {
        type: String,
        required: false,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    poster: {
        type: String,
        required: true,
        trim: true
    },
    year: {
        type: String,
        required: true,
        trim: true,
        validate: function (year) { return year <= new Date().getFullYear() }
    },
    director: {
        type: String,
        required: true,
        trim: true
    },
    genre: {
        type: String,
        required: true,
        trim: true
    },
    runtime: {
        type: String,
        required: true,
        trim: true
    },
    plot: {
        type: String,
        required: true,
        trim: true
    },
    actors: {
        type: String,
        required: false,
        trim: true
    },
    ratings: {
        type: Array,
        required: false,
        trim: true
    },
    opinions: {
        type: String,
        required: false,
        trim: true
    },

})


const Movie = mongoose.model("Movie", MovieSchema)


module.exports = Movie

