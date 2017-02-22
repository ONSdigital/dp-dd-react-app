import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import config from '../../../config';
import analytics from '../../../config/analytics';
import FileTypesHelp from '../../../components/elements/FileTypesHelp';
import DocumentTitle from '../../../components/elements/DocumentTitle';
import Checkbox from '../../../components/elements/Checkbox';
import SupportingFilesList from '../../../components/elements/SupportingFilesList';

import {
    saveDownloadOptions,
    requestVersionMetadata,
    requestDownloadProgress,
    cancelDownload
} from '../actions';

class Download extends Component {

    constructor(props) {
        super(props);

        this.cacheOption = this.cacheOption.bind(this);
        this.saveOptions = this.saveOptions.bind(this);

        this.state = {
            options: [{
                id: 'xls',
                label: 'XLS',
                value: 'XLS',
                selected: false,
                disabled: true
            }, {
                id: 'csv',
                label: 'CSV',
                value: 'CSV',
                selected: false
            }, {
                id: 'json',
                label: 'JSON',
                value: 'JSON',
                selected: false,
                disabled: true
            }],
            selectedOptions: [],
            parentPath: `${config.BASE_PATH}/datasets/${this.props.params.id}/dimensions/`,
            errorMessage: ''
        };
    }

    cacheOption({id, checked}) {
        const options = this.state.options.map((option) => {
            option.selected = option.id === id ? checked : option.selected;
            return option;
        });

        const errorMessage = '';

        this.setState({options, errorMessage});
    }

    isSelectionValid() {
        return (this.state.options).some(option => {
            return option.selected;
        });
    }

    saveOptions(e) {
        e.preventDefault();
        if (!this.isSelectionValid()) {
            this.setState({errorMessage: "Select at least one option"});
            return;
        }

        const options = this.state.options;
        const selectedOptions = [];

        options.map(option => {
            if (option.selected) {
                selectedOptions.push(option.value);
            }
        });

        this.state.selectedOptions = selectedOptions; // this might not be needed once we are getting the files back from the server, for the moment it still lets us only show links for the formats they chose once they're 'ready for download
        this.props.dispatch(saveDownloadOptions(selectedOptions));
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.download.completed && nextProps.download.inProgress) {
            setTimeout(() => nextProps.dispatch(requestDownloadProgress(nextProps.download.id)), 500);
        }
    }

    componentWillMount() {
        if (!this.props.hasMetadata) {
            this.props.dispatch(requestVersionMetadata(this.props.params.id));
            return;
        }
    }

    componentWillUnmount() {
        const download = this.props.download;
        const dispatch = this.props.dispatch;


        if (!download.completed && download.inProgress) {
            dispatch(cancelDownload(), 500);
        }
    }

    render() {
        const download = this.props.download;

        if (download.inProgress) {
            return this.renderInProgress();
        }

        if (download.completed) {
            return this.renderCompleted();
        }

        return this.renderOptions();
    }

    renderOptions() {
        const options = this.state.options;
        const errorMessage = this.state.errorMessage;

        return (
            <div className="wrapper margin-bottom--8">
                <div>
                    <DocumentTitle title={"Download " + this.props.title} />
                </div>
                <h1 className="margin-top--4 margin-bottom">Download options</h1>
                <p className="flush">Choose the file type(s) you want to download.</p>

                <FileTypesHelp/>

                <div className={(errorMessage.length > 0) && "error__group"}>
                    <div className={(errorMessage.length > 0) && "error__message"}>{errorMessage}</div>
                    {
                        options.map((props, index) => {
                            props['key'] = index;
                            props['checked'] = props.selected;
                            if (props.disabled) {
                                props['disabled'] = true;
                            }
                            return <Checkbox {...props} onChange={this.cacheOption}/>
                        })
                    }
                </div>

                <div className="margin-top--3 margin-bottom--8">
                    <a className="btn btn--primary btn--thick btn--wide btn--big margin-right--half" onClick={this.saveOptions}>Generate files</a><br/>
                    <a className="inline-block margin-top--4 font-size--17" onClick={browserHistory.goBack}>Cancel</a>
                </div>
            </div>
        )
    }

    renderInProgress() {
        return (
            <div className="wrapper margin-bottom--8">
                <div className="margin-top--double">
                    <DocumentTitle title={"Download " + this.props.title} />
                </div>
                <h1 className="margin-top--4 margin-bottom">Download options</h1>
                <p className="margin-top--0 margin-bottom--8 font-size--17 loading">Your file is being generated</p>
            </div>
        )
    }

    renderCompleted() {
        return (
            <div className="wrapper margin-bottom--8">
                <div className="margin-top--double">
                    <DocumentTitle title={"Download " + this.props.title} />
                </div>

                <h1 className="margin-top--4 margin-bottom">Download options</h1>

                <p className="margin-top--0 margin-bottom--1">These files are available for you to download.</p>
                {
                    this.props.download.files.map((file, index) => {
                        return (
                            <div key={index} className="margin-top--1">
                               <a
                                   //{/*target="_blank"*/}
                                   //{/*rel="noopener noreferrer"*/}
                                   onClick={analytics.logGoalCompleted}
                                   href={file.url}
                                   className="btn btn--primary btn--thick btn--wide btn--big uppercase"
                               >{file.name.slice(-3).toUpperCase()}</a>
                            </div>
                        )
                    })
                }

                <SupportingFilesList/>

                <Link className="btn btn--primary btn--thick btn--wide btn--big">Download all as a ZIP</Link>
            </div>
        )
    }
}

function mapStateToProps(state) {
    const dataset = state.dataset;

    return {
        download: state.dataset.download,
        hasMetadata: dataset.hasMetadata,
        hasDimensions: dataset.hasDimensions,
        title: dataset.title
    }
}

export default connect(mapStateToProps)(Download)