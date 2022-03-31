const express = require('express');
const router = express.Router();
const movie = require('../controllers/controller')
const passwords = require ('../controllers/passwords')



router.get('/', movie.getIndex)

router.get('/dashboard',movie.getDashboardView)

router.get('/search', movie.getSearchView)

router.get('/search/:title', movie.searchMovieInOMDB)

router.get('/recoverpassword',movie.getRecuPasswordView)

router.get('/restorepassword',movie.getRestorePasswordView)

router.post('/signup', movie.signup)


router.post('/createmovie',movie.postCreateMovie)

router.post('/pruebasvictor',movie.pruebasvictor)




module.exports = router;