import React, {Component} from 'react';
import Checkbox from '../../../components/elements/Checkbox';

export default class HierarchySelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cachedOptions: []
        }

        this.cacheSelection = this.cacheSelection.bind(this);
    }

    cacheSelection({id, checked = true}) {
        console.log(id, checked);
    }

    renderElement(option) {
        const key = option.id;
        const checkboxProps = {
            id: option.id,
            label: option.name,
            value: option.name,
            onChange: this.cacheSelection,
            checked: option.selected,
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