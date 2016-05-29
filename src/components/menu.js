import React from 'react';
import { Link } from 'react-router';

export default (props) => {

    // depending on props I can  return different elements

    const loggedInState = () => {}; //
    const loggedOutState = () => {};

    return (
        <div className="menu">
            <Link to="/" onClick={props.logOut}>Logout</Link> |
            <Link to="/users">New Chat</Link>  
            <p>Logged in as {props.name} </p>
        </div>
    )
}
