import express from 'express';
import ProductManager from '../dao/clases/productManager.js';

const router = express.Router();

// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await ProductManager.getProducts();
    res.json(products);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para obtener un producto por ID
router.get('/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await ProductManager.getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error al obtener el producto por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para agregar un nuevo producto
router.post('/', async (req, res) => {
  const productData = req.body;
  try {
    const newProduct = await ProductManager.addProduct(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error al agregar el producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para actualizar un producto existente
router.put('/:id', async (req, res) => {
  const productId = req.params.id;
  const productData = req.body;
  try {
    const updatedProduct = await ProductManager.updateProduct(productId, productData);
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para eliminar un producto
router.delete('/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    await ProductManager.deleteProduct(productId);
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;

