import React from 'react';
import RadioButton from './RadioButton';

import { render, shallow, mount } from 'enzyme';
import { expect } from 'chai';

describe('<RadioButton />', () => {

    it('Should render single', () => {
        const component = render(<RadioButton id="foo" value="bar" label="baz" group="biz" />);
        expect(component.text()).to.equal("baz");
    });

    it('Should render group', () => {
        const component = mount(<div>
            <RadioButton id="foo_1" value="bar_1" label="baz_1" group="fiz" />
            <RadioButton id="foo_2" value="bar_2" label="baz_2" group="fiz" />
        </div>);

        expect(component.find('#foo_1').prop('value')).to.equal('bar_1')
        expect(component.find('#foo_2').prop('value')).to.equal('bar_2')
    });

    it('Should render checked', () => {
        const component = mount(<RadioButton id="foo" value="bar" label="bell" group="fiz" checked={true} />);
        expect(component.state().checked).to.equal(true);
    })

    it('Should register change', () => {
        let clicked = false;
        const change = () => { clicked = true; }
        const component = shallow(<RadioButton id="foo" value="bar" label="bell" group="fiz" onChange={change} />);
        component.find('input[type="radio"]').simulate('change', { target: { checked: true }} );
        expect(clicked).to.equal(true);
    })
});