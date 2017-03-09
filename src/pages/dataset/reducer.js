import {
    REQUEST_DATASET_METADATA_SUCCESS,
    REQUEST_VERSION_METADATA_SUCCESS,
} from './actions';

const defaultState = {
    id: null,
    title: null,
    info: null,
    edition: null,
    version: null,
    metadata: {},
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
    }

    return state;
}