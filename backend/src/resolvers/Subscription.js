const Subscription = {
  subscribeUser: {
    subscribe: (parent, { userId }, { pubsub }) => {
      return pubsub.subscribe(`subscribeUser ${userId}`)
    }
  },
  subscribeRoom: {
    subscribe: (parent, { roomId }, { pubsub }) => {
      return pubsub.subscribe(`subscribeRoom ${roomId}`);
    }
  },
  subscribeRooms: {
    subscribe: (parent, args, { pubsub }) => {
      return pubsub.subscribe(`subscribeRooms`);
    }
  },
  subscribeMessages: {
    subscribe: (parent, { roomId }, { pubsub }) => {
      return pubsub.subscribe(`subscribeMessages ${roomId}`);
    }
  }
};

export default Subscription;
