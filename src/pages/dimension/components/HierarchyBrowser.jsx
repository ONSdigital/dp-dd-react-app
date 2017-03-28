import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import SimpleSelector from './SimpleSelector';
import HierarchySelector from './HierarchySelector';

import { findOptionByID } from '../utils/querying';
import { dropLastPathComponent } from '../../../common/helpers';
import { requestVersionMetadata } from '../../dataset/actions';

const propTypes = {
    dimensionID: PropTypes.string.isRequired,
    datasetID: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    option: PropTypes.object,
    options: PropTypes.array
}

class HierarchyBrowser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialFetchRequired: false
        }
    }

    componentWillMount() {
        const dispatch = this.props.dispatch;
        if (!this.props.hasMetadata) {
            this.state.initialFetchRequired = true;
            return dispatch(requestVersionMetadata(this.props.params.id));
        }
        if (!this.props.hasDimensions) {
            dispatch(requestDimensions(this.props.params.id));
        }
    }


    shouldComponentUpdate(nextProps) {
        if (this.state.initialFetchRequired) {
            this.state.initialFetchRequired = false;
            nextProps.dispatch(requestDimensions(this.props.params.id));
            return false;
        }
        return true;
    }

    render () {
        const isNested = !!this.props.location.query.id;
        const options = this.props.option ? this.props.option.options : this.props.options;
        const optionsAreParents = options.reduce((areParents, option) => {
            const isParent = option.options instanceof Array && option.options.length > 0
            return areParents || isParent;
        }, false)

        if (!this.props.hasDimensions) {
            return null;
        }

        if (!isNested) {
            return this.renderOptionLinks();
        }

        if (!optionsAreParents) {
            return this.renderSimpleSelector();
        }

        return this.renderHierarchySelector();
    }

    renderHierarchySelector() {
        const hierarchyProps = this.getChildComponentProps();
        hierarchyProps.option = this.props.option;
        return <HierarchySelector {...hierarchyProps} />
    }

    renderSimpleSelector() {
        const selectorProps = this.getChildComponentProps();
        if (!selectorProps.options && this.props.option) {
            selectorProps.options = [this.props.option];
        }
        return <SimpleSelector {...selectorProps} />
    }

    renderOptionLinks () {
        const pathname = this.props.location.pathname;
        const action = this.props.location.query.action;
        const options = this.props.option ? this.props.option.options : this.props.options;
        const parentPath = dropLastPathComponent(pathname);


        const optionElements = options.sort(function(a, b){
            if(a.name < b.name) return -1;
            if(a.name > b.name) return 1;
            return 0;
        }).map((option, index) => {
            const query = {
                action,
                id: option.id
            };
            let label = option.name;
            if (option.optionsType)
            label = `${option.optionsType} in ${option.name}`;

            if (option.options) {
                label += ` (${option.totalSelectables})`;
            }
            let info = option.options && option.options.length > 0 ?`For example ${option.options[0].name}` : '';

             return (
                 <p key={index} className="margin-top">
                     <Link to={{ pathname, query }}>{label}</Link><br />
                     <span>{info}</span>
                 </p>
             )
        });

        return (
            <div className="margin-bottom--8">
                <h1 className="margin-top--4 margin-bottom">Browse {this.props.dimensionID}</h1>
                {optionElements}
                <br/>
                <Link className="inline-block font-size--17" to={parentPath}>Cancel</Link>
            </div>
        )
    }

    getChildComponentProps() {
        return {
            router: this.props.router,
            datasetID: this.props.params.id,
            dimensionID: this.props.params.dimensionID,
            options: this.props.option ? this.props.option.options : this.props.options,
            onSave: () => {
                this.props.router.push({
                    pathname: this.props.location.pathname,
                    query: {
                        action: 'summary'
                    }
                })
            }
        }
    }

}

HierarchyBrowser.propTypes = propTypes;

function mapStateToProps(state, ownProps) {
    const dimension = state.dimension;
    const optionID = ownProps.location.query.id || null;

    const props = {};
    props.dimension = dimension;
    props.optionsCount = dimension.optionsCount;
    props.options = dimension.options;
    props.option = optionID ? findOptionByID({ options: dimension.options, id: optionID }) : null;

    return props;
}

export default connect(mapStateToProps)(HierarchyBrowser);