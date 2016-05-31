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
                <div className="logoContainer">
                    <div className="logo">Emochi</div>
                    <div className="description"> Shh... no words. Only feels now.</div> 
                </div>
                <div className="homeLinks">
                    <Link to="/register">Register</Link> <Link to="/login">Login</Link>
                </div>
            </div>
        )
    }
}
