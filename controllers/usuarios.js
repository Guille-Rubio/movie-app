/**
 * @author Guillermo Rubio, Gaizka Arrondo, Victor Balladares
 * @exports usuarios
 * @namespace usuarios
 */


const db = require('../models/usuario');

const tokens = require('../utils/createToken')
const regex = require('../utils/regex')

/* const guardarUsuario = async (req, res) => {

    const user = await db.guardarUsuario(req.body);
    res.status(200).render('message', { msg: user });

} */

const leerUsuario = async (req, res) => {
    try {
        const user = await db.leerUsuario(req.body);
        if (user.length > 0) {
            res.status(200).json(user);
        } else {
            res.status(401).json({ msg: "No autorizado" });
        }
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ msg: error.message })
    }

}

const checkUserByEmail = async (email) => {
    //PARA QUE ES ESTA FUNCIÓN SI NO DEVUELVE NADA???
    try {
        const user = await db.checkUserByEmail(email)

    } catch (error) {
        console.log(error.message);
        res.status(400).json({ msg: error.message })
    }
}

/** Descripción de la función: Crea un nuevo usuario en la base de datos y hace login
 * @memberof usuarios
 * @method signup
 * @async
 * @param {object} req HTTP request
 * @param {object} res HTTP response
 */
const signup = async (req, res) => {
    try {
        const newUser = req.body;
        if (regex.validateEmail(req.body.email) && regex.validatePassword(req.body.password)) {
            const user = await db.guardarUsuario(newUser);
            await login(req, res)

        } else {
            res.status(400).render('message', { msg: "Email o contraseña no válidos" })
        }
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ msg: error.message })
    }

}

/**
 * Descripción de la función: Loguea al usuario validando el password y la contraseña y devuelve la cookie y la vista correspondiente al role del usuario.
 * @memberof usuarios
 * @method login
 * @async
 * @param {object} req HTTP request
 * @param {object} res HTTP response
 */

const login = async (req, res) => {
    try {
        const inputEmail = req.body.email
        const inputPassword = req.body.password

        const user = await db.checkSignedUpUser(inputEmail, inputPassword);
        if (user.length > 0) {
            const users = await user.pop();
            const { email, password, username, role, id_user } = users;

            if (inputEmail === email && inputPassword === password) {
                console.log("correct email and password")
                //change logged state to true
                const token = await tokens.createToken(email, role, id_user)
                console.log("login token", token)

                if (role === "admin") {
                    res.cookie("access_token", token).render('admin');
                } if (role === "user") {
                    res.cookie("access_token", token).render('dashboard')
                }
            } /* else {
                res.render('message', { msg: "Incorrect email and/or password" })
            } */
        } else {
            res.status(200).render('index', { msg: "Incorrect email or password, please try again" })
        }
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ msg: error.message })
    }
}
/** Descripción de la función: Desloguea al usuario, borra el token de la cookie y devuelve la vista de inicio. 
* @memberof usuarios
* @method logout
* @async
* @param {object} req HTTP request
* @param {object} res HTTP response
*/

const logout = async (req, res) => {
    try {
        res.status(200).cookie("access_token", "").redirect('/');

    } catch (error) {
        console.log(error.message);
        res.status(400).json({ msg: error.message })
    }

}


const usuarios = {
    //guardarUsuario,
    leerUsuario,
    checkUserByEmail,
    signup,
    login,
    logout
};

module.exports = usuarios;