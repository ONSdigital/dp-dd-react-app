const defaultOpts = {
    headers: {
        'Accept': 'application/json'
    }
}

export class Request {

    constructor(opts = {}) {
        this.opts = Object.assign({}, defaultOpts, opts);
    }

    checkResponseStatus(response) {
        if (response.status >= 200 && response.status < 300) {
            return response;
        } else {
            var error = new Error(response.statusText);
            error.response = response;
            throw error;
        }
    }

    parseResponseToJSON(response) {
        return response.json();
    }

    get (url, opts) {
        return this.fetch(url, Object.assign({}, opts, { method: 'GET' }));
    }

    post (url, opts) {
        return this.fetch(url, Object.assign({}, opts, { method: 'POST' }));
    }

    fetch(url, opts = {}) {
        return fetch(url, Object.assign({}, this.opts, opts))
            .then(this.checkResponseStatus)
            .then(this.parseResponseToJSON)
            .catch(function (err) {
                throw(err);
            })
    }
}