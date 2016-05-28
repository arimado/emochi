import React from 'react';
import ReactDOM from 'react-dom';

import ChatBox from './components/chat-box.js';
import Home from './components/home.js';
import Register from './components/register.js';
import Login from './components/login.js';
import UserList from './components/user-list.js';
import ChatList from './components/chat-list.js';
import Chat from './components/chat.js';

import { hashHistory, Router, Route, Redirect, Link } from 'react-router';

const app = (
    <Router>
        <Redirect from="/" to="/home" />
        <Route path="/" component={ChatBox}>
            <Route path="home" component={Home} />
            <Route path="register" component={Register}/>
            <Route path="login" component={Login} />
            <Route path="users" component={UserList} />
            <Route path="chats" component={ChatList} />
            <Route path="chats/:chatId" component={Chat} />
        </Route>
    </Router>
)

ReactDOM.render( app, document.getElementById('container'))
