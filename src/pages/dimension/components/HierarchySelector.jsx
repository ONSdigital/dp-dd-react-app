import React, {Component} from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';

import Checkbox from '../../../components/elements/Checkbox';
import ToggleLink from '../../../components/elements/ToggleLink';
import { renderFlatListOfOptions } from '../utils';
import { saveDimensionOptions } from '../../dataset/actions';

class HierarchySelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            allEnabled: false,
            allDisabled: false,
            errorMessage: "",
            cachedOptions: renderFlatListOfOptions({
                hierarchy: props.option,
                filter: {}
            })
        }

        this.cacheSelectedOption = this.cacheSelectedOption.bind(this);
        this.saveSelectedOptions = this.saveSelectedOptions.bind(this);
    }

    saveSelectedOptions() {
        if (!this.isSelectionValid()) {
            this.setState({errorMessage: "Select at least one option"});
            return;
        }

        this.props.dispatch(saveDimensionOptions({
            dimensionID: this.props.dimensionID,
            options: this.state.cachedOptions
        }));

        this.props.onSave();
    }

    cacheSelectedOption({id, checked = true}) {
        const cachedOptions = this.state.cachedOptions.map((option) => {
            if (option.id === id) {
                option.selected = checked;
            }
            return option;
        });

        const errorMessage = this.isSelectionValid() ? "" : this.state.errorMessage;
        const {allEnabled, allDisabled} = this.getEnabledStatus();
        this.setState({ cachedOptions, allEnabled, allDisabled, errorMessage })
    }

    getEnabledStatus() {
        let allEnabled = true;
        let allDisabled = true;

        this.state.cachedOptions.forEach((option) => {
            if (option.selected) {
                allDisabled = false;
            } else {
                allEnabled = false;
            }
        });

        return {allEnabled, allDisabled}
    }

    isSelectionValid() {
        return (this.state.cachedOptions).some(option => {
            return option.selected;
        });
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
        const cachedOption = this.state.cachedOptions.find((optionItem) => {
            if (option.id === optionItem.id) return option;
        });

        const checkboxProps = {
            id: option.id,
            label: option.name,
            value: option.name,
            onChange: this.cacheSelectedOption,
            checked: cachedOption.selected,
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
        const errorMessage = this.state.errorMessage;
        const errorClass = (errorMessage.length > 0) && "error__group";


        return (
            <form className="form margin-bottom--8">
                <h1 className="margin-top--half margin-bottom">Select {option.name}</h1>
                <div className="margin-bottom--2">
                    <ToggleLink label="Enable all" enabled={!allEnabled} onClick={this.toggleAll(true)} />
                    <ToggleLink label="Disable all" enabled={!allDisabled} onClick={this.toggleAll(false)} />
                </div>

                <div className={`${errorClass}`}>
                    <div className={(errorMessage.length > 0) && "error__message"}>{errorMessage}</div>

                </div>

                <div >

                    <ul className="hierarchy">
                        {option.options.map(option => {
                            return this.renderElement(option)
                        })}
                    </ul>

                    <a className="btn btn--primary btn--thick btn--wide btn--big margin-right--half"
                       onClick={this.saveSelectedOptions}>Save selection</a>
                    <a className="btn btn--secondary btn--thick btn--wide btn--big" onClick={hashHistory.goBack}>Cancel</a>
                </div>
            </form>
        )
    }
}

export default connect(null)(HierarchySelector);