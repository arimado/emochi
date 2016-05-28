import React from 'react';
import ReactDOM from 'react-dom';
import ChatForm from './components/chat-form.js';
import { hashHistory, Router, Route, Redirect, Link } from 'react-router';

// CHAT App starts here ----------------------------

class ChatBox extends React.Component {

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

    _addUsersToChat() {
        // print an array of users
    }

    _setChat(chatId) {
        console.log('set Chat fired with ' + chatId)
        this.setState({chat: chatId});
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
                activeChat: this.state.chat
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

const Menu = (props) => {
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

class Home extends React.Component {

    componentDidMount() {
        this.props.consolePrint();
        this.props.getUser();
    }

    render() {
        return (
            <div className="homeContainer">
                <p> Home page </p>
            </div>
        )
    }
}

class Register extends React.Component {

    constructor() {
        super();
        this.state = {
            username: '',
            password: ''
        };

        this._handlePasswordChange = this._handlePasswordChange.bind(this);
        this._handleUsernameChange = this._handleUsernameChange.bind(this);
        this._handleRegisterSubmit = this._handleRegisterSubmit.bind(this);
    }

    _handleUsernameChange(e) {
        this.setState({username: e.target.value});
    }

    _handlePasswordChange(e) {
        this.setState({password: e.target.value});
    }

    _handleRegisterSubmit(e) {
        e.preventDefault();
        console.log('submit fired')

        var user = {username: this.state.username, password: this.state.password};

        $.ajax({
            url: '/api/register',
            dataType: 'json',
            type: 'POST',
            data: user,
            success: function(data) {
                console.log('ajax register success:') //unsure why this does not fire
                this.props.getUser(this.props.getUsers)
            }.bind(this),
            error: function(xhr, status, err) {
                this.setState({data: user});  // PART OF OPTIMISTIC UPDATE
            console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    }

    render() {
        return (
            <div className="registerContainer growContainer">
                <div className="growContent">
                    <form className="loginForm" onSubmit={this._handleRegisterSubmit}>
                        <input
                            type="text"
                            placeholder="name"
                            className="registerField"
                            value={this.state.username}
                            onChange={this._handleUsernameChange}
                        />
                        <input
                            type="text"
                            placeholder="password"
                            className="registerField"
                            value={this.state.password}
                            onChange={this._handlePasswordChange}
                        />
                    </form>
                </div>
                <FullButton buttonVal="Register" _onSubmit={this._handleRegisterSubmit}/>
            </div>
        )
    }
}

class Login extends React.Component {

        constructor() {
            super();
            this.state = {
                username: '',
                password: ''
            };

            this._handlePasswordChange = this._handlePasswordChange.bind(this);
            this._handleUsernameChange = this._handleUsernameChange.bind(this);
            this._handleLoginSubmit = this._handleLoginSubmit.bind(this);
        }

        _handleUsernameChange(e) {
            this.setState({username: e.target.value});
        }

        _handlePasswordChange(e) {
            this.setState({password: e.target.value});
        }

        _handleLoginSubmit(e) {
            e.preventDefault();
            console.log('login fired')

            var user = {username: this.state.username, password: this.state.password};

            $.ajax({
                url: '/api/login',
                dataType: 'json',
                type: 'POST',
                data: user,
                success: function(data) {
                    console.log('ajax success:') //unsure why this does not fire
                    this.props.getUser();
                }.bind(this),
                error: function(xhr, status, err) {
                console.error('/api/login', status, err.toString());
                }.bind(this)
            });
        }

    render() {
        return (
            <div className="registerContainer growContainer">
                <div className="growContent">
                <form className="loginForm" onSubmit={this._handleLoginSubmit}>
                    <input
                        type="text"
                        placeholder="name"
                        className="loginField"
                        value={this.state.username}
                        onChange={this._handleUsernameChange}
                    />
                    <input
                        type="text"
                        placeholder="password"
                        className="loginField"
                        value={this.state.password}
                        onChange={this._handlePasswordChange}
                    />
                </form>
                </div>
                <FullButton buttonVal="Login" _onSubmit={this._handleLoginSubmit}/>
            </div>
        )
    }
}

class FullButton extends React.Component {
    render() {
        var buttonClass = 'button' + this.props.buttonVal + ' fullButton';

        return (
            <form className="bottomForm" onSubmit={this.props._onSubmit}>
                <input
                    type="submit"
                    value={this.props.buttonVal}
                    className={buttonClass}
                />
            </form>
        )
    }
}

class UserList extends React.Component {

    constructor(props) {
        super();
        this.state = {};
        this._addUsersToChat = this._addUsersToChat.bind(this);
    }

    _handleCheckChange(id, e) {
        const checkbox = {};
        if (this.state[id] === undefined) {
            checkbox[id] = true;
        } else if (this.state[id]) {
            checkbox[id] = false;
        } else {
            checkbox[id] = true;
        }
        console.log(checkbox);
            this.setState(checkbox);
        console.log(this.state);
    }

    _addUsersToChat(e) {
        // Get state of all objects that are equal to true
        console.log('_addUsersToChat');
        e.preventDefault();
        // get users into array
        var usersObj = this.state;
        var usersArr = Object.keys(usersObj).map((key) => key);
        var userJSON = JSON.stringify(usersArr);
        var data = {data: userJSON};

        $.ajax({
            url: '/api/chats/create',
            dataType: 'json',
            type: 'POST',
            data: data,
            success: function(data) {
                console.log('ajax add chat users success:') //unsure why this does not fire
                console.log(data);
            }.bind(this),
            error: function(xhr, status, err) {
            console.error('/api/chats/create', status, err.toString());
            }.bind(this)
        });
    }

    render() {
        const userList = this.props.users.map((user) => {
            return (
                <li key={user._id}>
                    <label>{user.username}</label><input key={user._id} checked={this.state[user._id]} type="checkbox" onClick={this._handleCheckChange.bind(this, user._id)} />
                    {/* the onClick event solution came from --> https://github.com/facebook/react/issues/5674 */}
                </li>
            )
        });

        return (
            <div className="users">
                <ul>{userList.reverse()}</ul>
                <FullButton _onSubmit={this._addUsersToChat}/>
            </div>
        )
    }
}

const ChatList = (props) => {

        const chatList = props.chats.map((chat) => {

            return (
                <li key={chat._id}>
                    <div>
                        Conversation with: <br/>
                        <span className="membersList">
                            <Link onClick={props.setChat.bind(this, chat._id)} to={`/chats/${chat._id}`}>{chat.members.join(', ')}</Link>
                        </span>
                    </div>
                </li>
            )
        });

        return (
            <div className="users">
                <ul> {chatList} </ul>
            </div>
        )
}

const Chat = (props) => {
    return (
        <div class="convoWrapper">
            <div className="convo">
                <p>updated{props.activeChat}</p>
            </div>
            <ChatForm />
        </div>
    )
}


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
