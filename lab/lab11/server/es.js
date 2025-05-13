"use strict";

// Import package
const express = require('express');
const cors = require('cors');
const { check, validationResult } = require('express-validator');
//const morgan = require('morgan'); 
// Create application
const app = express();

//import dao_film.js
const dao = require('./dao_film.js');
const { ExpressValidator } = require('express-validator');
//app.use(morgan('dev'));
app.use(express.json());
app.use(cors());



// Activate server
app.listen(3000, () => console.log('Server ready'));

app.get('/api/films', (req, res) => {
    if (req.query.filter == "favorite") {
        console.log("fav...");
        dao.dbGetFavouriteFilm()
            .then(films => {
                console.log("...success");
                res.json({ message: "favourites", films })
            })
            .catch((err) => res.status(500).json(err));
    }
    else if (req.query.filter == "best") {
        console.log("best...");
        dao.dbGetBestFilm()
            .then(films => {
                console.log("...success");
                res.json({ message: "best", films })
            })
            .catch((err) => res.status(500).json(err));
    }
    else if (req.query.filter == "unseen") {
        console.log("unseen...");
        dao.dbGetUnseenFilm()
            .then(films => {
                console.log("...success");
                res.json({ message: "unseen", films })
            })
            .catch((err) => res.status(500).json(err));
    }
    else if (req.query.filter == "lastmonth") {
        console.log("lastmonth...");
        dao.dbGetLastMonthFilm()
            .then(films => {
                console.log("...success");
                res.json({ message: "last month", films })
            })
            .catch((err) => res.status(500).json(err));
    } else {
        console.log("no filter");
        dao.dbGetAllFilm()
            .then(films => res.json(films))
            .catch((err) => res.status(500).json(err));
    }
})


app.get('/api/films/:id'
    , [check('id').isInt({ min: 0 })],
    async (req, res) => {
        const errors = validationResult(req);
        //    console.log(req.params.id);

        if (!errors.isEmpty()) {
            console.log("error spotted");
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            await dao.dbcheckID(req.params.id)
            dao.dbGetID(req.params.id)
                .then((film) => res.json(film))
                .catch((err) => res.status(500).json(err));
        } catch (err) {
            console.error('no such film present')
            res.status(422).json(err)

        }
    })