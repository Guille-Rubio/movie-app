const express = require("express");
require('dotenv')
const SECRET = process.env.MY_TOKEN_SECRET
const jwt = require('jsonwebtoken')
require('cookie-parser');

const adminRoutes = express.Router();

adminRoutes.use(async (req, res, next) => {
  const token = req.cookies['access_token'];
  
  console.log(req.cookies['access_token']);
 
  if (token) {
    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        return res.json({ mensaje: 'Token inválida' });
      } else {
        
        req.decoded = decoded;
        if (decoded.role === "admin") {

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

module.exports = adminRoutes;