import React from 'react';
import Checkbox from './Checkbox';

import { render, shallow, mount } from 'enzyme';
import { expect } from 'chai';

describe('<Checkbox />', () => {

    it('Should render', () => {
        const component = render(<Checkbox id="foo" value="bar" label="bell" />);
        expect(true).to.equal(true);
        expect(component.text()).to.equal("bell");
    });

    it('Should render checked', () => {
        const component = mount(<Checkbox id="foo" value="bar" label="bell" checked={true} />);
        expect(component.state().checked).to.equal(true);
    })

    it('Should register change', () => {
        let clicked = false;
        const change = () => { clicked = true; }
        const component = shallow(<Checkbox id="foo" value="bar" label="bell" onChange={change} />);
        component.find('input[type="checkbox"]').simulate('change', { target: { checked: true }} );
        expect(clicked).to.equal(true);
    })
});