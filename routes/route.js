const express = require('express');
const router = express.Router();
const movie = require('../controllers/controller')


// [GET] http://localhost:3000/
router.get('/',movie.getIndex)

// [GET] http://localhost:3000/dashboard
router.get('/dashboard')

// [GET] http://localhost:3000/search
// Retorna un JSON con los detalles de la peli buscada
//router.get('/search/:title', movie.getMovie);

// [GET] http://localhost:3000/movies
//router.get('/movies', movie.getMovie);

// [POST] http://localhost:3000/api/entires
router.post('/entries', movie.createMovie);




router.get('/search',movie.getSearchView)


router.get('/search/:title',movie.searchMovie)



module.exports = router;