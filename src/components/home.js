import React from 'react';
import { Link } from 'react-router';

export default class Home extends React.Component {

    componentDidMount() {
        this.props.consolePrint();
        this.props.getUser();
    }

    render() {
        return (
            <div className="homeContainer">
                <Link to="/register">Register</Link> |
                <Link to="/login">Login</Link> |
            </div>
        )
    }
}
