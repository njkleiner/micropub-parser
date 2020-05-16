class MicropubRequest {
    static withType(type) {
        const request = new MicropubRequest();
        request.type = type.startsWith('h-') ? type : `h-${type}`;
        request.action = 'create';
        request.properties = {};
        request.commands = {};

        return request;
    }

    static withAction(action, url) {
        const request = new MicropubRequest();
        request.action = action;
        request.url = url;

        if (action === 'update') {
            request.update = {
                'add': {},
                'replace': {},
                'delete': {}
            };
        }

        return request;
    }

    /**
    * Apply a `update` request to an existing Microformats2 object.
    *
    * @param {object} target A Microformats2 object.
    *
    * @asserts this.action === 'update'
    * @asserts typeof target === 'object'
    * @asserts Object.keys(target) > 0
    * @asserts 'type' in target
    * @asserts Array.isArray(target['type'])
    * @asserts 'properties' in target
    * @asserts typeof target['properties'] === 'object'
    *
    * @returns {object} The modified `target`, or `null`.
    */
    apply(target) {
        if (this.action !== 'update') {
            return null;
        }

        if (!(target && typeof target === 'object' && Object.keys(target).length)) {
            return null;
        }

        if (!('type' in target && Array.isArray(target['type']) && 'properties' in target && typeof target['properties'] === 'object')) {
            return null;
        }

        for (let [key, value] of Object.entries(this.update.replace)) {
            target['properties'][key] = value;
        }

        for (let [key, value] of Object.entries(this.update.add)) {
            if (!(key in target['properties'] && Array.isArray(target['properties'][key]))) {
                target['properties'][key] = [];
            }

            target['properties'][key] = [...new Set(target['properties'][key].concat(value))];
        }

        if (Array.isArray(this.update.delete)) {
            for (let key of this.update.delete) {
                delete target['properties'][key];
            }
        } else {
            for (let [key, value] of Object.entries(this.update.delete)) {
                if (!(Array.isArray(value))) {
                    continue;
                }

                for (let item of value) {
                    const index = target['properties'][key].indexOf(item);

                    if (index !== -1) {
                        target['properties'][key].splice(index, 1);
                    }
                }
            }
        }

        return target;
    }

    /**
    * Convert the request to a Microformats2 object.
    *
    * @asserts this.action === 'create'
    *
    * @returns {object} The resulting Microformats2 object, or `null`.
    */
    toMicroformats() {
        if (this.action === 'create') {
            const {type, properties} = this;

            return {'type': [type], properties};
        }

        return null;
    }
}

/**
* Parse a form-style Micropub request.
*
* @param {object} body The form object to decode.
*
* @asserts typeof body === 'object'
* @asserts Object.keys(body).length > 0
* @asserts 'h' in body
*
* @returns {MicropubRequest} The parsed Micropub request, or `null`;
*/
function parseForm(body) {
    if (!(body && typeof body === 'object' && Object.keys(body).length)) {
        return null;
    }

    if ('h' in body && typeof body['h'] === 'string') {
        const request = MicropubRequest.withType(body['h']);

        delete body['h'];
        delete body['access_token'];
        delete body['action'];

        for (let [key, value] of Object.entries(body)) {
            if (!(typeof key === 'string' && value && (Array.isArray(value) || typeof value === 'string') && value.length)) {
                continue;
            }

            if (!Array.isArray(value)) {
                value = [value];
            }

            if (key.startsWith('mp-')) {
                key = key.replace(/^mp-/, '');

                if (key) {
                    request.commands[key] = value;
                }
            } else {
                request.properties[key] = value;
            }
        }

        return request;
    } else if ('action' in body && typeof body['action'] === 'string') {
        if (!(body['action'].length && 'url' in body && typeof body['url'] === 'string')) {
            return null;
        }

        if (body['action'] === 'update') {
            return null;
        }

        return MicropubRequest.withAction(body['action'], body['url']);
    } else {
        return null;
    }
}

/**
* Parse a JSON-style Micropub request.
*
* @param {object} body The JSON object to decode.
*
* @asserts typeof body === 'object'
* @asserts Object.keys(body).length > 0
* @asserts 'type' in body || 'action' in body
*
* @returns {MicropubRequest} The parsed Micropub request, or `null`;
*/
function parseJSON(body) {
    if (!(body && typeof body === 'object' && Object.keys(body).length)) {
        return null;
    }

    if ('type' in body && Array.isArray(body['type']) && body['type'].length) {
        const request = MicropubRequest.withType(body['type'][0]);

        if (!('properties' in body && typeof body['properties'] === 'object' && Object.keys(body['properties']).length)) {
            return null;
        }

        for (let [key, value] of Object.entries(body['properties'])) {
            if (!(Array.isArray(value) && value.length)) {
                continue;
            }

            if (key.startsWith('mp-')) {
                key = key.replace(/^mp-/, '');

                if (key) {
                    request.commands[key] = value;
                }
            } else {
                request.properties[key] = value;
            }
        }

        return request;
    } else if ('action' in body && typeof body['action'] === 'string') {
        if (!(body['action'].length && 'url' in body && typeof body['url'] === 'string')) {
            return null;
        }

        const request = MicropubRequest.withAction(body['action'], body['url']);

        if (request.action === 'update') {
            for (let flag of Object.keys(request.update)) {
                if (!(flag in body && (Array.isArray(body[flag]) || typeof body[flag] === 'object'))) {
                    continue;
                }

                if (flag === 'delete' && Array.isArray(body[flag])) {
                    request.update.delete = body['delete'];
                } else if (!Array.isArray(body[flag])) {
                    for (let [key, value] of Object.entries(body[flag])) {
                        if (!Array.isArray(value)) {
                            delete body[flag][key];
                        }
                    }

                    request.update[flag] = body[flag];
                }
            }
        }

        return request;
    }

    return null;
}

module.exports = Object.freeze({
    parseForm, parseJSON
});
