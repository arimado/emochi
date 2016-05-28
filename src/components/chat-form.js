import React from 'react';

export default (props) => {
    console.log('chat form imported')
    return (
        <form className="chatForm">
            <div className="chatFormInner">
                <input type="text"/>
                <input type="submit" value=" "/>
            </div>
        </form>
    )
}
