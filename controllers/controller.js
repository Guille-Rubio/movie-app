
const getMovie = async (req, res) => {
    const movie = await movieFetch.getMovie(req.params.title);
    res.status(200).json(movie);
}

const createMovie = async (req,res) => {
    console.log(req.body); // Objeto recibido de entry nueva
    const newMovie = req.body; // {} nueva peli a guardar
    // Líneas para guardar en una BBDD SQL
    const response = await db.createMovie(newMovie);
    console.log(response);
    res.status(201).json({"items_created":response});
}

const movie = {
    getMovie,
    createMovie,
    updateMovie,
    deleteMovie
}

module.exports = movie;