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





app.post('/api/films',
    [check('favourite').isInt({ min: 0, max: 1 }),
    check('rating').isInt({ min: 0, max: 5 }),
    check('title').isLength({ min: 1 }),
    check('watchDate').isDate({ format: 'YYYY-MM-DD', strictMode: true })
    ],
    async (req, res) => {
        //console.log(req.body.title);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("error spotted");
            return res.status(400).json({ errors: errors.array() });
        }

        const film = {
            title: req.body.title,
            favorite: req.body.favourite,
            watchDate: req.body.watchDate,
            rating: req.body.rating
        };
        await dao.insert(film)
            .then(
                f => {
                    console.log(f);
                    res.status(200).json({ message: 'Film added successfully' });
                })
            .catch((err) => {
                console.error('Error inserting film:', err);  // Log any error
                res.status(500).json(err)
            });
    })

    
app.delete('/api/films/:id', [check('id').isInt({ min: 0 })],
async (req, res) => {
    const errors = validationResult(req);
    //    console.log(req.params.id);

    if (!errors.isEmpty()) {
        console.log("error spotted");
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        await dao.dbcheckID(req.params.id)


        dao.deleted(req.params.id)
            .then(f => {
                console.log(f);
                res.status(200).json({ message: 'film deleted successfully' });
            })
            .catch((err) => {
                console.error('Error deleting film:', err);  // Log any error
                res.status(500).json(err)
            });
    } catch (err) {
        console.error('no such film present')
        res.status(422).json(err)

    }
})



app.put('/api/films/:id',
    [check('id').isInt({ min: 0 }),
        check('favorite').isInt({ min: 0, max: 1 }).optional(),
        check('rating').isInt({ min: 0, max: 5 }).optional(),
        check('title').isLength({ min: 1 }).optional(),
        check('watchDate').isDate({ format: 'YYYY-MM-DD', strictMode: true }).optional()
        ],
    async (req, res) => {
        const errors = validationResult(req);
        //    console.log(req.params.id);

        if (!errors.isEmpty()) {
            console.log("error spotted");
            return res.status(400).json({ errors: errors.array() });
        }
        const DBfilm = await dao.dbGetFilm(req.params.id);
        //console.log('Favorite value:', req.body.favorite);
        const film = {
            id: req.params.id,
            title: (req.body.title !== undefined && req.body.title !== null) ? req.body.title : DBfilm[0].title,
            favorite: (req.body.favorite !== undefined && req.body.favorite !== null) ? req.body.favorite : DBfilm[0].favourite,
            watchDate: (req.body.watchDate !== undefined && req.body.watchDate !== null) ? req.body.watchDate : DBfilm[0].watchDate,
            rating: (req.body.rating !== undefined && req.body.rating !== null) ? req.body.rating : DBfilm[0].rating
        };
        console.log(film);
        //console.log(DBfilm);
        
        
        try {
            await dao.dbcheckID(req.params.id)
            //console.log(film);
            await dao.updateFilm(film)
                .then(
                    f => {
                        console.log(f);
                        res.status(200).json({ message: 'film updated successfully' });
                    })
                .catch((err) => {
                    console.error('Error modifying film:', err);  // Log any error
                    res.status(500).json(err)
                });
        } catch (err) {
            console.error('no such film present')
            res.status(422).json(err)

        }
    })