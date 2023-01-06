const Query = {
  getUser: async (parent, { id }, { User }) => {
    let user = await User.findOne({"_id" : id});
    if (!user) {
      throw new Error('Fail to find this user.');
    }
    return user;
  },

  getRooms: async (parent, args, { Room }) => {
    let rooms = await Room.find({});
    if (!rooms) {
      throw new Error('Fail to find all rooms.');
    }
    return rooms;
  },

  getMessages: async (parent, { roomId }, { Message }) => {
    let messages = await Message.find({"roomId": roomId});
    console.log(messages);
    if (!messages) {
      throw new Error('Fail to find messages from this room.');
    }
    return messages;  
  },
  
  getRoom: async (parent, { roomId }, { Room }) => {
    let room = Room.findOne({"_id": roomId});
    if (!room) {
      throw new Error('Fail to find this room.');
    }
    return room;
  },

  getMurdered: async (parent, { roomId, nightNum }, { User, Night }) => {
    let night = await Night.findOne({
      "roomId": roomId,
      "nightNum": nightNum
    });
    if (!night) {
      throw new Error('Fail to find this night.');
    }
    let user = await User.findOne({"_id": night.murderId});
    if (!user) {
      throw new Error('Fail to find this user');
    }
    return user;
  }
};

export default Query;
