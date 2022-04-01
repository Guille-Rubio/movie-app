require('dotenv');
const usuarios = require('../models/usuario');
const fetch = require('node-fetch');
require('mongoose');
const MovieModel = require('../models/favourites');
//const { db } = require('../models/favourites');
const db = require('../utils/mongoConfig')
const API_KEY = process.env.OMDB_API_KEY





const getMovie = async (req, res) => {
    const movie = await movieFetch.getMovie(req.params.title);
    res.status(200).json(movie);
}

/* const createMovie = async (req, res) => {
    console.log(req.body); // Objeto recibido de entry nueva
    const newMovie = req.body; // {} nueva peli a guardar
    // Líneas para guardar en una BBDD SQL
    const response = await db.createMovie(newMovie);
    console.log(response);
    res.status(201).json({ "items_created": response });
} */

const getIndex = (req, res) => {
    res.status(200).render("index");
}

const getSearchView = (req, res) => {
    res.status(200).render("search")
};


const searchMovieInOMDB = async (req, res) => {
    const titleSought = req.params.title
    const response = await fetch(`http://www.omdbapi.com/?t=${titleSought}&apikey=${API_KEY}`)
    const data = await response.json()
    const { Title, Year, Runtime, Genre, Director, Actors, Plot, Poster, Ratings } = data;

    res.status(200).render('moviesdetail', {
        Title: Title,
        Year: Year,
        Runtime: Runtime,
        Genre: Genre,
        Director: Director,
        Actors: Actors,
        Plot: Plot,
        Poster: Poster,
        Ratings: Ratings
    })
}

const signup = async (req, res) => {
    const newUser = req.body;
    console.log(newUser);
    await usuarios.guardarUsuario(newUser);
    res.status(201).json({ "message": "Usuario creado exitosamente." })
}


const getDashboardView = async (req, res) => {
}

const getUser = async (req, res) => {
    const user = await usuarios.leerUsuario(req.body);
    if (user.length > 0) {
        res.status(200).json(user);
    } else {
        res.status(401).json({ msg: "No autorizado" });
    }
}

//mis pruebas NOP TOCAR
const pruebasvictor = async (req, res) => {
    //malditos todos
    const favourite = await usuarios.updatePassword(req.body);
    res.status(200).json(favourite);
}
//




const getRecuPasswordView = async (req, res) => {
    res.status(200).render('recoverpassword')

}

const getRestorePasswordView = async (req, res) => {
    res.status(200).render('restorepassword');
}

const postCreateMovie = async (req, res) => {
    try {
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
    const filter = {title:req.body.title}
    const update = req.body
    let doc = await MovieModel.findOneAndUpdate(filter, update, {new:true})
    res.status(201).json({msg:"Editado"})


}

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
    deleteMovie,
    editMovie,
    pruebasvictor,
}

module.exports = controllers