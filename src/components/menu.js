import React from 'react';
import { Link } from 'react-router';

export default (props) => {
    return (
        <div className="menu">
            <Link to="/">Home</Link> |
            <Link to="/register">Register</Link> |
            <Link to="/login">Login</Link> |
            <Link to="/" onClick={props.logOut}>Logout</Link> |
            <Link to="/users">Users</Link> |
            <Link to="/Chats">Chats</Link>
            <p>Logged in as {props.name} </p>
        </div>
    )
}
