import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { requestMetadata } from './actions';

class Details extends Component {
    constructor(props) {1
        super(props);
    }

    componentWillMount() {
        const dispatch = this.props.dispatch;
        dispatch(requestMetadata(this.props.params.id));
    }

    render () {
        const description =  this.props.metadata && this.props.metadata.description ? this.props.metadata.description : '';
        return (
            <div>
                <div className="col--lg-two-thirds">
                    <h1 className="margin-bottom-md--0">{this.props.title}</h1>
                    <p className="page-intro__content margin-bottom-md--1">{description}</p>

                    <Link to={`/dd/dataset/${this.props.params.id}/download`}
                          className="btn btn--primary btn--thick btn--big btn--wide">Download the complete dataset &gt;</Link>
                    <br />
                    <Link to={`/dd/dataset/${this.props.params.id}/customise`}
                          className="btn btn--primary btn--thick btn--big btn--wide margin-top--2">Customise this dataset</Link>

                    <p className="margin-bottom--0 margin-top--4">
                        <strong>Supporting information</strong><br />
                        &middot;&nbsp;<a href="./files/background-notes.pdf" target="_blank">Background notes</a> (PDF, 168KB)
                    </p>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return state.dataset;
}


export default connect(mapStateToProps)(Details)