

const db = require('../models/usuario');

//Guardar usuario
const guardarUsuario = async(req,res)=>{
    const usuario = await db.guardarUsuario(req.body);
    res.status(200).json(usuario);
}

const usuarios = {
    guardarUsuario
};

module.exports = usuarios;