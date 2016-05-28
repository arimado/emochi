import React from 'react';

export default class FullButton extends React.Component {
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
