var express = require('express'); 
var app = require('express')();
var path = require('path'); //
var http = require('http').Server(app);

// SETUP VIEW ENGINE
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.get('/', function (req, res) {
    res.render('index');
});

app.use(express.static(path.join(__dirname, 'public')));

http.listen(3000, function () {
    console.log('listening on 3000');
});
