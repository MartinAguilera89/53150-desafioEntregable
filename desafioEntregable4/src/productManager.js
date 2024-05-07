import fs from "fs/promises"

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = [];
    this.nextID = 1;
    this.initialize();
  }

  async initialize() {
    try {
      const data = await this.readFile();
      this.products = data;
      this.nextID =
        this.products.length > 0
          ? Math.max(...this.products.map(product => product.id)) + 1
          : 1;
    } catch (error) {
      console.log('Error al inicializar la clase ProductManager: ', error.message);
    }
  }

  async addProduct(producto) {
    if (!producto.title || !producto.description || !producto.price || !producto.code || !producto.stock) {
        console.log("Error: Todos los campos del producto son obligatorios.");
        return;
      }
  
      const codeExists = this.products.some(product => product.code === producto.code);
  
      if (codeExists) {
        console.log('Error: Este producto ya existe.');
        return;
      }
  
      const newProduct = {
        id: this.nextID++,
        title: producto.title,
        description: producto.description,
        price: producto.price,
        thumbnail: producto.thumbnail,
        code: producto.code,
        stock: producto.stock,
      };
  
      this.products.push(newProduct);
      console.log("Producto agregado:");
      console.log(newProduct);
  
      await this.saveProductsToFile();
  }

  async getProductById(id, res) {
    const product = this.products.find(product => product.id === id);
  
    if (product) {
      console.log("Producto encontrado:");
      console.log(product);
      res.json(product); // Enviar el producto encontrado como respuesta
    } else {
      console.log("Error: No se encontró el producto con ID " + id);
      res.status(404).json({ error: 'Producto no encontrado' }); // Enviar un mensaje de error al cliente
    }
  }
  
  async deleteProduct(productId) {
    try {
        const products = await this.readFile();
        const filteredProduct = products.find((product) => product.id === productId);

        if (!filteredProduct) {
            console.log("El producto no existe.");
            return;
        }

        if (filteredProduct) {
            products.splice(products.indexOf(filteredProduct), 1);
            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
            console.log("Producto eliminado correctamente.");
        }
    } catch (error) {
        console.error("Error al elimianr el archivo.", error);
    }

};

  async readFile() {
    let finalData = [];
    try {
      finalData = await fs.readFile(this.path, 'utf-8');
      finalData = JSON.parse(finalData);
    } catch (error) {
      console.log('error al leer el archivo: ', error.message);
    }
    return finalData;
  }

  async getProducts() {
    return await this.readFile();
  }

  async saveProductsToFile() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
      console.log('Datos guardados en el archivo:', this.path);
    } catch (error) {
      console.error('Error al guardar los datos en el archivo:', error.message);
      throw error;
    }
  }
}

export default ProductManager;