/**
 * @author Guillermo Rubio, Gaizka Arrondo, Victor Balladares
 * @exports controllers
 * @namespace controllers
 */

require('dotenv').config();
const usuarios = require('../models/usuario');
const fetch = require('node-fetch');
require('mongoose');
const jwt = require('jsonwebtoken');
const Favourites = require('../models/favourites');
const API_KEY = process.env.OMDB_API_KEY;
const regex = require('../utils/regex');
const authoriseRoles = require('../utils/authoriseRoles');
const { decodeToken } = require('../utils/createToken');




const createTableUsuarios = async (req, res) => {
    try {
        await usuarios.createUsersTable();
        res.status(201).json({ msg: "tabla usuarios creada" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: error.message });

    }
};

const populateUsuariosTableWithSeed = async (req, res) => {
    try {
        const data = await usuarios.populateUsuariosTableWithSeed();
        res.status(201).json({ msg: data });
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: error.message });
    }
};


const getHomeView = (req, res) => {
    try {
        res.status(200).render('index.pug');
    } catch (error) {
        console.log(error.message);
        res.status(200).render("search")
    }
};



/**
* Descripción de la función: función para buscar película en ombd por titulo 

* @memberof controllers
* @method getMovie
* @async
* @param {object} req HTTP request
* @param {object} res HTTP response
*/

const getMovie = async (req, res) => {
    try {
        const movie = await movieFetch.getMovie(req.params.title);
        res.status(200).json(movie);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ msg: error.message })
    }
};


const getSearchView = async (req, res) => {
    try {
        authoriseRoles(res.locals.role, ["admin", "user"]);
        res.status(200).render("search")

    } catch (error) {
        console.log(error.message);
        res.status(400).json({ msg: error.message })
    }
};

const getIndex = async (req, res) => {
    try {
        res.status(200).render("index.pug");

    } catch (error) {
        console.log(req.query.title);
        res.status(200).render("search")
    }
};

/**
 * Descripción de la función
 * Busca una película en OMDB por título si no existe la busca en la base de datos de mongo y la muestra en la vista moviesdetail
* @memberof controllers
* @method searchMovieInOMDB
* @async
* @param {object} req HTTP request
* @param {object} res HTTP response
 * 
 */

const searchMovieInOMDB = async (req, res) => {
    try {
        const titleSought = req.body.title
        const response = await fetch(`http://www.omdbapi.com/?t=${titleSought}&apikey=${API_KEY}`)
        const data = await response.json()

        console.log("resultado de OMDB", data.title)

        if (data.Response === "False") {
            const movie = await (await Favourites.find({ title: titleSought })).pop();

            console.log(movie);

            res.status(200).render('moviesdetail', movie);

        } else {

            res.status(200).render('moviesdetail', data)
        }
    } catch (err) {
        res.status().json({ msg: err })

    }
}


/**
 * Descripción de la función: busca el titulo de la pelicula pasada como parametro en OMDB, si no existe en busca solo en mongo, si existe une los resultados de buscar en omdb y en mongo en un array.  El resultado de las busquedas se muestra en la vista moviesdetail 
* @memberof controllers
* @method getOneMovie
* @async
* @param {object} req HTTP request
* @param {object} res HTTP response
 */

