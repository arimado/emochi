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

// var DB_URL = 'mongodb://localhost:27017/chat';
var DB_URL = 'mongodb://jarimado:chicken@ds023674.mlab.com:23674/emochi';
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

passport.serializeUser(function(user, done) {
    console.log(user);
    console.log("serializing " + user.username);
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    console.log("deserializing " + obj);
    console.log(JSON.stringify(obj));
    done(null, obj);
})

passport.use('local-signup', new LocalStrategy ({ passReqToCallback: true },
    function (req, username, password, done) {
        _auth.localReg(username, password,
            function (err, result) {
                var user;
                if (result) {
                    // looks like this result needs to be the document passed in
                    // maybe with just the user name
                    user = result.ops[0];
                    console.log('REGISTERED SUCCESS FOR: ' + user.username);
                    req.session.success = 'You are logged in as ' + user.username;
                    done(null, user);
                } else if (!result) {
                    console.log('REGISTERED FAILURE');
                    req.session.error = 'That username is already in use';
                    done(null, user);
                } else {
                    console.log('something messed up here');
                    console.log(err);
                }
            }
        );
    })
);

passport.use('local-login', new LocalStrategy ({ passReqToCallback: true },
    function (req, username, password, done) {
        _auth.localAuth(username, password,
            function (err, result) {
                var user;
                if (result) {
                    // looks like this result needs to be the document passed in
                    // maybe with just the user name
                    user = result;
                    console.log('LOGIN SUCCESS FOR: ' + user.username);
                    req.session.success = 'You are logged in as ' + user.username;
                    done(null, result);
                } else if (!result) {
                    console.log('LOGIN FAILURE');
                    req.session.error = 'Could not log in';
                    done(null, result);
                } else {
                    console.log('something messed up here');
                    console.log(err);
                }
            }
        );
    })
);

db.connect(DB_URL, function(err) {
    if (err) {
        console.log('could not connect to DB');
    } else {
        console.log('connected to DB');
    }
});

app.post('/api/register',
    passport.authenticate('local-signup'),
    function(req, res){
        console.log('POST: /api/register')
        res.json(req.user.username)
    }
)

app.get('/logout', function(req, res) {
    var name = req.user.username;
    console.log('LOGGING OUT: ' + name);
    req.logout();                                   // where did this come from?
    req.session.notice = "You have been logged out of: " + name;
    res.json();
    // im going to return a json with true in it because lets hope that doesnt throw an error! lol, you probably should be using a callback but whatever!
});

app.post('/api/login',
    passport.authenticate('local-login'),
    function(req, res) {
        res.json(req.user.username);
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

app.get('/api/user', function(req, res) {
    res.json(req.user);
});

app.get('/api/users', function(req, res) {
    var usersArray;
    var usersCollection = db.get().collection('users').find({}, {password: false}).toArray(function(err, users) {
        // usersArray = users;
        res.json(users);
    });
});

app.post('/api/data', function(req, res) {
    console.log('post request fired');
    var comments = db.get().collection('comments');
    comments.insert({user: req.body.author, text: req.body.text}, function (){
        io.emit('init', 'SERVER');
    });
});

app.post('/api/chats/create', function(req, res) {
    var members = JSON.parse(req.body.data);
    var chats = db.get().collection('chats');
    chats.insert({members: members}, function (err, result){
        res.json(result);
    });
});

app.get('/api/chats', function(req, res) {
    var currentChatId = req.body.id;
    var chats = db.get().collection('chats');
    chats.find({}).toArray(function(err, chats) {
        res.json(chats);
    })
});

io.on('connection', function (socket) {

    console.log("socket connection established: " + socket.id);

    // receive from client
    socket.on('data:message', function (data) {
        io.to(data.chatId).emit('server:data', data);
    });

    socket.on('connect:chatroom', function(chatroom) {
        console.log('connect:chatroom fired')
        console.log('chatroom: ' + chatroom);
        socket.join(chatroom);
    });

    socket.on('disconnect:chatroom', function(chatroom) {
        console.log('disconnect:chatroom fired')
        console.log('chatroom: ' + chatroom);
        socket.leave(chatroom);
    })

    socket.on('disconnect', function () {
        console.log("a socket connection was disconnected");
    });

});

http.listen(process.env.PORT || 3000, function () {
    console.log('listening on 3000');
});
