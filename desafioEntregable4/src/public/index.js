const socket = io();

document.getElementById('product-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const data = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        status: true,
        category: document.getElementById("category").value,
    }

    socket.emit("addProduct", data);
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';

});

document.getElementById('delete-product-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const productId = document.getElementById('product-id').value;

    socket.emit('deleteProduct', productId);
    document.getElementById('product-id').value = '';

});

// Evento agregar productos
socket.on("productAdded", (product) => {
    // Lo agrego a la lista
    appendProductToList(product);
  });

// Evento eliminar productos
  socket.on("productDeleted", (productId) => {
    // Lo elimino de la lista
    removeProductFromList(productId);

  });


// Escuchar el evento de lista de productos actualizados
socket.on("productList", (updatedProducts) => {
  // Actualizar la lista de productos en la vista
  updateProductList(updatedProducts);
});

// Función para actualizar la lista de productos en la vista
function updateProductList(products) {
  // Limpiar la lista actual de productos
  const productList = document.getElementById('product-list');
  productList.innerHTML = '';

  // Volver a generar la lista de productos con los datos actualizados
  products.forEach(product => {
      const productItem = document.createElement('li');
      productItem.innerHTML = `
          <h3>${product.title}</h3>
          <p>${product.description}</p>
          <p>Código: ${product.code}</p>
          <p>Precio: $${product.price}</p>
          <p>Stock: ${product.stock}</p>
          <p>Categoría: ${product.category}</p>
      `;
      productList.appendChild(productItem);
  });
}