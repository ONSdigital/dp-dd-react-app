import React, { Component } from 'react';
import { connect } from 'react-redux';

import { dropLastPathComponent } from '../../common/helpers';
import DocumentTitle from '../../components/elements/DocumentTitle';

import DownloadOptions from './components/DownloadOptions';
import DownloadComplete from './components/DownloadComplete';
import DownloadProgress from './components/DownloadInProgress';

import {
    requestVersionMetadata,
    requestDownloadProgress,
    saveDownloadOptions,
    cancelDownload
} from './actions';

class Download extends Component {

    constructor(props) {
        super(props);

        this.onSaveOptions = this.onSaveOptions.bind(this);
        this.onCancelDownload = this.onCancelDownload.bind(this);
    }

    onSaveOptions(selectedOptions) {
        this.props.dispatch(saveDownloadOptions(selectedOptions));
    }

    onCancelDownload(e) {
        if (e) e.preventDefault();


        const router = this.props.router;
        const parentPath = dropLastPathComponent(this.props.location.pathname);
        const dimensionsPath = `${parentPath}/dimensions`;
        router.push({ pathname: dimensionsPath });
    }

    componentWillReceiveProps(nextProps) {
        const download = nextProps.download;
        if (download.completed && download.inProgress) {
            setTimeout(() => nextProps.dispatch(requestDownloadProgress(download.id)), 500);
        }
    }

    componentWillMount() {
        const dispatch = this.props.dispatch;
        const params = this.props.params;

        if (!this.props.hasMetadata) {
            dispatch(requestVersionMetadata(params.id, params.edition, params.version));
        }
    }

    componentWillUnmount() {
        const dispatch = this.props.dispatch;
        dispatch(cancelDownload());
        // const download = this.props.download;
        // if (!download.completed && download.inProgress) {
        //     dispatch(cancelDownload(), 500);
        //
        // }
    }

    render() {
        return (
            <div className="wrapper margin-bottom--8">
                <div className="margin-top--double">
                    <DocumentTitle title={"Download " + this.props.title} />
                </div>
                { this.renderComponent() }
                <div>
                    <a className="inline-block margin-top--4 font-size--17"
                       onClick={this.onCancelDownload}>Cancel</a>
                </div>
            </div>
        )
    }

    renderComponent() {
        const download = this.props.download;

        if (download.inProgress) {
            return <DownloadProgress />
        }

        if (download.completed) {
            const props = { files: this.props.download.files };
            return <DownloadComplete {...props} />
        }

        const componentProps = {
            onSave: (selectedOptions) => this.props.dispatch(saveDownloadOptions(selectedOptions))
        }

        return <DownloadOptions {...componentProps} />
    }
}

function mapStateToProps(state) {
    return {
        download: state.download || {},
        hasMetadata: state.dataset.hasMetadata,
        hasDimensions: state.dataset.hasDimensions,
        title: state.dataset.title
    }
}

export default connect(mapStateToProps)(Download)