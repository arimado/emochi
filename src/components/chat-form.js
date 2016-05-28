import React from 'react';

export default (props) => {
    console.log('chat form imported')
    return (
        <form className="chatForm" onSubmit={props.sendMsgToServer}>
            <div className="chatFormInner">
                <input type="text"/>
                <input type="submit" value=" "/>
            </div>
        </form>
    )
}
