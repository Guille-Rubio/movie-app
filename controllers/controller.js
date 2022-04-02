require('dotenv');
const usuarios = require('../models/usuario');
const fetch = require('node-fetch');
require('mongoose');
const MovieModel = require('../models/favourites');
const db = require('../utils/mongoConfig')
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


const searchMovieInOMDB = async (req, res) => {
    const titleSought = req.params.title
    const response = await fetch(`http://www.omdbapi.com/?t=${titleSought}&apikey=${API_KEY}`)
    const data = await response.json()
    res.status(200).render('moviesdetail', data)
}

const signup = async (req, res) => {
    const newUser = req.body;
    console.log(newUser);
    await usuarios.guardarUsuario(newUser);
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


const getDashboardView = async (req, res) => {
    res.render('dashboard');
}


const getRecuPasswordView = async (req, res) => {
    res.status(200).render('recoverpassword')

}

const getRestorePasswordView = async (req, res) => {
    res.status(200).render('restorepassword');
}

const postCreateMovie = async (req, res) => {
    try {
        console.log("body", req.body)
        console.log("params", req.params)
        const film = new MovieModel(req.body);
        const result = await film.save();
        res.status(201).json({ msg: `Pelicula ${req.body.title} creada` })

    }
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
    const favouriteMovies = await usuarios.getUserFavouriteMovies(18)//sustituir por real user
    if (favouriteMovies == "") {
        res.send("User has no films saved as favourites")
    } else {
        const favouriteIDs = []
        favouriteMovies.map(id => favouriteIDs.push(id.id_movie))
        const movies = await MovieModel.find({ id_movie: { $in: favouriteIDs } })
        console.log(movies)

        res.status(200).render('movies', { "movies": movies })

    }

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






//mis pruebas NOP TOCAR
const pruebasvictor = async (req, res) => {
    //malditos todos
    const favourite = await usuarios.updatePassword(req.body);
    res.status(200).json(favourite);
}
//


const controllers = {
    getMovie,
    getSearchView,
    getIndex,
    searchMovieInOMDB,
    signup,
    getUser,
    getDashboardView,
    getRecuPasswordView,
    getRestorePasswordView,
    postCreateMovie,
    deleteMovie,//se puede eliminar
    editMovie,
    getFavouriteMovies,
    removeTitle,
    pruebasvictor,
}


module.exports = controllers