import { Router } from "express";
import cartModel from "../dao/models/cart.model.js";
import userModel from "../dao/models/user.model.js";

const cartRouter = Router();

// Middleware para obtener el carrito del usuario autenticado
const getUserCart = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({ error: "No está autenticado" });
  }
  try {
    const user = await userModel.findById(req.user._id).populate({
      path: 'cart',
      populate: {
        path: 'products.product',
        model: 'products'
      }
    });

    if (!user || !user.cart) {
      return res.status(404).send({ error: "Carrito no encontrado para el usuario" });
    }

    req.cart = user.cart;
    console.log('Carrito del usuario:', JSON.stringify(req.cart, null, 2));
    next();
  } catch (error) {
    res.status(500).send({ error: "Error al obtener el carrito del usuario" });
  }
};

// Usamos el middleware para asegurarnos de que las operaciones se realicen sobre el carrito del usuario autenticado
cartRouter.use(getUserCart);

cartRouter.get("/", async (req, res) => {
  try {
    res.render('carts', { cart: req.cart }); // Renderiza la vista con el carrito del usuario
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error al obtener el carrito" });
  }
});

cartRouter.post("/products", async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Verifica que el carrito existe
    if (!req.cart) {
      return res.status(404).send({ error: "Carrito no encontrado" });
    }

    // Verifica si el producto ya está en el carrito
    const existingProductIndex = req.cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingProductIndex >= 0) {
      // Si el producto ya existe, actualiza la cantidad
      req.cart.products[existingProductIndex].quantity += quantity || 1;
    } else {
      // Si el producto no existe, agrégalo
      const newProduct = {
        product: productId,
        quantity: quantity || 1
      };
      req.cart.products.push(newProduct);
    }

    await req.cart.save();
    console.log('Cart after adding product:', req.cart);

    res.send({ message: "Producto agregado al carrito", payload: req.cart });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error al agregar producto al carrito" });
  }
});

cartRouter.delete("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    if (!req.cart) {
      return res.status(404).send({ error: "Carrito no encontrado" });
    }

    const productIndex = req.cart.products.findIndex(
      (item) => item.product.toString() === pid
    );

    if (productIndex >= 0) {
      req.cart.products.splice(productIndex, 1);
      await req.cart.save();
      res.send({ message: "Producto eliminado del carrito", payload: req.cart });
    } else {
      res.status(404).send({ error: "Producto no encontrado en el carrito" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error al eliminar producto del carrito" });
  }
});

cartRouter.put("/", async (req, res) => {
  try {
    const { products } = req.body;

    if (!req.cart) {
      return res.status(404).send({ error: "Carrito no encontrado" });
    }

    req.cart.products = products;
    await req.cart.save();

    res.send({ message: "Carrito actualizado", payload: req.cart });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error al actualizar el carrito" });
  }
});

cartRouter.put("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const { quantity } = req.body;

    if (!req.cart) {
      return res.status(404).send({ error: "Carrito no encontrado" });
    }

    const productIndex = req.cart.products.findIndex(
      (item) => item.product.toString() === pid
    );

    if (productIndex >= 0) {
      req.cart.products[productIndex].quantity = quantity;
      await req.cart.save();
      res.send({ message: "Cantidad del producto actualizada", payload: req.cart });
    } else {
      res.status(404).send({ error: "Producto no encontrado en el carrito" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error al actualizar la cantidad del producto" });
  }
});

cartRouter.delete("/", async (req, res) => {
  try {
    if (!req.cart) {
      return res.status(404).send({ error: "Carrito no encontrado" });
    }

    req.cart.products = [];
    await req.cart.save();
    res.send({ message: "Todos los productos eliminados del carrito", payload: req.cart });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error al eliminar todos los productos del carrito" });
  }
});

export default cartRouter;
