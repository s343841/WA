"use strict";

// Import package
const express = require('express');
const cors = require('cors');
const { check, validationResult } = require('express-validator');
const passport = require('passport'); // auth middleware

const LocalStrategy = require('passport-local'); // username and password for login
const session = require('express-session'); // enable sessions

//const morgan = require('morgan'); 
// Create application
const app = express();



//import dao_film.js
const dao = require('./dao_film.js');
const userDao = require('./dao_users.js'); // module for accessing the user info in the DB
const { ExpressValidator } = require('express-validator');
//app.use(morgan('dev'));
app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
  function(username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Incorrect username or password.' });
        
      return done(null, user);
    })
  }
));

// serialize and de-serialize the user (user object <-> session)
// we serialize only the user id and store it in the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  userDao.getUserById(id)
    .then(user => {
      done(null, user); // this will be available in req.user
    }).catch(err => {
      done(err, null);
    });
});




// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated())
    return next();
  
  return res.status(401).json({ error: 'Not authenticated'});
}

// set up the session
app.use(session({
  // by default, Passport uses a MemoryStore to keep track of the sessions
  secret: 'wge8d239bwd93rkskb',   // change this random string, should be a secret value
  resave: false,
  saveUninitialized: false
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());

// Activate server
app.listen(3000, () => console.log('Server ready'));

app.get('/api/films', isLoggedIn, (req, res) => {
    if (req.query.filter == "favorite") {
        console.log("fav...");
        dao.dbGetFavouriteFilm(req.user.id)
            .then(films => {
                console.log("...success");
                res.json({ message: "favourites", films })
            })
            .catch((err) => res.status(500).json(err));
    }
    else if (req.query.filter == "best") {
        console.log("best...");
        dao.dbGetBestFilm(req.user.id)
            .then(films => {
                console.log("...success");
                res.json({ message: "best", films })
            })
            .catch((err) => res.status(500).json(err));
    }
    else if (req.query.filter == "unseen") {
        console.log("unseen...");
        dao.dbGetUnseenFilm(req.user.id)
            .then(films => {
                console.log("...success");
                res.json({ message: "unseen", films })
            })
            .catch((err) => res.status(500).json(err));
    }
    else if (req.query.filter == "lastmonth") {
        console.log("lastmonth...");
        dao.dbGetLastMonthFilm(req.user.id)
            .then(films => {
                console.log("...success");
                res.json({ message: "last month", films })
            })
            .catch((err) => res.status(500).json(err));
    } else {
        console.log("no filter");
        dao.dbGetAllFilmByUser(req.user.id)
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
            dao.dbGetID(req.params.id,req.user.id)
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
        await dao.insert(film,req.user.id)
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


        dao.deleted(req.params.id,req.user.id)
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
        const DBfilm = await dao.dbGetFilm(req.params.id,req.user.id);
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
            await dao.updateFilm(film,req.user.id)
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


    /*** Users APIs ***/

// POST /sessions 
// login
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).json(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        // this is coming from userDao.getUser()
        return res.json(req.user);
      });
  })(req, res, next);
});

// ALTERNATIVE: if we are not interested in sending error messages...
/*
app.post('/api/sessions', passport.authenticate('local'), (req,res) => {
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  res.json(req.user);
});
*/

// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout( ()=> { res.end(); } );
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {  if(req.isAuthenticated()) {
    res.status(200).json(req.user);}
  else
    res.status(401).json({error: 'Unauthenticated user!'});;
});