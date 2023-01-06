import mongoose from "mongoose"

const Schema = mongoose.Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name field is required.']
    },
    character: {
        type: String,
        required: [false]
    },
    dead: {
        type: Boolean,
        required: [true, 'dead field is required']
    }
})

const User = mongoose.model('user', UserSchema)
export default User;