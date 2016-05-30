import React from 'react';

export default (props) => {

    const getMessage = (e) => {
        e.preventDefault();
        var msg = document.getElementById("messageField").value;
        props.sendMsgToServer(msg);
        document.getElementById("messageField").value = '';
    }

    return (
        <form className="chatForm" onSubmit={getMessage}>
            <div className="chatFormInner">
                <input id="messageField" type="text"/>
                <button type="submit" class="btn btn-success">
                   <i className="material-icons">send</i>
               </button>
            </div>

        </form>
    )
}
