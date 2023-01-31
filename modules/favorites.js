const pool = require('../utils/pgConfig');


const getUserFavorites = async (id_user) => {
    let client, result;
    try {
        client = await pool.connect(); // Espera a abrir conexion
        const data = await client.query
            (`SELECT * FROM favorites WHERE id_user=($1)`
                , [id_user])
        result = { msg: data }
    } catch (err) {
        console.log(err);
        throw err
    } finally {
        client.release();
    }
    return result
};


const addMovieToFavorites = async (id_user, id_movie) => {
    let client, result;
    console.log(id_user, id_movie);
    try {
        client = await pool.connect(); // Espera a abrir conexion
        const data = await client.query
            (`INSERT INTO favorites (id_user,id_movie) VALUES ($1,$2)`
                , [id_user, id_movie])
        result = data;
    } catch (err) {
        console.log(err);
        throw err
    } finally {
        client.release();
    }
    return result;
};



const removeFavorite = async (id_user, id_movie) => {
    let client, result;
    try {
        client = await pool.connect(); // Espera a abrir conexion
        const data = await client.query
            (`DELETE FROM favorites WHERE id_user= $1 AND id_movie = $2`
                , [id_user, id_movie])
        result = data;
    } catch (err) {
        console.log(err);
        throw err
    } finally {
        client.release();
    }
    return result

};



const favoriteModels = {
    getUserFavorites,
    addMovieToFavorites,
    removeFavorite

};

module.exports = favoriteModels;