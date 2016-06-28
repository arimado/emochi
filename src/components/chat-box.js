import React from 'react';
import Menu from './menu.js';
import { browserHistory, RouterContext } from 'react-router';
// import io from 'socket.io-client'
// let socket = io('http://localhost:3005/');

let socket = io();

let $chatElement = $('#convo');

const emojiObjectToString = (obj, length) => {
    return obj.results
              .slice(0, length)
              .map(e => e.text)
              .reduce(( prev, next ) => { return prev + ' ' +  next});
}

export default class ChatBox extends React.Component {

    constructor() {
        super();

        this.state = {
            username: 'no one',
            users: [],                                //
            chats: [],                                // array of availble chats with the chats[i]._id and chats[i].members (which is an array of user _id's)
            chat: '',
            message: '',
            preview: '',
            messages: [],
            names: [],
            emojiFetch: false,
        };

        this._getCurrentUser = this._getCurrentUser.bind(this);
        this._logOut = this._logOut.bind(this);
        this._consolePrint = this._consolePrint.bind(this);
        this._getUsers = this._getUsers.bind(this);
        this._getChats = this._getChats.bind(this);
        this._setChat = this._setChat.bind(this);
        this._sendMsgToServer = this._sendMsgToServer.bind(this);
        this._setNewMessage = this._setNewMessage.bind(this);
        this._navBack = this._navBack.bind(this);
        this._getEmoji = this._getEmoji.bind(this);
        this._chatInputChange = this._chatInputChange.bind(this);

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

        // _getUsers() makes an API call to get users
        // called on root Component mount
        // data is availble to childeren through childrenWithProps function
        // as 'users'

        // console.log('getting users');
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

        // this._getChats -----------------------------------
        // - GET: /api/chats
        //      - server returns array of chats
        //      - properties: ._id STR, .members ARR
        // - sets this.state.chats to that array
        // - Triggered By
        //      - whenever this._setChat() is called
        //      - root componentDidMount

        $.ajax({
              url: '/api/chats',
              dataType: 'json',
              cache: false,
              success: function(data) {
                console.log('GET /api/chats fired. Server data: ');
                console.log(data);
                // this should be retrunging an array of chats
                if (done) {
                    // console.log('updating this.state.chats with callback')
                    this.setState({chats: data}, done);
                } else {
                    // console.log('updating this.state.chats without callback')
                    this.setState({chats: data});
                }
              }.bind(this),
              error: function(xhr, status, err) {
                console.log('fail!');
                this.setState({chats: data});
                console.error('/api/user', status, err.toString());
              }.bind(this)
        });
    }

    _setChat(chatId, done) {

        // this._setChat -----------------------------------
        // - sets chatId string in this.state.chat
        // - then fetches the new chats from the database with this_.getChats
        // - Triggered By:
        //      - SUBMIT BUTTON in user-list.js
        //      - ON ELEMENT CLICK in chat-list.js

        console.log('set Chat fired with ' + chatId)

        // only leave chat if there is an availble chat id
        if(this.state.chat) socket.emit('disconnect:chatroom', this.state.chat);


        this.setState({chat: chatId}, () => {
            console.log('ROOT STATE: setState - activeChatId');
            // I want to makes sure that the state is updated
            this._getChats(() => {
                console.log('new chats imported')
                if (done) done();
            });
        });


        // join the chatId room
        socket.emit('connect:chatroom', chatId);
    }

    _getNamesOfActiveChat(chatId) {
        console.log('');
    }

    _getEmoji(message, callback) {

        var currentTimeoutId = '';

        if (this.state.emojiFetch === false) {
            currentTimeoutId = window.setTimeout(() => {
                this.setState({preview: '...'});
                $.ajax({
                  url: 'http://emoji.getdango.com/api/emoji?q=' + encodeURIComponent(message),
                  success: (data) => {
                      console.log(data)
                      callback(data)
                      this.setState({emojiFetch: false})
                      console.log('currentTimeoutId: ', currentTimeoutId);
                      window.clearTimeout(currentTimeoutId);
                  }
                });
            }, 200);
        }
        this.setState({emojiFetch: true});
    }

    _sendMsgToServer() {
        console.log('fired: sendMsgToServer')

        // this._getEmoji(msg, (emojiResponse) => {
        //
        //     var emojiTxt = emojiObjectToString(emojiResponse);
        //
        //     var profileMsg = {
        //         chatId:     this.state.chat,
        //         user:       this.state.username,
        //         message:    emojiTxt
        //     }
        //
        //     console.log(emojiTxt);
        //     socket.emit('data:message', profileMsg);
        // })

        var profileMsg = {
            chatId:     this.state.chat,
            user:       this.state.username,
            message:    this.state.preview,
        }

        if (profileMsg.message !== '' && profileMsg.message !== '...') {
            socket.emit('data:message', profileMsg);
        }
    }

    _setNewMessage() {
        var that = this;
        socket.on('server:data', function(data) {
            // console.log('message recieved from server:  ');
            // console.dir(data);
            // console.log('that.state.messages [BEFORE]: ', that.state.messages);

            var updatedMessages = that.state.messages;
            updatedMessages.unshift(data);

            that.setState({ messages: updatedMessages});

            // console.log('that.state.messages: [AFTER]', that.state.messages);

            // $('#convo').append('<p>' + data.message + '</p>');
            // $('#convo')[0].scrollTop = $('#convo')[0].scrollHeight;

            // that.setState({message: data.message}, (thing) => {
            //     console.log('callback fired: ' + data.message);
            //     console.log('callback property: ' + thing);
            //
            // });
        })
    }

    _chatInputChange(msg) {
        console.log(msg);
        // get emoji's
        // render new thing
        // probs only fire when the last has finished
        // make a dummt for making requests

        this.setState({preview: ''});


        if (msg.length > 0) {
            this._getEmoji(msg, (res) => {
                this.setState({preview: emojiObjectToString(res, 5)});
                console.log('chat-box.js - preview emoji: ', this.state.preview);
            })
        }
        this.setState({message: msg});
        console.log('chat-box.js - preview: ', this.state.preview);

    }

    _navBack() {
        console.log('EVENT: _navBack()')
        this.props.history.goBack();
    }

    componentDidMount() {
        if (this.props.params) {
            console.log(this.props.params);
            this._setChat(this.props.params.chatId)
        }
        this._getCurrentUser();
        this._getUsers();
        this._getChats();
        this._setNewMessage();
    }

    render() {

        // console.log('ROOT STATE: this.state.chats: ');
        // console.log(this.state.chats);

        const childrenWithProps = React.Children.map(this.props.children,
            (child) => React.cloneElement(child, {
                user: this.state.username,
                getUser: this._getCurrentUser,
                getUsers: this._getUsers,
                users: this.state.users,
                consolePrint: this._consolePrint,
                getChats: this._getChats,
                chats: this.state.chats,
                setChat: this._setChat,
                activeChat: this.state.chat,
                sendMsgToServer: this._sendMsgToServer,
                getMsg: this.state.message,
                chatInputChange: this._chatInputChange,
                getPreview: this.state.preview,
                getMessages: this.state.messages,
            })
        );

        return (
            <div className="chatBoxContainer">
                <Menu
                    activeChat = {this.state.chat}
                    chats = {this.state.chats}
                    name={this.state.username}
                    logOut={this._logOut}
                    getUser={this._getCurrentUser}
                    users={this.state.users}
                    navBack={this._navBack}
                />
                <div className="mainContent">
                    {childrenWithProps}
                </div>
            </div>
        );
    }
}
