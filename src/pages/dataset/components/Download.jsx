import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import config from '../../../config';
import FileTypesHelp from '../../../components/elements/FileTypesHelp';
import Checkbox from '../../../components/elements/Checkbox';
import {
    saveDownloadOptions
} from '../actions';

class Download extends Component {

    constructor(props) {
        super(props);

        this.cacheOption = this.cacheOption.bind(this);
        this.saveOptions = this.saveOptions.bind(this);

        this.state = {
            options: [
                {
                    id: 'xls',
                    label: 'XLS',
                    value: 'xls',
                    onChange: this.cacheOption,
                    selected: false
                },
                {
                    id: 'csv',
                    label: 'CSV',
                    value: 'csv',
                    onChange: this.cacheOption,
                    selected: false
                },
                {
                    id: 'json',
                    label: 'JSON',
                    value: 'json',
                    onChange: this.cacheOption,
                    selected: false
                }
            ],
            selectedOptions: [],
            parentPath: `${config.BASE_PATH}/dataset/${this.props.datasetID}/customise/`
        };
    }

    cacheOption(event) {
        const options = this.state.options;
        const optionIndex = options.findIndex(option => {
            return option.id === event.id;
        });

        this.state.options[optionIndex].selected = event.selected;
    }
    
    saveOptions() {
        const options = this.state.options;
        const selectedOptions = [];

        options.map(option => {
            if (option.selected) {
                selectedOptions.push(option.id);
            }
        });

        this.state.selectedOptions = selectedOptions; // this might not be needed once we are getting the files back from the server, for the moment it still lets us only show links for the formats they chose once they're 'ready for download'
        this.props.dispatch(saveDownloadOptions(selectedOptions));
    }

    render() {
        const download = this.props.download;

        if (download.isInProgress) {
            return this.renderInProgress();
        }

        if (download.isCompleted) {
            return this.renderCompleted();
        }

        return this.renderOptions();
    }

    renderOptions() {
        const options = this.state.options;

        return (
            <div>
                <h1 className="margin-top--2 margin-bottom--half">Download options</h1>
                <p className="flush">Choose the file type(s) you want to download.</p>
                <FileTypesHelp/>
                {
                    options.map((props, index) => {
                        props['key'] = index;
                        return <Checkbox {...props} />
                    })
                }
                <div className="margin-top--4 margin-bottom--8">
                    <a className="btn btn--primary btn--thick btn--wide btn--big margin-right--half" onClick={this.saveOptions}>Generate files</a>
                    <Link className="btn btn--secondary btn--thick btn--wide btn--big" to={this.state.parentPath}>Cancel</Link>
                </div>
            </div>
        )
    }

    renderInProgress() {
        return (
            <div>
                <h1 className="margin-top--2 margin-bottom--half">Download options</h1>
                <p className="margin-top--0 margin-bottom--8 font-size--17 loading">Your file is being generated</p>
            </div>
        )
    }

    renderCompleted() {
        return (
            <div className="margin-bottom--8">
                <h1 className="margin-top--2 margin-bottom--half">Download options</h1>
                <p className="margin-top--0 margin-bottom--1">These files are available for you to download.</p>
                {
                    this.state.selectedOptions.map((option, index) => {
                        return (
                            <div key={index} className="margin-top--1">
                               <button className="btn btn--primary btn--thick btn--wide btn--big uppercase">{option}</button>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        download: state.dataset.download
    }
}

export default connect(mapStateToProps)(Download)