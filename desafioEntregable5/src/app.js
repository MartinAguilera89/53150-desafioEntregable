import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from './config/database.js';  // Actualiza la importación
import handlebars from 'express-handlebars';
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
import __dirname from "./utils.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 8080;

app.engine('handlebars', handlebars.engine());
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
    // cookie: { maxAge: 180 * 60 * 1000 },
}));

app.use('/views', viewsRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/messages', messageRouter);
app.use('/api/carts', cartRouter);
app.use('/api/sessions', sessionsRouter);  // Nueva ruta de sesión

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

app.get('/products', (req, res) => {
    res.render('products', products);
});

app.get('/carts', (req, res) => {
    res.render('carts');
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
