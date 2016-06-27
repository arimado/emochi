import React from 'react';
import { Link } from 'react-router';

export default (props) => {

    console.log('props.chats: ', props.chats);
    console.log('props.users: ', props.users);

        const chatList = props.chats.map((chat) => {

            // chat.members map to names from users.name

            // loop through chat.members

            var currentMembers = chat.members.map((member) => {
                var memberName = '';
                props.users.forEach((user) => {
                    if (user._id === member) memberName = user.username;
                })
                return memberName;
            });

            return (
                <li key={chat._id}>
                    <Link className="chatListItem" onClick={props.setChat.bind(this, chat._id)} to={`/chats/${chat._id}`}>
                    <div>
                        <span className="chatListTitle"> Conversation with: </span><br/>
                        <span className="membersList">
                            {currentMembers.join(', ')}
                        </span>
                    </div>
                    </Link>
                </li>
            )
        });

        return (
            <div className="chats">
                <ul> {chatList} </ul>
            </div>
        )
}
