import styled from "styled-components";
// import { UserOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { makeStyles } from "@mui/styles";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useUser } from "../containers/hooks/useUser";
import { useChat } from "../containers/hooks/useChat";
import { useGame } from "../containers/hooks/useGame";
import { useQuery, useLazyQuery } from "@apollo/client";
import { ROOMS_QUERY, ROOMS_SUBSCRIPTION } from "../graphql";
import { useEffect } from "react";

const styles = theme => ({
    tablecell: {
        fontSize: '40pt',
    },
});

const useStyles = makeStyles({
    root: {
        width: '80%',
        marginLeft: '10%',
        marginTop: '10px',
        overflowX: 'auto',
    },
    table: {
        minWidth: '800',
    },
});

const Title = styled.div`
    opacity: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    h1 {
        margin: 30px;
        font-size: 5vw;
        font-family: 'Averia Libre', cursive;
        color: rgb(136, 8, 8);
    }
`

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    font-size: 5em;
`;

const RoomList = () => {
    const { myName, myId, setMyId, joinRoom
        , createRoom, createUser, setEnterRoom } = useUser()
    const { roomName, setRoomName, roomId, setRoomId, loadingData, roomData,
        setOwnerId } = useGame()
    const { displayStatus } = useChat()
    const { loading, data: roomsData, subscribeToMore } = useQuery(ROOMS_QUERY);
    // const [loadingData, { data: roomData, loading: loadingRoom }]
    //     = useLazyQuery(ROOM_QUERY, {
    //         variables: {
    //             roomId: roomId,
    //         },
    //         fetchPolicy: "network-only"
    //     });
    // useEffect(() => {
    //     if (roomId) {
    //         console.log("loading");
    //         loadingData()
    //     }
    // }, [roomId])

    // useEffect(
    //     () => {
    //         if (!loading) console.log("roomsData: ", roomsData);
    //     },
    //     [loading]
    // )
    const onJoin = async (id) => {
        // 先query → 存在room且人數小於6 → createUser + joinRoom
        while (roomId !== id) { }
        await loadingData()
        if (roomData && roomData.getRoom.name && roomData.getRoom.players.length < 6) {
            let user = await createUser({
                variables: {
                    name: myName,
                }
            })
            setMyId(user.data.createUser)
            let result = await joinRoom({
                variables: {
                    userId: user.data.createUser,
                    roomId: id,
                }
            }).catch(e => console.log(e))
            result = result.data.joinRoom
            // console.log(result);
            // joinRoomSet(result)
            setOwnerId(result.owner)
            setRoomName(result.name);
            setEnterRoom(true)
        }
        else {
            console.log("roomData: ", roomData);
            displayStatus({
                type: 'error',
                msg: 'Invalid roomId.'
            })
        }
        // console.log(roomData.getRoom.name);
        // return
    }
    const onCreate = async (name) => {
        // createUser + createRoom
        let user = await createUser({
            variables: {
                name: myName,
            }
        })
        setMyId(user.data.createUser)
        // console.log(user.data.createUser);
        let roomCreated = await createRoom({
            variables: {
                userId: user.data.createUser,
                name: name,
            }
        })
        await loadingData()
        // console.log(roomCreated.data.createRoom);
        setRoomId(roomCreated.data.createRoom.id)
        setRoomName(name)
        setOwnerId(roomCreated.data.createRoom.owner)
        setEnterRoom(true)
    }
    useEffect(
        () => {
            subscribeToMore({
                document: ROOMS_SUBSCRIPTION,
                updateQuery: (prev, { subscriptionData }) => {
                    // console.log("prev: ", prev);
                    // console.log("sub: ", subscriptionData);
                    if (!subscriptionData.data) return prev;
                    const item = subscriptionData.data.subscribeRooms;
                    return {
                        getRooms: [...item],
                    };
                },
            });
        },
        [subscribeToMore],
    );
    const classes = useStyles();
    if (loading) return <div>Loading...</div>
    return (
        // <ThemeProvider theme={theme}>
        <Wrapper>
            {/* <button onClick={getRoomList}>Get Room List</button> */}
            <Title><h1>Room List</h1></Title>
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell variant="head" align="center" sx={{ fontSize: "1.25rem" }}>Room Name</TableCell>
                            <TableCell variant="head" align="center" sx={{ fontSize: "1.25rem" }}>Player Number</TableCell>
                            <TableCell variant="head" align="center" sx={{ fontSize: "1.25rem" }}>Status</TableCell>
                            <TableCell variant="head" align="center" sx={{ fontSize: "1.25rem" }}>Room Id</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {roomsData.getRooms.map((room) => (
                            <TableRow
                                key={room.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="center" component="th" scope="row" sx={{ fontSize: "1.25rem" }}>
                                    {room.name}
                                </TableCell>
                                <TableCell align="center" sx={{ fontSize: "1.25rem" }}>
                                    {room.players.length}
                                </TableCell>
                                <TableCell align="center" sx={{ fontSize: "1.25rem" }}>
                                    <b style={room.players.length >= 6 ? { color: 'red' } : { color: 'green' }}>
                                        {room.players.length >= 6 ? 'Full' : 'Waiting'}
                                    </b>
                                </TableCell>
                                <TableCell align="center" sx={{ fontSize: "1.25rem" }}>{room.id}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            <Input.Search
                size="large"
                style={{ width: '40%', marginTop: '5%', marginLeft: '30%' }}
                placeholder="Room Id you want to join"
                onChange={(e) => setRoomId(e.target.value)}
                value={roomId}
                enterButton="Join"
                onSearch={(roomId) => onJoin(roomId)}
            />
            <Input.Search
                size="large"
                style={{ width: '40%', marginTop: '0%', marginLeft: '30%' }}
                placeholder="Room Name you want to create"
                onChange={(e) => setRoomName(e.target.value)}
                value={roomName}
                enterButton="Create"
                onSearch={(name) => onCreate(name)}
            />
        </Wrapper>
        // </ThemeProvider>
    );
}

export default RoomList;

// let user = await createUser({
//     variables: {
//         name: name
//     }
// })
// setMyId(user.createUser)
// console.log(user)