const { validationResult } = require('express-validator');
const { Movie, Genre, Sequelize } = require('../database/models');
const { Op } = Sequelize;

//Otra forma de llamar a los modelos
//const sequelize = db.sequelize;
//const Movies = db.Movie;

const moviesController = {
    list: (req, res) => {
        Movie.findAll()
            .then(movies => {
                //return res.send(movies)
                res.render('moviesList.ejs', {movies})
            })
    },
    detail: (req, res) => {
        Movie.findByPk(req.params.id, {include:
            [{association: "actors"},
            {association: "genre"},]
        })
            .then(movie => {
                //return res.render(movie)
                return res.render('moviesDetail.ejs', {movie});
            })
    },
    newest: (req, res) => {
        Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    recomended: (req, res) => {
        Movie.findAll({
            where: {
                rating: {[Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        Genre.findAll()
        .then(genres => {
            return res.render("moviesAdd", {genres});
        })
        .catch(error => console.log(error))
    },
    create: function (req, res) {
        const ERRORS = validationResult(req);

        if(ERRORS.isEmpty){
            const { title, awards, release_date, length, rating, genre_id } = req.body;

            // Movie.create({ ...req.body });
            Movie.create({ title, awards, release_date, length, rating, genre_id })
            .then((movie) => {
                return res.redirect("/movies")
            })
            .catch((error) => console.log(error))

        } else {
            return res.render("moviesAdd", {errors: ERRORS.mapped()})
        };
    },
    edit: function(req, res) {
        const MOVIE_ID = req.params.id;
        const MOVIE_PROMISE = Movie.findByPk(MOVIE_ID);
        const GENRES_PROMISE = Genre.findAll();
        
        Promise.all([MOVIE_PROMISE, GENRES_PROMISE])
        .then(([Movie, genres]) => {
            return res.render("moviesEdit", { Movie, genres })
        })
        .catch(error => console.log(error));
    },
    update: function (req,res) {
        const ERRORS = validationResult(req);
        const MOVIE_ID = req.params.id;

        if(ERRORS.isEmpty()) {

            Movie.update({...req.body}, {
                where: {
                    id: MOVIE_ID,
                }
            })
            .then((response) => {
                if(response){
                    return res.redirect(`/movies/detail/${MOVIE_ID}`)
                } else {
                    // redirije a vista de error
                }
            })

        } else {
            Movie.findByPk(MOVIE_ID)
            .then(Movie => {
                return res.render("moviesEdit", {
                    Movie,
                    errors: ERRORS.mapped
                })
            })
            .catch(error => console.log(error));
        };

    },
    deleteMovie: function (req, res) {
        const MOVIE_ID = req.params.id;
        Movie.findByPk(MOVIE_ID)
        .then(movieToDelete => {
            return res.render("moviesDelete", { Movie: movieToDelete })
        })
        .catch(error => console.log(error))
    },
    destroy: function (req, res) {
        const MOVIE_ID = req.params.id;

        Movie.destroy({
            where: {
                id: MOVIE_ID,
            }
        })
        .then(response => response ? res.redirect("/movies/") : error )
        .catch(error => console.log(error))
    }

}

module.exports = moviesController;