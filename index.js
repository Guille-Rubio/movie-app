const dotenv = require('dotenv').config();
const express = require('express');

const app = express();

const port = 3000;

app.set('view engine','pug');
app.set('views', './views')//comprobar ruta está ok

app.get('/', (req, res) => {
    res.render('index.pug')
})

//app.use(express().JSON);

app.listen(port,()=>{console.log(`Example app listening on port ${port}`)});