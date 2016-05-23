var express = require('express');
var app = require('express')();
var path = require('path'); //
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var db = require('./db.js');
var _auth = require('./auth.js');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var session = require('express-session');

var DB_URL = 'mongodb://localhost:27017/chat';
var DATA_FILE = path.join(__dirname, './data/data.json');

// SETUP VIEW ENGINE
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret: 'supernova', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
    var err = req.session.error;
    var msg = req.session.notice;
    var success = req.session.success;

    delete req.session.error;
    delete req.session.success;
    delete req.session.notice;

    if (err) res.locals.error = err;
    if (msg) res.locals.notice = msg;
    if (success) res.locals.success = success;
    next();
});

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
    console.log('req.user: -- ');
    console.log(req.user)
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

app.get('/api/user', function(req, res) {
    res.json(req.user);
});

app.post('/api/data', function(req, res) {
    console.log('post request fired');
    var comments = db.get().collection('comments');
    comments.insert({user: req.body.author, text: req.body.text}, function (){
        io.emit('init', 'SERVER');
    });
});

app.post('/api/register', function(req, res) {
    console.log('register post request fired');
    _auth.localReg(req.body.username, req.body.password, function (err, res){
        if(err) console.log(err, res);
    })
});

app.post('/api/login', function(req, res) {
    console.log('login post request fired');
    _auth.localAuth(req.body.username, req.body.password, function (err, res){
        if(err) console.log(err, res);
    })

});

io.on('connection', function (socket) {

    console.log('a user connected!');
    // receive from client
    socket.on('chat message', function (msg) {
        // emit to all clients
        io.emit('chat message', msg);
        io.emit('init', 'SERVER');
    });

    socket.on('user:comment', function (comment) {
        console.log('received comment emit')
        // every time a receive a comment
        // im going to emit it to everyone
        io.emit('init', 'SERVER');
    })

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

http.listen(3000, function () {
    console.log('listening on 3000');
});
