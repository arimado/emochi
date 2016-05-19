import React from 'react';
import ReactDOM from 'react-dom';

var data = [
    {id: 1, author: "Pete DATA", text: "This is one DATA"},
    {id: 2, author: "Jordan DATA", text: "This is *another* DATA"}
];

class CommentBox extends React.Component {

    constructor() {
        super(); // WTF IS THIS MATE
        this.state = {
            data: data
        };
    }


    render() {
        return (
            <div className="commentBox">
                <h1> Composable Componenets </h1>
                <CommentList data={this.state.data}/>
            </div>
        );
    }
}

class CommentList extends React.Component {

    _getComments() {
        var commentNodes = this.props.data;
        commentNodes.map(function(comment){
            return (
                <Comment author={comment.author} key={comment.id}>
                    {comment.text};
                </Comment>
            )
        });
        return commentNodes
    }

    render() {
        var commentNodes = _getComments();
        return (
            <div className="commentList">
                {commentNodes}
            </div>
        )
    }
};

class Comment extends React.Component {
    render() {
        return (
            <div className="comment">
                <h2 className="commentAuthor">
                    author: hard coded author.
                </h2>
            </div>
        )
    }
};

ReactDOM.render(<CommentBox />, document.getElementById('container'))
