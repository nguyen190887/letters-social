jest.mock('../../src/shared/http');
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import initialState from '../../src/constants/initialState'; //todo
import * as types from '../../src/constants/types';
import {
    showComments,
    toggleComments,
    updateAvailableComments,
    createComment,
    getCommentsForPost
} from '../../src/actions/comments';
import * as API from '../../src/shared/http';

const mockStore = configureStore([thunk]);

describe('login actions', () => {
    let store;
    beforeEach(() => {
        store = mockStore(initialState);
    });

    test('showComments', () => {
        const postId = 'id';
        const actual = showComments(postId);
        const expected = { type: types.comments.SHOW, postId };
        expect(actual).toEqual(expected);
    })

    test('createComment', async () => {
        const mockComment = { content: 'great post' };
        API.createComment = jest.fn(() => {
            return Promise.resolve({
                json: () => Promise.resolve([mockComment])
            });
        });
        await store.dispatch(createComment(mockComment));
        const actions = store.getActions();
        const expectedActions = [{type: types.comments.CREATE, comment: [mockComment]}];
        expect(actions).toEqual(expectedActions);
    });

    test('getCommentsForPost', async () => {
        const postId = 1;
        const mockComments = [{content: 'comment 1'}, {content: 'comment 2'}];
        API.fetchCommentsForPost = jest.fn(()=>{
            return Promise.resolve({
                json: () => Promise.resolve(mockComments)
            });
        });
        await store.dispatch(getCommentsForPost(postId));
        const actions = store.getActions();
        const expectedActions = [{
            type: types.comments.GET,
            comments: mockComments
        }];
        expect(actions).toEqual(expectedActions);
    });
});
