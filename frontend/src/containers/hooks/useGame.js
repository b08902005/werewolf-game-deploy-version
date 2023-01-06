// stimulate what should record when we want to display the game (left part of Room = Players)
// store stage, players current state (alive/dead, displayName), deadNum
// game result: 0 for not end / 1 for werewolf win / 2 for werewolf lose
// owner id

import { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useMutation, useLazyQuery, useSubscription } from "@apollo/client";
import {
    ROOM_QUERY, ROOM_SUBSCRIPTION, START_GAME, MURDER, POISON,
    SAVE_MURDER, DO_NOTHING, CHECK_CHARACTER, EXECUTE_NIGHT_RESULT,
    CHECK_GAME_END, VOTE, DELETE_ROOM
} from "../../graphql";
import { useChat } from "./useChat";
import { useUser } from "./useUser";

const GameContext = createContext({
    nightNum: 0,
    roomId: "",
    roomName: "",
    ownerId: "",
    stage: "",
    gameResult: 0,
    players: [],
    deadNum: 0,
});

const GameProvider = (props) => {
    const { myId, enterRoom } = useUser()
    const { messages, setMessages } = useChat()
    const [nightNum, setNightNum] = useState(0)
    const [roomId, setRoomId] = useState('');
    const [roomName, setRoomName] = useState('');
    const [ownerId, setOwnerId] = useState('');
    const [stage, setStage] = useState('');
    const [gameResult, setGameResult] = useState(0);
    const [players, setPlayers] = useState([]);
    const [deadNum, setDeadNum] = useState(0);
    const [startGame] = useMutation(START_GAME);
    const [murder] = useMutation(MURDER)
    const [poison] = useMutation(POISON)
    const [save] = useMutation(SAVE_MURDER)
    const [doNothing] = useMutation(DO_NOTHING)
    const [check] = useMutation(CHECK_CHARACTER)
    const [executeNight] = useMutation(EXECUTE_NIGHT_RESULT)
    const [checkGameEnd] = useMutation(CHECK_GAME_END)
    const [vote] = useMutation(VOTE)
    const [deleteRoom] = useMutation(DELETE_ROOM)
    const resetGame = () => {
        setNightNum(0)
        setRoomId('')
        setRoomName('')
        setOwnerId('')
        setStage('')
        setGameResult(0)
        setPlayers([])
        setDeadNum(0)
    }
    const [loadingData, { data: roomData, loading: loadingRoom, subscribeToMore }]
        = useLazyQuery(ROOM_QUERY, {
            variables: {
                roomId: roomId,
            },
            fetchPolicy: "network-only"
        });

    useEffect(() => {
        if (stage === "NIGHT_WOLF") {
            if (nightNum !== 0)
                checkGameEnd({
                    variables: {
                        roomId: roomId,
                    }
                }).then((res) => {
                    if (!res.data.checkGameEnd)
                        setNightNum((prev) => prev + 1);
                })
            else
                setNightNum((prev) => prev + 1);
        }
        else if (stage === "MORNING" && myId === ownerId) {
            executeNight({
                variables: {
                    roomId: roomId,
                    nightNum: nightNum,
                }
            }).then(
                (res) => {
                    // console.log("executeNight: ", res);
                    checkGameEnd({
                        variables: {
                            roomId: roomId,
                        }
                    }).then()
                }
            )

        }
    }, [stage])

    useEffect(() => {
        if (roomData) {
            let roomInfo = roomData.getRoom;
            setStage(roomInfo.stage)
            setPlayers([...roomInfo.players])
            setGameResult(() =>
                roomInfo.stage === "WOLF_WIN" ? 1 : roomInfo.stage === "CIVILIAN_WIN" ? 2 : 0
            )
            setDeadNum(roomInfo.deadNum)
            // console.log("enter room: ", roomData);
        }
    }, [roomData])

    useEffect(
        () => {
            if (roomId)
                subscribeToMore({
                    document: ROOM_SUBSCRIPTION,
                    variables: { roomId: roomId },
                    updateQuery: (prev, { subscriptionData }) => {
                        // console.log("prev: ", prev);
                        // console.log("sub: ", subscriptionData);
                        if (!subscriptionData.data) return prev;
                        const item = subscriptionData.data.subscribeRoom;
                        return {
                            getRoom: item,
                        };
                    },
                });
        },
        [subscribeToMore, roomId],
    );

    return (
        <GameContext.Provider
            value={{
                nightNum, roomId, roomName, stage, players, ownerId, loadingData,
                roomData, setNightNum, setRoomId, setRoomName, setOwnerId, startGame,
                resetGame, murder, poison, save, doNothing, check, vote, deleteRoom
            }}
            {...props}
        />
    );
}

const useGame = () => useContext(GameContext);
export { GameProvider, useGame };