import { gql } from '@apollo/client';

export const GET_MESSAGES = gql`
query getMessages ($roomId: String!) {
    getMessages (roomId: $roomId) {
      sender {
        id
        name
      }
      body
      fromWolf
      dayNum
    }
}
`

export const GET_MURDERD = gql`
query getMurdered($roomId: String!, $nightNum: Int!) {
    getMurdered(roomId: $roomId, nightNum: $nightNum) {
      id
      name
    }
}
`

export const ROOM_QUERY = gql`
query queryRoom($roomId: String!) {
    getRoom(roomId: $roomId){
        id
        name
        owner
        stage
        players {
            id
            name
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

export const USER_QUERY = gql`
query queryUser($id: String!) {
    getUser(id: $id) {
        id
        name
        dead
        character
    }
}
`
export const ROOMS_QUERY = gql`
query queryRooms {
    getRooms {
        id
        name
        players {
            id
        }
    }
}
`;

export const CHATBOX_QUERY = gql`
query queryChatBox($name1: String!, $name2: String!) {
    chatbox(name1: $name1, name2: $name2) {
        name
        messages {
            sender
            body
        }
    }
}
`;