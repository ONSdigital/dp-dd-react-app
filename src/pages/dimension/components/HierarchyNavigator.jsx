import React, { Component, PropTypes } from 'react';
import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { deselectAllOptions, selectAllOptions } from '../../dataset/actions';

class HierarchyNavigator extends Component {
    constructor(props) {
        super(props);
        this.selectAll = this.selectAll.bind(this);
    }

    selectAll() {
        this.props.dispatch(selectAllOptions(this.props.dimensionID));
        this.props.router.push({
            pathname: this.props.location.pathname,
            query: {
                action: 'summary'
            }
        });
    }

    componentWillMount() {
        if (!this.props.dimension.edited) {
            this.props.dispatch(deselectAllOptions(this.props.dimensionID));
        }
    }

    render () {
        const pathname = this.props.location.pathname;

        return (
            <div>
                <h1 className="margin-top margin-bottom">Customise location</h1>
                <div>
                    <h2><Link to={{pathname, query: {action: 'search'}}}>Search</Link></h2>
                    Search for specific location
                </div>

                <div className="margin-top--3">
                    <h2><Link to={{pathname: pathname, query: {action: 'browse'}}}>Browse</Link></h2>
                    Select locations from the list
                </div>

                <div className="margin-top--3">
                    <h2><a href="" onClick={this.selectAll}>Add all</a></h2>
                    Add all locations in the dataset
                </div>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    const dimension = state.dataset.dimensions.find((dimension) => {
        return dimension.id === ownProps.dimensionID;
    });

    return {
        hasDimension: state.dataset.hasDimensions,
        dimension
    }
}

export default connect(mapStateToProps)(HierarchyNavigator)