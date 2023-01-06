import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const MorningSchema = new Schema({
    roomId: {
        type: ObjectId,
        required: [true, 'roomId field is required.']
    },
    dayNum: {
        type: Number,
        required: [true, 'dayNum field is required.']
    },
    voterId: {
        type: ObjectId,
        required: [true, 'voterId field is required.']
    },
    targetId: {
        type: ObjectId,
        required: [true, 'targetId field is required.']
    }
})

const Morning = mongoose.model('morning', MorningSchema)
export default Morning;