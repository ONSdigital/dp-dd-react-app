import React, {Component, PropTypes} from 'react';
import MetaWrapper from './MetaWrapper';
import DocumentTitle from '../../../components/elements/DocumentTitle';

const propTypes = {
    title: PropTypes.string,
    contact: PropTypes.shape({
        name: PropTypes.string,
        email: PropTypes.string,
        phone: PropTypes.string
    }),
    nationalStatistics: PropTypes.bool,
    releaseDate: PropTypes.string,
    nextReleaseDAte: PropTypes.string
}

export default class IntroBlock extends Component {
    constructor(props) {
        super(props);
    }

    render () {
        const title = this.props.title;
        return (
            <div className="page-intro background--gallery">
                <div className="wrapper">
                    <div className="col-wrap">
                        <div className="col">
                            {/* bread crumb */}
                            <div className="col col--md-47 col--lg-48">
                                <DocumentTitle title={title}>
                                    <h1 className="page-intro__title "><span className="page-intro__type">Dataset</span>{title}</h1>
                                </DocumentTitle>
                            </div>
                        </div>
                    </div>
                </div>
                <MetaWrapper {...this.props} />
            </div>
        )
    }
}

MetaWrapper.propTypes = propTypes;