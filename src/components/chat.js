import React from 'react';
import ChatForm from './chat-form.js';

export default (props) => {

    // SOME PROPS YOU CAN USE FOR DEBUGGING
    // Chat ID: {props.activeChat}
    // Current Message: {props.getMsg}

    var messages = props.getMessages.map((message) => {
        return (
            <li>
                <p> { message.chatId } </p>
                <p> { message.message } </p>
                <p> { message.user } </p>
            </li>
        )
    })

    return (
        <div class="convoWrapper">
            <div className="convo growContent" id="convo" >
                {messages}
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
