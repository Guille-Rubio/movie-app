require('dotenv')
const jwt = require('jsonwebtoken')

const SECRET = process.env.MY_TOKEN_SECRET

const createToken = async (email, role, id) => {
    const payload = {
        check: true,
        email: email,
        role: role,
        id_user: id
    };
    
    const token = jwt.sign(payload, SECRET, {
        expiresIn: "30min"
    });
    return token
};

module.exports = { createToken };
