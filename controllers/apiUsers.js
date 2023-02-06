const regex = require('../utils/regex');
const usersModels = require('../models/usuario');
const { createToken } = require('../utils/createToken');
const mailer = require('../utils/nodemailer');



const signUp = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (regex.validateEmail(email) && regex.validatePassword(password)) {
            const userExists = await usersModels.checkUserByEmail(email);
            console.log("***************", userExists)
            if (userExists.length > 0) {
                res.status(400).json({ msg: "Email already in use" });
            } else {
                const user = await usersModels.createNewUser(req.body);
                res.status(201).json({ msg: user })
            }
        } else {
            res.status(400).json({ msg: "Email o contraseña no válidos" })
        }
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ msg: error.message })
    }
};


const login = async (req, res) => {
    try {
        const inputEmail = req.body.email
        const inputPassword = req.body.password

        const user = await usersModels.checkSignedUpUser(inputEmail, inputPassword);
        console.log("***", user);
        if (user.length > 0) {
            const users = await user.pop();
            const { email, password, username, role, id_user } = users;
            const emailMatch = inputEmail === email;
            const passwordMatch = inputPassword === password;
            console.log(passwordMatch, emailMatch);
            if (emailMatch && passwordMatch) {

                //TODO change logged state to true
                const token = await createToken(email, role, id_user)
                console.log("login token", token);
                if (role === "admin") {//TODO modify to Authorization: Bearer <token>
                    res.cookie("access_token", token).json({ msg: 'Logged in as admin' });
                } if (role === "user") {
                    res.cookie("access_token", token).json({ msg: 'Logged in as user' })
                }
            } else {
                res.status(400).json({ msg: "Incorrect email and/or password" })
            }
        } else {
            res.status(200).json({ msg: "Incorrect email or password, please try again" })
        }
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ msg: error.message })
    }
};


const getAllUsers = async (req, res) => {
    try {
        const users = await usersModels.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: error.message })
    };

};

const deleteUserByEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const deleted = await usersModels.deleteUserByEmail(email);
        console.log("*******", deleted)
        if (deleted > 0) {
            res.status(200).json(true);
        } else {
            res.status(400).json(false);
        }

    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: error.message })
    }
}

const updateUserPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const passwordIsValid = regex.validatePassword(newPassword);
        console.log(passwordIsValid)
        if (passwordIsValid) {
            const update = await usersModels.updatePasswordByEmail(email, newPassword);
            res.status(200).json(update);
        } else {
            res.status(400).json({ msg: "Invalid Password, not safe enough" });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: error.message })
    }
};

const getPasswordRecoveryEmail = async (req, res) => {
    try {
        const { email } = req.body

        if (regex.validateEmail(email)) {
            const user = await usersModels.checkUserExistsByEmail(email)
            console.log(user);
            if (user) {
                await mailer.sendPasswordRecoveryEmailTo(email)
                res.status(200).json({ msg: "email sent" })

            } else {
                res.status(400).json({ msg: "No user under provided email" })

            }
        } else {
            res.statuss(400).json({ msg: "email no válido" })
        }
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ msg: error.message })
    }
}





const users = {
    signUp,
    login,
    getAllUsers,
    deleteUserByEmail,
    updateUserPassword,
    getPasswordRecoveryEmail
};


module.exports = users;