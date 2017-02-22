import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import {
    requestVersionMetadata,
    requestDimensions
} from '../../dataset/actions';


import DimensionList from './DimensionList';
import DocumentTitle from '../../../components/elements/DocumentTitle';

const propTypes = {
    hasDimensions: PropTypes.bool.isRequired,
    hasMetadata: PropTypes.bool.isRequired,
    dimensions: PropTypes.array
}

class Dimension extends Component {
    constructor(props) {
        super(props)
        const pathname = props.location.pathname;
        this.state = {
            initialFetchRequired: false,
            parentPath: pathname.replace(/\/\w+\/?$/, ''),            // drop last bit
            currentPath: pathname,
            downloadPath: pathname.replace(/\/\w+\/?$/, '/download')  // replace last bit with /download
        }
    }

    componentWillMount() {
        const dispatch = this.props.dispatch;
        const params = this.props.params;
        if (!this.props.hasMetadata) {
            this.state.initialFetchRequired = true;
            dispatch(requestVersionMetadata(params.id, params.edition, params.version));
        }

        if (!this.props.hasDimensions) {
            dispatch(requestDimensions(params.id, params.edition, params.version));
        }
    }

    shouldComponentUpdate(props) {
        const dispatch = props.dispatch;
        const params = props.params;
        if (this.state.initialFetchRequired) {
            this.state.initialFetchRequired = false;
            dispatch(requestDimensions(params.id, params.edition, params.version));
            return false;
        }
        return true;
    }

    render() {
        const props = this.props;
        if (!this.props.hasMetadata || !props.hasDimensions) {
            return null;
        }

        const componentProps = {
            dimensions: this.props.dimensions,
            pathname: this.props.location.pathname
        }

        return (
            <div className="wrapper">
                <div>
                    <DocumentTitle title={`Customise ${this.props.title}`}>
                        <h1 className="margin-top--4 margin-bottom">Customise this dataset</h1>
                    </DocumentTitle>
                </div>
                <div>
                    <DimensionList {...componentProps} />
                    <div className="margin-top--4 margin-bottom--8">
                        <Link className="btn btn--primary btn--thick btn--wide btn--big margin-right--half"
                              to={this.state.downloadPath}>Choose a download format</Link>
                        <br/>
                        <a className="inline-block margin-top--4 font-size--17" onClick={browserHistory.goBack}>Cancel</a>
                    </div>
                </div>
            </div>
        )
    }
}

Dimension.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        dimensions: state.dataset.dimensions,
        title: state.dataset.title,
        hasDimensions: state.dataset.hasDimensions,
        hasMetadata: state.dataset.hasMetadata
    }
}

export default connect(mapStateToProps)(Dimension);