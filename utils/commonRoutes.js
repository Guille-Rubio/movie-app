const express = require("express");
require('dotenv')
const jwt = require('jsonwebtoken')

const SECRET = process.env.MY_TOKEN_SECRET

const commonRoutes = express.Router();

commonRoutes.use((req, res, next) => {
  const token = req.cookies['access_token'];
  if (token) {
    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        return res.json({ mensaje: 'Token inválida' });
      } else {
        //comprobar que login está en true en SQL
        req.decoded = decoded;
      
        if (decoded.role === "user" || decoded.role === "admin") {

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

module.exports = commonRoutes;