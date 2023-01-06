/****************************************************************************
  FileName      [ Modal.js ]
  PackageName   [ src/components ]
  Author        [ Cheng-Hua Lu ]
  Synopsis      [ This file generates the Modal component. ]
  Copyright     [ 2022 10 ]
****************************************************************************/

import './css/Modal.css'
import React, { useEffect, useState } from "react";
import { useGame } from '../containers/hooks/useGame';
import { useUser } from '../containers/hooks/useUser';
import { Input } from 'antd';
import { useChat } from '../containers/hooks/useChat';

const VoteModal = () => {
    const { roomId, stage, players, vote, nightNum } = useGame()
    const { myId, myLive } = useUser()
    const [target, setTarget] = useState('')
    const [voted, setVoted] = useState(false)
    const { displayStatus } = useChat()

    useEffect(() => {
        if (stage === "MORNING") {
            setVoted(false)
        }
    }, [stage])

    const onVote = async () => {
        if (target > 5 || target < 0){
            displayStatus({
                type: 'error',
                msg: 'Invalid Choice.'
            })
        }
        else if (players[target].dead) {
            displayStatus({
                type: 'error',
                msg: 'The player is dead.'
            })
        }
        else {
            // console.log(roomId, players[target].id, nightNum);
            const { data } = await vote({
                variables: {
                    roomId: roomId,
                    dayNum: nightNum,
                    voterId: myId,
                    targetId: players[target].id,
                }
            })
            if (data.vote.success !== undefined)
                setVoted(true)
            else {
                displayStatus({
                    type: 'error',
                    msg: 'Vote Failed'
                })
            }
        }
        // console.log(players[target]);
    }

    return (
        // Advanced TODO: Implement the structure of Modal
        // Useful Hint: style = {{opacity: 1 or 0 }}
        <div className='modal' style={(stage === "MORNING") ?
            { display: 'block' } : { display: 'none' }}>
            <div className='modalWrapper'></div>
            <div className='modalWrapper'>
                <Input.Search
                    disabled={(!myLive || voted)}
                    size="large"
                    style={{ width: '80%', marginTop: '3%', marginLeft: '10%' }}
                    placeholder="Player Number you want to vote out"
                    onChange={(e) => setTarget(e.target.value)}
                    value={target}
                    enterButton="Vote"
                    onSearch={onVote}
                />
            </div>
            <div className='modalWrapper'></div>
            {/* <button onClick={() => {console.log(myCharacter, stage)}}>search</button> */}
        </div>

    );
}

export default VoteModal