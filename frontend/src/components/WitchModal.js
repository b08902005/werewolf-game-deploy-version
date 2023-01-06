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
import { useChat } from '../containers/hooks/useChat';
import { useLazyQuery } from '@apollo/client';
import { GET_MURDERD } from '../graphql';
import { Input } from 'antd';

const WitchModal = () => {
    const { roomId, stage, players, poison, nightNum, save, doNothing } = useGame()
    const { myCharacter, myLive, potionKill, potionSave, setPotionKill, setPotionSave } = useUser()
    const [target, setTarget] = useState('')
    const { displayStatus } = useChat()
    const [loadingData, { data, loading, subscribeToMore }]
        = useLazyQuery(GET_MURDERD, {
            variables: {
                roomId: roomId,
                nightNum: nightNum,
            },
            fetchPolicy: "network-only"
        });

    useEffect(() => {
        if (stage === "NIGHT_WITCH" && myLive) {
            loadingData()
        }
    }, [stage])

    const onKill = () => {
        if (target > 5 || target < 0){
            displayStatus({
                type: 'error',
                msg: 'Invalid Choice.'
            })
        }
        else if (potionKill === 1 && myLive && !players[target].dead) {
            poison({
                variables: {
                    roomId: roomId,
                    userId: players[target].id,
                    nightNum: nightNum,
                }
            })
            setPotionKill(2)
        }
        else if (!myLive) {
            displayStatus({
                type: 'error',
                msg: 'You are already dead.'
            })
        }
        else if (potionKill === 2) {
            displayStatus({
                type: 'error',
                msg: 'You have used it.'
            })
        }
        else if (players[target].dead) {
            displayStatus({
                type: 'error',
                msg: 'The player is dead.'
            })
        }
    }

    const onSave = () => {
        if (potionSave === 1 && myLive) {
            save({
                variables: {
                    roomId: roomId,
                    nightNum: nightNum,
                }
            })
            setPotionSave(2)
        }
        else if (!myLive) {
            displayStatus({
                type: 'error',
                msg: 'You are already dead.'
            })
        }
        else if (potionSave === 2) {
            displayStatus({
                type: 'error',
                msg: 'You have used it.'
            })
        }
    }

    const onLeave = () => {
        doNothing({
            variables: {
                roomId: roomId,
                nightNum: nightNum,
            }
        })
    }

    return (
        // Advanced TODO: Implement the structure of Modal
        // Useful Hint: style = {{opacity: 1 or 0 }}
        <>

            <div className='modal' style={(myCharacter === "WITCH" &&
                stage === "NIGHT_WITCH") ?
                { display: 'block' } : { display: 'none' }}>
                <div className='modalInfo' style={(myLive && potionSave === 1) ? { display: 'block' } :
                    { display: 'none' }}>
                    Player No.{data ? players.findIndex(
                        player => player.id === data.getMurdered.id) : "?"} is murdered.
                </div>
                <div className='modalWrapper'>
                    <Input.Search
                        size="large"
                        style={{ width: '80%', marginTop: '3%', marginLeft: '10%' }}
                        placeholder="Player Number you want to use the poison on"
                        onChange={(e) => setTarget(e.target.value)}
                        value={target}
                        enterButton="Poison"
                        onSearch={() => onKill(target)}
                    />
                </div>
                <div className='modalWrapper'>
                    {/* <div style={()? { display: 'block' } : { display: 'none' }}></div> */}
                    <div className='modalBtn' onClick={onSave}>
                        Save
                    </div>
                </div>
                <div className='modalWrapper'>
                    <div className='modalBtn' onClick={onLeave}>
                        Do nothing
                    </div>
                </div>
            </div>
        </>
    );
}

export default WitchModal