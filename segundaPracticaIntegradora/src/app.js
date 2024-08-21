import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from './config/database.js';  // Actualiza la importación
import { engine } from 'express-handlebars';
import dotenv from 'dotenv';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import userRouter from './routes/users.router.js';
import productRouter from './routes/products.router.js';
import messageRouter from './routes/messages.router.js';
import cartRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import sessionsRouter from './routes/sessions.router.js';  // Nueva importación
import messageModel from './dao/models/message.model.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import passport from 'passport';
import initializePassport from './config/passport.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 8080;

// Configuración del motor de plantillas Handlebars
app.engine('handlebars', engine({
    defaultLayout: 'main',
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true
    }
}));
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

dotenv.config();

app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
}));

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use('/', viewsRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/messages', messageRouter);
app.use('/api/carts', cartRouter);
app.use('/api/sessions', sessionsRouter);

// Ruta para ver el carrito
app.use('/carrito', (req, res, next) => {
    if (req.isAuthenticated()) { // Verifica que el usuario esté autenticado
      next();
    } else {
      res.redirect('/login'); // Redirige al login si no está autenticado
    }
  }, cartRouter); // Usa el router de carrito después de verificar autenticación

io.on('connection', (socket) => {
    console.log('un usuario conectado');

    socket.on('disconnect', () => {
        console.log('usuario desconectado');
    });

    socket.on('chat message', async (msg) => {
        try {
            const message = await messageModel.create(msg);
            io.emit('chat message', message);
        } catch (error) {
            console.error('Error al guardar el mensaje:', error);
        }
    });
});

app.get('/chat', (req, res) => {
    res.render('chat');
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
