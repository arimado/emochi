import React from 'react';
import FullButton from './button.js';
import { browserHistory } from 'react-router';

export default class Register extends React.Component {

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
                this.props.history.push('/chats');
            }.bind(this),
            error: function(xhr, status, err) {
                this.setState({data: user});  // PART OF OPTIMISTIC UPDATE
            console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    }

    render() {
        return (
            <div className="registerContainer growContainer registerLoginContainer">
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
