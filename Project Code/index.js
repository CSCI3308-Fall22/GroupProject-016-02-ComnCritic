const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const axios = require('axios');

// database configuration
const dbConfig = {
    host: 'db',
    port: 5432,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
};

const db = pgp(dbConfig);

// test your database
db.connect()
    .then(obj => {
        console.log('Database connection successful'); // you can view this message in the docker compose logs
        obj.done(); // success, release the connection;
    })
    .catch(error => {
        console.log('ERROR:', error.message || error);
    });

app.set('view engine', 'ejs');

app.use(bodyParser.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
    })
);

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.listen(3000);
console.log('Server is listening on port 3000');


app.get('/', (req, res) =>{
    res.redirect('/login'); //this will call the /anotherRoute route in the API
});

app.get('/login', (req, res) => {
    res.render("pages/login.ejs")
});

app.get('/register', (req, res) => {
    res.render('pages/register.ejs');
});

// Register submission
app.post('/register', async (req, res) => {
    //the logic goes here
    const hash = await bcrypt.hash(req.body.password, 10);
    const query = `INSERT INTO users (username,password) VALUES ('${req.body.username}', '${hash}') returning *;`

    db.any(query)
        .then(() => {
            res.locals.message = "Account Created";
        res.redirect("/login");
        })
        .catch((err) => {
            res.locals.error = "danger";
            res.locals.message = "Username Already Exists";
            console.log(err);
            res.redirect("/register");
        });
});

app.post('/login', async (req, res) => {
    //the logic goes here
    const query = 'SELECT * FROM users WHERE username = $1';
     //await is explained in #8
    db.any(query,[req.body.username])
        .then(async (user) => {
            const match = await bcrypt.compare(req.body.password, user[0].password);
            if (!match) {
                res.locals.error = "danger";
                res.locals.message = "Incorrect Password";
                console.log("Password Incorrect");
                res.render("pages/login");
                res.redirect("/home");
            }
            else {
                console.log(match);
                console.log("Match");
                req.session.user = {
                    api_key: process.env.API_KEY,
                };
                req.session.save();
                console.log("Password Correct");
                res.redirect("/home");
            }
        })
        .catch((err) => {
            res.locals.error = "danger";
            res.locals.message = "Incorrect Username";
            console.log("Password Incorrect");
            res.render("pages/login.ejs")
            return console.log(err)
        });
});

// Authentication Middleware.
const auth = (req, res, next) => {
    if (!req.session.user) {
        // Default to register page.
        return res.redirect('/register');
    }
    next();
};

// Authentication Required
app.use(auth);

app.get('/home', (req, res) => {

    console.log("Home Call");

    db.any(`SELECT * FROM movies ORDER BY movie_id desc `)
        .then((data) => {
            console.log("Fetching Movies",data);

            res.render("pages/home.ejs",{data: data});
        })
        .catch((err) => {
            res.locals.message = "Something Went Wrong";
            console.log(err);
            res.render("pages/home.ejs", {data: []});
        });
});

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.render("pages/login");
});


app.get("/getMovieInfo", function (req, res) {
    var query = "SELECT * FROM movies WHERE movie_id = $1"
    db.any(query)
    .then(function (rows) {
        res.send(rows);
    })
    .catch(function (err) {
        console.log(err)
    })
})

app.post("/sko", function (req, res) {
    console.log("Sko'd");
    db.any(`UPDATE movies SET skoNo = skoNo + 1 WHERE movie_id = $1`,[req.body.movie_id])
        .then(function (rows) {
            console.log("adding sko");

            res.redirect("/home")
        })
        .catch(function (err) {
            console.log(err)
        })
})

app.post("/no", function (req, res) {
    console.log("No'd");
    db.any(`UPDATE movies SET skoNo = skoNo + -1 WHERE movie_id = $1`,[req.body.movie_id])
        .then(function (rows) {
            console.log("adding no");
            res.redirect("/home")
        })
        .catch(function (err) {
            console.log(err)
        })
})

app.get('/mostSko', (req, res) => {

    console.log("Most Sko'd");

    db.any(`SELECT * FROM movies ORDER BY skono desc limit 3`)
        .then((data) => {
            console.log("Fetching Most Sko'd movies",data);

            res.render("pages/trending.ejs",{data: data});
        })
        .catch((err) => {
            res.locals.message = "Something Went Wrong";
            console.log(err);
            res.render("pages/trending.ejs", {data: []});
        });
});