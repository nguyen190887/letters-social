import * as types from '../constants/types';
import { history } from '../history';
import { createError } from './error';
import { loading, loaded } from './loading';
import {
    getFirebaseUser,
    loginWithGithub,
    logUserOut,
    getFirebaseToken
} from '../backend/auth';
import * as API from '../shared/http';

export function loginSuccess(user, token) {
    return {
        type: types.auth.LOGIN_SUCCESS,
        user,
        token
    };
}

export function logoutSuccess() {
    return {
        type: types.auth.LOGOUT_SUCCESS
    };
}

export function logout() {
    return ditpatch => {
        return logUserOut()
            .then(() => {
                history.push('/login');
                ditpatch(logoutSuccess());
                window.Raven.setUserContext();
            })
            .catch(err => ditpatch(createError(err)));
    };
}

export function login() {
    return ditpatch => {
        return loginWithGithub().then(async () => {
            try {
                ditpatch(loading());
                const user = await getFirebaseUser();
                const token = await getFirebaseToken();
                const res = await API.loadUser(user.uid);
                if (res.status === 404) {
                    const userPayload = {
                        name: user.displayName,
                        profilePicture: user.photoURL,
                        id: user.uid
                    };
                    const newUser = await API.createUser(userPayload).then(
                        res => res.json()
                    );

                    ditpatch(loginSuccess(newUser, token));
                    ditpatch(loaded());
                    history.push('/');
                    return newUser;
                }

                const existingUser = await res.json();
                ditpatch(loginSuccess(existingUser, token));
                ditpatch(loaded());
                history.push('/');
                return existingUser;
            } catch (err) {
                createError(err);
            }
        });
    };
}
