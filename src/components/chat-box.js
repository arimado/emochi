import React from 'react';
import Menu from './menu.js';
// import io from 'socket.io-client'
// let socket = io('http://localhost:3005/');

let socket = io();

export default class ChatBox extends React.Component {

    constructor() {
        super();
        this.state = {
            username: 'no one',
            users: [],
            chats: [],
            chat: ''
        };
        this._getCurrentUser = this._getCurrentUser.bind(this);
        this._logOut = this._logOut.bind(this);
        this._consolePrint = this._consolePrint.bind(this);
        this._getUsers = this._getUsers.bind(this);
        this._getChats = this._getChats.bind(this);
        this._setChat = this._setChat.bind(this);
        this._sendMsgToServer = this._sendMsgToServer.bind(this);
    }

    _consolePrint() {
        console.log('print')
    }

    _getCurrentUser(done) {
        console.log('get current user fired');
        $.ajax({
              url: '/api/user',
              dataType: 'json',
              cache: false,
              success: function(data) {
                console.log('user set')
                this.setState({username: data.username});
                if (done) done();
              }.bind(this),
              error: function(xhr, status, err) {
                console.log('fail!')
                this.setState({username: 'no one'});
                console.error('/api/user', status, err.toString());
              }.bind(this)
        });
    }

    _logOut() {
        $.ajax({
              url: '/logout',
              dataType: 'json',
              cache: false,
              success: function(data) {
                  this._getCurrentUser();
              }.bind(this),
              error: function(xhr, status, err) {
                console.log('fail!')
                console.error('/logout', status, err.toString());
              }.bind(this)
        });
    }

    _getUsers() {
        // Make an api call to get users
        console.log('getting users');
        $.ajax({
              url: '/api/users',
              dataType: 'json',
              cache: false,
              success: function(data) {
                  this.setState({users: data});
              }.bind(this),
              error: function(xhr, status, err) {
                  this.setState({users: data});
              }.bind(this)
        });
    }

    _getChats(done) {
        // query the database
        $.ajax({
              url: '/api/chats',
              dataType: 'json',
              cache: false,
              success: function(data) {
                console.log('user set');
                this.setState({chats: data});
                if (done) done();
              }.bind(this),
              error: function(xhr, status, err) {
                console.log('fail!');
                this.setState({chats: data});
                console.error('/api/user', status, err.toString());
              }.bind(this)
        });
    }

    _setChat(chatId) {
        console.log('set Chat fired with ' + chatId)
        this.setState({chat: chatId});
    }

    _sendMsgToServer(msg) {
        // EMIT HERE
        console.log('fired: sendMsgToServer')
        socket.emit('chat:msg', msg);
    }

    componentDidMount() {
        this._getCurrentUser();
        this._getUsers();
        this._getChats();
    }

    render() {
        const childrenWithProps = React.Children.map(this.props.children,
            (child) => React.cloneElement(child, {
                getUser: this._getCurrentUser,
                getUsers: this._getUsers,
                users: this.state.users,
                consolePrint: this._consolePrint,
                getChats: this._getChats,
                chats: this.state.chats,
                setChat: this._setChat,
                activeChat: this.state.chat,
                sendMsgToServer: this._sendMsgToServer
            })
        );
        return (
            <div className="chatBoxContainer">
                <Menu name={this.state.username} logOut={this._logOut} getUser={this._getCurrentUser}/>
                <div className="mainContent">
                    {childrenWithProps}
                </div>
            </div>
        );
    }
}
