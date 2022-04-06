require('dotenv');
const usuarios = require('../models/usuario');
const fetch = require('node-fetch');
require('mongoose');
const MovieModel = require('../models/favourites');
const db = require('../utils/mongoConfig');
const { json } = require('express/lib/response');
const { readMovie, addMovieToUser } = require('../models/usuario');
const res = require('express/lib/response');
const API_KEY = process.env.OMDB_API_KEY

const getMovie = async (req, res) => {
    const movie = await movieFetch.getMovie(req.params.title);
    res.status(200).json(movie);
}

const getSearchView = (req, res) => {
    res.status(200).render("search")
};

const getIndex = (req, res) => {
    res.status(200).render("index");
}

const searchMovieInOMDB = async (req, res) => {
    const titleSought = req.body.title
    console.log(titleSought)
    //search movie in OMDB
    const response = await fetch(`http://www.omdbapi.com/?t=${titleSought}&apikey=${API_KEY}`)
    const data = await response.json()
    console.log("resultado de OMDB", data.Title)
   
    if (data.Response==="False"){
        const movie = await (await MovieModel.find({ Title:titleSought })).pop();
        console.log(movie);

        res.status(200).render('moviesdetail',movie);
        

    }else{
    
    res.status(200).render('moviesdetail', data)
    }

}



const signup = async (req, res) => {
    const newUser = req.body;
    await usuarios.guardarUsuario(newUser);
    res.status(201).json({ "message": "Usuario creado exitosamente." })
}

const getUser = async (req, res) => {
    const user = await usuarios.leerUsuario(req.body);
    if (user.length > 0) {
        res.status(200).json(user);
    } else {
        res.status(401).json({ msg: "No autorizado" });
    }
}

const getSignUpView = async (req, res) => {
    res.render('signup');
}

const getDashboardView = async (req, res) => {
    res.render('dashboard');
}

const getAdminView = async (req, res) => {
    res.render('admin.pug')
}

const getCreateMovieView = async (req, res) => {
    res.render('createmovie')

}
const getRecoverPasswordView = async (req, res) => {
    res.status(200).render('recoverpassword')
}

const getRestorePasswordView = async (req, res) => {
    res.status(200).render('restorepassword');
}

const getSearchEditMovieView = async (req, res) => {
    console.log("nuevo: " + req.body.title);
    const titleToEdit = req.body.buscar;
    console.log("Titulo to edit: " + titleToEdit);
    
    //search movie in MONGO
    const filter = { Title: titleToEdit };
    console.log("Filtro: " + filter);
    let data = await MovieModel.findOne(filter); //, function (err, movie) {
    console.log("datatatatatata: " + data);    
    res.render('editdetail', data);
}

const postSaveChanges = async  (req, res) => {
    //console.log("Aki empieza la nueva función: " + req.body);
    //const filter = { _id: req.body.Id }
    console.log("Este es el req: " + req.body);
    const idToEdit = req.body._id;
    console.log("Id to editttt: " + idToEdit);
    
    
    const update = req.body
    console.log("update es = a: " + update);
    
    await MovieModel.findByIdAndUpdate(idToEdit, update, { new: true })
    
    
    res.status(201).json({ msg: "Editado" })
    //console.log("el doc: " + doc);
    //guardar cambios en MOngo findOneandupdate
    //res.json({msg: "hasta aki hemos llegado"})
}

const getEditMovieView = async (req, res) => {
    res.render('editmovie'); /**/
}

const postCreateMovie = async (req, res) => {
    try {
        const film = new MovieModel(req.body);
        const result = await film.save();
        res.status(201).json({ msg: `Pelicula ${req.body.Title} creada` })
    }
    catch (err) {
        console.log(err)
    }
}

const deleteMovie = async (req, res) => {
    const title = req.body.title
    MovieModel.findOneAndDelete({ title: title }, function (err, docs) {
        if (err) {
            console.log(err)
        } else {
            res.status(202).json({ message: title + " deleted" })
        }
    })
}

const editMovie = async (req, res) => {
    //Buscar Peli en Mongo
    //Buscar peli a editar y cargarla
    //Editar los cambios y guardarlos en la BDD
    //Devolver mensajes OK/NOK
    
    const filter = { title: req.body.title }
    const update = req.body
    let doc = await MovieModel.findOneAndUpdate(filter, update, { new: true })
    res.status(201).json({ msg: "Editado" })
}

const getFavouriteMovies = async (req, res) => {
    const favouriteMovies = await usuarios.getUserFavouriteMovies(18)//sustituir por usuario logado
    const omdbfavourites = await usuarios.readMovie(18);
    console.log("omdbfavourites", omdbfavourites)
    if (favouriteMovies == "") {
        res.send("User has no films saved as favourites")
    } else {
        const favouriteIDs = []
        favouriteMovies.map(id => favouriteIDs.push(id.id_movie))
        const movies = await MovieModel.find({ id_movie: { $in: favouriteIDs } })
        res.status(200).render('movies', { "movies": movies })
    }
}

const getRemoveMovieView = () => {
    res.render('removemovie')
}

const removeTitle = async (req, res) => {
    const title = req.query.title
    const titleIsSaved = await MovieModel.findOne({ title: title }).exec() ? true : false
    if (titleIsSaved) {
        MovieModel.findOneAndDelete({ title: title })
        res.status(202).json({ message: title + " deleted" })
    } else {
        res.json({ msg: "la película buscada no está en la base de datos" })
    }
}

const removefavourite = async (req, res) => {
    await usuarios.removeUserFavouriteMovie(req, res);
    //funcion usuario eliminar registro usuario e id
    console.log(req.body.id)
    //elminar registro de tabla favoritos
}

const addfavourite = (req, res) => {
    console.log("save title " + req.body.id)
    usuarios.addMovieToUser({ id_user: 18, id_movie: req.body.id })
    console.log(req.body.id + " saved in DB")
    //guardar usuario e id en tabla favourites
}



//mis pruebas NOP TOCAR
const pruebasvictor = async (req, res) => {
    //malditos todos
    const favourite = await usuarios.updatePassword(req.body);
    res.status(200).json(favourite);
}
//


const controllers = {
    getMovie,
    getSearchView,
    getIndex,
    searchMovieInOMDB,
    signup,
    getUser,
    getSignUpView,
    getDashboardView,
    getAdminView,
    getCreateMovieView,
    getRecoverPasswordView,
    getRestorePasswordView,
    postSaveChanges,
    getEditMovieView, /**/
    getSearchEditMovieView,
    postCreateMovie,
    deleteMovie,//se puede eliminar
    editMovie,
    getFavouriteMovies,
    getRemoveMovieView,
    removeTitle,
    removefavourite,
    addfavourite,
    pruebasvictor,
}


module.exports = controllers