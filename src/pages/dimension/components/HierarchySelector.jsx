import React, {Component} from 'react';
import Checkbox from '../../../components/elements/Checkbox';

export default class HierarchySelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cachedOptions: []
        }

        this.cacheSelectedOption = this.cacheSelectedOption.bind(this);
    }

    cacheSelectedOption({id, checked = true}) {
        const cachedOptions = this.state.cachedOptions.slice(0);
        const index = cachedOptions.indexOf(id);
        const cached = index > -1;

        if (cached && !checked) {
            cachedOptions.splice(index, 1);
        }
        if (!cached && checked) {
            cachedOptions.push(id);
        }

        this.setState({ cachedOptions });
    }

    renderElement(option) {
        const key = option.id;
        const cachedOptions = this.state.cachedOptions;
        const checkboxProps = {
            id: option.id,
            label: option.name,
            value: option.name,
            onChange: this.cacheSelectedOption,
            checked: cachedOptions.indexOf(option.id) > - 1,
            key
        }

        return (
            <li className={"hierarchy--" + (option.options ? "children" : "option")} key={key}>
                <Checkbox {...checkboxProps} />

                {!option.options || (
                    <ul className="hierarchy">
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
            <fieldset>
                <legend>Select {option.name}</legend>
                <ul className="hierarchy">
                    {option.options.map(option => {
                        return this.renderElement(option)
                    })}
                </ul>
            </fieldset>
        )
    }
}