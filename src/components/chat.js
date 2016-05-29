import React from 'react';
import ChatForm from './chat-form.js';

export default (props) => {

    return (
        <div class="convoWrapper">
            <div className="convo growContent" id="convo" >
                <div className="overflowContent">
                    <div className="overflowContentInner" >
                        <p>Chat ID: {props.activeChat}</p>
                        <p>Current Message: {props.getMsg}</p>
                    </div>
                </div>
            </div>
            <ChatForm
                sendMsgToServer={props.sendMsgToServer}
                getMsg={props.getMsg}
            />
        </div>
    )
}
