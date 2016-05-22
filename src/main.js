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
                console.log('fail!')
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
        this.state = {};
    }

    render() {
        return (
            <div className="chatBoxContainer">
                 <div className="menu">
                 <Link to="/">Home</Link> | <Link to="/register">Register</Link> | <Link to="/login">Login</Link>
                 </div>
                <div className="mainContent">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

class Home extends React.Component {
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
                user: '',
            password: ''
        };

        this._handlePasswordChange = this._handlePasswordChange.bind(this);
        this._handleUsernameChange = this._handleUsernameChange.bind(this);
        this._handleRegisterSubmit = this._handleRegisterSubmit.bind(this);
    }

    _handleUsernameChange(e) {
        this.setState({user: e.target.value});
    }

    _handlePasswordChange(e) {
        this.setState({password: e.target.value});
    }

    _handleRegisterSubmit(e) {
        e.preventDefault();
        console.log('submit fired')

        var user = {user: this.state.user, password: this.state.password};

        $.ajax({
            url: '/api/register',
            dataType: 'json',
            type: 'POST',
            data: user,
            success: function(data) {
            console.log('ajax success:') //unsure why this does not fire
            this.setState({data: user});
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
                            value={this.state.user}
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
    render() {
        return (
            <div className="loginContainer growContainer">
                <div className="growContent">
                <form className="bottomForm">
                    <input
                        type="text"
                        placeholder="name"
                        className="registerField"
                    />
                    <input
                        type="text"
                        placeholder="password"
                        className="registerField"
                    />
                </form>
                </div>
                <FullButton buttonVal="Login" />
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

const app = (
    <Router>
        <Redirect from="/" to="/home" />
        <Route path="/" component={ChatBox}>
            <Route path="home" component={Home} />
            <Route path="Register" component={Register}/>
            <Route path="Login" component={Login} />
        </Route>
    </Router>
)




ReactDOM.render( app, document.getElementById('container'))
