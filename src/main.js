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
            data: []
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
        return commentNodes.map((comment) => {
            return (
                <Comment author={comment.author} key={comment.id}>
                    {comment.text};
                </Comment>
            )
        });
    }

    _loadCommentsFromServer() {
        // $.ajax({
        //     url      : this.props.url,
        //     dataType : 'json',
        //     cache    : false,
        //     success  : (data) => { this.setState({data: data});
        //                }.bind(this),
        //     error    : (xhr, status, err) => { console.log('error');
        //                }.bind(this)
        // });
    }

    componentDidMount() {
        // this._loadCommentsFromServer();
    }

    render() {
        var commentNodes = this._getComments();
        console.log(commentNodes);
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
                    author: {this.props.author}
                </h2>
                <p className="commentAuthor">
                    {this.props.children}
                </p>
            </div>
        )
    }
};

ReactDOM.render(<CommentBox url="/api/data"/>, document.getElementById('container'))
