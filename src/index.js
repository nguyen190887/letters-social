import React from 'react';
import { render } from 'react-dom';

import App from './app';
import Home from './pages/Home';
import SinglePost from './pages/Post';
import Router from './components/router/Router';
import Route from './components/router/Route';
import { history } from './history';

import './shared/crash';
import './shared/service-worker';
import './shared/vendor';
// NOTE: this isn't ES*-compliant/possible, but works because we use Webpack as a build tool
import './styles/styles.scss';

// render(<App />, document.getElementById('app'));
export const renderApp = (state, callback = () => {}) => {
    render(
        <Router {...state}>
            <Route path="" component={App}>
                <Route path="/" component={Home} />
                <Route path="/posts/:postId" component={SinglePost} />
            </Route>
        </Router>,
        document.getElementById('app'),
        callback
    );
};

let state = {
    location: window.location.pathname
};

history.listen(location => {
    state = {...state, ...{ location: location.pathname }};
    renderApp(state);
})

renderApp(state);
