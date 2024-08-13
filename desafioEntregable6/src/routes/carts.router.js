import { Router } from "express";
import cartModel from "../dao/models/cart.model.js";

const cartRouter = Router();

cartRouter.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartModel.findById(cartId).populate('products.product');
    if (cart) {
      res.send({ cart });
    } else {
      res.status(404).send({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error al obtener el carrito" });
  }
});

cartRouter.post("/:cid/products", async (req, res) => {
  try {
    const { cid } = req.params;
    const { productId, quantity } = req.body;

    let cart = await cartModel.findById(cid);

    if (!cart) {
      cart = new cartModel({ _id: cid, products: [] });
    }

    const newProduct = {
      product: productId,
      quantity: quantity || 1
    };

    cart.products.push(newProduct);

    await cart.save();

    res.send({ message: "Producto agregado al carrito", payload: cart });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error al agregar producto al carrito" });
  }
});

cartRouter.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartModel.findById(cid);

    if (!cart) {
      return res.status(404).send({ error: "Carrito no encontrado" });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === pid
    );

    if (productIndex >= 0) {
      cart.products.splice(productIndex, 1);
      await cart.save();
      res.send({ message: "Producto eliminado del carrito", payload: cart });
    } else {
      res.status(404).send({ error: "Producto no encontrado en el carrito" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error al eliminar producto del carrito" });
  }
});

cartRouter.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    const cart = await cartModel.findById(cid);

    if (!cart) {
      return res.status(404).send({ error: "Carrito no encontrado" });
    }

    cart.products = products;
    await cart.save();

    res.send({ message: "Carrito actualizado", payload: cart });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error al actualizar el carrito" });
  }
});

cartRouter.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await cartModel.findById(cid);

    if (!cart) {
      return res.status(404).send({ error: "Carrito no encontrado" });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === pid
    );

    if (productIndex >= 0) {
      cart.products[productIndex].quantity = quantity;
      await cart.save();
      res.send({ message: "Cantidad del producto actualizada", payload: cart });
    } else {
      res.status(404).send({ error: "Producto no encontrado en el carrito" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error al actualizar la cantidad del producto" });
  }
});

cartRouter.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartModel.findById(cid);

    if (!cart) {
      return res.status(404).send({ error: "Carrito no encontrado" });
    }

    cart.products = [];
    await cart.save();
    res.send({ message: "Todos los productos eliminados del carrito", payload: cart });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error al eliminar todos los productos del carrito" });
  }
});

export default cartRouter;
