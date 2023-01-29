const Favourites = require('../models/favourites')



const getAllMovies = async (req, res) => {
    try {
        const movies = await Favourites.find({});
        res.status(200).json(movies);
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: error.message })
    }
}
const getOneMovie = async (req, res) => {
    try {
        const title = req.params.title;
        const movie = await Favourites.find({ title })
        res.status(200).json(movie);
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: error.message })
    }
}
const createMovie = async (req, res) => {
    try {
        const newMovie = await Favourites.create(req.body);
        res.status(200).json(newMovie);
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: error.message })
    }
}
const updateMovie = async (req, res) => {
    try {
        res.status(200).json();
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: error.message })
    }
}
const deleteMovie = async (req, res) => {
    try {
        res.status(200).json();
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: error.message })
    }
}


const apiControllers = {
    getAllMovies,
    getOneMovie,
    createMovie,
    updateMovie,
    deleteMovie
}

module.exports = apiControllers;