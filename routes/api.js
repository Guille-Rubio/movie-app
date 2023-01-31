const express = require('express');
const api = express.Router();
const apiMovies = require('../controllers/apiMovies');
const apiFavorites = require('../controllers/apiFavorites');

api.get('/get-all-movies', apiMovies.getAllMovies);
api.get('/get-movie/:title', apiMovies.getOneMovie)
api.post('/create-movie', apiMovies.createMovie);
api.patch('/edit-movie', apiMovies.updateMovie);
api.delete('/delete-movie', apiMovies.deleteMovie);


api.get('/favorite/get-user-favorites',apiFavorites.getUserFavorites)
api.post('/favorite/add', apiFavorites.addMovieToFavorites);
api.delete('/favorite/remove', apiFavorites.removeFavorite);


module.exports = api;