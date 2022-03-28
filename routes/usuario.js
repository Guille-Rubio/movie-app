const express = require('express');
const router = express.Router();
const usuarios = require('../controllers/usuarios');


router.post('/signup', usuarios.guardarUsuario);

router.post('/login', usuarios.leerUsuario);

module.exports = router;


