const db = require('../models/usuario');

const tokens = require('../utils/createToken')


const guardarUsuario = async (req, res) => {
    const user = await db.guardarUsuario(req.body);
    res.status(200).render('message',{msg:user});
}

const leerUsuario = async (req, res) => {
    const user = await db.leerUsuario(req.body);
    if (user.length > 0) {
        res.status(200).json(user);
    } else {
        res.status(401).json({ msg: "No autorizado" });
    }
}

const checkUserByEmail = async (email) => {
    const user = await db.checkUserByEmail(email)
}

/** Descripción de la función: Crea un nuevo usuario en la base de datos y hace login
 * @namespace usuarios
 * @memberof function
 * @method signup
 * @param {object} req 
 * @param {object} res 
 */
const signup = async (req, res) => {
    const newUser = req.body;
    const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const emailValidation = emailRegex.test(req.body.email)
    if (!emailValidation) {
        res.render('message',{ msg: "El email no es válido" })
    }

    const user = await db.guardarUsuario(newUser);

    await login(req, res)
}

/**
 * Descripción de la función: Loguea al usuario validando el password y la contraseña y devuelve la cookie y la vista correspondiente al role del usuario.
 * @namespace usuarios
 * @memberof function
 * @method signup
 * @param {object} req 
 * @param {object} res 
 */

const login = async (req, res) => {
    const inputEmail = req.body.email
    const inputPassword = req.body.password

    const query = await (await db.checkSignedUpUser(inputEmail, inputPassword)).pop()
    const { email, password, role, id} = query
    if (inputEmail == email && inputPassword == password) {
        console.log("correct email and password")
        //change logged state to true
        const token = tokens.createToken(email, role, id)

        if (role === "admin") {
            res.cookie("access_token", token).render('admin');
        } if (role === "user") {
            res.cookie("access_token", token).render('dashboard')
        }
    } else {
        res.render('message',{ msg: "Incorrect email and/or password" })
    }

}
/** Descripción de la función: Desloguea al usuario, borra el token de la cookie y devuelve la vista de inicio. 
* @namespace usuarios
* @memberof function
* @method signup
* @param {object} req 
* @param {object} res 
*/

const logout = async (req, res) => {
    res.status(200).cookie("access_token", "").render('index');

}


const usuarios = {
    guardarUsuario,
    leerUsuario,
    checkUserByEmail,
    signup,
    login,
    logout
};

module.exports = usuarios;