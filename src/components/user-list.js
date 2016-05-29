import React from 'react';
import FullButton from './button.js';
import { browserHistory } from 'react-router';

export default class UserList extends React.Component {

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

        // get users into array from state object
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
                console.log(data.ops[0]._id);
                this.props.history.push('/chats/' + data.ops[0]._id);
                this.props.setChat()
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
                    <label>{user.username}</label>
                    <input key={user._id} checked={this.state[user._id]} type="checkbox" onClick={this._handleCheckChange.bind(this, user._id)} />
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
