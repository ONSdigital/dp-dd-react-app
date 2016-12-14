import React, { Component, PropTypes } from 'react'
import DimensionItem from './DimensionItem'

const propTypes = {
    dimensions: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired,
        selected: React.PropTypes.string.isRequired
    })).isRequired
}

export default class DimensionList extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const dimensions = this.props.dimensions || [];
        return (
            <ul className="list--neutral">
                {dimensions.map((item, key) => (
                    <DimensionItem key={key} name={item.name} selected={item.selected} id={item.id} />
                ))}
            </ul>
        )
    }
}

DimensionList.propTypes = propTypes