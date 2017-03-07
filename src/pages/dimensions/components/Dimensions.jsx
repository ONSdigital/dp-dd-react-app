import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { appendPathComponent, dropLastPathComponent } from '../../../common/helpers';
import { requestVersionMetadata } from '../../dataset/actions';
import { requestDimensions, resetDimension } from '../actions';

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
            parentPath: dropLastPathComponent(pathname),
            currentPath: pathname,
            downloadPath: appendPathComponent(dropLastPathComponent(pathname), '/download')
        }
    }

    componentWillMount() {
        this.requestDataUpdate();
    }

    shouldComponentUpdate(props) {
        return !this.requestDataUpdate(props);
    }

    requestDataUpdate(props = this.props) {
        const dispatch = props.dispatch;
        const params = props.params;

        if (!props.hasMetadata) {
            dispatch(requestVersionMetadata(params.id, params.edition, params.version));
            return true;
        }

        if (!props.hasDimensions) {
            dispatch(requestDimensions(params.id, params.edition, params.version));
            return true;
        }

        props.dimensions.forEach(dimension => {
           if (dimension.selectedCount === 0) {
               dispatch(resetDimension(dimension.id));
               return true;
           }
        });

        return false;
    }

    render() {
        const props = this.props;
        if (!this.props.hasMetadata || !props.hasDimensions) {
            return null;
        }

        const componentProps = {
            dimensions: this.props.dimensions,
            pathname: this.props.location.pathname
        };

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
                        <Link className="inline-block margin-top--4 font-size--17" to={this.state.parentPath}>Cancel</Link>
                    </div>
                </div>
            </div>
        )
    }
}

Dimension.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        hasMetadata: state.dataset.hasMetadata,
        title: state.dataset.title,
        dimensions: state.dimensions,
        hasDimensions: state.dimensions.length > 0
    }
}

export default connect(mapStateToProps)(Dimension);