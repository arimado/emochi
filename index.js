var express = require('express');
var app = require('express')();
var path = require('path'); //
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var DATA_FILE = path.join(__dirname, './data/data.json');

// SETUP VIEW ENGINE
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.get('/', function (req, res) {
    res.render('index');
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/data', function(req, res) {
    fs.readFile(DATA_FILE, function(err, data) {
        if (err) {
          console.error(err);
          process.exit(1);  // WHAT IS THIS?
        }
        res.json(JSON.parse(data));
    });
});

io.on('connection', function (socket) {
    console.log('a user connected!');

    socket.on('chat message', function (msg) {
        console.log('message: ' + msg);
        io.emit('chat message', msg)
    });

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

http.listen(3000, function () {
    console.log('listening on 3000');
});
