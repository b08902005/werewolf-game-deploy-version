import Message from "../models/message";

const Mutation = {
  createUser: async (parent, { name }, { User }) => {
    let newUser = await new User({ name, character: "", dead: false, character: "UNKNOWN" }).save();
    if (!newUser) {
      throw new Error('Fail to create new user.');
    }
    return newUser._id.toString();
  },

  deleteUser: async (parent, { userId, roomId }, { User, Room, pubsub }) => {
    await User.deleteOne({"_id": userId});

    // delete user from room
    let room = await Room.findOne({"_id": roomId});
    if (!room) {
      throw new Error('Fail to find this room.');
    }
    let roomPlayersId = room.playersId;
    let index = roomPlayersId.indexOf(userId);
    if (index !== -1) {
      roomPlayersId.splice(index, 1);
    }
    await Room.updateOne({
      "_id": roomId
    }, {
      playersId: roomPlayersId
    });
    room = await Room.findOne({"_id": roomId});
    pubsub.publish(`subscribeRoom ${roomId}`, {
      subscribeRoom: room
    });
    let allRooms = await Room.find({});
    pubsub.publish(`subscribeRooms`, {
      subscribeRooms: allRooms
    });
    return {
      success: true,
      msg: 'Successfully deleted user.'
    }
  },

  createRoom: async (parent, { userId, name }, { Room, pubsub }) => {
    const playersId = [userId];
    let newRoom = await new Room({ name, owner: userId, playersId: playersId, stage: "WAITING", deadNum: 0}).save();
    if (!newRoom) {
      throw new Error('Fail to create new room.');
    }
    let allRooms = await Room.find({});
    pubsub.publish(`subscribeRooms`, {
      subscribeRooms: allRooms
    });
    return newRoom;
  },

  deleteRoom: async (parent, { roomId }, { Room, pubsub }) => {
    await Room.deleteOne({"_id": roomId});
    let allRooms = await Room.find({});
    pubsub.publish(`subscribeRooms`, {
      subscribeRooms: allRooms
    });
    return {
      success: true,
      msg: 'Successfully delete room.'
    }
  },

  joinRoom: async (parent, { userId, roomId }, { Room, pubsub }) => {
    let room = await Room.findOne({"_id": roomId});
    if (!room) {
      throw new Error('Fail to find room.');
    }
    if (Object.keys(room.playersId).length === 6) {
      throw new Error('the room is already full.');
    }
    let playersId = [...room.playersId];
    playersId.push(userId);
    // update the return data
    room.playersId = playersId;
    // update the data in DB
    let result = await Room.updateOne({
      "_id": roomId
    }, {
      playersId: playersId
    });
    room = await Room.findOne({"_id": roomId});
    pubsub.publish(`subscribeRoom ${roomId}`, {
      subscribeRoom: room
    });
    let allRooms = await Room.find({});
    pubsub.publish(`subscribeRooms`, {
      subscribeRooms: allRooms
    });
    return room;
  },

  startGame: async (parent, { roomId }, { User, Room, pubsub }) => {
    var chosenId, index, result, user;
    let room = await Room.findOne({"_id": roomId});
    if (Object.keys(room.playersId).length < 6) return false;

    // assign characters to each player
    let playersId = [...room.playersId];
    // assign wolf1 to a random player
    chosenId = playersId[Math.floor(Math.random() * playersId.length)];
    result = await Room.updateOne({
      "_id": roomId
    }, {
      wolf1Id: chosenId
    });
    result = await User.updateOne({
      "_id": chosenId
    }, {
      character: "WOLF1"
    });
    index = playersId.indexOf(chosenId);
    if (index !== -1) {
      playersId.splice(index, 1);
    }
    user = await User.findOne({"_id": chosenId});
    pubsub.publish(`subscribeUser ${chosenId}`, {
      subscribeUser: user
    });

    // assign wolf2 to a random player
    chosenId = playersId[Math.floor(Math.random() * playersId.length)];
    result = await Room.updateOne({
      "_id": roomId
    }, {
      wolf2Id: chosenId
    });
    result = await User.updateOne({
      "_id": chosenId
    }, {
      character: "WOLF2"
    });
    index = playersId.indexOf(chosenId);
    if (index !== -1) {
      playersId.splice(index, 1);
    }
    user = await User.findOne({"_id": chosenId});
    pubsub.publish(`subscribeUser ${chosenId}`, {
      subscribeUser: user
    });

    // assign witch to a random player
    chosenId = playersId[Math.floor(Math.random() * playersId.length)];
    result = await Room.updateOne({
      "_id": roomId
    }, {
      witchId: chosenId
    });
    result = await User.updateOne({
      "_id": chosenId
    }, {
      character: "WITCH"
    });
    index = playersId.indexOf(chosenId);
    if (index !== -1) {
      playersId.splice(index, 1);
    }
    user = await User.findOne({"_id": chosenId});
    pubsub.publish(`subscribeUser ${chosenId}`, {
      subscribeUser: user
    });

    // assign foreteller to a random player
    chosenId = playersId[Math.floor(Math.random() * playersId.length)];
    result = await Room.updateOne({
      "_id": roomId
    }, {
      foretellerId: chosenId
    });
    result = await User.updateOne({
      "_id": chosenId
    }, {
      character: "FORETELLER"
    });
    index = playersId.indexOf(chosenId);
    if (index !== -1) {
      playersId.splice(index, 1);
    }
    user = await User.findOne({"_id": chosenId});
    pubsub.publish(`subscribeUser ${chosenId}`, {
      subscribeUser: user
    });

    // assign civilians to the left 2 players
    chosenId = playersId[Math.floor(Math.random() * playersId.length)];
    result = await User.updateOne({
      "_id": chosenId
    }, {
      character: "CIVILIAN"
    });
    index = playersId.indexOf(chosenId);
    if (index !== -1) {
      playersId.splice(index, 1);
    }
    user = await User.findOne({"_id": chosenId});
    pubsub.publish(`subscribeUser ${chosenId}`, {
      subscribeUser: user
    });

    chosenId = playersId[Math.floor(Math.random() * playersId.length)];
    result = await User.updateOne({
      "_id": chosenId
    }, {
      character: "CIVILIAN"
    });
    index = playersId.indexOf(chosenId);
    if (index !== -1) {
      playersId.splice(index, 1);
    }
    user = await User.findOne({"_id": chosenId});
    pubsub.publish(`subscribeUser ${chosenId}`, {
      subscribeUser: user
    });

    // update room stage to NIGHT_WOLF
    result = await Room.updateOne({
      "_id": roomId
    }, {
      stage: "NIGHT_WOLF"
    });

    // publish for subscribeRoom
    room = await Room.findOne({"_id": roomId});
    pubsub.publish(`subscribeRoom ${roomId}`, {
      subscribeRoom: room
    });

    // publish for subscribeRooms
    let allRooms = await Room.find({});
    pubsub.publish(`subscribeRooms`, {
      subscribeRooms: allRooms
    });

    return true;
  },

  createMessage: async (parent, { input }, { Room, Message, pubsub }) => {
    let newMessage = await new Message({
      roomId: input.roomId,
      senderId: input.senderId,
      body: input.body,
      fromWolf: input.fromWolf,
      dayNum: input.dayNum
    }).save();

    pubsub.publish(`subscribeMessages ${input.roomId}`, {
      subscribeMessages: newMessage
    });

    if (!newMessage) return {
      success: false,
      msg: 'Fail to create new message.'
    };

    let room = await Room.findOne({"_id": input.roomId});
    let newMessageIds = [...room.messagesId];
    newMessageIds.push(newMessage._id.toString());
    await Room.updateOne({
      "_id": input.roomId
    }, {
      messagesId: newMessageIds
    });
    room = await Room.findOne({"_id": input.roomId});
    pubsub.publish(`subscribeRoom ${input.roomId}`, {
      subscribeRoom: room
    });

    return {
      success: true,
      msg: 'Successfully create new message.'
    };
  },

  murder: async (parent, { roomId, userId, nightNum }, { User, Room, Night, pubsub }) => {
    let user = await User.findOne({"_id": userId});
    if (!user) {
      throw new Error('Fail to find this user.');
    }
    let room = await Room.findOne({"_id": roomId});
    if (!room) {
      throw new Error('Fail to find this room.');
    }
    // check if the night already exist in the database
    let night = await Night.findOne({
      roomId,
      nightNum
    });
    if (night) return {
      success: false,
      msg: 'Error usage. This night already exist.'
    };
    
    let newNight = await new Night({
      roomId, 
      murderId: userId, 
      nightNum,
      deadNum: 1,
      isSaved: false
    }).save();
    if (!newNight) {
      throw new Error('Fail to create new night');
    }
    // change to the next room stage
    let witch = await User.findOne({"_id": room.witchId});
    if (!witch) {
      throw new Error('Fail to find witch.');
    }
    let foreteller = await User.findOne({"_id": room.foretellerId});
    if (!foreteller) {
      throw new Error('Fail to find foreteller.');
    }

    if (!witch.dead) {
      await Room.updateOne({"_id": roomId}, {"stage": "NIGHT_WITCH"});
    } else if (!foreteller.dead) {
      await Room.updateOne({"_id": roomId}, {"stage": "NIGHT_FORETELLER"});
    } else {
      await Room.updateOne({"_id": roomId}, {"stage": "MORNING"});
    }

    // publish for subscribeRoom
    room = await Room.findOne({"_id": roomId});
    pubsub.publish(`subscribeRoom ${roomId}`, {
      subscribeRoom: room
    });

    let allRooms = await Room.find({});
    pubsub.publish(`subscribeRooms`, {
      subscribeRooms: allRooms
    });

    return {
      success: true,
      msg: 'Murder recorded successfully.'
    };
  },

  poison: async (parent, { roomId, userId, nightNum }, { User, Room, Night, pubsub }) => {
    let user = await User.findOne({"_id": userId});
    if (!user) {
      throw new Error('Fail to find this user.');
    }
    let room = await Room.findOne({"_id": roomId});
    if (!room) {
      throw new Error('Fail to find this room.');
    }
    let night = await Night.findOne({
      roomId,
      nightNum
    });
    if (!night) return {
      success: false,
      msg: 'This night is not yet exist. You might haven\'t call murder function yet.'
    };

    // If the poison target is the same as the murder target. No need to update deadNum.
    if (userId == night.murderId) {
      await Night.updateOne({
        roomId,
        nightNum
      }, {
        poisonId: userId
      });

      // change to the next room stage
      let foreteller = await User.findOne({"_id": room.foretellerId});
      if (!foreteller) {
        throw new Error('Fail to find foreteller.');
      }
      if (!foreteller.dead) {
        await Room.updateOne({"_id": roomId}, {"stage": "NIGHT_FORETELLER"});
      } else {
        await Room.updateOne({"_id": roomId}, {"stage": "MORNING"});
      }
      room = await Room.findOne({"_id": roomId});
      pubsub.publish(`subscribeRoom ${roomId}`, {
        subscribeRoom: room
      });

      return {
        success: true,
        msg: 'Successfully poison, but the target is the same as the murder target.'
      };
    } else {
    // The poison target is different from the murfer target.
      await Night.updateOne({
        roomId,
        nightNum
      }, {
        poisonId: userId,
        deadNum: 2
      });

      // change to the next room stage
      let foreteller = await User.findOne({"_id": room.foretellerId});
      if (!foreteller) {
        throw new Error('Fail to find foreteller.');
      }
      if (!foreteller.dead) {
        await Room.updateOne({"_id": roomId}, {"stage": "NIGHT_FORETELLER"});
      } else {
        await Room.updateOne({"_id": roomId}, {"stage": "MORNING"});
      }

      // publish for subscribeRoom
      room = await Room.findOne({"_id": roomId});
      pubsub.publish(`subscribeRoom ${roomId}`, {
        subscribeRoom: room
      });

      let allRooms = await Room.find({});
      pubsub.publish(`subscribeRooms`, {
        subscribeRooms: allRooms
      });
      return {
        success: true,
        msg: 'Successfully poison.'
      };
    }
  },

  saveMurder: async (parent, { roomId, nightNum }, { User, Room, Night, pubsub }) => {
    let room = await Room.findOne({"_id": roomId});
    if (!room) {
      throw new Error('Fail to find this room.');
    }
    let night = await Night.findOne({
      roomId,
      nightNum
    });
    if (!night) return {
      success: false,
      msg: 'This night is not yet exist. You might haven\'t call murder function yet.'
    };
    await Night.updateOne({
      roomId,
      nightNum
    }, {
      murderId: null,
      isSaved: true,
      deadNum: 0
    });
    // change to the next room stage
    let foreteller = await User.findOne({"_id": room.foretellerId});
    if (!foreteller) {
      throw new Error('Fail to find foreteller.');
    }
    if (!foreteller.dead) {
      await Room.updateOne({"_id": roomId}, {"stage": "NIGHT_FORETELLER"});
    } else {
      await Room.updateOne({"_id": roomId}, {"stage": "MORNING"});
    }


    // publish for subscribeRoom
    room = await Room.findOne({"_id": roomId});
    pubsub.publish(`subscribeRoom ${roomId}`, {
      subscribeRoom: room
    });

    let allRooms = await Room.find({});
    pubsub.publish(`subscribeRooms`, {
      subscribeRooms: allRooms
    });

    return {
      success: true,
      msg: 'Successfully save murder.'
    };
  },

  doNothing: async (parent, { roomId, nightNum }, { User, Room, Night, pubsub }) => {
    let room = await Room.findOne({"_id": roomId});
    if (!room) {
      throw new Error('Fail to find this room.');
    }
    let night = await Night.findOne({
      roomId,
      nightNum
    });
    if (!night) return {
      success: false,
      msg: 'This night is not yet exist. You might haven\'t call murder function yet.'
    };

    // change to the next room stage
    let foreteller = await User.findOne({"_id": room.foretellerId});
    if (!foreteller) {
      throw new Error('Fail to find foreteller.');
    }
    if (!foreteller.dead) {
      await Room.updateOne({"_id": roomId}, {"stage": "NIGHT_FORETELLER"});
    } else {
      await Room.updateOne({"_id": roomId}, {"stage": "MORNING"});
    }


    // publish for subscribeRoom
    room = await Room.findOne({"_id": roomId});
    pubsub.publish(`subscribeRoom ${roomId}`, {
      subscribeRoom: room
    });

    let allRooms = await Room.find({});
    pubsub.publish(`subscribeRooms`, {
      subscribeRooms: allRooms
    });

    return {
      success: true,
      msg: 'Successfully do nothing.'
    };
  },

  checkCharacter: async (parent, { roomId, userId }, { User, Room, pubsub }) => {
    let user = await User.findOne({"_id": userId});
    if (!user) {
      throw new Error('Fail to find this user.');
    }

    let room = await Room.findOne({"_id": roomId});
    if (!room) {
      throw new Error('Fail to find this room.');
    }

    await Room.updateOne({"_id": roomId}, {"stage": "MORNING"});

    // publish for subscribeRoom
    room = await Room.findOne({"_id": roomId});
    pubsub.publish(`subscribeRoom ${roomId}`, {
      subscribeRoom: room
    });

    let allRooms = await Room.find({});
    pubsub.publish(`subscribeRooms`, {
      subscribeRooms: allRooms
    });

    if (user.character == "WOLF1" || user.character == "WOLF2") return false;
    else return true;
  },

  checkGameEnd: async (parent, { roomId }, { User, Room, pubsub }) => {
    let room = await Room.findOne({"_id": roomId});
    if (!room) {
      throw new Error('Fail to find this room.');
    }

    // check if wolves are all dead
    let wolf1 = await User.findOne({"_id": room.wolf1Id});
    let wolf2 = await User.findOne({"_id": room.wolf2Id});
    if (!wolf1) {
      throw new Error('Fail to find wolf1.');
    }
    if (!wolf2) {
      throw new Error('Fail to find wolf2.');
    }
    if (wolf1.dead && wolf2.dead) {
      await Room.updateOne({
        "_id": roomId
      }, {
        "stage": "CIVILIAN_WIN"
      });
      // publish for subscribeRoom
      room = await Room.findOne({"_id": roomId});
      pubsub.publish(`subscribeRoom ${roomId}`, {
        subscribeRoom: room
      });

      let allRooms = await Room.find({});
      pubsub.publish(`subscribeRooms`, {
        subscribeRooms: allRooms
      });
      return true;
    }

    // check if witch and foreteller are all dead
    let witch = await User.findOne({"_id": room.witchId});
    let foreteller = await User.findOne({"_id": room.foretellerId});
    if (!witch) {
      throw new Error('Fail to find witch.');
    }
    if (!foreteller) {
      throw new Error('Fail to find foreteller.');
    }
    if (witch.dead && foreteller.dead) {
      await Room.updateOne({
        "_id": roomId
      }, {
        "stage": "WOLF_WIN"
      });
      // publish for subscribeRoom
      room = await Room.findOne({"_id": roomId});
      pubsub.publish(`subscribeRoom ${roomId}`, {
        subscribeRoom: room
      });

      let allRooms = await Room.find({});
      pubsub.publish(`subscribeRooms`, {
        subscribeRooms: allRooms
      });
      return true;
    }

    // check if civilians are all dead
    let civilian = [];
    // get the civilian's id
    for (let i = 0; i < 6; i ++) {
      if (room.playersId[i] != room.wolf1Id && room.playersId[i] != room.wolf2Id 
        && room.playersId[i] != room.witchId && room.playersId[i] != room.foretellerId) {
          civilian.push(await User.findOne({"_id": room.playersId[i]}));
      }
    }

    if (civilian[0].dead && civilian[1].dead) {
      await Room.updateOne({
        "_id": roomId
      }, {
        "stage": "WOLF_WIN"
      });
      // publish for subscribeRoom
      room = await Room.findOne({"_id": roomId});
      pubsub.publish(`subscribeRoom ${roomId}`, {
        subscribeRoom: room
      });
      let allRooms = await Room.find({});
      pubsub.publish(`subscribeRooms`, {
        subscribeRooms: allRooms
      });
      return true;
    }

    // no one kills all of the enemies, game continue
    return false;
  },
  
  vote: async (parent, { roomId, dayNum, voterId, targetId }, { User, Room, Message, Morning, pubsub }) => {
    // add voterId and targetId into db
    let vote = await Morning.find({
      "roomId": roomId,
      "dayNum": dayNum,
      "voterId": voterId
    });
    if (vote.length > 0) {
      throw new Error('This voter has already voted in this day.');
    }
    let newVote = await new Morning({
      "roomId": roomId,
      "dayNum": dayNum,
      "voterId": voterId,
      "targetId": targetId
    }).save();
    // check if all players voted
    let voted = await Morning.find({
      "roomId": roomId,
      "dayNum": dayNum,
    });

    let room = await Room.findOne({"_id": roomId});

    // if less than alive players voted
    if (voted.length != (6 - room.deadNum)) {
      return {
        success: false,
        msg: 'Successfully voted. Not all players are voted yet.'
      }
    } else {
      // if all players voted, calculate who is going to die
      let voteRecord = {}, maxVote = 0, maxVoteId;
      for (let i = 0; i < voted.length; i ++) {
        let targetId = voted[i].targetId;
        if (targetId in voteRecord) {
          voteRecord[targetId] ++;
        } else {
          voteRecord[targetId] = 1;
        }
        if (voteRecord[targetId] > maxVote) {
          maxVote = voteRecord[targetId];
          maxVoteId = targetId;
        }
      }
      // let the target dies and publish
      await User.updateOne({
        "_id": maxVoteId
      }, {
        dead: true
      });
      let user = await User.findOne({"_id": maxVoteId});
      pubsub.publish(`subscribeUser ${maxVoteId}`, {
        subscribeUser: user
      });
      let resultMessage = user.name + " is voted to death.";
      let systemMessage = await new Message({
        "roomId": roomId,
        "senderId": '0',
        "body": resultMessage,
        "fromWolf": 0,
        "dayNum": dayNum
      });
      if (!systemMessage) {
        throw new Error('Fail to create system result message.');
      }
      pubsub.publish(`subscribeMessages ${roomId}`, {
        subscribeMessages: systemMessage
      });


      // update room death num, room stage to NIGHT_WOLF and publish
      await Room.updateOne({
        "_id": roomId
      }, {
        deadNum: room.deadNum + 1,
        stage: "NIGHT_WOLF"
      });
      room = await Room.findOne({"_id": roomId});
      pubsub.publish(`subscribeRoom ${roomId}`, {
        subscribeRoom: room
      });
      let allRooms = await Room.find({});
      pubsub.publish(`subscribeRooms`, {
        subscribeRooms: allRooms
      });

      return {
        success: true,
        msg: 'Successfully voted. All voters voted. Go to the next stage.'
      }
    }
  },

  // execute the death and then return the result of the night
  executeNightResult: async (parent, { roomId, nightNum }, { User, Room, Message, Night, pubsub }) => {
    let room = await Room.findOne({"_id": roomId});
    let curDead = 0;
    var resultMessage, safeNight = true;
    if (!room) {
      throw new Error('Fail to find this room.');
    }
    let night = await Night.findOne({
      roomId,
      nightNum
    });
    if (!night) {
      throw new Error('Fail to find this night result.');
    }
    // check if the murdered is dead or not, if dead then execute
    if (night.murderId != null && !night.isSaved) {
      let user = await User.findOne({"_id": night.murderId});
      if (!user) {
        throw new Error('Fail to find this murdered user.');
      }
      await User.updateOne({
        "_id": night.murderId
      }, {
        dead: true
      });
      user = await User.findOne({"_id": night.murderId});
      pubsub.publish(`subscribeUser ${night.murderId}`, {
        subscribeUser: user
      });
      curDead ++;

      // for system show message
      resultMessage = user.name;
      safeNight = false;
    }
    // execute death on the poisoned
    if (night.poisonId != null) {
      let user = await User.findOne({"_id": night.poisonId});
      if (!user) {
        throw new Error('Fail to find this poisoned user.');
      }
      await User.updateOne({
        "_id": night.poisonId
      }, {
        dead: true
      });
      user = await User.findOne({"_id": night.poisonId});
      pubsub.publish(`subscribeUser ${night.poisonId}`, {
        subscribeUser: user
      });
      curDead ++;
      if (night.deadNum == 2)
        resultMessage = resultMessage + " and " + user.name;
    }
    if (safeNight) {
      resultMessage = "This night is a silent night."
    } else {
      resultMessage = resultMessage + " is/are dead.";
    }
    await Room.updateOne({
      "_id": roomId
    }, {
      deadNum: room.deadNum + night.deadNum
    });
    // publish for subscribeRoom
    room = await Room.findOne({"_id": roomId});
    pubsub.publish(`subscribeRoom ${roomId}`, {
      subscribeRoom: room
    });
    let allRooms = await Room.find({});
    pubsub.publish(`subscribeRooms`, {
      subscribeRooms: allRooms
    });
    let systemMessage = await new Message({
      "roomId": roomId,
      "senderId": '0',
      "body": resultMessage,
      "fromWolf": 0,
      "dayNum": nightNum
    });
    if (!systemMessage) {
      throw new Error('Fail to create system result message.');
    }
    pubsub.publish(`subscribeMessages ${roomId}`, {
      subscribeMessages: systemMessage
    });
    

    return night;
  },

};

export default Mutation;
