const mongoose = require('mongoose');
//const { Db } = require('mongoose/node_modules/mongodb');


const MovieSchema = new mongoose.Schema({
    id: {
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
        maximum: new Date().getFullYear()
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
        required: true,
        trim: true
    },
    ratings: {
        type: Array,
        required: true,
        trim: true
    },
    opinions: {
        type: String,
        required: false,
        trim: true
    },

})


const Movie = mongoose.model("favourites", MovieSchema)


module.exports = Movie

