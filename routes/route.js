const express = require('express');
const router = express.Router();
const controllers = require('../controllers/controller')
const passwords = require('../controllers/passwords')



router.get('/', controllers.getIndex)


router.get('/signup', (req, res) => {
    res.render('signup')
})

router.post('/signup', controllers.signup)

//GET /login

//POST /login

router.get('/dashboard', controllers.getDashboardView)

router.get('/search', controllers.getSearchView)

router.post('/search', controllers.searchMovieInOMDB)

router.get('/moviesdetail', (req, res) => {
    res.render('moviesdetail.pug')
})

router.get('/movies', controllers.getFavouriteMovies)


router.get('/admin', (req, res) => {
    res.render('admin.pug')
})


router.get('/createmovie', (req, res) => {
    res.render('createmovie.pug')
})

router.post('/createmovie', controllers.postCreateMovie)

//GET/editMovie

router.put('/editMovie', controllers.editMovie)

router.get('/removemovie', (req, res) => {
    res.render('removemovie.pug')
})

router.get('/removemovie/:title', controllers.removeTitle)



router.delete('/removeMovie', controllers.deleteMovie)


router.get('/recoverpassword', controllers.getRecuPasswordView)

//POST /recoverpassword

router.get('/restorepassword', controllers.getRestorePasswordView)

//POST /restoerpassword

//POST /logout


/router.post('/savefavourite',(req,res)=>{
    console.log(req.body)

})

router.post('/removefavourite', controllers.removefavourite)



router.post('/pruebasvictor', controllers.pruebasvictor)


module.exports = router;