import React from 'react';
import { Link, browserHistory } from 'react-router';

export default (props) => {


    // STATE DEPENDENCIES ----------------------------
    // - props.chats >      root: this.state.chats  Arr
    // - props.users >      root: this.state.users  Arr
    // - props.activeChat > root: this.state.chat   Str

    const activeChat = props.chats.filter((chat) => {
        return chat._id === props.activeChat;
    })

    var activeChatMemberIds;
    var activeUserIds;
    var activeUsers;

    if (props.activeChat !== '' && props.activeChat !== undefined) {
        console.log(props.activeChat);
        activeChatMemberIds = activeChat[0].members
        activeUsers = props.users.filter((user) => {
            let isMatch = activeChatMemberIds.indexOf(user._id);
            if (isMatch >= 0) { return true } else { return false };

        })
        activeUserIds = activeUsers.map((member) => {
            return <li key={member._id}>{member.username.slice(0,2).toUpperCase()}</li>
        });

    } else {
        activeUserIds = () => { return <div></div> }
    }

    return (
        <div className="menu">
            <Link to="/" onClick={props.logOut}><i className="material-icons">eject</i></Link>
            <Link to="/users"><i className="material-icons">add</i></Link>
            <p>Logged in as {props.name} </p>
            <ul className="activeUsers">
                {activeUserIds}
            </ul>
        </div>
    )
}
