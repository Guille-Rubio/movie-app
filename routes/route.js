const express = require('express');
const router = express.Router();
const controllers = require('../controllers/controller');
const passwords = require('../controllers/passwords');
const usuarios = require('../controllers/usuarios');
const roleManager = require('../middleware/roleManager');



router.get('/create-tables', controllers.createTableUsuarios);
router.get('/populate-usuarios', controllers.populateUsuariosTableWithSeed);



//router.get('/', controllers.getIndex);
router.get('/signup', controllers.getSignUpView);
router.post('/signup', usuarios.signup);


router.post('/login', usuarios.login);
router.post('/logout', usuarios.logout);

router.get('/dashboard', roleManager, controllers.getDashboardView);
router.get('/search', roleManager, controllers.getSearchView);
//router.post('/search', controllers.getOneMovie);
router.get('/search/:title', roleManager, controllers.getOneMovie); //todas
//Ruta vista
router.get('/movies/:title', roleManager, controllers.getDetailsMovie);
/* router.get('/moviesdetail', (req, res) => {
    res.render('moviesdetail.pug');
}) */
router.get('/movies', roleManager, controllers.getFavouriteMovies);
router.get('/admin', roleManager, controllers.getAdminView)
router.get('/createmovie', roleManager, controllers.getCreateMovieView);
router.post('/createmovie', roleManager, controllers.postCreateMovie);

router.post('/editmovie', roleManager, controllers.getSearchEditMovieView);//***/
router.get('/editmovie', roleManager, controllers.getEditMovieView);//***/
router.post('/editmoviedetail', roleManager, controllers.postSaveChanges);

router.get('/removemovie', roleManager, controllers.getRemoveMovieView);
router.get('/removemovie/:title', roleManager, controllers.removeTitle);
//router.delete('/removeMovie', controllers.deleteMovie);
router.get('/recoverpassword', controllers.getRecoverPasswordView);
router.post('/recoverpassword', passwords.recover);
router.get('/restorepassword', controllers.getRestorePasswordView);
//POST /restorepassword
router.post('/logout', usuarios.logout)
router.post('/removefavourite', roleManager, controllers.removefavourite);
router.post('/addfavourite', roleManager, controllers.addfavourite);


module.exports = router;