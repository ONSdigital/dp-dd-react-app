import config from './'
const {API_URL, JOB_API_URL} = config;

const getVersionsURL = function() {
    return `${API_URL}/versions`;
}

const getVersionURL = function(resourceID) {
    return `${API_URL}/versions/${resourceID}`;
}

const getDimensionsURL = function(datasetID) {
    return `${API_URL}/versions/${datasetID}/dimensions`;
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
    getVersionURL,
    getVersionsURL,
    getDimensionsURL,
    getDimensionURL,
    getDimensionHierarchyURL,
    getJobCreatorURL,
    getJobStatusURL
};