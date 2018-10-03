import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Post from '../components/post/Post';
import Ad from '../components/ad/Ad';
import RouterLink from '../components/router/Link';

export class SinglePost extends Component {
    static propTypes = {
        params: PropTypes.shape({
            postId: PropTypes.string.isRequired
        })
    }
    render() {
        return (
            <div className="sinple-post">
                <RouterLink to="/">
                    <div className="back">
                        <i className="fa fa-arrow-circle-left"></i>
                        Back to home
                    </div>
                </RouterLink>
                <Post id={this.props.params.postId} />
                <Ad
                    url="#"
                    imageUrl="/static/assets/ads/ria.png"
                />
            </div>
        )
    }
}

export default SinglePost;
