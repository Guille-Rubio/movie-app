

const db = require('../models/usuario');

//Guardar usuario
const guardarUsuario = async(req,res)=>{
    const usuario = await db.guardarUsuario(req.body);
    res.status(200).json(usuario);
}

//leer usuario
const leerUsuario = async(req,res)=>{
    const usuario = await db.leerUsuario(req.body);
    if(usuario.length > 0){
        res.status(200).json(usuario);
    }else{
        res.status(401).json({msg:"No autorizado"});
    } 
}

const checkUserByEmail = async (email)=>{
    const user = await db.checkUserByEmail(email)
    console.log(user)
}

const usuarios = {
    guardarUsuario,
    leerUsuario,
    checkUserByEmail
};

module.exports = usuarios;