const getOneMovie = async (req, res) => {
    try {
        authoriseRoles(res.locals.role, ["admin", "user"]);
        const result = [];
        const titleSought = req.params.title
        const response = await fetch(`https://www.omdbapi.com/?s=${titleSought}&apikey=${API_KEY}`)
        const movies = await response.json();
        if (movies.Response == "False") {
            const pelisMongo = await (await Favourites.find({ title: titleSought })).pop();
            result.push(pelisMongo);
            if (pelisMongo) {
                res.render("moviesdetail", { detalles: result })
            } else {
                res.render("message", { msg: "No se ha encontrado la película" });
            }
        } else {
            let detalles = await Promise.all(
                movies.Search.map(async movie => {
                    const subRespon = await fetch(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=${API_KEY}`)
                    const subData = await subRespon.json();
                    return subData;
                }))

            res.render("moviesdetail", { detalles })
        }
    } catch (err) {
        res.status(400).json({ msg: err });
    }

}

const getUser = async (req, res) => {
    try {
        const user = await usuarios.leerUsuario(req.body);
        if (user.length > 0) {
            res.status(200).json(user);
        } else {
            res.status(401).json({ msg: "No autorizado" });
        }
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ msg: error.message })
    }

}

/**
 * Descripción de la función: Obtiene los datos completos de una pelicula de OMDB y los muestra en getDetailsMovie
* @memberof controllers
* @method getDetailsMovie
* @async
* @param {object} req HTTP request
* @param {object} res HTTP response
 */
const getDetailsMovie = async (req, res) => {
    try {
        authoriseRoles(res.locals.role, ["admin", "user"]);
        const titleSought = req.params.title
        const response = await fetch(`https://www.omdbapi.com/?i=${titleSought}&apikey=${API_KEY}`)
        const movie = await response.json()
        res.render('getDetailsMovie', { movie });
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ msg: error.message })
    }
}


const getSignUpView = async (req, res) => {
    try {
        res.render('signup');
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ msg: error.message })
    }
}

const getDashboardView = async (req, res) => {
    try {
        authoriseRoles(res.locals.role, ["admin", "user"]);
        res.render('dashboard');

    } catch (error) {
        console.log(error.message);
        res.status(400).json({ msg: error.message })
    }
}

const getAdminView = async (req, res) => {
    try {
        authoriseRoles(res.locals.role, ["admin"]);
        res.render('admin.pug')
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ msg: error.message })
    }
}

const getCreateMovieView = async (req, res) => {
    try {
        authoriseRoles(res.locals.role, ["admin"]);
        res.render('createmovie')

    } catch (error) {
        console.log(error.message);
        res.status(400).json({ msg: error.message })
    }
}
const getRecoverPasswordView = async (req, res) => {
    try {
        res.status(200).render('recoverpassword')
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ msg: error.message })
    }
}

const getRestorePasswordView = async (req, res) => {
    try {
        res.status(200).render('restorepassword');
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ msg: error.message })
    }
}


/**Descripción de la función: Busca la película que se va a editar y pinta sus datos en el formulario de la vista edit detail
* @memberof controllers
* @method getSearchEditMovieView
* @async
* @param {object} req HTTP request
* @param {object} res HTTP response
 * 
 */
const getSearchEditMovieView = async (req, res) => {
    try {
        authoriseRoles(res.locals.role, ["admin"]);
        const titleToEdit = req.body.buscar;
        const filter = { title: titleToEdit };
        let data = await Favourites.findOne(filter);
        res.render('editdetail', data);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ msg: error.message })
    }
}

/**Descripción de la función: guarda los cambios introducidos en la edición de una pelicula de la vista editmovie.
 * 
* @memberof controllers
* @method postSaveChanges
* @async
* @param {object} req HTTP request
* @param {object} res HTTP response
 
 */

const postSaveChanges = async (req, res) => {
    try {
        authoriseRoles(res.locals.role, ["admin"]);
        const idToEdit = { id_movie: req.body.id_movie }
        const update = req.body
        await Favourites.findOneAndUpdate(idToEdit, update, { new: true })
        res.status(201).render('message', { msg: "Editado" })
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ msg: error.message })
    }
}

const getEditMovieView = async (req, res) => {
    try {
        authoriseRoles(res.locals.role, ["admin"]);
        res.render('editmovie');
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ msg: error.message })
    }
}

/** Descripción de la función: Crea una película nueva en la base de datos de mongo
* @memberof controllers
* @method postCreateMovie
* @async
* @param {object} req HTTP request
* @param {object} res HTTP response
 */


const postCreateMovie = async (req, res) => {
    try {
        authoriseRoles(res.locals.role, ["admin"]);

        const newFilm = await Favourites.create(req.body);
        res.status(201).render('message', { msg: `Pelicula ${newFilm.title} creada` })
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ msg: error.message })
    }
}

/** Descripción de la función: busca por título y edita una película en la base de datos de mongo
* @memberof controllers
* @method editMovie
* @async
* @param {object} req HTTP request
* @param {object} res HTTP response
 
 */

const editMovie = async (req, res) => {
    try {
        const filter = { title: req.body.title }
        const update = req.body
        let doc = await Favourites.findOneAndUpdate(filter, update, { new: true })
        res.status(201).render('message', { msg: "Editado" })
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ msg: error.message })
    }
}

/** Descripción de la función: Devuelve vista movies con las peliculas favoritas del usuario logado 
* @memberof controllers
* @method getFavouriteMovies
* @async
* @param {object} req HTTP request
* @param {object} res HTTP response
 
 */

