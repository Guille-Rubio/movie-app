const favoritesModel = require('../modules/favorites');


const getUserFavorites = async (req, res) => {
    try {
        const { id_user } = req.body;
        const userFavorites = await favoritesModel.getUserFavorites(id_user);
        const rows = userFavorites.msg.rows;
        if (rows.length > 0) {
            res.status(200).json(rows);
        }
        if (rows.length === 0) {
            res.status(200).json({ msg: `No favourites saved for user ${id_user}` })
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: error.message })
    }
};


const addMovieToFavorites = async (req, res) => {
    try {
        const { id_user, id_movie } = req.body;
        const newFav = await favoritesModel.addMovieToFavorites(id_user, id_movie);
        res.status(201).json(newFav.rowCount);
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: error.message });
    }
};

const removeFavorite = async (req, res) => {
    const { id_user, id_movie } = req.body;
    try {
        const deletedFavorite = await favoritesModel.removeFavorite(id_user, id_movie)
        const {rowCount} = deletedFavorite;
        console.log(rowCount);
        if (rowCount > 0) {
            res.status(200).json({ msg: `${id_movie} removed from user ${id_user} favorites` })
        }
        if (rowCount === 0) {
            res.status(200).json({ msg: `movie ${id_movie} is not a favorite for ${id_user}` })
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({ msg: error.message });
    }
};




const favorites = {
    getUserFavorites,
    addMovieToFavorites,
    removeFavorite
};



module.exports = favorites;