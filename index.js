var express = require('express');
var app = require('express')();
var path = require('path'); //
var http = require('http').Server(app);
var io = require('socket.io')(http);

// SETUP VIEW ENGINE
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.get('/', function (req, res) {
    res.render('index');
});

app.use(express.static(path.join(__dirname, 'public')));

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
