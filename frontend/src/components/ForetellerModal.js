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

const ForetellerModal = () => {
    const { roomId, stage, players, check, nightNum } = useGame()
    const { myCharacter, myLive, setCheckList } = useUser()
    const [target, setTarget] = useState('')
    const { displayStatus } = useChat()

    const onCheck = async () => {
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
            const { data } = await check({
                variables: {
                    roomId: roomId,
                    userId: players[target].id,
                }
            })
            setCheckList((prev) => {
                let newList = prev;
                newList[target] = data.checkCharacter
                return newList;
            })
        }
        // console.log(players[target]);
    }

    return (
        // Advanced TODO: Implement the structure of Modal
        // Useful Hint: style = {{opacity: 1 or 0 }}
        <div className='modal' style={((myCharacter === "FORETELLER")
            && (stage === "NIGHT_FORETELLER")) ?
            { display: 'block' } : { display: 'none' }}>
            <div className='modalWrapper'></div>
            <div className='modalWrapper'>
                <Input.Search
                    disabled={(!myLive)}
                    size="large"
                    style={{ width: '80%', marginTop: '3%', marginLeft: '10%' }}
                    placeholder="Player Number you want to check"
                    onChange={(e) => setTarget(e.target.value)}
                    value={target}
                    enterButton="Check"
                    onSearch={onCheck}
                />
            </div>
            <div className='modalWrapper'></div>
            {/* <button onClick={() => {console.log(myCharacter, stage)}}>search</button> */}
        </div>

    );
}

export default ForetellerModal