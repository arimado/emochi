import React from 'react';
import ReactDOM from 'react-dom';
import { hashHistory, Router, Route, Redirect, Link } from 'react-router';

class CommentBox extends React.Component {
    constructor() {
        super(); // WTF IS THIS MATE
        this.state = {
            data: []
        };

        this._handleCommentSubmit = this._handleCommentSubmit.bind(this);
    }

    _loadCommentsFromServer() {
        $.ajax({
              url: this.props.url,
              dataType: 'json',
              cache: false,
              success: function(data) {
                this.setState({data: data});
              }.bind(this),
              error: function(xhr, status, err) {
                console.log('fail!');
                console.error(this.props.url, status, err.toString());
              }.bind(this)
        });
    }

    _handleCommentSubmit(comment) {

        // OPTIMISTIC UPDATE
        var comments = this.state.data;
        var newComment = comment;
        newComment._id = new Date().getTime() + Math.round(Math.random() * 100) + Math.round(Math.random() * 10)
        var newComments = comments.concat([newComment]);
        this.setState({data: newComments});

        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: comment,
            success: function(data) {
            console.log('ajax success:') //unsure why this does not fire
            this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
             this.setState({data: newComments});  // PART OF OPTIMISTIC UPDATE
            console.error(this.props.url, status, err.toString());
            }.bind(this)
        });

    }

    _thisIsMethod() {
        console.log('thisIsMethod called');
    }

    _initialize(init) {
        return init
    }

    componentDidMount() {
        socket.on('init', this._initialize(this._loadCommentsFromServer.bind(this)));
    }

    render() {
        return (
            <div className="commentBox">
                <h1> Composable Componenets </h1>
                <CommentList data={this.state.data} />
                <CommentForm onCommentSubmit={this._handleCommentSubmit} />
            </div>
        );
    }
}

class CommentList extends React.Component {

    _getComments() {
        var commentNodes = this.props.data;
        return commentNodes.map((comment) => {
            return (
                <Comment author={comment.author} key={comment._id}>
                    {comment.text};
                </Comment>
            )
        });
    }

    render() {
        var commentNodes = this._getComments();
        console.log(commentNodes);
        return (
            <div className="commentList">
                {commentNodes}
            </div>
        )
    }
};

class Comment extends React.Component {
    render() {
        return (
            <div className="comment">
                <h2 className="commentAuthor">
                    author: {this.props.author}
                </h2>
                <p className="commentAuthor">
                    {this.props.children}
                </p>
            </div>
        )
    }
};

class CommentForm extends React.Component {

    constructor() {

        super();
        this.state = {
            author: 'test',
            text: 'test'
        };

        this._handleAuthorChange = this._handleAuthorChange.bind(this);
        this._handleTextChange = this._handleTextChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    _handleAuthorChange(e) {
        this.setState({author: e.target.value});
    }

    _handleTextChange(e) {
        this.setState({text: e.target.value});
    }

    _handleSubmit(e) {
        e.preventDefault();
        var author = this.state.author.trim();
        var text = this.state.text.trim();
        if(!text || !author) {
            return;
        }
        this.props.onCommentSubmit({author: author, text: text});
        this.setState({author: '', text: ''});
    }

    componentDidMount() {
        console.log(this.state);
    }

    render() {
        return (
            <form className="commentForm" onSubmit={this._handleSubmit}>
                <input
                    type="text"
                    placeholder="Your name"
                    value={this.state.author}
                    onChange={this._handleAuthorChange}
                />
                <input
                    type="text"
                    placeholder="Say something..."
                    value={this.state.text}
                    onChange={this._handleTextChange}
                />
                <input
                    type="submit"
                    value="submit"
                />
            </form>
        );
    }
};

// CHAT App starts here ----------------------------


class ChatBox extends React.Component {

    constructor() {
        super();
        this.state = {
            username: 'no one',
            users: []
        };
        this._getCurrentUser = this._getCurrentUser.bind(this);
        this._logOut = this._logOut.bind(this);
        this._consolePrint = this._consolePrint.bind(this);
        this._getUsers = this._getUsers.bind(this);
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
                done();
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

    componentDidMount() {
        this._getCurrentUser()
        this._getUsers()
    }

    render() {

        const childrenWithProps = React.Children.map(this.props.children,
            (child) => React.cloneElement(child, {
                getUser: this._getCurrentUser,
                getUsers: this._getUsers,
                users: this.state.users,
                consolePrint: this._consolePrint
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
            <Link to="/users">Users</Link>
            <p>  Logged in as {props.name} </p>
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
                    <form className="bottomForm" onSubmit={this._handleRegisterSubmit}>
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
            <div className="loginContainer growContainer">
                <div className="growContent">
                <form className="bottomForm" onSubmit={this._handleLoginSubmit}>
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

const UserList = (props) => {

    // generate a list of users
    // from the json array
    // do a map

    var userList = props.users.map((user) => {
        return (
            <li> {user.username} </li>
        )
    })

    return (
        <div className="users">
            {userList}
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
        </Route>
    </Router>
)

ReactDOM.render( app, document.getElementById('container'))
