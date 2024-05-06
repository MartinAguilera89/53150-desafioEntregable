// Importa la librería de Socket.IO
import { io } from 'socket.io-client';

// Conecta al servidor de Socket.IO
const socket = io();

// Maneja el evento del formulario del cliente para enviar datos al servidor al agregar un producto
document.getElementById('product-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    // Envía los datos al servidor a través de WebSocket
    socket.emit('addProduct', {
        title: title,
        description: description
        // Agrega otros campos según sea necesario
    });

    // Reinicia el formulario después de enviar los datos
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
});

// Maneja el evento del formulario del cliente para enviar datos al servidor al eliminar un producto
document.getElementById('delete-product-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const productId = document.getElementById('product-id').value;

    // Envía los datos al servidor a través de WebSocket
    socket.emit('deleteProduct', productId);

    // Reinicia el formulario después de enviar los datos
    document.getElementById('product-id').value = '';
});

