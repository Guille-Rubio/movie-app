const express = require("express");
const SECRET = process.env.MY_TOKEN_SECRET
const jwt = require('jsonwebtoken')
require('cookie-parser');

const roleManager = express.Router();

roleManager.use(async (req, res, next) => {

    const cookie = req.headers.cookie;
    const token = cookie.slice(cookie.indexOf("=") + 1, cookie.length);
    console.log("TOKEN", token);

    if (token) {
        jwt.verify(token, SECRET, (err, decoded) => {
            if (err) {
                return res.status(400).json({
                    msg: 'Token error',
                    error: err.message
                });
            } else {
                console.log(decoded.role);
                const role = decoded.role;
                if (role === "admin") {
                    res.locals.role = "admin";
                    next();
                } else if (role = "user") {
                    res.locals.role = "user";
                    next();

                } else {
                    res.status(401).send({
                        mensaje: "Role does not exist"
                    })
                }
            }
        });
    } else {
        res.send({
            mensaje: 'Token not provided.'
        });
    }
});

module.exports = roleManager;