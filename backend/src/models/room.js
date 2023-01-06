import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const RoomSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name field is required.']
    },
    owner: {
        type: ObjectId,
        required: [true, 'owner field is required.']
    },
    playersId: {
        type: Array,
        required: [true, 'players field is required.']
    },
    stage: {
        type: String,
        required: [true, 'stage field is required.']
    },
    wolf1Id: {
        type: ObjectId,
        required: [false]
    },
    wolf2Id: {
        type: ObjectId,
        required: [false]
    },
    witchId: {
        type: ObjectId,
        required: [false]
    },
    foretellerId: {
        type: ObjectId,
        required: [false]
    },
    deadNum: {
        type: Number,
        required: [true, 'deadNum field is required.']
    },
    messagesId: {
        type: Array,
        required: [false]
    },
})

const Room = mongoose.model('room', RoomSchema)
export default Room;