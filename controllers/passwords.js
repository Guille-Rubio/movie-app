require('dotenv');
const usuarios = require('../models/usuario');



const recover =(email)=>{
    usuarios.leerUsuario()

}


const passwords = {
    recover
}


module.exports = passwords