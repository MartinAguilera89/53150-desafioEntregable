import express from 'express'
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose'
import handlebars from 'express-handlebars'
import dotenv from 'dotenv'
import userRouter from './routes/users.router.js'
import productRouter from './routes/products.router.js'
import messageRouter from './routes/messages.router.js'
import cartRouter from './routes/carts.router.js'
import messageModel from './dao/models/message.model.js';
import __dirname from "./utils.js";
import viewsRouter from './routes/views.router.js'
import session from 'express-session';
import bodyParser from 'body-parser';
import sessionsRouter from './routes/api/sessions.js'
import MongoStore from 'connect-mongo';

const app = express()
const server = http.createServer(app);
const io = new Server(server);
const PORT = 8080

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + "/public"));

dotenv.config()
console.log(process.env.MONGO_URL)
mongoose.connect(process.env.MONGO_URL)
    .then(()=>{console.log("Conectado a la base de datos")})
    .catch(error=>console.log("Error en la conexion", error))

app.use('/views', viewsRouter)
app.use('/api/users', userRouter)
app.use('/api/products', productRouter)
app.use('/api/messages', messageRouter)
app.use('/api/carts', cartRouter)

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
    res.render('products');
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});