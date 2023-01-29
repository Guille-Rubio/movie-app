const mongoose = require("mongoose");
const mongoUser = process.env.MONGODB_USER;
const mongoPassword = process.env.MONGODB_PASSWORD;
const mongoCluster = process.env.MONGODB_CLUSTER;
const mongoDBName = process.env.MONGO_DB_NAME;

const url = `mongodb+srv://${mongoUser}:${mongoPassword}@${mongoCluster}.mongodb.net/${mongoDBName}?retryWrites=true&w=majority`

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true
});//conexión con base de datos


const db = mongoose.connection;//objeto de la conexion

// Eventos
db.on("error", error => console.log(error));
db.once("open", () => console.log("connection to db established"))

module.exports = { mongoose, db };