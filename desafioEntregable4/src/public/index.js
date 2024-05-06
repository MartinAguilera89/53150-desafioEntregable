import { io } from 'socket.io-client';


const socket = io();

document.getElementById('product-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    socket.emit('addProduct', {
        title: title,
        description: description

    });

    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
});

document.getElementById('delete-product-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const productId = document.getElementById('product-id').value;

    socket.emit('deleteProduct', productId);
 
    document.getElementById('product-id').value = '';
});

