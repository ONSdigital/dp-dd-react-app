import React from 'react';
import DocumentTitle from './DocumentTitle';

import { render, shallow, mount } from 'enzyme';
import { expect } from 'chai';

describe('<DocumentTitle />', () => {

    it('Should render text title node', () => {
        const component = render(<DocumentTitle><h1>foo</h1></DocumentTitle>);
        expect(component.text()).to.equal('foo');
    });

    it('Should update page title', () => {
        const component = render(<DocumentTitle title="foo"></DocumentTitle>);
        expect(document.title).to.equal('foo - Office for National Statistics');
    })
});