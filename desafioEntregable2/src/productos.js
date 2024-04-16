const ProductManager = require('./productManager.js')

const manager = new ProductManager('products.json')

manager.addProduct({
    title: "Nuevo Producto",
    description: "Descripción del nuevo producto",
    price: 9.99,
    thumbnail: 'imagen.jpg',
    code: "151",
    stock: 15
});

const productos = manager.getProducts(); // Obtenemos los productos directamente

console.log('Productos:', productos); // Imprimimos los productos

