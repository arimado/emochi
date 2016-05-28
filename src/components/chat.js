import React from 'react';
import ChatForm from './chat-form.js';

export default (props) => {
    return (
        <div class="convoWrapper">
            <div className="convo" id="convo" >
                <p>Chat ID: {props.activeChat}</p>
                <p>Current Message: {props.getMsg}</p>
            </div>
            <ChatForm
                sendMsgToServer={props.sendMsgToServer}
                getMsg={props.getMsg}
            />
        </div>
    )
}
