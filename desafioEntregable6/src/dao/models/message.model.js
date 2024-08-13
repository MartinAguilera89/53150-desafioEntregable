import mongoose from "mongoose";

const messageCollection = "messages";

const messageSchema = new mongoose.Schema({
    user: {type: String, require: true, max: 20},
    message: {type: String, require: true, max: 50},
    timestamp: {type: Date, default: Date.now}
});

const messageModel = mongoose.model(messageCollection, messageSchema);

export default messageModel;