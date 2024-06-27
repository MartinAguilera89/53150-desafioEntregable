import { Router } from 'express';
import userModel from '../dao/models/user.model.js';
import bcrypt from 'bcrypt';

const router = Router();

router.post('/register', async (req, res) => {
    const { nombre, apellido, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({ nombre, apellido, email, password: hashedPassword, role });
        await newUser.save();
        res.redirect('/views/login');
    } catch (err) {
        console.error('Error al registrar usuario:', err);
        res.status(500).send('Error al registrar usuario');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
            req.session.user = {
                email: email,
                role: "admin",
                nombre: "Admin",
                apellido: "Coder"
            };
            res.redirect('/views/products?message=Bienvenido Usuario administrador');
            return;
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            res.render('error', { message: 'Usuario no encontrado', showLoginButton: true, showRegisterButton: true });
            return;
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            res.render('error', { message: 'Contraseña incorrecta', showLoginButton: true });
            return;
        }

        req.session.user = {
            id: user._id,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            role: user.role
        };
        res.redirect('/views/products?message=Bienvenido');
    } catch (err) {
        console.error('Error al iniciar sesión:', err);
        res.status(500).send('Error al iniciar sesión');
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/views/login');
    });
});

export default router;