import { Request } from '../../common/utils';
const request = new Request();

import api from '../../config/api';

import { requestVersionMetadata } from '../dataset/actions';
export { requestVersionMetadata };

export const SAVE_DOWNLOAD_OPTIONS = 'SAVE_DOWNLOAD_OPTIONS';
export const SAVE_DOWNLOAD_PROGRESS = 'SAVE_DOWNLOAD_PROGRESS';
export const SAVE_DOWNLOAD_OPTIONS_SUCCESS = 'SAVE_DOWNLOAD_OPTIONS_SUCCESS';
export const CANCEL_DOWNLOAD = 'CANCEL_DOWNLOAD';

export function cancelDownload() {
    return {
        type: CANCEL_DOWNLOAD
    }
}

export function saveDownloadOptions(options) {

    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: SAVE_DOWNLOAD_OPTIONS,
            options
        });

        const dimensions = state.dimensions.map(dimension => {
            return {
                id: dimension.id,
                options: flattenSelectedOptions(dimension.options)
            }
        }).filter(dimension => {
            return dimension.options.length > 0;
        });

        const body = JSON.stringify({
            id: state.dataset.versionID,
            fileFormats: options,
            dimensions
        });

        return request
            .post(api.getJobCreatorURL(), { body })
            .then(json => {
                dispatch(requestDownloadProgress(json.id));
            }).catch(err => {
                throw(err);
            });
    }

    function flattenSelectedOptions(options) {
        const list = [];
        if (!options) {
            return list;
        }
        options.forEach(option => {
            if (option.selected) {
                list.push(option.code);
            }
            if (option.options && option.options.length > 0) {
                Array.prototype.push.apply(list, flattenSelectedOptions(option.options));
            }
        })
        return list;
    }
}

export function requestDownloadProgress(jobID) {
    const headers = new Headers({
        'Cache-control': 'no-cache, no-store',
        'Pragma': 'no-cache',
        'Expires': 0
    });

    return dispatch => request
        .get(api.getJobStatusURL(jobID), {headers: headers})
        .then(json => {
            dispatch(saveDownloadProgress(json));
        })
}

function saveDownloadProgress(json) {
    return {
        type: SAVE_DOWNLOAD_PROGRESS,
        download: json
    }
}