const express = require("express");
require('dotenv')
const jwt = require('jsonwebtoken')
const SECRET = process.env.MY_TOKEN_SECRET

const userRoutes = express.Router();

userRoutes.use(async (req, res, next) => {
  const token = req.cookies['access_token'];
  if (token) {
    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        console.log(err)
        return res.json({ mensaje: 'Token inválida' });
      } else {
        req.decoded = decoded;
        if (decoded.role === "user") {

          next();
        } else { res.status(401).send({ mensaje: "ruta no autorizada" }) }
      }
    });
  } else {
    res.send({
      mensaje: 'Token no proveída.'
    });
  }
});

module.exports = userRoutes;