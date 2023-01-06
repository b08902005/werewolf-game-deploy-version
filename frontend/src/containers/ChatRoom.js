import { Tabs, Input, Tag } from 'antd'
import { useState, useEffect, useRef } from 'react'
import { useChat } from './hooks/useChat'
import styled from 'styled-components';
import Title from '../components/Title';
import Message from '../components/Message';
import { useUser } from './hooks/useUser';
import { useGame } from './hooks/useGame';

const ChatBoxesWrapper = styled(Tabs)`
    border-radius: 10px;
    background: lightgrey;
    height: 90%;
    width: 100%;
`;

const ChatBoxWrapper = styled.div`
    height: calc(240px - 36px);
    display: flex;
    flex-direction: column;
    overflow: auto;
`;

const FootRef = styled.div`
    height: 20px;
`;

const ChatRoom = () => {
    const { myId, myName, myCharacter, myLive } = useUser()
    const { me, displayStatus, messages, createMessage } = useChat()
    const [activeKey, setActiveKey] = useState(`day1`)
    const { roomId, stage, nightNum, players } = useGame()
    const [msg, setMsg] = useState('') // textBody
    const [msgSent, setMsgSent] = useState(false);
    const msgFooter = useRef(null)
    const [chatBoxes, setChatBoxes] =
        useState([
            {
                label: "day1", key: "day1",
                children:
                    <ChatBoxWrapper>
                        {messages.filter((msg) =>
                            (msg.dayNum === 1 && !msg.fromWolf)).map(({ sender, body }, i) => (
                                <Message isMe={sender.id === myId}
                                    idx={players.findIndex(player => player.id === sender.id)}
                                    message={body} key={i} />
                            ))}
                    </ChatBoxWrapper>
            },
            {
                label: "day2", key: "day2",
                children: <ChatBoxWrapper>
                    {messages.filter((msg) =>
                        (msg.dayNum === 2 && !msg.fromWolf)).map(({ sender, body }, i) => (
                            <Message isMe={sender.id === myId}
                                idx={players.findIndex(player => player.id === sender.id)}
                                message={body} key={i} />
                        ))}
                </ChatBoxWrapper>
            },
            {
                label: "wolf", key: "wolf",
                children: <ChatBoxWrapper>
                    {messages.filter((msg) =>
                        (msg.fromWolf)).map(({ sender, body }, i) => (
                            <Message isMe={sender.id === myId}
                                idx={players.findIndex(player => player.id === sender.id)}
                                message={body} key={i} />
                        ))}
                </ChatBoxWrapper>
            }
        ]); // {label, children, key} 方便起見使 key = label

    useEffect(() => {
        if (activeKey) {
            // console.log(chatBoxes);
            setChatBoxes((prev) => prev.map((item) => (
                item.key !== "wolf" ? {
                    label: item.key, key: item.key,
                    children:
                        <ChatBoxWrapper>
                            {messages.filter((msg) =>
                                (`day${msg.dayNum}` === item.key && !msg.fromWolf)).map(({ sender, body }, i) => (
                                    <Message isMe={sender.id === myId}
                                        idx={players.findIndex(player => player.id === sender.id)}
                                        message={body} key={i} />
                                ))}
                            <FootRef key={messages.length} ref={msgFooter} />
                        </ChatBoxWrapper>
                } : {
                    label: item.key, key: item.key,
                    children:
                        <ChatBoxWrapper>
                            {messages.filter((msg) =>
                                (msg.fromWolf)).map(({ sender, body }, i) => (
                                    <Message isMe={sender.id === myId}
                                        idx={players.findIndex(player => player.id === sender.id)}
                                        message={body} key={i} />
                                ))}
                            <FootRef key={messages.length} ref={msgFooter} />
                        </ChatBoxWrapper>
                }
            )))
        }
    }, [messages])

    const scrollToBottom = () => {
        msgFooter.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })     //?.前面若是undefined的話會回傳undefined而非throw error
    }

    useEffect(() => {
        scrollToBottom();
        setMsgSent(false);
    }, [msgSent])

    const renderChat = (chat) => (

        chat.length === 0 ? (
            <p style={{ color: '#ccc' }}> No messages... </p>
        ) : (
            <ChatBoxWrapper>
                {chat.map(({ sender, body }, i) => (
                    <Message isMe={sender === me} message={body} key={i} />
                ))}
                <FootRef key={chat.length} ref={msgFooter} />
            </ChatBoxWrapper>
        )
    );

    const extractChat = (friend) => {
        // console.log(messages);
        return renderChat
            (messages.filter
                (({ sender, body }) => ((sender === friend) || (sender === me))));
    }

    const updateChatBox = (newKey) => {
        const index = chatBoxes.findIndex
            (({ key }) => key === newKey);
        // const chat = renderChat(messages);
        const chat = extractChat(newKey);
        // console.log(chat);
        setChatBoxes([...chatBoxes.slice(0, index),
        {
            label: newKey, children: chat,
            key: newKey
        },
        ...chatBoxes.slice(index + 1)
        ]);
        setMsgSent(true);
        return newKey;
    }

    return (
        <>
            <ChatBoxesWrapper
                type='card'
                tabBarStyle={{ marginLeft: '5%', marginTop: '2%', height: '8%', width: '100%' }}
                defaultActiveKey={
                    (stage === "MORNING" || stage === "WAITING") ? `day${nightNum}` :
                        (myCharacter === "WOLF1" || myCharacter === "WOLF2") ? 'wolf' :
                            `day${nightNum}`
                }
                activeKey={activeKey}
                onChange={(key) => {    // 點選其他已開啟的tab(切換)
                    if (key === "wolf") {
                        if ((myCharacter !== "WOLF1" && myCharacter !== "WOLF2")) {
                            displayStatus({
                                type: 'error',
                                msg: 'You can\'t pry into the secrets of werewolves.'
                            })
                        }
                        else {
                            setActiveKey(key)
                        }
                    }
                    else
                        setActiveKey(key);
                }}
                items={chatBoxes}
            />
            <Input.Search
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                enterButton="Send"
                placeholder="Type a message here..."
                onSearch={async (msg) => {
                    if (!myLive) {
                        displayStatus({
                            type: 'error',
                            msg: 'You are dead.'
                        })
                    }
                    else if (stage === "MORNING") {
                        if (activeKey === "wolf") {
                            displayStatus({
                                type: 'error',
                                msg: 'You can\'t communicate in the morning.'
                            })
                        }
                        else if (activeKey !== `day${nightNum}`) {
                            displayStatus({
                                type: 'error',
                                msg: 'You send message to wrong day.'
                            })
                        }
                        else {
                            const { data } = await createMessage({
                                variables: {
                                    input: {
                                        roomId: roomId,
                                        senderId: myId,
                                        body: msg,
                                        fromWolf: false,
                                        dayNum: nightNum,
                                    }
                                }
                            })
                            if (data.createMessage.success) {
                                setMsg('')
                                setMsgSent(true);
                            }
                        }
                    }
                    else if (stage === "NIGHT_WOLF" && activeKey === "wolf") {
                        const { data } = await createMessage({
                            variables: {
                                input: {
                                    roomId: roomId,
                                    senderId: myId,
                                    body: msg,
                                    fromWolf: true,
                                    dayNum: nightNum,
                                }
                            }
                        })
                        if (data.createMessage.success) {
                            setMsg('')
                            setMsgSent(true);
                        }
                    }
                    else {
                        displayStatus({
                            type: 'error',
                            msg: 'Sending Failure.'
                        })
                    }
                    // if (friend) {
                    //     if (!msg) {
                    //         displayStatus({
                    //             type: 'error',
                    //             msg: 'Please enter message.'
                    //         })
                    //         return
                    //     }
                    //     sendMessage({
                    //         variables: {
                    //             name: me,
                    //             to: friend,
                    //             body: msg,
                    //         }
                    //     })
                    //     setMsg('')
                    //     setStatus({
                    //         type: 'success',
                    //         msg: `Message sent`
                    //     })
                    //     setMsgSent(true);
                    // }
                    // else {
                    //     displayStatus({
                    //         type: 'error',
                    //         msg: 'Please create chatbox(es).'
                    //     })
                    // }
                }}
            ></Input.Search>
        </>
    )
}

export default ChatRoom