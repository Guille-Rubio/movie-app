require('dotenv').config();//si no se usa no declarar, solo requerir
const express = require('express');

//const { Db } = require('mongodb');
//require("./utils/mongoConfig");

const router = require('./routes/route');

const app = express();

const port = 3000;

// Motor de vists PUG
app.set('view engine','pug');
app.set('views', './views')

app.use(express.json());

app.use(express.static('public'));

app.use("/",router);




app.listen(port,()=>{console.log(`Example app listening on port ${port}`)});