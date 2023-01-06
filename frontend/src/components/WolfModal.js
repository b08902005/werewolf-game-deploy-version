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

const WolfModal = () => {
    const { roomId, stage, players, murder, nightNum } = useGame()
    const { myCharacter, myLive } = useUser()
    const [target, setTarget] = useState('')
    const { displayStatus } = useChat()

    const onMurder = () => {
        if (players[target].dead) {
            displayStatus({
                type: 'error',
                msg: 'The player is dead.'
            })
        }
        else{
            // console.log(roomId, players[target].id, nightNum);
            murder({
                variables: {
                    roomId: roomId,
                    userId: players[target].id,
                    nightNum: nightNum,
                }
            })
        }
        // console.log(players[target]);
    }

    return (
        // Advanced TODO: Implement the structure of Modal
        // Useful Hint: style = {{opacity: 1 or 0 }}
        <div className='modal' style={((myCharacter === "WOLF1" || myCharacter === "WOLF2")
            && (stage === "NIGHT_WOLF")) ?
            { display: 'block' } : { display: 'none' }}>
            <div className='modalWrapper'></div>
            <div className='modalWrapper'>
                <Input.Search
                    disabled={(!myLive)}
                    size="large"
                    style={{ width: '80%', marginTop: '3%', marginLeft: '10%' }}
                    placeholder="Player Number you want to murder"
                    onChange={(e) => setTarget(e.target.value)}
                    value={target}
                    enterButton="Kill"
                    onSearch={onMurder}
                />
            </div>
            <div className='modalWrapper'></div>
            {/* <button onClick={() => {console.log(myCharacter, stage)}}>search</button> */}
        </div>

    );
}

export default WolfModal