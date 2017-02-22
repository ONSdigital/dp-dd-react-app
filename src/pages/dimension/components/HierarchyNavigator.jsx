import React, { Component, PropTypes } from 'react';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { selectAllOptions } from '../../dataset/actions';
import analytics from '../../../config/analytics';

class HierarchyNavigator extends Component {
    constructor(props) {
        super(props);
        this.selectAll = this.selectAll.bind(this);
    }

    selectAll(e) {
        e.preventDefault();
        analytics.logHierarchyAddAll();
        this.props.dispatch(selectAllOptions(this.props.dimensionID));
        this.props.router.push({
            pathname: this.props.location.pathname,
            query: {
                action: 'summary'
            }
        });
    }

    render () {
        const pathname = this.props.location.pathname;
        const dimensionName = this.props.dimensionName;

        return (
            <div className="margin-bottom--8">
                <h1 className="margin-top--4 margin-bottom">{dimensionName}</h1>
                <div>
                    <h2><Link to={{pathname, query: {action: 'search'}}}>Search</Link></h2>
                    Search for specific location
                </div>

                <div className="margin-top--3">
                    <h2><Link to={{pathname: pathname, query: {action: 'browse'}}}>Browse</Link></h2>
                    Select values from the list
                </div>

                <div className="margin-top--3">
                    <h2><a onClick={this.selectAll}>Add all</a></h2>
                    Add all dimension values
                </div>
                <br/>
                <a className="inline-block margin-top--4 font-size--17" onClick={browserHistory.goBack}>Cancel</a>
            </div>
        )
    }
}

export default connect(null)(HierarchyNavigator);