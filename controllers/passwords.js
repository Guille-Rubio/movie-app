require('dotenv');
const usuarios = require('../models/usuario');
const mailer = require('../utils/nodemailer')

const recover = async (req, res) => {
    const email = req.body.email
    const user = await usuarios.checkUserByEmail(email)
    console.log(user)
    if (user == "") {

        res.render('message', { msg: "No existe ningún usuario con el email indicado" })
    } else {
        await mailer.main("guillermorubiog@gmail.com")
        res.render('message', { msg: "email sent" })//add own email to DB and config nodemailer
    }
}


const passwords = {
    recover
}


module.exports = passwords