const express = require('express');
const router = express.Router();
const usuarios = require('../controllers/usuarios');


router.post('/signup', usuarios.guardarUsuario);

module.exports = router;


