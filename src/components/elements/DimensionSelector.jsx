import React, { Component, PropTypes } from 'react';
import Checkbox from '../elements/Checkbox';
import { Link } from 'react-router';

const propTypes = {
    dimensionID: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        selected: PropTypes.bool
    })).isRequired,
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
            errorMessage: ""
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
        const option = this.state.cachedOptions.find((option) => {
            return option.id === id
        });
        option.selected = selected;
    }

    render () {
        return (
            <form className="form">
                <legend className="visuallyhidden">What do you want to include?</legend>
                <div className={(this.state.errorMessage.length > 0) && "error__group"}>
                    <h3 className="margin-bottom--1">What do you want to include?</h3>
                    <div className={(this.state.errorMessage.length > 0) && "error__message"}>{this.state.errorMessage}</div>
                    { this.renderSelector() }
                </div>
                <div className="margin-top--4 margin-bottom--8">
                    <a className="btn btn--primary btn--thick btn--wide btn--big margin-right--half"
                       onClick={this.saveSelections}>Save selection &gt;</a>
                    <Link className="btn btn--secondary btn--thick btn--wide btn--big"
                          to="/dd/dataset/AF001EW/customise/">Cancel</Link>
                </div>
            </form>
        )
    }

    renderSelector() {
        const { dimensionID, type, options } = this.props;
        switch(type) {
            // todo: consider moving DimensionSelector to dataset
            case 'SIMPLE_LIST':
                return options.map((item, key) => {
                    const checkboxProps = {
                        id: item.id,
                        label: item.name,
                        value: item.id,
                        onChange: this.cacheSelection,
                        selected: item.selected,
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