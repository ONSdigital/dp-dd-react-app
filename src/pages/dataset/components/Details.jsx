import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { requestMetadata } from '../actions';
import config from '../../../config';
import IntroBlock from './static/IntroBlock';
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

        if (!this.props.metadata) {
            return null;
        }

        const metadata = this.props.metadata;
        const description =  this.props.metadata.description;
        const title = this.props.title;

        return (
            <div>
               <IntroBlock {...metadata} {...{title}} />
                <div className="wrapper">
                    <div className="col--lg-two-thirds">

                        <h3>About this dataset</h3>
                        <p className="page-intro__content font-size--14 margin-bottom--0">{description}</p>
                        <Link to={this.state.downloadPath}
                              className="btn btn--primary btn--thick btn--big btn--wide margin-top--2 font-size--17">
                                <strong>Download the complete dataset</strong>
                        </Link>
                        <br />
                        <Link to={this.state.customisePath}
                              className="btn btn--primary btn--thick btn--big btn--wide margin-top--2 font-size--17">
                                <strong>Customise this dataset</strong>
                        </Link>

                        <SupportingFilesList/>
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