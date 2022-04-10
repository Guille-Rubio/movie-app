const pool = require("../utils/pgConfig");

/**
 * Descripción de la función: guarda el usuario pasado por parámetro en la tabla usuarios 
 * @param {Object} usuario 
 * @returns mensaje
 * @exports usuarios
 * @method guardarUsuario
 * @namespace usuarios
 * @memberof function
 */


// Querys

const saveNewUserQuery = `INSERT INTO usuarios (username,email,password,role,logged) VALUES ($1,$2,$3,$4,$5)`
const loginWithUserAndPasswordQuery = `SELECT username,email,role,logged FROM usuarios WHERE email = $1 AND password = $2`
const setLoggedStatusQuery = `UPDATE usuarios SET logged = true WHERE email = $1 AND password = $2`
const getUserMailAndRoleQuery = `SELECT user,email,role FROM usuarios WHERE email = $1`
const getFavouriteRecordQuery = `SELECT * FROM favourites WHERE id_user=$1 AND id_movie=$2`
const saveFavouriteMovieQuery = `INSERT INTO favourites(id_user,id_movie) VALUES ($1,$2)`
const updatePasswordForUserQuery = `UPDATE usuarios SET password =$1 WHERE id =$2`
const getUserFavouriteMoviesQuery = `SELECT id_movie FROM favourites WHERE id_user = $1`
const checkSavedAsFavouriteQuery = `SELECT * FROM favourites WHERE id_user = $1 and id_movie = $2`
const removeFavouriteQuery = `DELETE FROM favourites WHERE id_user = $1 AND id_movie =$2`
const getUserByEmailAndPasswordQuery = `SELECT * FROM usuarios WHERE email = $1 and password = $2`
const updatePasswordByEmailQuery = `UPDATE usuarios SET password=$1 WHERE email=$2`


