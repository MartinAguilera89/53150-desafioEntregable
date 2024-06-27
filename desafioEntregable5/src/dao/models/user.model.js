import mongoose from "mongoose";

//Crear la coleccion con el nombre

const userCollection = "users"

const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true, max: 100 },
    apellido: { type: String, required: true, max: 100 },
    email: { type: String, required: true, max: 50, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' } // Campo role
});

const userModel = mongoose.model(userCollection, userSchema)

export default userModel