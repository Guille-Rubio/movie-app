const Movie = require('../models/movie');



const getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find({}).select('-_id -__v');
        res.status(200).json(movies);
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: error.message })
    }
};

const getOneMovie = async (req, res) => {
    try {
        const title = req.params.title;
        const movie = await Movie.find({ title }).select('-_id -__v');
        res.status(200).json(movie);
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: error.message })
    }
};

const createMovie = async (req, res) => {
    try {
        const newMovie = await Movie.create(req.body);
        res.status(201).json(newMovie);
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: error.message })
    }
};

const updateMovie = async (req, res) => {
    try {
        const filter = { title: req.body.title };
        const update = req.body;
        const updated = await Movie.findOneAndUpdate(filter, update).select('-_id -__v');
        res.status(200).json(updated);
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: error.message })
    }
};


const deleteMovie = async (req, res) => {
    try {
        const deletedMovie = await Movie.deleteOne({ title: req.body.title })
        if (deletedMovie === 0) {
            res.status(400).json({ msg: 'There is no movie under the title provided' })
        } else {
            res.status(200).json({ msg: `Movie ${req.body.title} has been deleted` });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: error.message })
    }
};

const apiControllers = {
    getAllMovies,
    getOneMovie,
    createMovie,
    updateMovie,
    deleteMovie
};;

module.exports = apiControllers;