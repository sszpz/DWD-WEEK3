var express = require('express');
var app = express();

var port = process.env.PORT || 8000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port);