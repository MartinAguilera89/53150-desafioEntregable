const socket = io();

document.getElementById('product-form').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const data = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price"),
        code: document.getElementById("code"),
        stock: document.getElementById("stock")
    }

    socket.emit("addProduct", data);

    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
});

document.getElementById('delete-product-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const productId = document.getElementById('product-id').value;

    socket.emit('deleteProduct', productId);
 
    document.getElementById('product-id').value = '';
});