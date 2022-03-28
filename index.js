require('dotenv').config();//si no se usa no declarar, solo requerir
const express = require('express');
const { Db } = require('mongodb');
require("./utils/mongoConfig");

const app = express();

const port = 3000;

app.set('view engine','pug');
app.set('views', './views')

app.use(express.json());


app.get('/', (req, res) => {
    res.render('index.pug')
})



app.listen(port,()=>{console.log(`Example app listening on port ${port}`)});