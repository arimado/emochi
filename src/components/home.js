import React from 'react';

export default class Home extends React.Component {

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
