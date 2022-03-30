const express = require('express');
const router = express.Router();


// [GET] http://localhost:3000/
router.get('/index.pug')

// [GET] http://localhost:3000/search
// Retorna un JSON con los detalles de la peli buscada
router.get('/search/:title', movie.getMovie);

// [GET] http://localhost:3000/dashboard
router.get('/dashboard')





module.exports = router;