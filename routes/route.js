const express = require('express');
const router = express.Router();
const controllers = require('../controllers/controller')
const passwords = require ('../controllers/passwords')



router.get('/', controllers.getIndex)


router.get('/signup', (req, res) => {
    res.render('signup.pug')
})

router.post('/signup', controllers.signup)

//GET /login

//POST /login

router.get('/dashboard',controllers.getDashboardView)

router.get('/search', controllers.getSearchView)

router.get('/search/:title', controllers.searchMovieInOMDB)

router.get('/moviesdetail', (req, res) => {
    res.render('moviesdetail.pug')
})

router.get('/movies', (req, res) => {
    res.render('movies.pug')
})

router.get('/admin', (req, res) => {
    res.render('admin.pug')
})


router.get('/createmovie', (req, res) => {
    res.render('createmovie.pug')
})

router.post('/createmovie',controllers.postCreateMovie)

//GET/editMovie

router.put('/editMovie', controllers.editMovie)

router.get('/removemovie', (req, res) => {
    res.render('removemovie.pug')
})

router.delete('/removeMovie',controllers.deleteMovie)


router.get('/recoverpassword',controllers.getRecuPasswordView)

//POST /recoverpassword

router.get('/restorepassword',controllers.getRestorePasswordView)

//POST /restoerpassword

//POST /logout



router.post('/pruebasvictor',controllers.pruebasvictor)


module.exports = router;