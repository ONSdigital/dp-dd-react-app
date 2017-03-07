import { appendPathComponent } from '../../../common/helpers';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

const propTypes = {
    id: PropTypes.string,
    datasetID: PropTypes.string,
    edition: PropTypes.string,
    version: PropTypes.string,
    name: PropTypes.string,
    label: PropTypes.string
}

export default class DimensionItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const pathname = appendPathComponent(this.props.pathname, this.props.id);
        return (
            <li className="margin-left--0 padding-bottom--2 padding-top--2 border-bottom--gallery-sm border-top--gallery-md border-bottom--gallery-md col-wrap width-lg--39 border-top--gallery-sm">
                <div className="col col--md-24 col--lg-19">
                    <strong>{this.props.name}</strong>
                </div>
                <div className="col col--md-17 col--lg-14">
                    {this.props.label}
                </div>
                <div className="col col--md-6 col--lg-6">
                    <Link to={pathname} className="float-right--md">Customise</Link>
                </div>
            </li>
        )
    }
}

DimensionItem.propTypes = propTypes;