const express = require('express')
const ProductManager = require('./productManager')

const app = express()
const puerto = 8080

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const productManager = new ProductManager('./src/productos.json')

app.get('/products', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit)
    const products = await productManager.getProducts()

    if (!isNaN(limit)) {
      res.json(products.slice(0, limit))
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(404).json({ error: 'Error al obtener los productos' })
  }
})

app.get('/products/:pid', async (req, res) => {
    try {
      const productId = parseInt(req.params.pid)
      await productManager.getProductById(productId, res)
    } catch (error) {
      res.status(404).json({ error: 'Error al obtener el producto' })
    }
  })
  

app.listen(puerto, () => {
  console.log(`Servidor Express en ejecución en el puerto ${puerto}`)
})
