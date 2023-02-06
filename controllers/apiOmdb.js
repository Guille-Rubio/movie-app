const Movie = require('../models/movie');
const API_KEY = process.env.OMDB_API_KEY;



const searchMovieByTitleInOMDB = async (req, res) => {//DEAD CODE??
    try {
        const { title } = req.params;
        const response = await fetch(`http://www.omdbapi.com/?t=${title}&apikey=${API_KEY}`);
        const data = await response.json();
        console.log("*******", data);

        if (data.Response === "False") {
            const movie = await (await Movie.find({ title: title })).pop();

            console.log(movie);

            res.status(200).json(movie);

        } else {
            res.status(200).json(data)
        }
    } catch (err) {
        res.status(500).json({ msg: err.message })

    }
};

const searchMoviesByTitleInOMDB = async (req, res) => {
    try {
        const result = [];
        const { title } = req.body;
        const response = await fetch(`https://www.omdbapi.com/?s=${title}&apikey=${API_KEY}`)
        const movies = await response.json();
        if (movies.Response == "False") {
            const pelisMongo = await (await Movie.find({ title })).pop();
            result.push(pelisMongo);
            if (pelisMongo) {
                res.json({ detalles: result })
            } else {
                res.json({ msg: "No se ha encontrado la película" });
            }
        } else {
            let detalles = await Promise.all(
                movies.Search.map(async movie => {
                    const subRespon = await fetch(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=${API_KEY}`)
                    const subData = await subRespon.json();
                    return subData;
                }))

            res.status(200).json(detalles)
        }
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}


const ApiOmdb = {
    searchMovieByTitleInOMDB,
    searchMoviesByTitleInOMDB
};

module.exports = ApiOmdb;