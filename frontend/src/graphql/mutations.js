import { gql } from '@apollo/client';

export const DELETE_ROOM = gql`
mutation deleteRoom ($roomId: String!) {
  deleteRoom (roomId: $roomId) {
    success
    msg
  }
}
`

export const CREATE_MESSAGE = gql`
mutation createMessage ($input: createMessageInput!){
  createMessage(input: $input) {
    success
    msg
  }
}
`

export const VOTE = gql`
mutation vote($roomId: String!, $dayNum: Int!, $voterId: String!, $targetId: String!) {
    vote(roomId: $roomId, dayNum: $dayNum, voterId: $voterId, targetId: $targetId) {
      success
      msg
    }
}
`

export const MURDER = gql`
mutation murder($roomId: String!, $userId: String!, $nightNum: Int!) {
    murder(roomId: $roomId, userId: $userId, nightNum: $nightNum) {
      success
      msg
    }
}
`

export const POISON = gql`
mutation poison($roomId: String!, $userId: String!, $nightNum: Int!){
    poison(roomId: $roomId, userId: $userId, nightNum: $nightNum) {
      success
      msg
    }
}
`

export const SAVE_MURDER = gql`
mutation saveMurder ($roomId: String!, $nightNum: Int!){
    saveMurder(roomId: $roomId, nightNum: $nightNum) {
        success
        msg
    }
}
`

export const DO_NOTHING = gql`
mutation doNothing($roomId: String!, $nightNum: Int!) {
    doNothing(roomId: $roomId, nightNum: $nightNum) {
      success
      msg
    }
}
`

export const CHECK_CHARACTER = gql`
mutation checkCharacter($roomId: String!, $userId: String!) {
    checkCharacter(roomId: $roomId, userId: $userId)
}
`

export const CHECK_GAME_END = gql`
mutation checkGameEnd($roomId: String!) {
    checkGameEnd(roomId: $roomId)
}
`

export const EXECUTE_NIGHT_RESULT = gql`
mutation executeNightResult($roomId: String!, $nightNum: Int!) {
    executeNightResult(roomId: $roomId, nightNum: $nightNum) {
      roomId
      nightNum
      murder {
        name
        character
        dead
      }
      poison {
        name
        character
        dead
      }
      isSaved
      deadNum
    }
}
`

export const DELETE_USER = gql`
mutation deleteUser($userId: String!, $roomId: String!) {
    deleteUser(userId: $userId, roomId: $roomId) {
      success
      msg
    }
}
`

export const START_GAME = gql`
mutation startGame($roomId: String!) {
    startGame(roomId: $roomId)
}
`

export const CREATE_ROOM = gql`
mutation createRoom($userId: String!, $name: String!) {
    createRoom(userId: $userId, name: $name) {
      id
      name
      owner
    }
}
`

export const JOIN_ROOM = gql`
mutation joinRoom($userId: String!, $roomId: String!) {
    joinRoom(userId: $userId, roomId: $roomId) {
      id
      name
      owner
    }
}
`

export const CREATE_USER = gql`
mutation createUser($name: String!) {
    createUser(name: $name)
}
`

export const CREATE_CHATBOX_MUTATION = gql`
mutation createChatBox($name1: String!, $name2: String!) {
    createChatBox(name1: $name1, name2: $name2) {
        name
        messages {
            sender
            body
        }
    }
}
`;

export const CREATE_MESSAGE_MUTATION = gql`
mutation createMessage($name: String!, $to: String!, $body: String!) {
    createMessage(name: $name, to: $to, body: $body) {
        sender
        body
    }
}
`;