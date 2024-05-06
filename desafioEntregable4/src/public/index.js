const socket = io();

socket.on('productAdded', product => {
  console.log('Nuevo producto agregado:', product);
  const productList = document.getElementById('product-list');
  const listItem = document.createElement('li');
  listItem.textContent = `${product.title}: $${product.price}`;
  productList.appendChild(listItem);
});

socket.on('productDeleted', productId => {
  console.log('Producto eliminado:', productId);
  const productList = document.getElementById('product-list');
  const listItem = Array.from(productList.children).find(item => item.dataset.productId === productId);
  if (listItem) {
    listItem.remove();
  }
});

socket.on('evento_para_todos', data => {
  console.log(data);
});
