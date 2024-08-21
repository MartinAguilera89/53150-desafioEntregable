import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: function() { return !this.githubId; }, // Requerido solo si no es usuario de GitHub
        max: 100 
    },
    apellido: { 
        type: String, 
        required: function() { return !this.githubId; }, // Requerido solo si no es usuario de GitHub
        max: 100 
    },
    email: { 
        type: String, 
        required: function() { return !this.githubId; }, // Requerido solo si no es usuario de GitHub
        max: 50, 
        unique: true 
    },
    password: { 
        type: String, 
        required: function() { return !this.githubId; } // Requerido solo si no es usuario de GitHub
    },
    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user' 
    }, // Campo role
    githubId: { 
        type: String, 
        unique: true, 
        sparse: true 
    }, // Campo para almacenar el ID de GitHub, si aplica
    cart: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'carts' 
    } // Referencia al carrito// Campo para almacenar el ID de GitHub, si aplica
});


const userModel = mongoose.model(userCollection, userSchema);

export default userModel;
