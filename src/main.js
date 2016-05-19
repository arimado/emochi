import FlashMessage from "./components/flash-message.js";
import React from 'react';
import ReactDOM from 'react-dom';


let flash = new FlashMessage("Gulp, Babel, Brow");

flash.display();

class CommentBox extends React.Component {
    render() {
        return (
            <div className="commentBox">
                <h1> Composable Componenets </h1>
            </div>
        );
    }
}

// class CommentList = React.Component {
//     render() {
//         return (
//             <div
//         )
//     }
// };

ReactDOM.render(<CommentBox />, document.getElementById('container'))
