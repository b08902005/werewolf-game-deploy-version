import { message } from "antd";
import { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useMutation, useLazyQuery, useSubscription } from "@apollo/client";
import { GET_MESSAGES, MESSAGE_SUBSCRIPTION, CREATE_MESSAGE } from "../../graphql";
import { useGame } from "./useGame";

const LOCALSTORAGE_KEY = 'save-me';
const savedMe = localStorage.getItem(LOCALSTORAGE_KEY);

const ChatContext = createContext({
    status: {},
    me: "",
    signedIn: false,
    messages: [],
    startChat: () => { },
    sendMessage: () => { },
    clearMessages: () => { },
});

const ChatProvider = (props) => {
    const { roomId } = useGame()
    const [messages, setMessages] = useState([]);
    const [me, setMe] = useState(savedMe || '');
    const [signedIn, setSignedIn] = useState(false);
    const [createMessage] = useMutation(CREATE_MESSAGE)
    const [loadingData, { data, loading, subscribeToMore }]
        = useLazyQuery(GET_MESSAGES, {
            variables: {
                roomId: roomId,
            },
            fetchPolicy: "network-only"
        });

    useEffect(() => {
        if (roomId)
            loadingData();
    }, [roomId])

    useEffect(() => {
        if (data) {
            let Info = data.getMessages;
            setMessages([...Info])
        }
    }, [data])

    useEffect(
        () => {
            if (roomId)
                subscribeToMore({
                    document: MESSAGE_SUBSCRIPTION,
                    variables: { roomId: roomId },
                    updateQuery: (prev, { subscriptionData }) => {
                        if (!subscriptionData.data) return prev;
                        const item = subscriptionData.data.subscribeMessages;
                        return {
                            getMessages: [...prev.getMessages, item],
                        };
                    },
                });
        },
        [subscribeToMore, roomId],
    );

    const displayStatus = (s) => {
        if (s.msg) {
            const { type, msg } = s;
            const content = {
                content: msg, duration: 1.5
            }
            switch (type) {
                case 'success':
                    message.success(content)
                    break
                case 'error':
                default:
                    message.error(content)
                    break
            }
        }
    }

    useEffect(() => {
        if (signedIn) {
            localStorage.setItem(LOCALSTORAGE_KEY, me);
        }
    }, [signedIn])

    return (
        <ChatContext.Provider
            value={{
                me, signedIn, messages, setMe, setSignedIn,
                displayStatus, setMessages, createMessage
            }}
            {...props}
        />
    );
}

const useChat = () => useContext(ChatContext);
export { ChatProvider, useChat };