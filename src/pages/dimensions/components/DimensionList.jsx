import React, { Component, PropTypes } from 'react';
import DimensionItem from './DimensionItem';

const propTypes = {
    dimensions: PropTypes.arrayOf(React.PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        selectedCount: PropTypes.number.isRequired,
        optionsCount: PropTypes.number.isRequired
    })).isRequired,
    pathname: PropTypes.string.isRequired
};

export default class DimensionList extends Component {
    constructor(props) {
        super(props);
    }

    renderDimensionItems() {
        const dimensions = this.props.dimensions || [];
        let selectionLabel = '';
        return dimensions.map((item, key) => {
            if (item.selectedCount === 1 && item.selectableCount === 1) {
                selectionLabel = `${item.options[0].name}`
            } else if (item.selectedCount === item.selectableCount) {
                selectionLabel = `Everything selected (${item.selectedCount})`
            } else if (item.selectedCount > 1) {
                selectionLabel = `Selected options (${item.selectedCount})`
            } else {
                selectionLabel = `Nothing selected`
            }

            item.pathname = this.props.pathname;
            return <DimensionItem key={key} label={selectionLabel} {...item}/>
        });
    }

    render() {
        return (
            <ul className="list--neutral">
                { this.renderDimensionItems() }
            </ul>
        )
    }
}

DimensionList.propTypes = propTypes;