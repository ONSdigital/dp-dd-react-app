import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { requestVersionMetadata } from '../actions';
import config from '../../../config';
import IntroBlock from './static/IntroBlock';
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

        if (params.id !== this.props.id) {
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
                    <div className="col--lg-two-thirds">

                        <h3>About this dataset</h3>
                        <p className="page-intro__content font-size--14 margin-bottom--0">{description}</p>
                        <Link to={this.state.customisePath}
                              className="btn btn--primary btn--thick btn--big btn--wide margin-top--2 font-size--17">
                                Customise this dataset
                        </Link>
                        <br/>
                        <Link to={this.state.downloadPath}
                              className="inline-block margin-top--4 font-size--17">
                            Download the complete dataset
                        </Link>

                        <SupportingFilesList/>
                    </div>

                    <Foldable header="Selected customisations of this dataset" id="expandable-1" expanded={true} >
                        <div className="margin-bottom">Lorem ipsum</div>
                    </Foldable>
                    <Foldable header="Guide to quality" id="expandable-2">
                        <div className="margin-bottom">Lorem ipsum</div>
                    </Foldable>
                    <Foldable header="Previous versions" id="expandable-3">
                        <div className="margin-bottom">Lorem ipsum</div>
                    </Foldable>
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