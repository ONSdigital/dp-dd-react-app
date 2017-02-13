import React, {Component} from 'react';
import { hashHistory } from 'react-router';
import Checkbox from '../../../components/elements/Checkbox';
import ToggleLink from '../../../components/elements/ToggleLink';

export default class HierarchySelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cachedOptions: [],
            allEnabled: false,
            allDisabled: false
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

    getEnabledStatus() {
        let allEnabled = false;
        let allDisabled = allDisabled = this.state.cachedOptions.length === 0;

        return {allEnabled, allDisabled}
    }

    toggleAll(state) {
        state = typeof state === 'undefined' || state === true
        return () => {
            const cachedOptions = this.state.cachedOptions.map((option) => {
                option.selected = state;
                return option;
            });
            this.setState({ cachedOptions, allEnabled: state, allDisabled: !state })
        }
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
        const {allEnabled, allDisabled} = this.getEnabledStatus();

        return (
            <form className="form">
                <h1 className="margin-top--half margin-bottom">Select {option.name}</h1>
                <div className="margin-bottom--2">
                    <ToggleLink label="Enable all" enabled={!allEnabled} onClick={this.toggleAll(true)} />
                    <ToggleLink label="Disable all" enabled={!allDisabled} onClick={this.toggleAll(false)} />
                </div>

                <div className="margin-top--4 margin-bottom--8">

                    <ul className="hierarchy">
                        {option.options.map(option => {
                            return this.renderElement(option)
                        })}
                    </ul>

                    <a className="btn btn--primary btn--thick btn--wide btn--big margin-right--half"
                       onClick={this.saveSelections}>Save selection</a>
                    <a className="btn btn--secondary btn--thick btn--wide btn--big" onClick={hashHistory.goBack}>Cancel</a>
                </div>
            </form>
        )
    }
}