const express = require('express');
const api = express.Router();
const apiControllers = require('../controllers/apiControllers');

api.get('/get-all-movies', apiControllers.getAllMovies);
api.get('/get-movie/:title', apiControllers.getOneMovie)
api.post('/create-movie', apiControllers.createMovie);
api.patch('/edit-movie', apiControllers.updateMovie);
api.delete('/delete-movie', apiControllers.deleteMovie);

module.exports = api;