require('dotenv').config();
const usuarios = require('../models/usuario');
const fetch = require('node-fetch');
require('mongoose');
const jwt = require('jsonwebtoken');
const tokens = require('../utils/createToken');
const cookieParser = require('cookie-parser');
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
    console.log(req.query.title);
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

    console.log("resultado de OMDB", data.Title)

    if (data.Response === "False") {
        const movie = await (await MovieModel.find({ Title: titleSought })).pop();

        console.log(movie);

        res.status(200).render('moviesdetail', movie);

    } else {

        res.status(200).render('moviesdetail', data)
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
    const titleSought = req.params.title
    console.log(titleSought);
    const response = await fetch(`https://www.omdbapi.com/?s=${titleSought}&apikey=${API_KEY}`)
    const movies = await response.json()
    //console.log(movies);

    const titulos = [];
    //movies.Search.forEach(element => titulos.push(element.Title));
    let detalles = await Promise.all(
        movies.Search.map(async movie => {
            const subRespon = await fetch(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=${API_KEY}`)
            const subData = await subRespon.json()
            //detalles.push(subData);
            //console.log(subData);
            return subData;
        }))
    //console.log(detalles);
    res.render("moviesdetail", { detalles })

}




//Logout
//Como nose como vais administrar el usuario desde el lado del cliente
// con cookie , jwt , etc no hago el logout pero ya esta hecho el 



const getUser = async (req, res) => {
    const user = await usuarios.leerUsuario(req.body);
    if (user.length > 0) {
        res.status(200).json(user);
    } else {
        res.status(401).json({ msg: "No autorizado" });
    }
}

//Detalles de movie
const getDetailsMovie = async (req, res) => {
    const titleSought = req.params.title
    console.log(titleSought);
    const response = await fetch(`https://www.omdbapi.com/?i=${titleSought}&apikey=${API_KEY}`)
    const movie = await response.json()
    res.render('getDetailsMovie', { movie });
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

const getSearchEditMovieView = async (req, res) => {
    console.log("nuevo: " + req.body.title);
    const titleToEdit = req.body.buscar;
    console.log("Titulo to edit: " + titleToEdit);

    //search movie in MONGO
    const filter = { Title: titleToEdit };
    console.log("Filtro: " + filter);
    let data = await MovieModel.findOne(filter); //, function (err, movie) {
    console.log("datatatatatata: " + data);
    res.render('editdetail', data);
}


const postSaveChanges = async  (req, res) => {
    const idToEdit ={ id_movie: req.body.id_movie }
    const update = req.body
  
    await MovieModel.findOneAndUpdate(idToEdit, update, { new: true })
    res.status(201).json({ msg: "Editado" })
}

const getEditMovieView = async (req, res) => {
    res.render('editmovie'); /**/
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
    //Buscar Peli en Mongo
    //Buscar peli a editar y cargarla
    //Editar los cambios y guardarlos en la BDD
    //Devolver mensajes OK/NOK

    const filter = { title: req.body.title }
    const update = req.body
    let doc = await MovieModel.findOneAndUpdate(filter, update, { new: true })
    res.status(201).json({ msg: "Editado" })
}

const getFavouriteMovies = async (req, res) => {
    //muestra todas las peliculas favoritas del usuario//sustituir por usuario logado
    const ids = []
    //recupera favoritos de usuario 18
    const favouriteMovies = await usuarios.getUserFavouriteMovies(req.body.id_user)
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
    usuarios.addMovieToUser({ id_user: req.body.user_id, id_movie: req.body.id })
    console.log(req.body.id + " saved in DB")
    //guardar usuario e id en tabla favourites
}



const controllers = {
    getMovie,
    getSearchView,
    getIndex,
    searchMovieInOMDB,
    getUser,
    getSignUpView,
    getDashboardView,
    getDetailsMovie,
    getAdminView,
    getCreateMovieView,
    getRecoverPasswordView,
    getRestorePasswordView,
    postSaveChanges,
    getEditMovieView, /**/
    getSearchEditMovieView,
    postCreateMovie,
    editMovie,
    getFavouriteMovies,
    getRemoveMovieView,
    removeTitle,
    removefavourite,
    addfavourite,
    getOneMovie,
}

module.exports = controllers