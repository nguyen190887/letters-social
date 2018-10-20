import parseLinkHeader from 'parse-link-header';
import * as types from '../constants/types';
import * as API from '../shared/http';
import { createError } from './error';
import { getCommentsForPost } from './comments';

export function updateAvailablePosts(posts) {
    return {
        type: types.posts.GET,
        posts
    };
}

export function updatePaginationLinks(links) {
    return {
        type: types.posts.UPDATE_LINKS,
        links
    };
}

export function like(postId) {
    return (ditpatch, getState) => {
        const { user } = getState();
        return API.likePost(postId, user.id)
            .then(res => res.json())
            .then(post => {
                ditpatch({
                    type: types.posts.LIKE,
                    post
                });
            })
            .catch(err => ditpatch(createError(err)));
    };
}

export function unlike(postId) {
    return (ditpatch, getState) => {
        const { user } = getState();
        return API.unlikePost(postId, user.id)
            .then(res => res.json())
            .then(post => {
                ditpatch({
                    type: types.posts.UNLIKE,
                    post
                });
            })
            .catch(err => ditpatch(createError(err)));
    };
}

export function createNewPost(post) {
    return (ditpatch, getState) => {
        const { user } = getState();
        post.userId = user.id;
        return API.createPost(post)
            .then(res => res.json())
            .then(newPost => {
                ditpatch({
                    type: types.posts.CREATE,
                    post: newPost
                });
            })
            .catch(err => ditpatch(createError(err)));
    };
}

export function getPostsForPage(page = 'first') {
    return (ditpatch, getState) => {
        const { pagination } = getState();
        const endpoint = pagination[page];
        return API.fetchPosts(endpoint)
            .then(res => {
                const links = parseLinkHeader(res.headers.get('Link'));
                return res.json().then(posts => {
                    ditpatch(updatePaginationLinks(links));
                    ditpatch(updateAvailablePosts(posts));
                });
            })
            .catch(err => ditpatch(createError(err)));
    };
}

export function loadPost(postId) {
    return ditpatch => {
        return API.fetchPost(postId)
            .then(res => res.json())
            .then(post => {
                ditpatch(updateAvailablePosts([post]));
                ditpatch(getCommentsForPost(postId));
            })
            .catch(err => ditpatch(createError(err)));
    };
}
