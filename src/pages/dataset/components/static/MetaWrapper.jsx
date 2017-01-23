import React, {Component, PropTypes} from 'react';

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


export default class MetaWrapper extends Component {
    constructor(props) {
        super(props);
    }

    render () {
        const releaseDate = this.props.releaseDate;
        const nextReleaseDate = this.props.nextReleaseDate;
        const showLogo = this.props.nationalStatistics;
        const contact = this.props.contact;

        return (
            <div className="meta-wrap">
                <div className="wrapper">
                    <div className="col-wrap">
                        <p className="col col--md-16 col--lg-20 meta__item">
                            {!showLogo || (
                                <a className="icon--hide" target="_blank"
                                href="https://www.statisticsauthority.gov.uk/national-statistician/types-of-official-statistics/">
                                <img className="meta__image" alt="National Statistics logo" src="https://www.ons.gov.uk/img/national-statistics.png" />
                                </a>
                            )}
                            <span>Contact: </span><br />
                            <a href={`mailto:${contact.email}`} data-ga-event="" data-ga-event-category="mailto"
                               data-ga-event-label="census.customerservices@ons.gsi.gov.uk">${contact.name}</a>
                        </p>
                        <p className="col col--md-16 col--lg-20 meta__item">
                            <span>Release date: </span><br />{releaseDate}<br />
                        </p>
                        <p className="col col--md-16 col--lg-20 meta__item">
                            <span>Next release: </span>
                            <br />{nextReleaseDate}
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}

MetaWrapper.propTypes = propTypes;