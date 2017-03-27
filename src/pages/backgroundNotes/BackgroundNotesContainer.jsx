import React, { Component } from 'react';
import { connect } from 'react-redux';
import { requestVersionMetadata } from '../dataset/actions';

import ArmedForcesSections from './components/ArmedForcesSections';

class BackgroundNotesContainer extends Component {
    constructor(props) {
        super(props)
    }

    componentWillMount() {
        const dispatch = this.props.dispatch;
        const params = this.props.params;

        if (!this.props.hasMetadata) {
            dispatch(requestVersionMetadata(params.id, params.edition, params.version));
        }
    }

    renderSections() {
        const datasetID = this.props.datasetID;

        switch (datasetID) {
            case ('AF001EW'): {
                return <ArmedForcesSections/>;
            }
            default: {
                return <p>Dataset does not match any of the available background notes</p>
            }
        }
    }

    renderContactDetails() {
        const props = this.props;
        return (
            <div>
                <h2>Contact details:</h2>
                <ul className="list--neutral">
                    <li className="flush"><strong>Name:</strong> {props.metadata.contact.name}</li>
                    <li className="flush"><strong>Email:</strong> {props.metadata.contact.email}</li>
                </ul>
            </div>

        )
    }

    render() {
        return (
            <div className="wrapper margin-bottom--double">
                <div className="padding-bottom--4 border-bottom--gallery-sm border-bottom--gallery-md">
                    <h1 className="page-intro__title">
                        <span className="page-intro__type">Dataset reference metadata</span>
                        {this.props.title}
                    </h1>
                </div>
                {this.renderSections()}
                {
                    this.props.hasMetadata ?
                        this.renderContactDetails()
                        :
                        ""
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        datasetID: state.dataset.datasetId,
        title: state.dataset.title,
        hasMetadata: state.dataset.hasMetadata,
        metadata: state.dataset.metadata
    }
}

export default connect(mapStateToProps)(BackgroundNotesContainer);