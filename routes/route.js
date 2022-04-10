const express = require('express');
const router = express.Router();
const controllers = require('../controllers/controller');
const passwords = require('../controllers/passwords');
const usuarios = require('../controllers/usuarios');
const adminRoutes = require('../utils/adminRoutes');
const userRoutes = require('../utils/userRoutes');
const commonRoutes = require('../utils/commonRoutes');


router.get('/', controllers.getIndex);
router.get('/signup', controllers.getSignUpView); 
router.post('/signup', usuarios.signup);

//GET /login
//POST /login
router.post('/login', usuarios.login);
//Logout
router.post('/logout', usuarios.logout);

router.get('/dashboard',userRoutes, controllers.getDashboardView);
router.get('/search',userRoutes, controllers.getSearchView);
//router.post('/search', controllers.getOneMovie);
router.get('/search/:title',userRoutes, controllers.getOneMovie); //todas
//Ruta vista
router.get('/movies/:title',userRoutes, controllers.getDetailsMovie);
/* router.get('/moviesdetail', (req, res) => {
    res.render('moviesdetail.pug');
}) */
router.get('/movies', userRoutes, controllers.getFavouriteMovies);
router.get('/admin',adminRoutes, controllers.getAdminView)
router.get('/createmovie', adminRoutes,controllers.getCreateMovieView);
router.post('/createmovie', adminRoutes,controllers.postCreateMovie);

router.post('/editmovie', adminRoutes,controllers.getSearchEditMovieView);//***/
router.get('/editmovie', adminRoutes,controllers.getEditMovieView);//***/
router.post('/editmoviedetail',adminRoutes, controllers.postSaveChanges);

router.get('/removemovie', adminRoutes,controllers.getRemoveMovieView);
router.get('/removemovie/:title', adminRoutes,controllers.removeTitle);
//router.delete('/removeMovie', controllers.deleteMovie);
router.get('/recoverpassword', controllers.getRecoverPasswordView);
router.post('/recoverpassword', passwords.recover);
router.get('/restorepassword', controllers.getRestorePasswordView);
//POST /restorepassword
router.post('/logout',usuarios.logout)
router.post('/removefavourite', commonRoutes, controllers.removefavourite);
router.post('/addfavourite',commonRoutes, controllers.addfavourite);


module.exports = router;