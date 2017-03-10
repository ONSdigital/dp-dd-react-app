import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { requestVersionMetadata } from '../actions';
import config from '../../../config';
import IntroBlock from './../components/IntroBlock';
import SupportingFilesList from '../../../components/elements/SupportingFilesList';
import Foldable from '../../../components/elements/Foldable';
import DocumentTitle from '../../../components/elements/DocumentTitle';

const propTypes = {
    metadata: PropTypes.object,
    title: PropTypes.string
}

class DatasetVersion extends Component {
    constructor(props) {
        super(props);

        const params = this.props.params;
        const baseURL = `${config.BASE_PATH}/datasets/${params.id}/editions/${params.edition}/versions/${params.version}`;

        this.state = {
            downloadPath: `${baseURL}/download`,
            customisePath: `${baseURL}/dimensions`,
        }
    }

    componentWillMount() {
        const dispatch = this.props.dispatch;
        const params = this.props.params;

        if (!this.props.hasMetadata) {
            dispatch(requestVersionMetadata(params.id, params.edition, params.version));
        }
    }

    render () {
        if (!this.props.id) {
            return null;
        }

        if (!this.props.metadata) {
            return null;
        }

        const metadata = this.props.metadata || { a: 1 };
        const description =  metadata ? this.props.metadata.description : '';
        const title = this.props.title;
        const edition = this.props.edition;
        const contactName = this.props.metadata.contact.name;
        const contactEmail = this.props.metadata.contact.email;
        const datasetID = this.props.datasetId;
        const releaseDate = this.props.metadata.releaseDate;
        const lastUpdated = this.props.metadata.releaseDate;
        const datasetLandingPageUrl = this.props.metadata.datasetLandingPage || null;

        const renderDimensionsList = () => {
            const dimensions = this.props.dimensions;
            return dimensions.map((dimension, i) => {
                return <li key={i} className="flush">{dimension.name}</li>
            })
        };


        return (
            <div>

                <div className="wrapper margin-bottom--double">
                    <div className="col--lg-two-thirds margin-bottom--6">

                        <DocumentTitle title={title}>
                            <h1 className="margin-top--4 margin-bottom">{title}: {edition}</h1>
                        </DocumentTitle>

                        <p>
                            <span className="width--8 inline-block">Dataset ID: </span>{datasetID}<br/>
                            <span className="width--8 inline-block">Release date: </span>{releaseDate}<br/>
                            <span className="width--8 inline-block">Last updated: </span>{lastUpdated}<br/>
                            <span className="width--8 inline-block">Contact: </span><a href={"mailto:" + contactEmail}>{contactName}</a>
                        </p>

                        <p className="page-intro__content margin-bottom--0">{description}</p>

                        <h2 className="margin-top--3">Contents</h2>
                        <ul className="margin-top--0">
                            {renderDimensionsList()}
                        </ul>

                        <Link to={this.state.customisePath}
                              className="btn btn--primary btn--thick btn--big btn--wide margin-top--2 font-size--17">
                                Customise this dataset
                        </Link>
                        <br/>

                        <p className="font-size--16">
                            <Link to={this.state.downloadPath} className="inline-block font-size--17">
                                Download the complete dataset
                            </Link>

                            {datasetLandingPageUrl ? <span className="hide--sm width--1"> | </span> : ""}

                            {datasetLandingPageUrl ?
                                <a href={datasetLandingPageUrl} className="inline-block font-size--17">
                                    View previous editions
                                </a>
                                    : ""}
                        </p>

                        {/*<SupportingFilesList/>*/}
                    </div>

                    <h3>Supporting information</h3>
                    <p className="margin-top--0 margin-bottom">
                        This section will provide detailed metadata. It will describe the content and dimensions of this dataset.
                    </p>

                    <h3>Selected customisations of this dataset</h3>
                    <p className="margin-top--0 margin-bottom">
                        This section will contain pre-generated subsets of this dataset. The statistician responsible will create these to highlight key areas.
                    </p>

                    <h3>Guide to quality</h3>
                    <p className="margin-top--0 margin-bottom">
                        This section will contain details around the statistical accuracy of this dataset. It will also contain any important considerations for interpreting and using this data.
                    </p>

                    <h3>Previous versions</h3>
                    <p className="margin-top--0 margin-bottom">
                        This section will provide access to previous versions of the dataset.
                    </p>
                </div>
            </div>
        )
    }
}

DatasetVersion.propTypes = propTypes;

function mapStateToProps(state) {
    return state.dataset;
}


export default connect(mapStateToProps)(DatasetVersion)