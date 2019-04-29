var express = require('express');
var mustacheExpress = require('mustache-express');
var request = require('request');
const bodyParser = require('body-parser'); //to handle post request
var { Client } = require('pg');
var connectionString = process.env.DATABASE_URL;
//'postgres://vvccboedpnfrwz:d5112736a828712297b8e2d0043629df29fe74b590bd5b865198a70f7403b560@ec2-23-23-92-204.compute-1.amazonaws.com:5432/d2bt6ppaqap0hc';


var app = express();
var port = process.env.PORT || 8000;
var client = new Client({
    database: 'postgresql-silhouetted-26173', //'posts-test'
    connectionString: connectionString,
    ssl: true,
});
var posts;
var allPosts;
var myText = 'this is a new line'
var updatedPosts;


app.use(bodyParser.urlencoded({ extended: true }));
// next 3 lines set up mustache
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname);

client.connect();

app.get("/", function (req, res) {

    client.query('SELECT * FROM posts', function (err, res0) {
        if (err) {
            console.log(err.stack);
        }
        allPosts = res0.rows;
        console.log(allPosts);

        res.render('forum', {
            "postContent": allPosts,
            "post": function () {
                return this.message;
            }
        });
    });
    console.log('Forum Loaded');
});


app.post('/update', function (req, res) {
    var newPost = req.body.textarea;
    console.log(newPost);
    client.query("INSERT INTO posts (message) VALUES ('" + newPost + "')"), function (err, res) {
        if (err) {
            console.log(err.stack);
        }
    }

    res.redirect('/');
});

app.listen(port);