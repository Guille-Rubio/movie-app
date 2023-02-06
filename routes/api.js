const express = require('express');
const api = express.Router();
const apiMovies = require('../controllers/apiMovies');
const apiFavorites = require('../controllers/apiFavorites');
const apiUsers = require('../controllers/apiUsers');
const apiOmdb = require('../controllers/apiOmdb');


api.get('/get-all-movies', apiMovies.getAllMovies);
api.get('/get-movie/:title', apiMovies.getOneMovie)
api.post('/create-movie', apiMovies.createMovie);
api.patch('/edit-movie', apiMovies.updateMovie);
api.delete('/delete-movie', apiMovies.deleteMovie);


api.get('/favorite/get-user-favorites', apiFavorites.getUserFavorites)
api.post('/favorite/add', apiFavorites.addMovieToFavorites);
api.delete('/favorite/remove', apiFavorites.removeFavorite);

api.post('/signup', apiUsers.signUp);
api.get('/login', apiUsers.login);
api.get('/users', apiUsers.getAllUsers);
api.delete('/user', apiUsers.deleteUserByEmail);
api.post('/password-recovery-email', apiUsers.getPasswordRecoveryEmail);
api.patch('/change-password', apiUsers.updateUserPassword);

api.get('/omdb-movies/:title', apiOmdb.searchMovieByTitleInOMDB);
api.get('/omdb-movies', apiOmdb.searchMoviesByTitleInOMDB);

module.exports = api;