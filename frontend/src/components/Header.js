import styled from "styled-components";
import { useChat } from "../containers/hooks/useChat";
import { useGame } from "../containers/hooks/useGame";
import { useUser } from "../containers/hooks/useUser";

const Wrapper = styled.div`
    inset: 0% 0% 90%;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${props => (props.alive) ? "lightgreen" : "tomato"};
    h1 {
        margin: 0;
        margin-right: 20px;
        font-size: 2.7em;
        font-family: 'Averia Libre', cursive;
        color: white;
    }
`

const Header = ({ stage, own, num }) => {
    const { startGame, roomId, roomName, resetGame } = useGame()
    const { displayStatus } = useChat()
    const { myId, deleteUser, resetAll } = useUser()
    const ownerStart = async() => {
        // console.log(roomId);
        let res = await startGame({
            variables: {
                roomId: roomId,
            }
        }).catch((e) => console.log(e))
        // res = res.data.startGame
        // console.log("res: ", res);
        if (!res || !res.data.startGame){
            displayStatus({
                type: 'error',
                msg: 'You can\'t start game now.'
            })
        }
        // console.log(res);
    }
    const leaveRoom = async () => {
        let res = await deleteUser({
            variables: {
                userId: myId,
                roomId: roomId,
            }
        })
        res = res.data.deleteUser
        if (res.success) {
            resetAll()
            resetGame()
        }
        else {
            displayStatus({
                type: 'error',
                msg: 'Leave room failed.'
            })
        }
        // console.log(res);
    }
    let text = `Room: ${roomName}\xa0\xa0\xa0\xa0\xa0`
    let displayStage = (stage === "NIGHT_WOLF" || stage === "NIGHT_WITCH" ||
    stage === "NIGHT_FORETELLER")? "NIGHT": stage;
    return (
        <>
            <Wrapper>
                <h1>{stage ? `${text}Stage ${displayStage}` : "Waiting"}</h1>
                {own ? <button disabled={!(stage === "WAITING")} onClick={ownerStart}>Start Game</button> :
                    <button disabled={(stage !== "WAITING")} onClick={leaveRoom}>Leave Room</button>}
            </Wrapper>
        </>
    )
};
export default Header;