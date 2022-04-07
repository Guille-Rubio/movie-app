const db = require('../models/usuario');

const tokens = require('../utils/createToken')

//Guardar usuario
const guardarUsuario = async (req, res) => {
    const user = await db.guardarUsuario(req.body);
    res.status(200).json(user);
}

//leer usuario
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
    console.log(user)
}





const signup = async (req, res) => {
    //validaciones
    const newUser = req.body;
    const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const emailValidation = emailRegex.test(req.body.email)
    if (!emailValidation) {
        res.json({ msg: "El email no es válido" })
    }


    //crear usuario en SQL y guardar en variable
    const user = await db.guardarUsuario(newUser);


    //hacer login
    await login(req, res)

}

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
        res.json({ msg: "Incorrect email and/or password" })
    }

}

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