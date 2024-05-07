import express from "express";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";
import http from "http";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import fs from "fs";
import ProductManager from "./productManager.js";
import __dirname from './utils.js'

const app = express();
const server = http.createServer(app);
const socketServer = new Server(server);
const productManager = new ProductManager("./src/data/products.json");

const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.use(express.static(__dirname + "/public"));
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.get("/", (req, res) => {
  const products = JSON.parse(
    fs.readFileSync("./src/data/products.json", "utf-8")
  );
  res.render("home", { products });
});

app.get("/realtimeproducts", (req, res) => {
  const products = JSON.parse(
    fs.readFileSync("./src/data/products.json", "utf-8")
  );
  res.render("realtimeProducts", { products, isRealTime: true });
});

socketServer.on("connection", (socket) => {
  console.log("Cliente conectado");

  socket.on("addProduct", async (product) => {
    try {
      productManager.addProduct(product);
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  });

  socket.on("deleteProduct", async (productId) => {
    try {
      productId.id = parseInt(productId.id);
      productManager.deleteProduct(productId);
      
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  });
});

server.listen(port, () => {
  console.log(`Servidor escuchando en el puerto: ${port}`);
});
export { socketServer };