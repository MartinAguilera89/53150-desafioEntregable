const socket = io();

socket.on('chat message', function(msg) {
    const messages = document.getElementById('messages');
    const message = document.createElement('div');
    message.innerText = `${msg.user}: ${msg.message}`;
    messages.appendChild(message);
});

function sendMessage() {
    const user = document.getElementById('user').value;
    const message = document.getElementById('message').value;
    socket.emit('chat message', { user, message });
}
