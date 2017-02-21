import config from './'
const {API_URL, JOB_API_URL} = config;

const getVersionsURL = function() {
    return `${API_URL}/versions`;
}

const getVersionURL = function(dimensionID) {
    return `${API_URL}/versions/${dimensionID}`;
}


const getDatasetsURL = function() {
    return `${API_URL}/datasets/`;
}

const getDatasetURL = function(resourceID) {
    return `${API_URL}/datasets/${resourceID}`;
}

const getDatasetVersionURL = function(id, edition, version) {
    return `${API_URL}/datasets/${id}/editions/${edition}/versions/${version}`;
}

const getDimensionsURL = function(id, edition, version) {
    return `${API_URL}/datasets/${id}/editions/${edition}/versions/${version}/dimensions`;
}

const getDimensionURL = function(datasetID, dimensionID) {
    return `${API_URL}/versions/${datasetID}/dimensions/${dimensionID}`;
}

const getDimensionHierarchyURL = function(datasetID, dimensionID) {
    return `${API_URL}/versions/${datasetID}/dimensions/${dimensionID}?view=hierarchy`;
}

const getJobCreatorURL = function() {
    return `${config.JOB_API_URL}/job`;
}

const getJobStatusURL = function(jobID) {
    return `${config.JOB_API_URL}/job/${jobID}`;
}

export default {
    getVersionURL,      // legacy API
    getVersionsURL,     // legacy API
    getDatasetsURL,
    getDatasetURL,
    getDatasetVersionURL,
    getDimensionsURL,
    getDimensionURL,
    getDimensionHierarchyURL,
    getJobCreatorURL,
    getJobStatusURL
};