import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { requestVersionMetadata } from '../actions';
import config from '../../../config';
import IntroBlock from './../components/IntroBlock';
import SupportingFilesList from '../../../components/elements/SupportingFilesList';
import Foldable from '../../../components/elements/Foldable';

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

        return (
            <div>
                {Object.keys(metadata) > 0 ||
                    <IntroBlock {...metadata} {...{title}} />
                }
                <div className="wrapper margin-bottom--double">
                    <div className="col--lg-two-thirds margin-bottom--6">

                        <h3>About this dataset</h3>
                        <p className="page-intro__content margin-bottom--0">{description}</p>
                        <Link to={this.state.customisePath}
                              className="btn btn--primary btn--thick btn--big btn--wide margin-top--2 font-size--17">
                                Customise this dataset
                        </Link>
                        <br/>
                        <Link to={this.state.downloadPath}
                              className="inline-block margin-top--3 font-size--17">
                            Download the complete dataset
                        </Link>

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