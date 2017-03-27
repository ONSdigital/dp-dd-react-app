import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

const propTypes = {
    supportingFiles: PropTypes.arrayOf(React.PropTypes.shape({
        title: PropTypes.string.isRequired,
        uri: PropTypes.string.isRequired,
    })),
    backgroundNotesPath: PropTypes.string.isRequired
};

class SupportingFilesList extends Component {
    constructor(props) {
        super(props);
    }

    renderSupportingFiles() {
        const supportingFiles = this.props.supportingFiles || [];
        if (supportingFiles.length > 0) {
            return supportingFiles.map((item, key) => {
                return <li key={key}><a href={item.uri} target="_blank">{item.title}</a></li>
                }
            )
        }
    }

    render() {
        return (
            <div>
                <h2 className="">Supporting information</h2>
                <ul>
                    <li>
                        <Link to={this.props.backgroundNotesPath}>Background notes</Link>
                    </li>
                    {/*{ this.renderSupportingFiles() }*/}
                </ul>
            </div>
        )
    }
}

export default SupportingFilesList;

SupportingFilesList.propTypes = propTypes;