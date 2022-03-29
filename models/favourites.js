const mongoose = require('mongoose');
const { Db } = require('mongoose/node_modules/mongodb');


const Film = mongoose.model('Favourites',new mongoose.Schema({
    imdbID:{
        type:String,
        required:true
    },
    title: {
        type: String,
        required: true
    },
    poster: {
        type: String,
        required: false
    },
    year: {
        type: String,
        required: true
    },
    director: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    runtime: {
        type: String,
        required: true
    },
    plot: {
        type: String,
        required: true
    },
    actors: {
        type: String,
        required: true
    },
    ratings: {
        type: Array,
        required: true
    },
    opinions: {
        type: String,
        required: false
    },



}))



module.exports= Film
