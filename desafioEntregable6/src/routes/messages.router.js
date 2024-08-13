import { Router } from "express";

// Import modelo de usuario

const router = Router();

router.get('/', async (req, res) => {
    try {
        const messages = await MessageModel.find().lean();
        res.send(messages);
    } catch (error) {
        console.error('Error al obtener los mensajes:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.post('/', async (req, res) => {
    try {
        const { user, message } = req.body;
        const newMessage = new MessageModel({ user, message });
        await newMessage.save();
        res.send('Mensaje agregado correctamente');
    } catch (error) {
        console.error('Error al agregar un nuevo mensaje:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.put('/', (req, res) => {
    res.send('Put request to the homepage')
})

router.delete('/', (req, res) => {
    res.send('Delete request to the homepage')
})


export default router;