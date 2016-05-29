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

    const chats = activeChat.map((chat) => {

        let keyId = Math.floor(Math.random() * 10 + Math.random() * 3);

        let members = chat.members.map((member) => {
            return (
                <p key={member}> {member} </p>
            )
        })

        return (
            <li key={chat._id}> {members} </li>
        )

    })

    console.log(activeChat);

    const allUsers = props.users.filter((user) => {

    })

    return (
        <div className="menu">
            <Link to="/" onClick={props.logOut}>Logout</Link> |
            <Link to="/users">New Chat</Link>
            <p>Logged in as {props.name} </p>
            {chats}
        </div>
    )
}
