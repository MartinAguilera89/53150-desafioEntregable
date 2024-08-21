import { Router } from 'express';
import userModel from '../dao/models/user.model.js';
import { hashedPassword, isValidPassword } from '../utils.js';
import passport from 'passport';

const router = Router();

router.post('/register', passport.authenticate('register',{failureRedirect:'failregister'}), async (req, res) => {
    res.redirect("/products?message=Bienvenido");
//     const { nombre, apellido, email, password, role } = req.body;
//     try {
//         const hashedPwd = hashedPassword(password);
//         const newUser = new userModel({ nombre, apellido, email, password: hashedPwd, role });
//         await newUser.save();
//         res.redirect('/login');
//     } catch (err) {
//         console.error('Error al registrar usuario:', err);
//         res.status(500).send('Error al registrar usuario');
//     }
})

router.get('/failregister', async (req, res) =>{
    console.log("Estrategia fallida")
    res.send({error: "Fallo"})
})

router.post('/login', passport.authenticate('login',{failureRedirect:'faillogin'}), async (req, res) => {
    const { email, password } = req.body;
    if (!req.user) return res.status(400).send({ status: "error", error: "Datos incompletos" })
    try {
        if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
            req.session.user = {
                email: email,
                role: "admin",
                nombre: "Admin",
                apellido: "Coder"
            };
            res.redirect('/products?message=Bienvenido Usuario administrador');
            return;
        }
        req.session.user = {
            nombre: req.user.nombre,
            apellido: req.user.apellido,
            email: req.user.email,
            role: req.user.role
        };
        res.redirect('/products?message=Bienvenido');
    } catch (err) {
        console.error('Error al iniciar sesión:', err);
        res.status(500).send('Error al iniciar sesión');
    }
});

router.get('/faillogin', (req, res) => {
    res.send({ error: "Login fallido" })
})

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/login');
    });
});

router.get("/github", passport.authenticate("github",{scope:["user:email"]}),async(req,res)=>{})


router.get("/githubcallback",passport.authenticate("github",{failureRedirect:"/login"}),async(req,res)=>{
    req.session.user=req.user
    res.redirect("/products?message=Bienvenido")
})

export default router;
