import ChatRoom from "./ChatRoom";
import Players from "./Players";
import styled from "styled-components"
import { useEffect } from 'react'
import { useChat } from "./hooks/useChat"
import { useUser } from "./hooks/useUser";
import StatusFooter from "../components/StatusFooter";
import { useGame } from "./hooks/useGame";
import Header from "../components/Header";
import WitchModal from "../components/WitchModal";
import WolfModal from "../components/WolfModal";
import ForetellerModal from "../components/ForetellerModal";
import VoteModal from "../components/VoteModal";
import ResultModal from "../components/ResultModal";

const Full = styled.div`
    left: 0;
    min-height: 100%;
    width: 100%;
    position: fixed;
    top: 0;
    background-color: rgb(32, 33, 37);
`
// background-color: ${((stage) ? 'rgb(32, 33, 37)' : 'white')};

const Panel = styled.div`
    inset: 10% 0% 10%;
    position: absolute;
    display: flex;
    justify-content: space-between;
    color: white
`;

const Left = styled.div`
    width: 70%;
    height: 100%;
    left: 0px;
    top: 0px;
    position: relative;
    background: ${props =>
        (props.stage === "MORNING" || props.stage === "CIVILIAN_WIN") ?
            "white" : "rgb(32, 33, 37)"};
`
const Right = styled.div`
    width: 30%;
    height: 100%;
    right: 0px;
    top: 0px;
    position: relative;
`
    // background: white;

const Room = () => {
    const { status, displayStatus } = useChat()
    const { myId, myName, myCharacter, myLive, enterRoom } = useUser()
    const { stage, ownerId, roomData, players } = useGame()

    return (
        <>
            <Full>
                <Header stage={stage} own={myId === ownerId} num={players.length} />
                <Panel>
                    <Left stage={stage}>
                        <Players players={players} />
                    </Left>
                    <Right>
                        <ChatRoom />
                    </Right>
                </Panel>
                <StatusFooter myName={myName} alive={myLive} character={myCharacter} />
            </Full>
            <WitchModal />
            <WolfModal />
            <ForetellerModal />
            <VoteModal />
            <ResultModal />
        </>
    )
}

export default Room