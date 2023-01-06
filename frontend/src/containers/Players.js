import styled from "styled-components";
import PlayerWindow from "../components/PlayerWindow";
import { useGame } from "./hooks/useGame";
import { useUser } from "./hooks/useUser";

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    align-content: center;
`

const Players = ({ players }) => {
    const { roomData } = useGame()
    const { checkList } = useUser()
    return (
        <>
            <Wrapper>
                {players.map((player, index) => (
                    <PlayerWindow player={player} key={index} idx={index} />
                ))}
            </Wrapper>
            {/* <button onClick={() => { console.log(checkList) }}>click me</button> */}
        </>
    )
};

export default Players