import React from 'react';
import ChatForm from './chat-form.js';

export default (props) => {

    // SOME PROPS YOU CAN USE FOR DEBUGGING
    // Chat ID: {props.activeChat}
    // Current Message: {props.getMsg}

    return (
        <div class="convoWrapper">
            <div className="convo growContent" id="convo" >
            </div>
            <ChatForm
                sendMsgToServer={props.sendMsgToServer}
                getMsg={props.getMsg}
                getPreview={props.getPreview}
                chatInputChange={props.chatInputChange}
            />
        </div>
    )
}
