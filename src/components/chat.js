import React from 'react';
import ChatForm from './chat-form.js';

export default (props) => {
    return (
        <div class="convoWrapper">
            <div className="convo">
                <p>updated{props.activeChat}</p>
            </div>
            <ChatForm
                sendMsgToServer={props.sendMsgToServer}
            />
        </div>
    )
}
