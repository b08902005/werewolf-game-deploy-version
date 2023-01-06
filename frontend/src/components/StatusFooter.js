import styled from "styled-components";
import { useGame } from "../containers/hooks/useGame";
import { useUser } from "../containers/hooks/useUser";

const Footer = styled.footer`
    inset: 90% 0% 0%;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${props => (props.alive) ? "lightgreen" : "tomato"};
    font-size: 1.6em;
    font-family: 'Averia Libre', cursive;
`

const StatusFooter = ({ myName, alive, character }) => {
    const { myId } = useUser()
    const { players } = useGame()
    return (
        <Footer alive={alive} >Player No. {players.findIndex(player => player.id === myId)} {myName}, you are {alive ? "alive" : "dead"} {character}.</Footer>
    )
};
export default StatusFooter;