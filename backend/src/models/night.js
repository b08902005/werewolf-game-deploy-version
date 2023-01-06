import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const NightSchema = new Schema({
    roomId: {
        type: ObjectId,
        required: [true, 'roomId field is required.']
    },
    nightNum: {
        type: Number,
        required: [true, 'nightNum field is required.']
    },
    murderId: {
        type: ObjectId,
        required: [false]
    },
    poisonId: {
        type: ObjectId,
        required: [false]
    },
    isSaved: {
        type: Boolean,
        required: [true, 'isSaved field is required.']
    },
    deadNum: {
        type: Number,
        required: [true, 'deadNum field is required.']
    }
})

const Night = mongoose.model('night', NightSchema)
export default Night;