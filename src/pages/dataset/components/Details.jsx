import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { requestMetadata } from '../actions';
import config from '../../../config';
import DocumentTitle from '../../../components/elements/DocumentTitle';
import SupportingFilesList from '../../../components/elements/SupportingFilesList';

const propTypes = {
    metadata: PropTypes.object,
    title: PropTypes.string
}

class Details extends Component {
    constructor(props) {
        super(props);
        this.state = {
            downloadPath: `${config.BASE_PATH}/datasets/${this.props.params.id}/download`,
            customisePath: `${config.BASE_PATH}/datasets/${this.props.params.id}/customise`,
        }
    }

    componentWillMount() {
        if (this.props.params.id !== this.props.id) {
            const dispatch = this.props.dispatch;
            dispatch(requestMetadata(this.props.params.id));
        }
    }

    render () {
        if (!this.props.id) {
            return null;
        }

        const page = {};
        if (this.props.metadata) {
            page.description =  this.props.metadata.description
            page.title = this.props.title
        }

        return (
            <div>
                <div className="meta-wrap">
                    <div className="wrapper">
                        <div className="col-wrap">
                            <p className="col col--md-16 col--lg-20 meta__item">

                                <a className="icon--hide"
                                   href="https://www.statisticsauthority.gov.uk/national-statistician/types-of-official-statistics/"
                                   target="_blank">
                                    <img className="meta__image"
                                         src="https://www.ons.gov.uk/img/national-statistics.png"
                                         alt="National Statistics logo" />
                                </a>

                                <span>Contact: </span><br />
                                <a href="mailto:census.customerservices@ons.gsi.gov.uk" data-ga-event="" data-ga-event-category="mailto" data-ga-event-label="census.customerservices@ons.gsi.gov.uk">Alexa Bradley</a>
                            </p>
                            <p className="col col--md-16 col--lg-20 meta__item">
                                <span>Release date: </span><br />
                                23 May 2014<br />
                            </p>
                            <p className="col col--md-16 col--lg-20 meta__item">
                                <span>Next release: </span>
                                <br />To be announced
                            </p>
                        </div>
                    </div>
                </div>
                <div className="wrapper">
                    <div className="col--lg-two-thirds">
                        <DocumentTitle title={page.title}>
                            <h1 className="margin-bottom-md--0">{page.title}</h1>
                        </DocumentTitle>

                        <p className="page-intro__content margin-bottom-md--1">{page.description}</p>

                        <Link to={this.state.downloadPath}
                              className="btn btn--primary btn--thick btn--big btn--wide margin-top--2 font-size--17">
                                <strong>Download the complete dataset</strong>
                        </Link>
                        <br />
                        <Link to={this.state.customisePath}
                              className="btn btn--primary btn--thick btn--big btn--wide margin-top--2 font-size--17">
                                <strong>Customise this dataset</strong>
                        </Link>

                        <div className="margin-bottom--8">
                            <SupportingFilesList/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Component.propTypes = propTypes;

function mapStateToProps(state) {
    return state.dataset;
}


export default connect(mapStateToProps)(Details)