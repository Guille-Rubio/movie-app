const nodemailer = require("nodemailer");
require('dotenv')
const usuarios = require('../controllers/usuarios');

const email = process.env.PASS_RECOVER_EMAIL
const password = process.env.PASS_RECOVER_PASSWORD

const smtp = process.env.SMTP_SERVER
const restorePasswordURL = "http://localhost:3000/restorepassword"

// async..await is not allowed in global scope, must use a wrapper
async function main(userEmail) {
    //checks whether the user exists. 

    const userExists = await usuarios.checkExistingUser(userEmail);

    console.log(userExists)

    if (!userExists) {
        res.render('message', { msg: "There is no user for the email provided" })
    } else {
        const restoringToken = token.createToken(userEmail,"","")

        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing

        let testAccount = await nodemailer.createTestAccount();
        console.log(userEmail)
        // create reusable transporter object using the default SMTP transport

        let transporter = nodemailer.createTransport({
            host: smtp,
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: email, // generated ethereal user
                pass: password, // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: email, // sender address
            to: userEmail, // list of receivers
            subject: "Movie App password recovery ✔", // Subject line
            text: "Please visit xxxxxx to restore your password",
            html: `Please visit ${restorePasswordURL}/${restoringToken} to restore your password`, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>





//main().catch(console.error);
    }}

const mailer = {
    main,
}

module.exports = mailer