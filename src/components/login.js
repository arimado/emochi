import React from 'react';
import FullButton from './button.js';
import { browserHistory, RouterContext } from 'react-router';

export default class Login extends React.Component {

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
                    this.props.history.push('/chats');
                }.bind(this),
                error: function(xhr, status, err) {
                console.error('/api/login', status, err.toString());
                }.bind(this)
            });


        }

    render() {
        return (
            <div className="registerContainer growContainer registerLoginContainer">
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
                        type="password"
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
