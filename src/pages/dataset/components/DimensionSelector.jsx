import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import config from '../../../config';
import Checkbox from '../../../components/elements/Checkbox';
import ToggleLink from '../../../components/elements/ToggleLink';

const propTypes = {
    datasetID: PropTypes.string.isRequired,
    dimensionID: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        selected: PropTypes.bool
    })).isRequired,
    optionsCount: PropTypes.number.isRequired,
    saveSelections: PropTypes.func
};

export default class DimensionSelector extends Component {
    constructor(props) {
        super(props);

        this.saveSelections = this.saveSelections.bind(this);
        this.cacheSelection = this.cacheSelection.bind(this);

        this.state = {
            cachedOptions: props.options.map(option => {
                return { id: option.id, selected: option.selected }
            }),
            errorMessage: "",
            parentPath: `${config.BASE_PATH}/dataset/${this.props.datasetID}/customise/`,
            allEnabled: false,
            allDisabled: false
        }
    }

    validateSelections() {
        return (this.state.cachedOptions).some(option => {
            return option.selected;
        });
    }

    saveSelections() {
        const saveSelections = this.props.saveSelections;
        const isValid = this.validateSelections();

        if (!isValid) {
            this.setState({errorMessage: "Select at least one option"});
            return;
        }

        if (saveSelections) {
            saveSelections({
                dimensionID: this.props.dimensionID,
                options: this.state.cachedOptions
            });
        }
    }

    cacheSelection({id, selected = true}) {
        const cachedOptions = this.state.cachedOptions.map((option) => {
            if (option.id === id) {
                option.selected = selected;
            }
            return option;
        });

        const errorMessage = this.validateSelections() ? "" : this.state.errorMessage;
        const {allEnabled, allDisabled} = this.getEnabledStatus();
        this.setState({ cachedOptions, allEnabled, allDisabled, errorMessage })
    }

    getEnabledStatus() {
        let allEnabled = true;
        let allDisabled = true;

        const cachedOptions = this.state.cachedOptions.map((option) => {
            if (option.selected) {
                allDisabled = false;
            } else {
                allEnabled = false;
            }
        });

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

    componentWillMount() {
        const {allEnabled, allDisabled} = this.getEnabledStatus();
        this.state.allEnabled = allEnabled;
        this.state.allDisabled = allDisabled;
    }

    render () {
        const errorMessage = this.state.errorMessage;
        const allEnabled = this.state.allEnabled;
        const allDisabled = this.state.allDisabled;
        const parentPath = this.state.parentPath;

        return (
            <form className="form">
                <h1 className="margin-top--half margin-bottom">What do you want to include?</h1>
                <div className="margin-bottom--2">
                    <ToggleLink label="Enable all" enabled={!allEnabled} handleOnClick={this.toggleAll(true)} />
                    <ToggleLink label="Disable all" enabled={!allDisabled} handleOnClick={this.toggleAll(false)} />
                </div>
                <div className={(errorMessage.length > 0) && "error__group"}>
                    <div className={(errorMessage.length > 0) && "error__message"}>{errorMessage}</div>
                    { this.renderSelector() }
                </div>
                <div className="margin-top--4 margin-bottom--8">
                    <a className="btn btn--primary btn--thick btn--wide btn--big margin-right--half"
                       onClick={this.saveSelections}>Save selection</a>
                    <Link className="btn btn--secondary btn--thick btn--wide btn--big"
                          to={parentPath}>Cancel</Link>
                </div>
            </form>
        )
    }

    renderSelector() {
        const { type, options } = this.props;
        switch(type) {
            // todo: consider moving DimensionSelector to dataset component folder
            case 'SIMPLE_LIST':
                return options.map((optionItem, key) => {
                    const cachedOption = this.state.cachedOptions.find((option) => {
                        if (option.id === optionItem.id) return option;
                    });
                    const checkboxProps = {
                        id: optionItem.id,
                        label: optionItem.name,
                        value: optionItem.id,
                        onChange: this.cacheSelection,
                        selected: cachedOption.selected,
                        key
                    }
                    return <Checkbox {...checkboxProps} />
                });
                break;
            default:
                return <span><i>Not supported yet.</i></span>
                break;
        }
    }
}

DimensionSelector.propTypes = propTypes;