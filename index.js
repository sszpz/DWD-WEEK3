var express = require('express');
var mustacheExpress = require('mustache-express');
var {
  Client
} = require('pg');
var connectionString = process.env.DATABASE_URL;

var client = new Client({
    connectionString: connectionString,
    ssl: true,
});
var bodyParser = require('body-parser');
var post_message = []
var app = express()

app.use(bodyParser.urlencoded({
  extended: false
}))

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname);

client.connect()


// render the index page
app.get('/', function(req, res) {

  client.query('SELECT * FROM posts', (err, res2) => {
    if (err) throw err;
    for (var i = 0; i < res2.rows.length; i++) {
      console.log(res2.rows[i].message);
      post_message[i] = res2.rows[i].message + ' \r\n';
    }
    res.render('forum', {
      postContent: post_message
    });
  });
console.log('Messages Loaded');

})



app.post('/post', function(req, res) {
  console.log(req.body.comment)
  input = [req.body.comment]

  client.query("INSERT INTO posts(message) VALUES($1)", input, (err, res) => {
    if (err) throw err;
  })
  res.redirect('/')
})

app.listen(process.env.PORT || 8000, function() {
  console.log('Started on port 8000')
})