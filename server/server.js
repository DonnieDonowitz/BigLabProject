const express = require('express');
const morgan = require('morgan');
const { check, param, query, validationResult } = require('express-validator');
const dbi = require('./dbi');
const userDbi = require('./userDbi');
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions

/*** Set up Passport ***/
// set up the "username and password" login strategy
passport.use(new LocalStrategy(
    function (username, password, done) {
        userDbi.getUser(username, password).then((user) => {
            if (!user)
                return done(null, false, { message: 'Incorrect username and/or password.' });

            return done(null, user);
        })
    }
));

// serialize and de-serialize the user (user object <-> session)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((userId, done) => {
    userDbi.getUserById(userId) //access to db
        .then(user => {
            done(null, user); // this will be available in req.user
        }).catch(err => {
            done(err, null);
        });
});

//init express
const PORT = 3001;
const app = new express();

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());

// Check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();
    return res.status(401).json({ error: 'not authenticated' });
}

//MIDDLEWARE
// set up the session
app.use(session({
    secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
    resave: false,
    saveUninitialized: false,
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());



/*** APIs ***/

app.get('/api/tasks', [
    isLoggedIn,
    query('start').optional().isDate({ format: 'YYYY-MM-DD', strictMode: true }),
    query('end').optional().isDate({ format: 'YYYY-MM-DD', strictMode: true })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    if (req.query.start && req.query.end) {
        try {
            const result = await dbi.getTasksByUserIDAndDateInterval(req.user.id, req.query.start, req.query.end);
            if (result.error) res.json([]);
            else res.json(result);
        } catch (error) {
            res.status(500).end();
        }
    } else {
        try {
            const result = await dbi.getTasksByUserID(req.user.id);
            if (result.error) res.json([]);
            else res.json(result);
        } catch (error) {
            res.status(500).end();
        }
    }
});

app.get('/api/tasks/:id', [
    isLoggedIn,
    param('id').isInt({ min: 1 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        const result = await dbi.getTaskByID(req.params.id, req.user.id);

        if (result.error) {
            res.status(404).json(result);
        } else {
            res.json(result);
        }
    } catch (error) {
        res.status(500).json({ error: 'Database error occurred while retrieving the task.' });
    }
});

app.get('/api/user/:userID', isLoggedIn , async (req, res) => {
    try {
        const result = await dbi.getTasksByUserID(req.params.userID, req.user.id);

        if (result.error) res.status(404).json(result);
        else res.json(result);
    } catch (error) {
        res.status(500).end();
    }
});

app.get('/api/deadline/:deadline', isLoggedIn, async (req, res) => {
    try {
        const result = await dbi.getTasksByDeadline(req.params.deadline, req.user.id);

        if (result.error) {
            res.json([]);
        } else {
            res.json(result);
        }
    } catch (error) {
        res.status(500).end();
    }
});

app.get('/api/important', isLoggedIn, async (req, res) => {
    try {
        const result = await dbi.getImportantTasks(req.user.id);

        if (result.error) res.status(404).json(result);
        else res.json(result);
    } catch (error) {
        res.status(500).end();
    }
});

app.get('/api/private', isLoggedIn, async (req, res) => {
    try {
        const result = await dbi.getPrivateTasks(req.user.id);

        if (result.error) res.status(404).json(result);
        else res.json(result);
    } catch (error) {
        res.status(500).end();
    }
});

app.post('/api/tasks', [
    isLoggedIn,
    check('description').isLength({ min: 1 }),
    check('important').isInt({ min: 0, max: 1 }),
    check('private').isInt({ min: 0, max: 1 }),
    check('completed').isInt({ min: 0, max: 1 }),
    check('deadline').isISO8601().optional({nullable: true}),
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const task = {
        description: req.body.description,
        important: req.body.important,
        private: req.body.private,
        deadline: req.body.deadline,
        completed: req.body.completed,
    };

    try {
        await dbi.createTask(task, req.user.id);

        res.status(201).end();
    } catch (error) {
        res.status(503).json({ error: 'Database error during the creation of the task.' });
    }
});

app.put('/api/tasks/:id', [
    isLoggedIn,
    param('id').isInt({ min: 1 }),
    check('description').isLength({ min: 1 }),
    check('important').isInt({ min: 0, max: 1 }),
    check('private').isInt({ min: 0, max: 1 }),
    check('completed').isInt({ min: 0, max: 1 }),
    check('deadline').isISO8601().optional({nullable: true}),
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const task = {
        description: req.body.description,
        important: req.body.important,
        private: req.body.private,
        deadline: req.body.deadline,
        completed: req.body.completed,
    };

    try {
        const result = await dbi.updateTask(task, req.params.id, req.user.id);

        if (result.error) {
            res.status(404).json(result.error);
        } else {
            res.status(200).end();
        }
    } catch (error) {
        res.status(503).json({ error: `Database error during the update of the task ${req.params.id}` });
    }
});

app.put('/api/marktask/:id', [
    isLoggedIn,
    param('id').isInt({ min: 1 }),
    check('completed').isInt({ min: 0, max: 1 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        const result = await dbi.markTaskCompletion(req.params.id, req.body.completed, req.user.id);

        if (result.error) {
            res.status(404).json(result.error);
        } else {
            res.status(200).end();
        }
    } catch (error) {
        res.status(503).json({ error: `Database error during the update of the task ${req.params.id}` });
    }
});

app.delete('/api/tasks/:id', [
    isLoggedIn,
    param('id').isInt({ min: 1 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        const result = await dbi.deleteTask(req.params.id, req.user.id);

        if (result.error) {
            res.status(404).json(result);
        } else {
            res.status(204).end();
        }
    } catch (error) {
               //user: req.body.useres.status(503).json({ error: `Database error during the deletion of task ${req.params.id}` });
    }
});



/*** Users APIs ***/
app.post('/api/sessions', function (req, res, next) {
    passport.authenticate('local', (err, user, info) => { //gestiamo l'errore
        if (err)
            return next(err);
        if (!user) {
            // display wrong login messages
            return res.status(401).json(info);
        }
        // success, perform the login. 
        req.login(user, (err) => {
            if (err)
                return next(err);

            // req.user contains the authenticated user, we send all the user info back
            return res.json(req.user); 
        });
    })(req, res, next);
});

// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
    req.logout();
    res.end();
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json(req.user);
    }
    else
        res.status(401).json({ error: 'User is not authenticated!' });;
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));