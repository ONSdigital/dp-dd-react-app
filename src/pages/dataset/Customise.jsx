import React, { Component } from 'react'
import { connect } from 'react-redux'
import { requestDimensions } from './actions'
import DimensionList from '../../components/elements/DimensionList'

class Customise extends Component {

    constructor(props) {
        super(props)
    }

    componentWillMount() {
        const dispatch = this.props.dispatch;
        dispatch(requestDimensions(this.props.params.id));
    }

    render() {
        const { dimensions, params } = this.props;
        const selectedDimensions = dimensions.map((dimension) => {
            return Object.assign({}, dimension, {
                selected: 'nothing selected'
            })
        })
        return this.props.params.selectorID === undefined
            ? <DimensionList dimensions={selectedDimensions} />
            : <div className="margin-bottom--double"><h3>Customise details {params.selectorID}</h3></div>
    }
}


function mapStateToProps(state) {
    const props = {
        dimensions: state.dataset.dimensions
    }

    return props
}

export default connect(mapStateToProps)(Customise)