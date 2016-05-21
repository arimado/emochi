
export default () => {
    var socket = io();

    // emit to the server

    $('form').submit(function(){
        var chatMsg = $('#m').val();
        socket.emit('chat message', chatMsg);
         $('#m').val('');
        return false; // why this
    })

    // receive change from server

    socket.on('chat message', function (msg) {
        $('#messages').append($('<li>').text(msg));
    });
}
