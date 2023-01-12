require('dotenv');
const usuarios = require('../models/usuario');
const mailer = require('../utils/nodemailer');
const regex = require('../utils/regex');

const recover = async (req, res) => {
    try {
        const email = req.body.email
        if (regex.validateEmail(email)) {
            const user = await usuarios.checkUserByEmail(email)
            console.log(user)
            if (user == "") {

                res.render('message', { msg: "No existe ningún usuario con el email indicado" })
            } else {
                await mailer.main("guillermorubiog@gmail.com")
                res.render('message', { msg: "email sent" })//add own email to DB and config nodemailer
            }
        } else {
            res.render('message', { msg: "email no válido" })
        }
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ msg: error.message })
    }
}


const passwords = {
    recover
}


module.exports = passwords