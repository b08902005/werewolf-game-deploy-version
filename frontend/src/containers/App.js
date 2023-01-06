import styled from "styled-components"
import { useEffect } from 'react'
import { useChat } from "./hooks/useChat"
import SignIn from "./SignIn";
import RoomList from "../components/RoomList";
import Room from "./Room";
import { useUser } from "./hooks/useUser";
import { useQuery } from "@apollo/client";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  margin: auto;
`;

const App = () => {
  const { signedIn, enterRoom } = useUser()
  // const { status, displayStatus } = useChat()

  // useEffect(() => {
  //   displayStatus(status)
  // }, [status])

  return (
    <Wrapper>{enterRoom ? <Room /> : signedIn ? <RoomList /> : <SignIn />}</Wrapper>
  )
}

export default App
