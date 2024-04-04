const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, '[]');
        }
        this.loadProducts();
    }

    addProduct(product) {
        if (!this.isProductValid(product)) {
            throw new Error("Error: El producto no es válido");
        }

        const id = this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1;
        const newProduct = { id, ...product };
        this.products.push(newProduct);
        this.saveProducts();
        return newProduct;
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
        } catch (error) {
            this.products = [];
        }
    }

    saveProducts() {
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
    }

    
    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) {
            throw new Error("Producto no encontrado.");
        }
        return product;
    }

    updateProduct(id, updatedFields) {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error("Producto no encontrado.");
        }
        this.products[index] = { ...this.products[index], ...updatedFields };
        this.saveProducts();
        return this.products[index];
    }

    deleteProduct(id) {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error("Producto no encontrado.");
        }
        this.products.splice(index, 1);
        this.saveProducts();
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

module.exports = ProductManager;

// Testing
