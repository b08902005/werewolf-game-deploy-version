import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const MessageSchema = new Schema({
    roomId: {
        type: ObjectId,
        required: [true, 'roomId is required.']
    },
    senderId: {
        type: String,
        required: [true, 'senderId field is required.']
    },
    body: {
        type: String,
        required: [true, 'body field is required.']
    },
    fromWolf: {
        type: Boolean,
        required: [true, 'fromWolf field is required']
    },
    dayNum: {
        type: Number,
        required: [true, 'dayNum field is required.']
    }
})

const Message = mongoose.model('message', MessageSchema)
export default Message

