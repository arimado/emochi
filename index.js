var express = require('express');
var app = require('express')();
var path = require('path'); //
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var db = require('./db.js');

var DB_URL = 'mongodb://localhost:27017/chat';
var DATA_FILE = path.join(__dirname, './data/data.json');

// SETUP VIEW ENGINE
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));

db.connect(DB_URL, function(err) {
    if (err) {
        console.log('could not connect to DB');
    } else {
        console.log('connected to DB');
    }
});

app.get('/', function (req, res) {
    // find the command that will emit to the user
    // stuck on io.emit here
    io.emit('chat message', 'recieved from socket emit');
    res.render('index');
});

app.get('/api/data', function(req, res) {
    console.log('serving new data');
    var comments = db.get().collection('comments');
    comments.find({}).toArray(function(err, docs){
        var clientComments = docs.map(function (doc){
            return { _id: doc._id, author: doc.user, text: doc.text};
        })
        res.json(clientComments);
    });
});


app.post('/api/data', function(req, res) {
    console.log(req.body.author);
    console.log(req.body.text);
    var comments = db.get().collection('comments');
    comments.insert({user: req.body.author, text: req.body.text});

});

io.on('connection', function (socket) {

    console.log('a user connected!');
    // receive from client
    socket.on('chat message', function (msg) {
        console.log('message: ' + msg);
        // emit to all clients
        io.emit('chat message', msg);
        io.emit('init', 'SERVER');
    });

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

http.listen(3000, function () {
    console.log('listening on 3000');
});
