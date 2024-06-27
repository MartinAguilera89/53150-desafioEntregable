import { Router } from 'express';
import productManager from '../dao/clases/productManager.js';
import { isAuthenticated, isNotAuthenticated } from '../middleware/auth.js';
const router = Router();

router.get('/', isNotAuthenticated, (req, res) => {
  res.redirect('/views/login');
});

router.get('/login', isNotAuthenticated, (req, res) => {
  res.render('login');
});

router.get('/register', isNotAuthenticated, (req, res) => {
  res.render('register');
});

router.get('/profile', isAuthenticated, (req, res) => {
  res.render('profile', { user: req.session.user });
});

router.get('/products', isAuthenticated, async (req, res) => {  // Usar middleware
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const options = {
      lean: true,
      limit: parseInt(limit, 10),
      page: parseInt(page, 10),
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
    };

    const filter = query ? { category: query, status: true } : {};

    const products = await productManager.getProducts(filter, options);

    res.render('products', products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

