const SingleMessage = {
    room: async ({ roomId }, args, { Room }) => {
       let room = await Room.findOne({"_id": roomId});
       if (!room) {
        throw new Error('Fail to resolve message room.');
       }
       return room;
    },

    sender: async ({ senderId }, args, { User }) => {
        var sender;
        if (senderId == '0') {
            sender = {
                "id": 0,
                "name": "System"
            }
        } else {
            sender = await User.findOne({"_id": senderId});
            if (!sender) {
                throw new Error('Fail to resolve message sender.');
            }
        }
        return sender;
    }
};

export default SingleMessage;