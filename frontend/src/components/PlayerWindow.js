import styled from "styled-components";
import { useGame } from "../containers/hooks/useGame";
import { useUser } from "../containers/hooks/useUser";

const Window = styled.div`
    width: 32%;
    height: auto;
    max-height: 45%;
    aspect-ratio: 1 / 1;
    flex-grow: 0.2;
    position: relative;
    margin: 0.2vw;
    background-color: rgb(60, 64, 67);
    border: 1px solid rgb(60, 64, 67);
    border-radius: 1vw;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: white;
`
const PlayerWindow = ({ player, idx }) => {
    const { checkList } = useUser()
    return (
        <Window>
            <h2>Player No.{idx}</h2>
            <h3>{player.name}</h3>
            {player.dead ? <h4 style={{ color: 'tomato' }}>DEAD</h4>
                : <h4 style={{ color: 'lightgreen' }}>ALIVE</h4>}
            {checkList[idx] === undefined ? '' :
                checkList[idx] ? <h4 style={{ color: 'lightgreen' }}>GOOD</h4>
                    : <h4 style={{ color: 'tomato' }}>BAD</h4>}
        </Window>
    )
}

export default PlayerWindow;