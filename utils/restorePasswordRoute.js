const express = require("express");
require('dotenv')
const SECRET = process.env.MY_TOKEN_SECRET
const jwt = require('jsonwebtoken')

const restorePasswordRoutes = express.Router();

restorePasswordRoutes.use((req, res, next) => {
    const token = req.body.token;
    if (token) {
        jwt.verify(token, SECRET, (err, decoded) => {
            if (err) {
                return res.json({ mensaje: 'Token inválida' });
            } else {
                req.decoded = decoded;
                next();
            };
        })
    } else {
        res.render('message', {
            msg: 'Token no proveída.'
        });
    }
});

module.exports = restorePasswordRoutes;