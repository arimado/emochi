#chat

A Real-time react chat application.

Using: Node, Express, React, Socket.io

## Socket IO

<pre><code>
io.on('connection', function (socket) {
    // a callback called on each connection
    socket.on('receiveedEventIdentifier', function (eventData){
        // emit this to all open sockets
        // typically will be the data you receive from an open socket
        io.emit('sendEventItenfier', sendData)
    });

    // disconnect event
    socket.on('disconnect', function (){
    });
})
</code></pre>
