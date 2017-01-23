import React, { Component, PropTypes } from 'react';

const propTypes = {
    supportingFiles: PropTypes.arrayOf(React.PropTypes.shape({
        title: PropTypes.string.isRequired,
        uri: PropTypes.string.isRequired,
    }))
}

export default class SupportingFilesList extends Component {
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
                    {/* TODO: Background notes will link to React page that generates content from API - once API is ready */}
                    <li><a href="./files/background-notes.pdf" target="_blank">Background notes</a></li>
                    { this.renderSupportingFiles() }
                </ul>
            </div>
        )
    }
}

SupportingFilesList.propTypes = propTypes;