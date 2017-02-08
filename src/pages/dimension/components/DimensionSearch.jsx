import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';
import SimpleSelector from './SimpleSelector';
import { searchOptions } from '../utils';

class Search extends Component {
    constructor(props) {
        super(props);
        this.search = this.search.bind(this);
        this.state = {
            term: ''
        };

        this.onChange = this.onChange.bind(this);
    }

    search (evt) {
        evt.preventDefault();
        this.props.router.push({
            pathname: this.props.location.pathname,
            query: {
                action: 'search',
                term: this.state.term
            }
        })
    }

    onChange (evt) {
        this.setState({ term: evt.target.value });
    }

    render () {
        return (
            <div className="margin-top--2 margin-bottom--4">
                {!this.props.options ? this.renderSearchInput() : this.renderDimensionSelector() }
            </div>
        )
    }

    renderSearchInput() {
        return (
            <div>
                <h1 className="margin-top margin-bottom">Search</h1>
                <form onSubmit={this.search}>
                    <label className="block baseline">Search for a location</label>
                    <input className="keyword-search__input" value={this.state.value} type="search"
                           onChange={this.onChange}/>
                    <div className="margin-top--2 margin-bottom--4">
                        <button type="submit" className="btn btn--primary btn--thick btn--wide btn--big margin-right--half">Search</button>
                    </div>
                </form>
            </div>
        )
    }

    renderDimensionSelector() {
        if (!this.props.hasDimensions) {
            return null;
        }

        const selectorProps = {
            router: this.props.router,
            datasetID: this.props.params.id,
            dimensionID: this.props.params.dimensionID,
            options: this.props.options,
            onSave: () => {
                this.props.router.push({
                    pathname: this.props.location.pathname,
                    query: {
                        action: 'summary'
                    }
                })
            }
        };

        return <SimpleSelector {...selectorProps} />
    }
}

function mapStateToProps(state, ownProps) {
    const dataset = state.dataset;
    const dimension = dataset.dimensions.find((dimension) => {
        return dimension.id === ownProps.dimensionID;
    });

    const term = ownProps.location.query.term || null;
    const options = term  ? searchOptions({ options: dimension.options, term }) : null;

    return {
        dimension,
        options: options,
        optionsCount: dimension.optionsCount
    }
}

export default connect(mapStateToProps)(Search);