const getFavouriteMovies = async (req, res) => {
    try {
        authoriseRoles(res.locals.role, ["admin", "user"]);
        const ids = []
        const cookie = req.headers.cookie;
        const token = cookie.slice(cookie.indexOf("=") + 1, cookie.length);
        const { id_user } = decodeToken(token);
        const favouriteMovies = await usuarios.getUserFavouriteMovies(id_user);
        if (favouriteMovies == "") {
            res.send("User has no films saved as favourites")
        } else {
            favouriteMovies.forEach(element => { ids.push(element.id_movie) })
            const movies = [];
            //busca los datos de los ids en mongo o en OMDB
            for (i = 0; i < ids.length; i++) {
                if (ids[i].length > 9) {
                    //buscar en mongo DB
                    let response = await Favourites.findById(ids[i]).exec()
                    //console.log("push de mongo", response)
                    response === null ? console.log(ids[i] + "Esta pelicula no existe en la base de datos") : movies.push(response);
                } else {
                    //buscar en OMDB
                    let response = await fetch(`http://www.omdbapi.com/?i=${ids[i]}&apikey=${API_KEY}`)
                    let data = await response.json();
                    movies.push(data)
                }
            }
            console.log(movies)
            res.status(200).render('movies', { movies })
        }
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ msg: error.message })
    }
}

const getRemoveMovieView = async (req, res) => {
    try {
        authoriseRoles(res.locals.role, ["admin"]);
        res.render('removemovie')
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ msg: error.message })
    }
}

/** Descripción de la función: Elimina la película con el titulo especificado de la base de datos de mongo
* @memberof controllers
* @method removeTitle
* @async
* @param {object} req HTTP request
* @param {object} res HTTP response
 */

const removeTitle = async (req, res) => {
    try {
        authoriseRoles(res.locals.role, ["admin"]);
        const title = req.query.title
        const titleIsSaved = await Favourites.findOne({ title }).exec() ? true : false
        console.log("title is saved: " + titleIsSaved)
        if (titleIsSaved) {
            await Favourites.findOneAndDelete({ title })
            res.status(202).json({ message: title + " deleted" })
        } else {
            res.render('message', { msg: "la película buscada no está en la base de datos" })
        }
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ msg: error.message })
    }
}

const removefavourite = async (req, res) => {
    try {
        authoriseRoles(res.locals.role, ["admin", "user"]);
        await usuarios.removeUserFavouriteMovie(req, res);
        //funcion usuario eliminar registro usuario e id   
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ msg: error.message })
    }
}

/** Descripción de la función: Crea un registro que relaciona el id de usuario con el id de la pelicula seleccionada como favorita
* @memberof controllers
* @method addfavourite
* @async
* @param {object} req HTTP request
* @param {object} res HTTP response
 */

const addfavourite = async (req, res) => {
    //funcion para comprobar si ya esá guardada 
    try {
        authoriseRoles(res.locals.role, ["admin", "user"]);
        const cookie = req.headers.cookie;
        const token = cookie.slice(cookie.indexOf("=") + 1, cookie.length);
        const { id_user } = decodeToken(token);
        console.log(id_user);
        const isSaved = await usuarios.checkSavedAsFavourite(id_user, req.body.id);

        if (isSaved) {
            console.log("This movie is saved already")
            res.render('message', { msg: "This movie is saved already" })
        } else {
            await usuarios.addMovieToUser({ id_user, id_movie: req.body.id })
            res.render('message', { msg: "save " + req.body.id + " for user: " + id_user })

        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: error.message })
    }
}

const controllers = {
    createTableUsuarios,
    populateUsuariosTableWithSeed,
    getHomeView,
    getMovie,
    getSearchView,
    getIndex,
    searchMovieInOMDB,
    getUser,
    getSignUpView,
    getDashboardView,
    getDetailsMovie,
    getAdminView,
    getCreateMovieView,
    getRecoverPasswordView,
    getRestorePasswordView,
    postSaveChanges,
    getEditMovieView,
    getSearchEditMovieView,
    postCreateMovie,
    editMovie,
    getFavouriteMovies,
    getRemoveMovieView,
    removeTitle,
    removefavourite,
    addfavourite,
    getOneMovie,
}

module.exports = controllers