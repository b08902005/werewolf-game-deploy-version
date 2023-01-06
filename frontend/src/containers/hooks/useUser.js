// stimulate what the user should know
// store signedIn, myId, myName, myCharacter, myLive (true for alive, false for dead),
// potionKill / potionSave (0 for not witch character, 1 for not use, 2 for used)
// checkList: an object array (initial: {player1Id: UNKNOWN, ..., myId: myCharacter} -> 
// check 1's character -> {plater1Id: WITCH, ..., myId: myCharacter}) wolves also know one another
import { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useMutation, useLazyQuery, useSubscription } from "@apollo/client";
import { USER_QUERY, CREATE_USER, JOIN_ROOM, CREATE_ROOM, DELETE_USER, USER_SUBSCRIPTION } from "../../graphql";

const LOCALSTORAGE_KEY = 'save-me';
const savedName = localStorage.getItem(LOCALSTORAGE_KEY);

const UserContext = createContext({
    myId: "",
    myName: "",
    signedIn: false,
    enterRoom: false,
    myCharacter: "UNKNOWN",
    myLive: true,
    potionKill: 0,
    potionSave: 0,
    checkList: {},
});

const UserProvider = (props) => {
    const [myId, setMyId] = useState('');
    const [myName, setMyName] = useState(savedName || '');
    const [signedIn, setSignedIn] = useState(false);
    const [enterRoom, setEnterRoom] = useState(false);
    const [myCharacter, setMyCharacter] = useState('UNKNOWN');
    const [myLive, setMyLive] = useState(true);
    const [potionKill, setPotionKill] = useState(0);
    const [potionSave, setPotionSave] = useState(0);
    const [checkList, setCheckList] = useState({});
    const [createUser] = useMutation(CREATE_USER);
    const [joinRoom] = useMutation(JOIN_ROOM);
    const [createRoom] = useMutation(CREATE_ROOM);
    const [deleteUser] = useMutation(DELETE_USER);

    const resetAll = () => {
        setMyId("")
        setEnterRoom(false)
        setMyCharacter('UNKNOWN')
        setMyLive(true)
        setPotionKill(0)
        setPotionSave(0)
        setCheckList({})
    }

    const [loadingData, { called, data: userData, loading, subscribeToMore }]
        = useLazyQuery(USER_QUERY, {
            variables: {
                id: myId,
            },
            fetchPolicy: "network-only"
        });

    useEffect(() => {
        if (userData) {
            let userInfo = userData.getUser;
            // console.log("userInfo: ", userInfo);
            setMyCharacter(userInfo.character)
            if (userInfo.character === "WITCH" && !userInfo.dead) {
                setPotionKill(1)
                setPotionSave(1)
            }
            setMyLive(!userInfo.dead)
        }
    }, [userData])

    useEffect(() => {
        if (myId) {
            // console.log("loading data");
            loadingData()
        }
    }, [myId])

    useEffect(() => {
        if (signedIn) {
            localStorage.setItem(LOCALSTORAGE_KEY, myName);
        }
    }, [signedIn])

    useEffect(
        () => {
            if (myId)
                subscribeToMore({
                    document: USER_SUBSCRIPTION,
                    variables: { userId: myId },
                    updateQuery: (prev, { subscriptionData }) => {
                        // console.log("prevUser: ", prev);
                        // console.log("subUser: ", subscriptionData);
                        if (!subscriptionData.data) return prev;
                        const item = subscriptionData.data.subscribeUser;
                        return {
                            getUser: item,
                        };
                    },
                });
        },
        [subscribeToMore, myId],
    );
    /*
        useEffect(() => {
            try {
                subscribeToMore({
                    document: MESSAGE_SUBSCRIPTION,
                    variables: { from: me, to: friend },
                    updateQuery: (prev, { subscriptionData }) => {
                        if (!subscriptionData.data) return prev;
                        const newMessage = subscriptionData.data.message;
                        // console.log(prev.chatbox.messages);
                        // console.log(subscriptionData.data.message);
                        // console.log(prev);
                        return {
                            chatbox: {
                                messages: [...prev.chatbox.messages, newMessage],
                                name: prev.chatbox.name
                            },
                        };
                    },
                });
            }
             catch (e) { console.log(e); }
    }, [subscribeToMore]);
    */
    // useEffect(() => {
    //     console.log(data);
    // }, [data])

    return (
        <UserContext.Provider
            value={{
                myId, myName, signedIn, enterRoom, myCharacter,
                myLive, potionKill, potionSave, checkList, setMyId, setMyName,
                setSignedIn, setEnterRoom, setMyCharacter,
                setMyLive, setPotionKill, setPotionSave, setCheckList, createUser,
                joinRoom, createRoom, deleteUser, resetAll
            }}
            {...props}
        />
    );
}

const useUser = () => useContext(UserContext);
export { UserProvider, useUser };