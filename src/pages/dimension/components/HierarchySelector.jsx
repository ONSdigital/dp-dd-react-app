import React, {Component} from 'react';

export default class HierarchySelector extends Component {
    constructor(props) {
        super(props);
    }

    renderElement(option) {
        const key = option.id;
        const id = option.id;
        return (
            <li className="nested-list--option" key={key}>
                <input className="checkbox__input" type="checkbox" id={id} name="checkbox" value="value-01" />
                <label className="font-size--19 checkbox__label" htmlFor={id}>
                    {option.name}
                </label>
                {!option.options || (
                    <ul className="nested-list">
                        {option.options.map(option => {
                            return this.renderElement(option)
                        })}
                    </ul>
                )}
            </li>
        )
    }

    render() {
        const option = this.props.option;

        return (
            <fieldset className="hierarchy">
                <legend>Select {option.name}</legend>
                <ul className="nested-list">
                    {option.options.map(option => {
                        return this.renderElement(option)
                    })}
                </ul>
            </fieldset>
        )
    }
}