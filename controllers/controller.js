/**
 * @author Guillermo Rubio, Gaizka Arrondo, Victor Balladares
 * @exports controllers
 * @namespace controllers
 */

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
const { Browser } = require('puppeteer');
const API_KEY = process.env.OMDB_API_KEY

/**
* Descripción de la función: función para buscar película en ombd por titulo 

* @memberof controllers
* @method getMovie
* @async
* @param {object} req HTTP request
* @param {object} res HTTP response
*/

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

/**
 * Descripción de la función
 * Busca una película en OMDB por título si no existe la busca en la base de datos de mongo y la muestra en la vista moviesdetail
* @memberof controllers
* @method searchMovieInOMDB
* @async
* @param {object} req HTTP request
* @param {object} res HTTP response
 * 
 */

const searchMovieInOMDB = async (req, res) => {
    const titleSought = req.body.title
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


/**
 * Descripción de la función: busca el titulo de la pelicula pasada como parametro en OMDB, si no existe en busca solo en mongo, si existe une los resultados de buscar en omdb y en mongo en un array.  El resultado de las busquedas se muestra en la vista moviesdetail 
* @memberof controllers
* @method getOneMovie
* @async
* @param {object} req HTTP request
* @param {object} res HTTP response
 */

const getOneMovie = async (req, res) => {
    const result = [];
    const titleSought = req.params.title
    const response = await fetch(`https://www.omdbapi.com/?s=${titleSought}&apikey=${API_KEY}`)
    const movies = await response.json();
    if (movies.Response == "False") {
        const pelisMongo = await (await MovieModel.find({ Title: titleSought })).pop();
        result.push(pelisMongo);
        if (pelisMongo) {
            res.render("moviesdetail", { detalles: result })
        } else {
            res.render("message",{msg:"No se ha encontrado la película"});
        }
    } else {
        let detalles = await Promise.all(
            movies.Search.map(async movie => {
                const subRespon = await fetch(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=${API_KEY}`)
                const subData = await subRespon.json();
                return subData;
            }))

        res.render("moviesdetail", { detalles })
    }
}

const getUser = async (req, res) => {
    const user = await usuarios.leerUsuario(req.body);
    if (user.length > 0) {
        res.status(200).json(user);
    } else {
        res.status(401).json({ msg: "No autorizado" });
    }
}

/**
 * Descripción de la función: Obtiene los datos completos de una pelicula de OMDB y los muestra en getDetailsMovie
* @memberof controllers
* @method getDetailsMovie
* @async
* @param {object} req HTTP request
* @param {object} res HTTP response
 */
const getDetailsMovie = async (req, res) => {
    const titleSought = req.params.title
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


/**Descripción de la función: Busca la película que se va a editar y pinta sus datos en el formulario de la vista edit detail
* @memberof controllers
* @method getSearchEditMovieView
* @async
* @param {object} req HTTP request
* @param {object} res HTTP response
 * 
 */
const getSearchEditMovieView = async (req, res) => {
    const titleToEdit = req.body.buscar;
    const filter = { Title: titleToEdit };
    let data = await MovieModel.findOne(filter); 
    res.render('editdetail', data);
}

/**Descripción de la función: guarda los cambios introducidos en la edición de una pelicula de la vista editmovie.
 * 
* @memberof controllers
* @method postSaveChanges
* @async
* @param {object} req HTTP request
* @param {object} res HTTP response

 */

const postSaveChanges = async (req, res) => {
    const idToEdit = { id_movie: req.body.id_movie }
    const update = req.body
    await MovieModel.findOneAndUpdate(idToEdit, update, { new: true })
    res.status(201).render('message',{ msg: "Editado" })
}

const getEditMovieView = async (req, res) => {
    res.render('editmovie'); 
}

/** Descripción de la función: Crea una película nueva en la base de datos de mongo
* @memberof controllers
* @method postCreateMovie
* @async
* @param {object} req HTTP request
* @param {object} res HTTP response
 */


const postCreateMovie = async (req, res) => {
    try {
        const film = new MovieModel(req.body);
        const result = await film.save();
        res.status(201).render('message',{msg: `Pelicula ${req.body.Title} creada` })
    }
    catch (err) {
        console.log(err)
    }
}

/** Descripción de la función: busca por título y edita una película en la base de datos de mongo
* @memberof controllers
* @method editMovie
* @async
* @param {object} req HTTP request
* @param {object} res HTTP response

 */

const editMovie = async (req, res) => {
    const filter = { title: req.body.title }
    const update = req.body
    let doc = await MovieModel.findOneAndUpdate(filter, update, { new: true })
    res.status(201).render('message',{ msg: "Editado" })
}

/** Descripción de la función: Devuelve vista movies con las peliculas favoritas del usuario logado 
* @memberof controllers
* @method getFavouriteMovies
* @async
* @param {object} req HTTP request
* @param {object} res HTTP response

 */

const getFavouriteMovies = async (req, res) => {
    const ids = []
    const favouriteMovies = await usuarios.getUserFavouriteMovies(req.decoded.id_user)
    if (favouriteMovies == "") {
        res.send("User has no films saved as favourites")
    } else {
        favouriteMovies.forEach(element => { ids.push(element.id_movie) })
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

/** Descripción de la función: Elimina la película con el titulo especificado de la base de datos de mongo
* @memberof controllers
* @method removeTitle
* @async
* @param {object} req HTTP request
* @param {object} res HTTP response
 */

const removeTitle = async (req, res) => {
    const title = req.query.title
    const titleIsSaved = await MovieModel.findOne({ Title: title }).exec() ? true : false
    console.log("title is saved: " + titleIsSaved)
    if (titleIsSaved) {
        await MovieModel.findOneAndDelete({ Title: title })
        res.status(202).json({ message: title + " deleted" })
    } else {
        res.render('message',{ msg: "la película buscada no está en la base de datos" })
    }
}

const removefavourite = async (req, res) => {
    await usuarios.removeUserFavouriteMovie(req, res);
    //funcion usuario eliminar registro usuario e id   
}

/** Descripción de la función: Crea un registro que relaciona el id de usuario con el id de la pelicula seleccionada como favorita
* @memberof controllers
* @method addfavourite
* @async
* @param {object} req HTTP request
* @param {object} res HTTP response
 */

const addfavourite = async (req, res) => {
    //funcion para comprobar si ya esá guardada 
    const isSaved = await usuarios.checkSavedAsFavourite(req.decoded.user, req.body.id)
    
    if (isSaved) {
        console.log("This movie is saved already")
        res.render('message',{ msg: "This movie is saved already" })
    } else {
       
        await usuarios.addMovieToUser({ id_user: req.decoded.id_user, id_movie: req.body.id })
        res.render('message',{ msg: "save " + req.body.id + " for user: " + req.decoded.id_user })

    }
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
    getEditMovieView,
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