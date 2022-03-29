require('dotenv');
const usuarios = require('../models/usuario');
const fetch = require('node-fetch');
const API_KEY = process.env.OMDB_API_KEY




const getMovie = async (req, res) => {
    const movie = await movieFetch.getMovie(req.params.title);
    res.status(200).json(movie);
}

const createMovie = async (req, res) => {
    console.log(req.body); // Objeto recibido de entry nueva
    const newMovie = req.body; // {} nueva peli a guardar
    // Líneas para guardar en una BBDD SQL
    const response = await db.createMovie(newMovie);
    console.log(response);
    res.status(201).json({ "items_created": response });
}

const getIndex = (req, res) => {
    res.status(200).render("index");
}

const getSearchView = (req, res) => {
    res.status(200).render("search")
};


const searchMovie = async (req, res) => {
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
    usuarios.guardarUsuario(newUser);
    res.json({ "message": newUser })
}

const getDashboardView = async (req,res)=>{
    res.status(200).render('dashboard')
    
}


const movie = {
    getMovie,
    createMovie,
    getSearchView,
    getIndex,
    searchMovie,
    signup,
    getDashboardView
}

module.exports = movie;