const guardarUsuario = async (usuario) => {
    const { user, email, password, role } = usuario;
    let client, result;
    try {
        client = await pool.connect();
        const data = await client.query
            (saveNewUserQuery, [user, email, password, role, false])
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


/** Descripción de la función: Establece el valor logado para el usuario pasado por parámetro en la tabla usuarios 
 * @param {Object} usuario 
 * @returns mensaje
 * @exports usuarios
 * @method login
 * @namespace usuarios
 * @memberof function
 * 
 */

const login = async (usuario) => {
    const { email, password } = usuario;
    let client, result;
    try {
        client = await pool.connect();
        const data = await client.query(
            loginWithUserAndPasswordQuery, [email, password]);

        if (data.rowCount > 0) {
            await client.query(setLoggedStatusQuery, [email, password]);
            result = data.rows

        } else {
            result = { "message": "Usuario o contraseña incorrecta" }
        }

    } catch (err) {
        console.log(err);
    } finally {
        client.release();
    }
    return result
}

/** Descripción de la función: Devuelve el usuario y el role del email pasado como parámetro
 * @param {string} email 
 * @returns mensaje
 * @exports usuarios
 * @method checkUSerByEmail
 * @namespace usuarios
 * @memberof function
 * @return datos del usuario con el email especificado
 */

const checkUserByEmail = async (email) => {
    try {
        client = await pool.connect();
        const data = await client.query(getUserMailAndRoleQuery, [email]);

        result = data.rows

    } catch (err) {
        console.log(err);
    } finally {
        client.release();
    }
    return result
}


/** Descripción de la función: Establece el valor logado para el usuario pasado por parámetro en la tabla usuarios 
 * @param {Object} usuario 
 * @returns mensaje
 * @exports usuarios
 * @method addMovieToUser
 * @namespace usuarios
 * @memberof function
 * 
 */
const addMovieToUser = async (favRecord) => {

    const { id_user, id_movie } = favRecord;
    let client, result;
    try {
        client = await pool.connect(); // Espera a abrir conexion
        const data = await client.query
            (getFavouriteRecordQuery, [id_user, id_movie])
        if (data.rows == 0) {
            const inser = await client.query
                (saveFavouriteMovieQuery, [id_user, id_movie])
            result = { msg: "Pelicula agregada." }
        } else {
            result = { msg: "Pelicula ya existe." }
        }
    } catch (err) {

        console.log(err);
        if (err.code == 23505) {
            result = { msg: "Error al guardar favorito" };
        }
    } finally {
        client.release();
    }
    return result
}



/** Descripción de la función: Modifica el password del usuario especificado
 * 
 * @param {Object} usuario 
 * @returns mensaje
 * @exports usuarios
 * @method updatePassword
 * @namespace usuarios
 * @memberof function
 * 
 */

const updatePassword = async (usuario) => {
    const { id, password } = usuario;
    let client, result;
    try {
        client = await pool.connect(); // Espera a abrir conexion
        const data = await client.query
            (updatePasswordForUserQuery, [password, id])
        result = { msg: "Usuario modificado exitosamente." }
    } catch (err) {

        console.log(err);
    } finally {
        client.release();
    }
    return result
}

/** Descripción de la función: devuelve una lista de ids de películas favoritas del id de usuario especificado
 * @param {Object} usuario 
 * @returns Array de objetos con pares de id de usuario y id de película favorita 
 * @exports usuarios
 * @method getUserFavouriteMovies
 * @namespace usuarios
 * @memberof function
 * 
 */

const getUserFavouriteMovies = async (user) => {
    let client, result
    try {
        client = await pool.connect(); // Espera a abrir conexion

        const data = await client.query(getUserFavouriteMoviesQuery, [user]);

        const result = data.rows
        return result
    } catch (err) {
        console.log(err);
        throw err
    } finally {
        client.release();
    }
}

/** Descripción de la función: Elimina el registro de la tabal favoritos que relaciona al usuario logado con una película
 * @param {Object} req 
 * @param {Object} res
 * @returns mensaje
 * @exports usuarios
 * @method removeUserFavouriteMovie
 * @namespace usuarios
 * @memberof function
 * 
 */
const removeUserFavouriteMovie = async (req, res) => {
    const id_movie = req.body.id;
    console.log("id de pelicula a borrar " + id_movie)
    const user = req.decode.id_user
    let client, result
    try {
        client = await pool.connect();

        const data = await client.query(removeFavouriteQuery, [user, id_movie]);
        const result = data.rows
        console.log(`La pelicula con id ${id_movie} ha sido borrada de favoritos`)
        return result
    } catch (err) {
        console.log(err);
        throw err
    } finally {
        client.release();

    }
}
/** Descripción de la función: Establece el valor logado para el usuario pasado por parámetro en la tabla usuarios 
 * @param {Object} usuario 
 * @returns mensaje
 * @exports usuarios
 * @method addMovieToUser
 * @namespace usuarios
 * @memberof function
 * 
 */
const checkSignedUpUser = async (email, password) => {
    console.log(email)
    console.log(password)
    let client, result;
    try {
        client = await pool.connect(); // Espera a abrir conexion
        const data = await client.query(getUserByEmailAndPasswordQuery, [email, password]);
        result = data.rows
    } catch (err) {
        console.log(err);
    } finally {
        client.release();
    }
    return result
}

/** Descripción de la función: Devuelve true si el usuario logado ya tiene el id_movie del parámetro guardado como favorito y false si no. 
* @param {string} id_user
* @param {string} id_movie
* @returns mensaje
* @exports usuarios
* @method checkSavedAsFavourite
* @namespace usuarios
* @memberof function
* 
*/

const checkSavedAsFavourite = async (id_user, id_movie) => {
    let client, result;
    try {
        client = await pool.connect(); // Espera a abrir conexion
        const data = await client.query(checkSavedAsFavouriteQuery, [id_user, id_movie]);
        result = data.rows
        if (result == 0) {
            return false
        } else {
            return true
        }
    } catch (err) {
        console.log(err);
        return false
    } finally {
        client.release();
    }

}

const checkExistingUser = async (email) => {
    let client, result;
    try {
        client = await pool.connect(); 
        const data = await client.query(`SELECT * FROM usuarios WHERE email=$1`, [email]);
        result = data.rows
        return (result==0)?false:true
    } catch (err) {
        console.log(err);
    } finally {
        client.release();
    }

}


const updateUserPassword = async (email, password) =>{
    let client;
    try {
        client = await pool.connect(); 
        const data = await client.query(updatePasswordByEmailQuery, [password, email]);
    } catch (err) {
        console.log(err);
    } finally {
        client.release();
    }



}



const usuarios = {
    guardarUsuario,
    login,
    checkUserByEmail,
    addMovieToUser,
    updatePassword,
    getUserFavouriteMovies,
    removeUserFavouriteMovie,
    checkSignedUpUser,
    checkSavedAsFavourite,
    checkExistingUser,
    updateUserPassword
}

module.exports = usuarios;
