const pool = require("../utils/pgConfig");

/**
 * Descripción de la función: guarda el usuario pasado por parámetro en la tabla usuarios 
 * @param {Object} usuario 
 * @returns mensaje
 * @exports usuarios
 * @method guardarUsuario
 * @namespace usuarios
 * @memberof function
 * 
 */

const createUsersTable = async () => {
    try {
        let client = await pool.connect();
        const newTable = await client.query(`CREATE TABLE IF NOT EXISTS usuarios (
        id_user serial PRIMARY KEY, 
        username VARCHAR (50),
        email VARCHAR (50) UNIQUE NOT NULL,
        password VARCHAR (50) NOT NULL,
        role VARCHAR (50));`);
        return newTable;
    } catch (error) {
        console.log(error.message);
        throw error
    } finally {
        //client.release();
    }


};

const populateUsuariosTableWithSeed = async () => {
    try {
        let client = await pool.connect();
        const newUser = await client.query(`INSERT INTO usuarios (id_user, username,email,password,role)
    VALUES(1,'Guille','guillermorubiog@gmail.com','ABCdef123!','admin'),(2,'Pepe','pepe@gmail.com','ABCdef123!','user');`)
        return newUser
    } catch (error) {
        console.log(error.message);
        throw error
    } finally {
        //client.release();

    }

}


const guardarUsuario = async (usuario) => {
    const { user, email, password, role } = usuario;
    let client, result;
    try {
        client = await pool.connect(); // Espera a abrir conexion
        const data = await client.query
            (`INSERT INTO usuarios (username,email,password,role,logged) VALUES ($1,$2,$3,$4,$5)`
                , [user, email, password, role, false])
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
        const data = await client.query(`
                SELECT username,email,role,logged
                FROM usuarios
                WHERE email = $1 AND password = $2`, [email, password]);

        if (data.rowCount > 0) {
            await client.query(`UPDATE usuarios SET logged = true WHERE email = $1 AND password = $2`, [email, password]);
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
            result = { msg: "Error al guardar favorito" };
        }
    } finally {
        client.release();
    }
    return result

}



const readMovie = async (id_user) => {
    let client, result;

    try {
        client = await pool.connect();
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

        const data = await client.query(`
            DELETE FROM favourites
            WHERE id_user = $1 AND id_movie =$2`, [user, id_movie]);
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
    let client;
    try {
        client = await pool.connect(); // Espera a abrir conexion
        const data = await client.query(`
                SELECT *
                FROM usuarios
                WHERE email = $1 and password = $2`, [email, password]);
        return data.rows;
    } catch (err) {
        console.log(err);

    }
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
        const data = await client.query(`
                SELECT *
                FROM favourites
                WHERE id_user = $1 and id_movie = $2`, [id_user, id_movie]);
        result = data.rows
        //QUE da de resultado???
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



const usuarios = {
    createUsersTable,
    populateUsuariosTableWithSeed,
    guardarUsuario,
    login,
    checkUserByEmail,
    addMovieToUser,
    readMovie,
    updatePassword,
    getUserFavouriteMovies,
    removeUserFavouriteMovie,
    checkSignedUpUser,
    checkSavedAsFavourite
}

module.exports = usuarios;
