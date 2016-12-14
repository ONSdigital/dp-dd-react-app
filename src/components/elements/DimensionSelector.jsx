import React, { Component, PropTypes } from 'react';
import Checkbox from '../elements/Checkbox';

const propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        selected: PropTypes.bool
    })).isRequired
};

export default class DimensionSelector extends Component {
    constructor(props) {
        super(props);
    }

    render () {
        // options.map((option, key) => {
        //     <Checkbox />
        // })

        return (
            <div>Dimension Selector</div>
        )
    }
}

DimensionSelector.propTypes = propTypes;