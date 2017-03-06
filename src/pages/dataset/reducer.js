import {
    REQUEST_DATASET_METADATA_SUCCESS,
    REQUEST_VERSION_METADATA_SUCCESS,
    SAVE_DOWNLOAD_PROGRESS,
    CANCEL_DOWNLOAD,
} from './actions';

const defaultState = {
    id: null,
    title: null,
    info: null,
    edition: null,
    version: null,
    metadata: {},
    download: {
        id: '',
        inProgress: false,
        completed: false,
        cancelled: false
    },
    hasMetadata: false,
    hasDimensions: false
};

export default function (state = defaultState, action) {
    switch (action.type) {

        case REQUEST_DATASET_METADATA_SUCCESS:
            const dataset = action.dataset;
            const metadata = dataset.latest.metadata || {};
            const hasDatasetMetadata = !!dataset.latest.metadata;
            const title = action.dataset.title;

            state = Object.assign({}, state, {
                id: dataset.datasetId,
                edition: dataset.latest.edition,
                version: dataset.latest.version,
                hasDatasetMetadata,
                title,
                metadata
            });
            break;

        case REQUEST_VERSION_METADATA_SUCCESS:
            state = Object.assign({}, state, action.dataset, {
                title: action.dataset.metadata.title || state.title || action.dataset.title,
                versionID: action.dataset.id,
                hasMetadata: true
            });
            break;

        case SAVE_DOWNLOAD_PROGRESS:
            if (state.download.cancelled) {
                state = Object.assign({}, state, {
                    download: Object.assign({}, defaultState.download)
                });
            } else {
                state = Object.assign({}, state, {
                    download: Object.assign({}, state.download, action.download, {
                        inProgress: action.download.status === 'Pending',
                        completed: action.download.status === 'Complete'
                    })
                });
            }
            break;

        case CANCEL_DOWNLOAD:
            state = Object.assign({}, state, {
                download: Object.assign({}, defaultState.download, {
                    cancelled: true
                })
            });
            break;

    }

    return state;
}