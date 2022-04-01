require('dotenv').config();//si no se usa no declarar, solo requerir
const express = require('express');

//const { Db } = require('mongodb');
//require("./utils/mongoConfig");

//const usuarioRoutes = require('./routes/usuario'); el fichero usuario no está
const usuarioRoutes = require('./routes/route');
const router = require('./routes/route');

const app = express();

const port = 3000;

// Motor de vists PUG
app.set('view engine','pug');
app.set('views', './views')

app.use(express.json());

app.use(express.static('public'));

app.use("/",router);

app.get('/dashboard', (req, res) => {
    res.render('dashboard.pug')
})
app.get('/menu', (req, res) => {
    res.render('menu.pug')
})
app.get('/movies', (req, res) => {
    res.render('movies.pug')
})
app.get('/moviesdetail', (req, res) => {
    res.render('moviesdetail.pug')
})
app.get('/search', (req, res) => {
    res.render('search.pug')
})
app.get('/signup', (req, res) => {
    res.render('signup.pug')
})
app.get('/recoverpassword', (req, res) => {
    res.render('recoverpassword.pug')
})
app.get('/restorepassword', (req, res) => {
    res.render('restorepassword.pug')
})
app.get('/admin', (req, res) => {
    res.render('admin.pug')
})
app.get('/createmovie', (req, res) => {
    res.render('createmovie.pug')
})
app.get('/editmovie', (req, res) => {
    res.render('editmovie.pug')
})
app.get('/removemovie', (req, res) => {
    res.render('removemovie.pug')
})






app.listen(port,()=>{console.log(`Example app listening on port ${port}`)});