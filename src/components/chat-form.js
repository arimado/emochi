import React from 'react';

export default (props) => {
    
    const getMessage = (e) => {
        e.preventDefault();
        var msg = document.getElementById("messageField").value;
        props.sendMsgToServer(msg);
    }

    return (
        <form className="chatForm" onSubmit={getMessage}>
            <div className="chatFormInner">
                <input id="messageField" type="text"/>
                <input type="submit" value=" "/>
            </div>
        </form>
    )
}
