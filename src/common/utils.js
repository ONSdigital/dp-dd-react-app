const defaultOpts = {
    headers: {
        'Accept': 'application/json'        
    },
    credentials: 'include'
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
        const headers = opts.headers ? opts.headers : {};
        opts.headers = Object.assign({}, headers, {
            'Accept': 'application/json',
            'Content-Type': 'application/json'            
        });
        return this.fetch(url, Object.assign({}, opts, { method: 'POST' }));
    }

    fetch(url, opts = {}) {

        // todo: IMPORTANT!!!! use deepmerge instead of object assign

        const fetchOpts = Object.assign({}, this.opts, opts);
        return fetch(url, fetchOpts)
            .then(this.checkResponseStatus)
            .then(this.parseResponseToJSON)
            .catch(function (err) {
                throw(err);
            })
    }
}