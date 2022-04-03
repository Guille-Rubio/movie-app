const express = require('express');
const router = express.Router();
const controllers = require('../controllers/controller');
const passwords = require('../controllers/passwords');



router.get('/', controllers.getIndex);
router.get('/signup', controllers.getSignUpView) 
router.post('/signup', controllers.signup);
//GET /login
//POST /login
router.get('/dashboard', controllers.getDashboardView);
router.get('/search', controllers.getSearchView);
router.post('/search', controllers.searchMovieInOMDB);
/* router.get('/moviesdetail', (req, res) => {
    res.render('moviesdetail.pug');
}) */
router.get('/movies', controllers.getFavouriteMovies);
router.get('/admin', controllers.getAdminView)
router.get('/createmovie', controllers.getCreateMovieView)
router.post('/createmovie', controllers.postCreateMovie);
//GET/editMovie
router.put('/editMovie', controllers.editMovie);
router.get('/removemovie', controllers.getRemoveMovieView)
router.get('/removemovie/:title', controllers.removeTitle);
router.delete('/removeMovie', controllers.deleteMovie);
router.get('/recoverpassword', controllers.getRecoverPasswordView);
router.post('/recoverpassword', passwords.recover)
router.get('/restorepassword', controllers.getRestorePasswordView)
//POST /restoerpassword
//POST /logout
router.post('/removefavourite', controllers.removefavourite)
router.post('/addfavourite', controllers.addfavourite)
router.post('/pruebasvictor', controllers.pruebasvictor)


module.exports = router;