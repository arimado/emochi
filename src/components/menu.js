import React from 'react';
import { Link, browserHistory } from 'react-router';

export default (props) => {

    // depending on props I can  return different elements

    const loggedInState = () => {}; //
    const loggedOutState = () => {};


    // get activeChat ID
        // loop through member list
        // filter?
            // if users are in member list show it
    const activeChat = props.chats.filter((chat) => {
        return chat._id === props.activeChat;
    })

    // const activeChatMemberIds = activeChat.map((chat) => {
    //
    //     // let members = chat.members.map((member) => {
    //     //     return (
    //     //         <p key={member}> {member} </p>
    //     //     )
    //     // })
    //
    //     return chat.members
    //
    // })

    var activeChatMemberIds;
    var users;

    if (props.activeChat !== '') {
        activeChatMemberIds = activeChat[0].members;
        users = activeChatMemberIds.map((member) => {
            return <p key={member}>{member}</p>
        });
    } else {
        users = () => { return <div></div> }
    }


    return (
        <div className="menu">
            <Link to="/" onClick={props.logOut}>Logout</Link> |
            <Link to="/users">New Chat</Link>
            <p>Logged in as {props.name} </p>
            {users}
        </div>
    )
}
