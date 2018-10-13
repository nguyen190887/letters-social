import React from 'react';
import {shalow} from 'enzyme';
import renderer from 'react-test-renderer';

import Content from './Content';
import { wrap } from 'rest';

describe('<Content/>', () => {
    describe('render methods', () => {
        it('should render correctly', () => {
            const mockPost = {
                content: 'ReactJS is cool'
            };
            const wrapper = shalow(<Content post={mockPost} />);
            expect(wrapper.find('p').length).toBe(1);
        })
    });
});
