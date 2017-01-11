import React from 'react';
import ToggleLink from './ToggleLink';

import { render, shallow, mount } from 'enzyme';
import { expect } from 'chai';

describe('<ToggleLink />', () => {

    it('Should render enabled by default', () => {
        const component = render(<ToggleLink label="foo" />);
        expect(component.text()).to.contain('foo');
        expect(component.find('a')).to.have.length(1);
    });

    it('Should render disabled', () => {
        const component = render(<ToggleLink label="foo" enabled={false} />);
        expect(component.text()).to.contain('foo');
        expect(component.find('a')).to.have.length(0);
        expect(component.find('span')).to.have.length(1);
    });

    it('Should register change on enabled', () => {
        let clicked = false;
        const onChange = ({enabled}) => { clicked = enabled };
        const component = shallow(<ToggleLink label="foo" enabled={true} onClick={onChange} />);
        component.simulate('click');
        expect(clicked).to.equal(true);
    });

    it('Should not register change on disabled', () => {
        let clicked = false;
        const onChange = ({enabled}) => { clicked = enabled };
        const component = shallow(<ToggleLink label="foo" enabled={false} onClick={onChange} />);
        component.simulate('click');
        expect(clicked).to.equal(false);
    });
});