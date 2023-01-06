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

const ResultModal = () => {
    const { ownerId, roomId, stage, resetGame, deleteRoom, players } = useGame()
    const { myId, myCharacter, resetAll, deleteUser } = useUser()
    const { displayStatus } = useChat()
    const leaveRoom = async () => {
        if (myId === ownerId && players.length > 1) {
            displayStatus({
                type: 'error',
                msg: 'You can\'t leave now.'
            })
            return
        }
        let res = await deleteUser({
            variables: {
                userId: myId,
                roomId: roomId,
            }
        })
        res = res.data.deleteUser
        if (res.success) {
            if (myId === ownerId) {
                await deleteRoom({
                    variables: {
                        roomId: roomId,
                    }
                })
            }
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

    return (
        // Advanced TODO: Implement the structure of Modal
        // Useful Hint: style = {{opacity: 1 or 0 }}
        <div className='modal' style={
            (stage === "WOLF_WIN" || stage === "CIVILIAN_WIN") ?
                { display: 'flex' } : { display: 'none' }}>
            {/* <div className='modalWrapper'></div> */}
            <div className='modalContent'>
                <div className='modalResult'>
                    {((stage === "WOLF_WIN" && (myCharacter === "WOLF1" || myCharacter === "WOLF2")) ||
                        (stage === "CIVILIAN_WIN" && (myCharacter !== "WOLF1" && myCharacter !== "WOLF2"))) ?
                        'WIN' : 'Game Over'}
                </div>
                <div className='modalBtnWrapper'>
                    <div className='modalBtn' onClick={leaveRoom}>Leave Room</div>
                </div>
            </div>
            {/* <div className='modalWrapper'></div> */}
        </div>
    );
}

export default ResultModal