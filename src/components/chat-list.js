import React from 'react';
import { Link } from 'react-router';

export default (props) => {
        const chatList = props.chats.map((chat) => {

            return (
                <li key={chat._id}>
                    <div>
                        Conversation with: <br/>
                        <span className="membersList">
                            <Link onClick={props.setChat.bind(this, chat._id)} to={`/chats/${chat._id}`}>{chat.members.join(', ')}</Link>
                        </span>
                    </div>
                </li>
            )
        });

        return (
            <div className="users">
                <ul> {chatList} </ul>
            </div>
        )
}
