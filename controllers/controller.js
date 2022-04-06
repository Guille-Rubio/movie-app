require('dotenv').config();
const usuarios = require('../models/usuario');
const fetch = require('node-fetch');
require('mongoose');
const MovieModel = require('../models/favourites');
const db = require('../utils/mongoConfig');
const { json } = require('express/lib/response');
const { readMovie, addMovieToUser } = require('../models/usuario');
const res = require('express/lib/response');
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
    const response = await fetch(`http://www.omdbapi.com/?t=${titleSought}&apikey=${API_KEY}`)
    const data = await response.json()
    res.status(200).render('moviesdetail', data)
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
    let detalles= await Promise.all(
         movies.Search.map(async movie =>{
         const subRespon = await fetch(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=${API_KEY}`)
         const subData = await subRespon.json()
        //detalles.push(subData);
        //console.log(subData);
        return subData;
   }))
    //console.log(detalles);
    res.render("moviesdetail", {detalles})
    
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
    const newUser = req.body;
    const usuario = await usuarios.guardarUsuario(newUser);
    res.status(201).json({ "message": usuario })
}

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
    res.render('getDetailsMovie', {movie});
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
        res.status(201).json({ msg: `Pelicula ${req.body.title} creada` })}
    catch (err) {
        console.log(err)
    }
}

const deleteMovie = async (req, res) => {
    const title = req.body.title
    MovieModel.findOneAndDelete({ title: title }, function (err, docs) {
        if (err) {
            console.log(err)
        } else {
            res.status(202).json({ message: title + " deleted" })
        }
    })
}

const editMovie = async (req, res) => {
    const filter = { title: req.body.title }
    const update = req.body
    let doc = await MovieModel.findOneAndUpdate(filter, update, { new: true })
    res.status(201).json({ msg: "Editado" })
}

const getFavouriteMovies = async (req, res) => {
    const favouriteMovies = await usuarios.getUserFavouriteMovies(18)//sustituir por usuario logado
    const omdbfavourites = await usuarios.readMovie(18);
    console.log("omdbfavourites", omdbfavourites)
    if (favouriteMovies == "") {
        res.send("User has no films saved as favourites")
    } else {
        const favouriteIDs = []
        favouriteMovies.map(id => favouriteIDs.push(id.id_movie))
        const movies = await MovieModel.find({ id_movie: { $in: favouriteIDs } })
        res.status(200).render('movies', { "movies": movies })
    }
}

const getRemoveMovieView = ()=>{
    res.render('removemovie')
}

const removeTitle = async (req, res) => {
    const title = req.query.title
    const titleIsSaved = await MovieModel.findOne({ title: title }).exec() ? true : false
    if (titleIsSaved) {
        MovieModel.findOneAndDelete({ title: title })
        res.status(202).json({ message: title + " deleted" })
    } else {
        res.json({ msg: "la película buscada no está en la base de datos" })
    }
}

const removefavourite = (req, res) => {
    console.log(req.body.id)
    //elminar registro de tabla favoritos
}

const addfavourite = (req, res) => {
    console.log("save title " + req.body.id)
    usuarios.addMovieToUser({id_user:18,id_movie:req.body.id})
    console.log(req.body.id + " saved in DB")
    //guardar usuario e id en tabla favourites
}



const controllers = {
    getMovie,
    getSearchView,
    getIndex,
    searchMovieInOMDB,
    signup,
    getUser,
    getSignUpView,
    getDashboardView,
    getDetailsMovie,
    getAdminView,
    getCreateMovieView,
    getRecoverPasswordView,
    getRestorePasswordView,
    postCreateMovie,
    deleteMovie,//se puede eliminar
    editMovie,
    getFavouriteMovies,
    getRemoveMovieView,
    removeTitle,
    removefavourite,
    addfavourite,
    getOneMovie,
    login,
    logout
}


module.exports = controllers