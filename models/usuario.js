const pool = require("../utils/pgConfig");

const guardarUsuario = async (usuario) => {
    const { user, email, password, role } = usuario;
    let client, result;
    try {
        client = await pool.connect();
        const data = await client.query
            (`INSERT INTO usuarios (username,email,password,role,logged) VALUES ($1,$2,$3,$4,$5)`
                , [user, email, password, role,false])
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


const login = async (usuario) => {
    const { email, password } = usuario;
    let client, result;
    try {
        client = await pool.connect(); 
        const data = await client.query(`
                SELECT username,email,role,logged
                FROM usuarios
                WHERE email = $1 AND password = $2`, [email, password]);

        if(data.rowCount > 0){
            await client.query(`UPDATE usuarios SET logged = true WHERE email = $1 AND password = $2`, [email, password]);
            result = data.rows

        }else{
            result={"message": "Usuario o contraseña incorrecta"}
        }

    } catch (err) {
        console.log(err);
    } finally {
        client.release();
    }
    return result
}



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


const addMovieToUser = async (favRecord) => {

    const { id_user, id_movie } = favRecord;
    let client, result;
    try {
        client = await pool.connect(); 
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

//Se usa??
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

//password 
const updatePassword = async (usuario) => {
    const { id, password } = usuario;
    let client, result;
    try {
        client = await pool.connect();
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
        client = await pool.connect(); 
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

const checkSignedUpUser = async (email, password) => {
    let client, result;
    try {
        client = await pool.connect();
        const data = await client.query(`
                SELECT *
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

 const checkSavedAsFavourite = async (id_user, id_movie) =>{
    let client, result;
    try {
        client = await pool.connect(); 
        const data = await client.query(`
                SELECT *
                FROM favourites
                WHERE id_user = $1 and id_movie = $2`, [id_user, id_movie]);
        result = data.rows
        
    } catch (err) {
        console.log(err);
    } finally {
        client.release();
    }
    return result==0?true:false;


 }



const usuarios = {
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
