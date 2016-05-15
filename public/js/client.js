var socket = io();
$('form').submit(function(){
    var chatMsg = $('#m').val();
    socket.emit('chat message', chatMsg);
     $('#m').val('');
    return false; // why this
})
socket.on('chat message', function (msg) {
    $('#messages').append($('<li>').text(msg));
}); 
