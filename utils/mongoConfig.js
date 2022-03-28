const mongoose = require("mongoose");
const dotenv = require('dotenv');
const mongoUser = process.env.MONGODB_USER
const mongoPassword = process.env.MONGODB_PASSWORD

const url = `mongodb+srv://${mongoUser}:${mongoPassword}@movieapp.wvpyc.mongodb.net/movieApp?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });//conexión con base de datos

const db = mongoose.connection;//objeto de la conexion

// Eventos
db.on("error", error => console.log(error));
db.once("open", () => console.log("connection to db established"))

module.exports = mongoose;