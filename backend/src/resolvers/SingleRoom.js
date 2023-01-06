const SingleRoom = {
    players: async ({ playersId }, args, { User }) => {
        let users = [];
        for (let i = 0; i < playersId.length; i ++ ) {
            let user = await User.findOne({"_id": playersId[i]});
            users.push(user);
        }
        return users;
    },

    wolf1: async ({ wolf1Id }, args, { User }) => {
        let user = await User.findOne({"_id": wolf1Id});
        return user;
    },

    wolf2: async ({ wolf2Id }, args, { User }) => {
        let user = await User.findOne({"_id": wolf2Id});
        return user;
    },

    witch: async ({ witchId }, args, { User }) => {
        let user = await User.findOne({"_id": witchId});
        return user;
    },

    foreteller: async ({ foretellerId }, args, { User }) => {
        let user = await User.findOne({"_id": foretellerId});
        return user;
    },

    messages: async ( { messagesId }, args, { Message }) => {
        let messages = [];
        for (let i = 0; i < messagesId.length; i ++ ) {
            let message = await Message.findOne({"_id": messagesId[i]});
            messages.push(message);
        }
        return messages;
    }
};

export default SingleRoom;