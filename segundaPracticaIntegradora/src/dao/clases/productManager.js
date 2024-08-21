import Product from '../models/product.model.js';

class ProductManager {
  async getProducts(filter = {}, options = {}) {
    try {
      return await Product.paginate(filter, options);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      throw new Error('Error al obtener los productos');
    }
  }

  async getProductById(id) {
    try {
      return await Product.findById(id);
    } catch (error) {
      console.error('Error al obtener el producto por ID:', error);
      throw new Error('Error al obtener el producto por ID');
    }
  }

  async addProduct(productData) {
    try {
      console.log('Datos del producto a agregar:', productData); // Log de depuración
      const product = new Product(productData);
      await product.save();
      return product;
    } catch (error) {
      console.error('Error al agregar el producto:', error);
      throw new Error('Error al agregar el producto');
    }
  }

  async updateProduct(id, productData) {
    try {
      return await Product.findByIdAndUpdate(id, productData, { new: true });
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      throw new Error('Error al actualizar el producto');
    }
  }

  async deleteProduct(id) {
    try {
      await Product.findByIdAndDelete(id);
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      throw new Error('Error al eliminar el producto');
    }
  }
}

export default new ProductManager()