require('dotenv').config();
const usuarios = require('../models/usuario');
const fetch = require('node-fetch');
require('mongoose');
const jwt = require('jsonwebtoken');
const tokens = require('../utils/createToken')
const MovieModel = require('../models/favourites');
const db = require('../utils/mongoConfig');
const { json } = require('express/lib/response');
const { readMovie, addMovieToUser } = require('../models/usuario');
const res = require('express/lib/response');
const { LEGAL_TCP_SOCKET_OPTIONS } = require('mongodb');
const API_KEY = process.env.OMDB_API_KEY

const getMovie = async (req, res) => {
    const movie = await movieFetch.getMovie(req.params.title);
    res.status(200).json(movie);
}

const getSearchView = (req, res) => {
    res.status(200).render("search")
};

const getIndex = (req, res) => {
    res.status(200).render("index");
}

//Guillermo
const searchMovieInOMDB = async (req, res) => {
    const titleSought = req.body.title
    console.log(titleSought)
    //search movie in OMDB
    const response = await fetch(`http://www.omdbapi.com/?t=${titleSought}&apikey=${API_KEY}`)
    const data = await response.json()
    console.log("resultado de OMDB", data.title)

    if (data.Response === "False") {
        const movie = await (await MovieModel.find({ Title: titleSought })).pop();
        console.log(movie);

        res.status(200).render('moviesdetail', movie);

    } else {

        res.status(200).render('moviesdetail', data)
    }
}

const login = async (req, res) => {
    const inputEmail = req.body.email
    const inputPassword = req.body.password

    const query = await (await usuarios.checkSignedUpUser(inputEmail, inputPassword)).pop()
    const { email, password, role } = query

    if (inputEmail == email && inputPassword == password) {
        console.log("correct email and password")
        //change logged state to true
        const token = tokens.createToken(email)

        res.cookie(token).render('dashboard');
    } else {
        res.json({ msg: "Incorrect email and/or password" })
    }

}


//Fin 

//Victor
// const getMovies = async(title)=>{
//     const response = await fetch(`https://www.omdbapi.com/?s=${title}&apikey=${API_KEY}`)
//     const data = await response.json()
//     let movies = [];
//     data.Search.forEach(async movie =>{
//         const subRespon = await fetch(`http://www.omdbapi.com/?t=${movie.Title}&apikey=${API_KEY}`)
//         const subData = await subRespon.json()
//         movies.push(subData);
//     })
//     return movies;
// }

//http://localhost:3000/search/titanic/  
const getOneMovie = async (req, res) => { 
    const titleSought = req.body.title
    const response = await fetch(`https://www.omdbapi.com/?s=${titleSought}&apikey=${API_KEY}`)
    const movies = await response.json()
    console.log(movies);
    const titulos = [];
    //movies.Search.forEach(element => titulos.push(element.Title));
    console.log(titulos);
    const detalles= []
    titulos.forEach(async movie =>{
         const subRespon = await fetch(`http://www.omdbapi.com/?t=${movie}&apikey=${API_KEY}`)
         const subData = await subRespon.json()
        detalles.push(subData);
   })
 
  



    
    res.render("moviesdetail", {movies})
 
}

//Login
const login = async (req,res) => {
    const user = req.body;
    const usuario = await usuarios.login(user);
    console.log(user);
    res.status(200).json({"message" : usuario})

}

//Logout
//Como nose como vais administrar el usuario desde el lado del cliente
// con cookie , jwt , etc no hago el logout pero ya esta hecho el
const logout = async (req,res) => {
    res.status(200);

}



const signup = async (req, res) => {
    //validaciones
    const newUser = req.body;

    const usuario = await usuarios.guardarUsuario(newUser);
    res.status(201).json({ "message": usuario })

    //crear usuario en SQL
    await usuarios.guardarUsuario(newUser);
    //hacer login
    res.status(201).json({ "message": "Usuario creado exitosamente." })
}

