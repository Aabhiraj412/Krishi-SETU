import mongoose from "mongoose";

const ChatsSchema = new mongoose.Schema({
    message:{
        type: String,
        required: true,
    },
    image:{
        type: String
    },
    audio:{
        type: String
    },
    sender:{
        type: String,
        enum: ["user","agri","ai"],
        required: true
    }
},
{
    timestamps: true,
});

const Chats =  mongoose.model("Chats", ChatsSchema);
export default Chats;