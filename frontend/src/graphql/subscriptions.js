import { gql } from "@apollo/client";

export const USER_SUBSCRIPTION = gql`
subscription subscribeUser($userId: String!) {
  subscribeUser(userId: $userId) {
      name
      id
      character
      dead
  }
}
`

export const ROOM_SUBSCRIPTION = gql`
subscription subscribeRoom($roomId: String!) {
  subscribeRoom(roomId: $roomId) {
    id
    name
    owner
    stage
    players {
        id
        name
        character
        dead
    }
    wolf1 {
        id
        name
        dead
    }
    deadNum
  }
}
`

export const ROOMS_SUBSCRIPTION = gql`
subscription subscribeRooms {
  subscribeRooms {
    id
    name
    players {
      id
    }
  }
}
`

export const MESSAGE_SUBSCRIPTION = gql`
subscription subscribeMessages ($roomId: String!) {
  subscribeMessages (roomId: $roomId) {
    sender {
      id
      name
    }
    body
    fromWolf
    dayNum
  }
}
`;