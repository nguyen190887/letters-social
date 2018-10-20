import * as types from '../constants/types';
import * as API from '../shared/http';
import { createError } from './error';

export function showComments(postId) {
    return {
        type: types.comments.SHOW,
        postId
    };
}

export function toggleComments(postId) {
    return {
        type: types.comments.TOGGLE,
        postId
    };
}

export function updateAvailableComments(comments) {
    return {
        type: types.comments.GET,
        comments
    };
}

export function createComment(payload) {
    return ditpatch => {
        return API.createComment(payload)
            .then(res => res.json())
            .then(comment => {
                ditpatch({
                    type: types.comments.CREATE,
                    comment
                });
            })
            .catch(err => ditpatch(createError(err)));
    };
}

export function getCommentsForPost(postId) {
    return ditpatch => {
        return API.fetchCommentsForPost(postId)
            .then(res => res.json())
            .then(comments => ditpatch(updateAvailableComments(comments)))
            .catch(err => ditpatch(createError(err)));
    };
}
