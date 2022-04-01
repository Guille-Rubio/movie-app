const express = require('express');
const router = express.Router();
const controllers = require('../controllers/controller')
const passwords = require ('../controllers/passwords')



router.get('/', controllers.getIndex)



router.get('/dashboard',controllers.getDashboardView)

router.get('/search', controllers.getSearchView)

router.get('/search/:title', controllers.searchMovieInOMDB)

router.get('/recoverpassword',controllers.getRecuPasswordView)

router.get('/restorepassword',controllers.getRestorePasswordView)

router.get('/signup', (req, res) => {
    res.render('signup.pug')
})

router.post('/signup', controllers.signup)


router.get('/createmovie', (req, res) => {
    res.render('createmovie.pug')
})

router.post('/createmovie',controllers.postCreateMovie)

router.post('/pruebasvictor',controllers.pruebasvictor)

router.get('/removemovie', (req, res) => {
    res.render('removemovie.pug')
})

router.delete('/removeMovie',controllers.deleteMovie)
router.put('/editMovie', controllers.editMovie)

router.get('/menu', (req, res) => {
    res.render('menu.pug')
})
router.get('/movies', (req, res) => {
    res.render('movies.pug')
})

router.get('/moviesdetail', (req, res) => {
    res.render('moviesdetail.pug')
})

router.get('/admin', (req, res) => {
    res.render('admin.pug')
})


module.exports = router;