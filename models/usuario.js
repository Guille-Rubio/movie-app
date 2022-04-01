//Importando postgreeSql
const { Pool } = require('pg');

require('dotenv').config();

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PR_USER,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT
});

//Introducir datos

const guardarUsuario = async (usuario) => {
    const { user, email, password, role } = usuario;
    let client, result;
    try {
        client = await pool.connect(); // Espera a abrir conexion
        const data = await client.query
            (` INSERT INTO usuarios(user,email,password,role) 
                                    VALUES ($1,$2,$3,$4)`
                , [user, email, password, role])
        result = { msg: "Usuario creado exitosamente." }
    } catch (err) {
        console.log(err);
        if (err.code == 23505) {
            result = { msg: "Usuario ya registrado." };
        }
    } finally {
        client.release();
    }
    return result
}


//Leer usuario

const leerUsuario = async (usuario) => {
    const { email, password } = usuario;
    let client, result;
    try {
        client = await pool.connect(); // Espera a abrir conexion
        const data = await client.query(`
                SELECT name,email,role
                FROM usuarios
                WHERE email = $1 and password = $2`, [email, password]);

        result = data.rows
    } catch (err) {
        console.log(err);
    } finally {
        client.release();
    }
    return result
}


const checkUserByEmail = async (email) => {
    try {
        client = await pool.connect(); // Espera a abrir conexion
        const data = await client.query(`
                SELECT user,email,role
                FROM usuarios
                WHERE email = $1`, [email]);

        result = data.rows

    } catch (err) {
        console.log(err);
    } finally {
        client.release();
    }
    return result
}


//NO TOCAR
const addMovieToUser = async (info) => {

    const { id_user, id_movie } = info;
    let client, result;
    try {
        client = await pool.connect(); // Espera a abrir conexion
        const data = await client.query
            (`SELECT * FROM favourites WHERE id_user=$1 AND id_movie=$2`
                , [id_user, id_movie])
        if (data.rows == 0) {
            const inser = await client.query
                (`INSERT INTO favourites(id_user,id_movie) VALUES ($1,$2)`
                    , [id_user, id_movie])
            result = { msg: "Pelicula agregada." }
        } else {
            result = { msg: "Pelicula ya existe." }
        }
    } catch (err) {

        console.log(err);
        if (err.code == 23505) {
            result = { msg: "Usuario ya registrado." };
        }
    } finally {
        client.release();
    }
    return result

}

//Leer peliculas de los usuarios

const readMovie = async (id_user) => {
    let client, result;

    try {
        client = await pool.connect(); // Espera a abrir conexion
        const data = await client.query(`
                SELECT * 
                FROM favourites
                WHERE id_user = $1`, [id_user]);

        result = data.rows

    } catch (err) {
        console.log(err);
    } finally {
        client.release();
    }
    return result

}

//password 
const updatePassword = async (usuario) => {
    const { id, password } = usuario;
    let client, result;
    try {
        client = await pool.connect(); // Espera a abrir conexion
        const data = await client.query
            (` UPDATE usuarios SET password =$1 WHERE id =$2`
                , [password, id])
        result = { msg: "Usuario modificado exitosamente." }
    } catch (err) {

        console.log(err);
    } finally {
        client.release();
    }
    return result
}


const getUserFavouriteMovies = async (user) => {
    let client, result
    try {
        client = await pool.connect(); // Espera a abrir conexion

        const data = await client.query(`
            SELECT id_movie
            FROM favourites
            WHERE id_user = $1`, [user]);

        const result = data.rows
        return result
    } catch (err) {
        console.log(err);
        throw err
    } finally {
        client.release();

    }
    
}

const usuarios = {
    guardarUsuario,
    leerUsuario,
    checkUserByEmail,
    addMovieToUser,
    readMovie,
    updatePassword,
    getUserFavouriteMovies
}

module.exports = usuarios;
