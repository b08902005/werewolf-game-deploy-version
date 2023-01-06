import AppTitle from "../components/Title";
import LogIn from "../components/LogIn";
import { useChat } from "./hooks/useChat";
import { useEffect } from "react";
import styled from "styled-components";
import { useUser } from "./hooks/useUser";
import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/react-hooks";
import { USER_QUERY } from "../graphql";

const Wrapper = styled.div`
    background: url("https://w0.peakpx.com/wallpaper/414/926/HD-wallpaper-gothic-castle-moon-gothic-town-castle-light.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    opacity: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    margin: auto;
`

const SignIn = () => {
    const { myName, setMyName, setSignedIn } = useUser()
    const { displayStatus } = useChat()

    const handleLogin = async (name) => {
        if (!name)
            displayStatus({
                type: "error",
                msg: "Missing user name",
            });
        else {
            setMyName(name)
            setSignedIn(true);
        }
    }

    return (
        <Wrapper>
            <AppTitle />
            <LogIn myName={myName} setMyName={setMyName} onLogin={handleLogin} />
        </Wrapper>
    )
}

export default SignIn;