const getUser = async (req, res) => {
    const user = await usuarios.leerUsuario(req.body);
    if (user.length > 0) {
        res.status(200).json(user);
    } else {
        res.status(401).json({ msg: "No autorizado" });
    }
}




const getSignUpView = async (req, res) => {
    res.render('signup');
}

const getDashboardView = async (req, res) => {
    res.render('dashboard');
}


const getAdminView = async (req, res) => {
    res.render('admin.pug')
}

const getCreateMovieView = async (req, res) => {
    res.render('createmovie')

}
const getRecoverPasswordView = async (req, res) => {
    res.status(200).render('recoverpassword')
}

const getRestorePasswordView = async (req, res) => {
    res.status(200).render('restorepassword');
}

const postCreateMovie = async (req, res) => {
    try {
        const film = new MovieModel(req.body);
        const result = await film.save();
        res.status(201).json({ msg: `Pelicula ${req.body.Title} creada` })
    }
    catch (err) {
        console.log(err)
    }
}


const editMovie = async (req, res) => {
    const filter = { title: req.body.title }
    const update = req.body
    let doc = await MovieModel.findOneAndUpdate(filter, update, { new: true })
    res.status(201).json({ msg: "Editado" })
}

const getFavouriteMovies = async (req, res) => {
    //muestra todas las peliculas favoritas del usuario//sustituir por usuario logado
    const ids = []
    //recupera favoritos de usuario 18
    const favouriteMovies = await usuarios.getUserFavouriteMovies(18)
    if (favouriteMovies == "") {
        res.send("User has no films saved as favourites")
    } else {
        //guarda ids favoritos del usuario en un array
        favouriteMovies.forEach(element => { ids.push(element.id_movie) })

        console.log("ids", ids)
        const movies = [];
        //busca los datos de los ids en mongo o en OMDB
        for (i = 0; i < ids.length; i++) {
            if (ids[i].length > 9) {
                //buscar en mongo DB
                let response = await MovieModel.findById(ids[i]).exec()
                //console.log("push de mongo", response)
                response === null ? console.log(ids[i] + "Esta pelicula no existe en la base de datos") : movies.push(response);
            } else {
                //buscar en OMDB
                let response = await fetch(`http://www.omdbapi.com/?i=${ids[i]}&apikey=${API_KEY}`)
                let data = await response.json();
                movies.push(data)
            }
        }
        res.status(200).render('movies', { movies: movies })
    }
}

const getRemoveMovieView = (req, res) => {
    res.render('removemovie')
}

const removeTitle = async (req, res) => {
    const title = req.query.title
    console.log("title to delete: " + title)
    const titleIsSaved = await MovieModel.findOne({ Title: title }).exec() ? true : false
    console.log("title is saved: " + titleIsSaved)
    if (titleIsSaved) {
        await MovieModel.findOneAndDelete({ Title: title })
        res.status(202).json({ message: title + " deleted" })
    } else {
        res.json({ msg: "la película buscada no está en la base de datos" })
    }
}

const removefavourite = async (req, res) => {
    await usuarios.removeUserFavouriteMovie(req, res);
    //funcion usuario eliminar registro usuario e id   
}

const addfavourite = (req, res) => {
    console.log("save title " + req.body.id)
    usuarios.addMovieToUser({ id_user: 18, id_movie: req.body.id })
    console.log(req.body.id + " saved in DB")
    //guardar usuario e id en tabla favourites
}



const controllers = {
    getMovie,
    getSearchView,
    getIndex,
    searchMovieInOMDB,
    login,
    signup,
    getUser,
    getSignUpView,
    getDashboardView,
    getAdminView,
    getCreateMovieView,
    getRecoverPasswordView,
    getRestorePasswordView,
    postCreateMovie,
    editMovie,
    getFavouriteMovies,
    getRemoveMovieView,
    removeTitle,
    removefavourite,
    addfavourite,
    getOneMovie,
    logout
}

module.exports = controllers