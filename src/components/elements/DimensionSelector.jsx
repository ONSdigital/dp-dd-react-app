import React, { Component, PropTypes } from 'react';
import Checkbox from '../elements/Checkbox';
import { Link } from 'react-router';

const propTypes = {
    selectorID: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        selected: PropTypes.bool
    }))
};

const defaultState = {
    selectedOptionIDs: []
};

export default class DimensionSelector extends Component {
    constructor(props) {
        super(props);
        this.state = defaultState;

        this.cacheSelection = this.cacheSelection.bind(this);
    }

    saveSelections() {
        console.log(this.state.selectedOptionIDs);
        console.error('Not implemented yet');
        // trigger action to send
    }

    cacheSelection({id, selected = true}) {
        const index = this.state.selectedOptionIDs.indexOf(id);
        if (index === -1) {
            this.state.selectedOptionIDs.push(id);
        } else if (!selected) {
            this.state.selectedOptionIDs.splice(index, 1);
        }
    }

    renderSelector() {
        const selectorID = this.props.selectorID;
        const options = this.props.options;
        const selectorMap = {
            'dimensionList': ['D000123', 'D000124', 'D000125']
        };

        if (selectorMap.dimensionList.indexOf(selectorID) > -1) {
            return options.map((item, key) => (
                <Checkbox key={key} id={item.id}  label={item.name} value={item.id} onChange={this.cacheSelection} />
            ));
        } else {
            return <span><i>Not supported yet.</i></span>
        }
    }

    render () {
        return (
            <div>
                <div>
                    <h3>What do you want to include?</h3>
                </div>
                { this.renderSelector() }
                <div className="margin-top--4 margin-bottom--8">
                    <a className="btn btn--primary btn--thick btn--wide btn--big margin-right--half"
                       onClick={this.saveSelections.bind(this)}>Save selection &gt;</a>
                    <Link className="btn btn--secondary btn--thick btn--wide btn--big"
                          to="/dd/dataset/AF001EW/customise/">Cancel</Link>
                </div>
            </div>
        )
    }
}

DimensionSelector.propTypes = propTypes;