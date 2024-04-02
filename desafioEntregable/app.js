class ProductManager {
    constructor() {
        this.products = []
    }

    addProduct(product) {
        // Validar que todos los campos sean obligatorios
        if (!this.isProductValid(product)) {
            console.log("Error: El producto no es válido");
            return;
        }

        // Validar que no se repita el campo "code"
        const codeExists = this.products.some(p => p.code === product.code);
        if (codeExists) {
            console.log("El código de producto ya existe.");
            return;
        }

        // Crear un nuevo producto con un id autoincrementable
        const newProduct = {
            id: this.products.length + 1,
            title: product.title,
            description: product.description,
            price: product.price,
            thumbnail: product.thumbnail,
            code: product.code,
            stock: product.stock
        };

        // Agregar el nuevo producto al arreglo de productos
        this.products.push(newProduct);
        console.log("Producto agregado correctamente.");
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(p => p.id === id);
        if (product) {
            return product;
        } else {
            console.log("Producto no encontrado.");
        }
    }

    isProductValid(product) {
        return (
            product.title &&
            product.description &&
            product.price &&
            product.thumbnail &&
            product.code &&
            product.stock !== undefined
        );
    }
}

//testing
const productManager = new ProductManager()

productManager.addProduct({
    title: "Producto A",
    description: "Descripción prod A",
    price: 10.99,
    thumbnail: 'ruta/imagenA.jpg',
    code: 'P001',
    stock: 5
})


productManager.addProduct({
    title: "Producto B",
    description: "Descripción prod B",
    price: 100.99,
    thumbnail: 'ruta/imagenB.jpg',
    code: 'P001',
    stock: 10
})

productManager.addProduct({
    title: "Producto C",
    description: "Descripción prod C",
    price: '',
    thumbnail: 'ruta/imagenC.jpg',
    code: 'P002',
    stock: 15
})


const productos = productManager.getProducts()
const producto = productManager.getProductById(2)

console.log(productos)