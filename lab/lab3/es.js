"use strict";

// Import package
const express = require('express');
//const morgan = require('morgan'); 
// Create application
const app = express();

//import dao_film.js
const dao = require('./dao_film.js');
//app.use(morgan('dev'));
app.use(express.json());


// Activate server
app.listen(3000, () => console.log('Server ready'));

app.get('/api/films', (req, res) => {
    if (req.query.filter=="favorite") {
        console.log("fav...");
        dao.dbGetFavouriteFilm()
        .then(films => {
            console.log("...success");
            res.json({message:"favourites",films})})
        .catch((err) => res.status(500).json(err));
    }
    else if (req.query.filter=="best") {
        console.log("best...");
        dao.dbGetBestFilm()
        .then(films => {
            console.log("...success");
            res.json({message:"best",films})})
        .catch((err) => res.status(500).json(err));
    }
    else if (req.query.filter=="unseen") {
        console.log("unseen...");
        dao.dbGetUnseenFilm()
        .then(films => {
            console.log("...success");
            res.json({message:"unseen",films})})
        .catch((err) => res.status(500).json(err));
    }
    else if (req.query.filter=="lastmonth") {
        console.log("lastmonth...");
        dao.dbGetLastMonthFilm()
        .then(films => {
            console.log("...success");
            res.json({message:"last month",films})})
        .catch((err) => res.status(500).json(err));
    } else {
        console.log("no filter");
        dao.dbGetAllFilm()
        .then(films => res.json(films))
        .catch((err) => res.status(500).json(err));
    }
})


app.post('/api/films', async (req, res) => {
    //console.log(req.body.title);
    const film = {
        title: req.body.title,
        favourite: req.body.favorite,
        date: req.body.watchDate,
        rating: req.body.rating
    };
    await dao.insert(film)
        .then(
            f => {
                console.log(f);
                res.status(200).json({ message: 'Film added successfully'});
            })
        .catch((err) => {
            console.error('Error inserting film:', err);  // Log any error
            res.status(500).json(err)
        });
})

app.put('/api/films/:id/change-favourite', async (req, res) => {
    //console.log(req.body.title);
    const film = {
        id: req.body.id,
        deltaRating: req.body.deltaRating,
    };
    await dao.updateFavourite(film)
        .then(
            f => {
                console.log(f);
                res.status(200).json({ message: 'favourite preferences updated successfully'});
            })
        .catch((err) => {
            console.error('Error modifying film:', err);  // Log any error
            res.status(500).json(err)
        });
})

app.put('/api/films/:id/change-rating', async (req, res) => {
    //console.log(req.body.title);
    const film = {
        id: req.body.id,
        deltaRating: req.body.deltaRating,
    };
    await dao.updateRating(film)
        .then(
            f => {
                console.log(f);
                res.status(200).json({ message: 'rating updated successfully'});
            })
        .catch((err) => {
            console.error('Error modifying film:', err);  // Log any error
            res.status(500).json(err)
        });
})

app.delete('/api/films/:id', (req, res) => {
    //    console.log(req.params.id);
    dao.deleted(req.params.id)
        .then(f => {
            console.log(f);
            res.status(200).json({ message: 'film deleted successfully'});
        })
        .catch((err) => {
            console.error('Error deleting film:', err);  // Log any error
            res.status(500).json(err)
        });
})

app.get('/api/films/:id', (req, res) => {
    //    console.log(req.params.id);
    dao.dbGetID(req.params.id)
        .then((film) => res.json(film))
        .catch((err) => res.status(500).json(err));
})


app.put('/api/films/:id', async (req, res) => {
    //console.log(req.body.title);
    const film = {
        id: req.params.id,
        title : req.body.title,
        favorite : req.body.favorite,
        watchDate : req.body.watchDate,
        rating : req.body.rating
    };

    //console.log(film);
    await dao.updateFilm(film)
        .then(
            f => {
                console.log(f);
                res.status(200).json({ message: 'favourite preferences updated successfully'});
            })
        .catch((err) => {
            console.error('Error modifying film:', err);  // Log any error
            res.status(500).json(err)
        });
})


