import React from 'react';

export default (props) => {

    const getMessage = (e) => {
        e.preventDefault();
        var msg = document.getElementById("messageField").value;
        props.sendMsgToServer(msg);
        document.getElementById("messageField").value = '';
    }

    var preview = '';

    const handleChange = (e) => {
        props.chatInputChange(e.target.value);
        preview = props.getPreview;
        console.log('preview: ',  preview);
    }

    return (
        <form className="chatForm" onSubmit={getMessage}>
            <div className="chatFormInner">
                <div className="messageFieldWrapper">
                    <div id="preview">
                         {props.getPreview}
                    </div>
                    <input id="messageField" type="text" onChange={handleChange} value={props.getMsg}/><span className="shade"></span>
                </div>
                <button type="submit" class="btn btn-success">
                   <i className="material-icons">send</i>
               </button>
            </div>
        </form>
    )
}
