import React from 'react';
import { Link, browserHistory } from 'react-router';

export default (props) => {

    // STATE DEPENDENCIES ----------------------------
    // - props.chats >      root: this.state.chats  Arr
    // - props.users >      root: this.state.users  Arr
    // - props.activeChat > root: this.state.chat   Str

    var activeChatMemberIds;
    var activeUserIds;
    var activeUsers;
    var activeChat = props.chats.filter((chat) => {
        return chat._id === props.activeChat;
    });

    // ONLY RENDER WHEN THERE IS A NEW CHAT INITIALISED AND SAVED TO THE DB

    if (props.activeChat !== '' && props.activeChat !== undefined && activeChat.length > 0) {

        activeChatMemberIds = activeChat[0].members;
        activeUsers = props.users.filter((user) => {
            let isMatch = activeChatMemberIds.indexOf(user._id);
            if (isMatch >= 0) { return true } else { return false };
        });
        activeUserIds = activeUsers.map((member) => {
            return <li key={member._id}>{member.username.slice(0,2).toUpperCase()}</li>
        });
    } else {
        activeUserIds = () => { return <div></div> }
    }

    // CLICK EVENTS


    return (
        <div className="menu">
            {/*<p>Logged in as {props.name} </p>*/}
            <div id="backButton">
                <a onClick={props.navBack}><i className="material-icons">chevron_left</i></a>
            </div>
            <div className="activeUsersWrapper">
                <ul className="activeUsers">
                    {activeUserIds}
                </ul>
            </div>
            <ul className="controls">
                <li><Link to="/" onClick={props.logOut}><i className="material-icons">eject</i></Link></li>
                <li><Link to="/users"><i className="material-icons">add</i></Link></li>
            </ul>
        </div>
    )
}
