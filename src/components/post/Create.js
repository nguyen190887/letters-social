import React, { Component } from 'react';
import ProptTypes from 'prop-types';
import uuid from 'uuid';

class CreatePost extends Component {
    static propTypes = {
        onSubmit: ProptTypes.func.isRequired
    }

    constructor (props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePostChange = this.handlePostChange.bind(this);

        this.state = {
            content: ''
        };
    }

    handleSubmit(event) {
        let newPost = {
            ...this.state,
            id: uuid(),
            date: new Date(),
            likes: [],
            comments: []
        }
        // console.log(this.state);
        this.props.onSubmit(newPost);
    }

    handlePostChange(event) {
        // console.log(event);
        this.setState({
            content: event.target.value
        });
    }

    render () {
        return (
            <div className="create-post">
                <textarea
                    value={this.state.content}
                    onChange={this.handlePostChange}
                    placeholder="What's on your mind?" />
                <button onClick={this.handleSubmit}>Post</button>
            </div>
        )
    }
}

export default CreatePost;
