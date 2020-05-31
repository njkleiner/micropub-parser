const test = require('ava');

const micropub = require('..');

test('parseForm: should fail if input is null', t => {
    return t.is(micropub.parseForm(null), null);
});

test('parseForm: should fail if input is the empty string', t => {
    return t.is(micropub.parseForm(''), null);
});

test('parseForm: should fail if input is an empty object', t => {
    return t.is(micropub.parseForm({}), null);
});

test('parseForm: should parse basic h-entry', t => {
    const request = micropub.parseForm({
        'h': 'entry',
        'content': 'Hello World'
    });

    const expected = {
        'type': 'h-entry',
        'action': 'create',
        'properties': {
            'content': [
                'Hello World'
            ]
        },
        'commands': {}
    };

    return t.deepEqual(Object.assign({}, request), expected);
});

test('parseForm: should parse h-entry with array values', t => {
    const request = micropub.parseForm({
        'h': 'entry',
        'content': 'Hello World',
        'category': [
            'first-category',
            'second-category'
        ]
    });

    const expected = {
        'type': 'h-entry',
        'action': 'create',
        'properties': {
            'content': [
                'Hello World'
            ],
            'category': [
                'first-category',
                'second-category'
            ]
        },
        'commands': {}
    };

    return t.deepEqual(Object.assign({}, request), expected);
});

test('parseForm: should not include access token', t => {
    const request = micropub.parseForm({
        'h': 'entry',
        'access_token': '2ab96390c7dbe3439de74d0c9b0b1767',
        'content': 'Hello World'
    });

    const expected = {
        'type': 'h-entry',
        'action': 'create',
        'properties': {
            'content': [
                'Hello World'
            ]
        },
        'commands': {}
    };

    return t.deepEqual(Object.assign({}, request), expected);
});

test('parseForm: should parse command', t => {
    const request = micropub.parseForm({
        'h': 'entry',
        'content': 'Hello World',
        'mp-slug': 'hello-world'
    });

    const expected = {
        'type': 'h-entry',
        'action': 'create',
        'properties': {
            'content': [
                'Hello World'
            ]
        },
        'commands': {
            'slug': [
                'hello-world'
            ]
        }
    };

    return t.deepEqual(Object.assign({}, request), expected);
});

test('parseForm: should not parse malformed command', t => {
    const request = micropub.parseForm({
        'h': 'entry',
        'content': 'Hello World',
        'mp-': 'test'
    });

    const expected = {
        'type': 'h-entry',
        'action': 'create',
        'properties': {
            'content': [
                'Hello World'
            ]
        },
        'commands': {}
    };

    return t.deepEqual(Object.assign({}, request), expected);
});

test('parseForm: should not parse update requests', t => {
    const request = micropub.parseForm({
        'action': 'update',
        'url': 'https://example.com/posts/hello-world'
    });

    return t.is(request, null);
});

test('parseForm: should parse delete requests', t => {
    const request = micropub.parseForm({
        'action': 'delete',
        'url': 'https://example.com/posts/hello-world'
    });

    const expected = {
        'action': 'delete',
        'url': 'https://example.com/posts/hello-world'
    };

    return t.deepEqual(Object.assign({}, request), expected);
});

test('parseForm: should not parse delete request without URL', t => {
    const request = micropub.parseForm({
        'action': 'delete'
    });

    return t.is(request, null);
});

test('parseJSON: should fail if input is null', t => {
    return t.is(micropub.parseJSON(null), null);
});

test('parseJSON: should fail if input is the empty string', t => {
    return t.is(micropub.parseJSON(''), null);
});

test('parseJSON: should fail if input is an empty object', t => {
    return t.is(micropub.parseJSON({}), null);
});

test('parseJSON: should parse basic h-entry', t => {
    const request = micropub.parseJSON({
        'type': [
            'h-entry'
        ],
        'properties': {
            'content': [
                'Hello World'
            ]
        }
    });

    const expected = {
        'type': 'h-entry',
        'action': 'create',
        'properties': {
            'content': [
                'Hello World'
            ]
        },
        'commands': {}
    };

    return t.deepEqual(Object.assign({}, request), expected);
});

test('parseJSON: should not include access token', t => {
    const request = micropub.parseJSON({
        'type': [
            'h-entry'
        ],
        'access_token': '2ab96390c7dbe3439de74d0c9b0b1767',
        'properties': {
            'content': [
                'Hello World'
            ]
        }
    });

    const expected = {
        'type': 'h-entry',
        'action': 'create',
        'properties': {
            'content': [
                'Hello World'
            ]
        },
        'commands': {}
    };

    return t.deepEqual(Object.assign({}, request), expected);
});

test('parseJSON: should parse basic h-entry with HTML content', t => {
    const request = micropub.parseJSON({
        'type': [
            'h-entry'
        ],
        'properties': {
            'content': [
                {
                    'html': '<p>Hello World</p>'
                }
            ]
        }
    });

    const expected = {
        'type': 'h-entry',
        'action': 'create',
        'properties': {
            'content': [
                {
                    'html': '<p>Hello World</p>'
                }
            ]
        },
        'commands': {}
    };

    return t.deepEqual(Object.assign({}, request), expected);
});

test('parseJSON: should parse command', t => {
    const request = micropub.parseJSON({
        'type': [
            'h-entry'
        ],
        'properties': {
            'content': [
                'Hello World'
            ],
            'mp-slug': [
                'hello-world'
            ]
        }
    });

    const expected = {
        'type': 'h-entry',
        'action': 'create',
        'properties': {
            'content': [
                'Hello World'
            ]
        },
        'commands': {
            'slug': [
                'hello-world'
            ]
        }
    };

    return t.deepEqual(Object.assign({}, request), expected);
});

test('parseJSON: should not parse malformed command', t => {
    const request = micropub.parseJSON({
        'type': [
            'h-entry'
        ],
        'properties': {
            'content': [
                'Hello World'
            ],
            'mp-': [
                'test'
            ]
        }
    });

    const expected = {
        'type': 'h-entry',
        'action': 'create',
        'properties': {
            'content': [
                'Hello World'
            ]
        },
        'commands': {}
    };

    return t.deepEqual(Object.assign({}, request), expected);
});

test('parseJSON: should not parse malformed type', t => {
    const request = micropub.parseJSON({
        'type': 'h-entry',
        'properties': {
            'content': [
                'Hello World'
            ]
        }
    });

    return t.is(request, null);
});

test('parseJSON: should not parse without properties', t => {
    const request = micropub.parseJSON({
        'type': [
            'h-entry'
        ]
    });

    return t.is(request, null);
});

test('parseJSON: should not include malformed properties', t => {
    const request = micropub.parseJSON({
        'type': [
            'h-entry'
        ],
        'properties': {
            'name': [
                'Example Entry'
            ],
            'content': 'Hello World'
        }
    });

    const expected = {
        'type': 'h-entry',
        'action': 'create',
        'properties': {
            'name': [
                'Example Entry'
            ]
        },
        'commands': {}
    };

    return t.deepEqual(Object.assign({}, request), expected);
});

test('parseJSON: should parse delete requests', t => {
    const request = micropub.parseJSON({
        'action': 'delete',
        'url': 'https://example.com/posts/hello-world'
    });

    const expected = {
        'action': 'delete',
        'url': 'https://example.com/posts/hello-world'
    };

    return t.deepEqual(Object.assign({}, request), expected);
});

test('parseJSON: should not parse delete request without URL', t => {
    const request = micropub.parseJSON({
        'action': 'delete'
    });

    return t.is(request, null);
});

test('parseJSON: should parse update (replace) requests', t => {
    const request = micropub.parseJSON({
        'action': 'update',
        'url': 'https://example.com/posts/hello-world',
        'replace': {
            'content': [
                'Goodbye World'
            ]
        }
    });

    const expected = {
        'action': 'update',
        'url': 'https://example.com/posts/hello-world',
        'update': {
            'replace': {
                'content': [
                    'Goodbye World'
                ]
            },
            'add': {},
            'delete': {}
        }
    };

    return t.deepEqual(Object.assign({}, request), expected);
});

test('parseJSON: should parse update (add) requests', t => {
    const request = micropub.parseJSON({
        'action': 'update',
        'url': 'https://example.com/posts/hello-world',
        'add': {
            'category': [
                'indieweb'
            ]
        }
    });

    const expected = {
        'action': 'update',
        'url': 'https://example.com/posts/hello-world',
        'update': {
            'replace': {},
            'add': {
                'category': [
                    'indieweb'
                ]
            },
            'delete': {}
        }
    };

    return t.deepEqual(Object.assign({}, request), expected);
});

test('parseJSON: should parse update (delete [value]) requests', t => {
    const request = micropub.parseJSON({
        'action': 'update',
        'url': 'https://example.com/posts/hello-world',
        'delete': {
            'category': [
                'indieweb'
            ]
        }
    });

    const expected = {
        'action': 'update',
        'url': 'https://example.com/posts/hello-world',
        'update': {
            'replace': {},
            'add': {},
            'delete': {
                'category': [
                    'indieweb'
                ]
            }
        }
    };

    return t.deepEqual(Object.assign({}, request), expected);
});

test('parseJSON: should parse update (delete [property]) requests', t => {
    const request = micropub.parseJSON({
        'action': 'update',
        'url': 'https://example.com/posts/hello-world',
        'delete': [
            'category'
        ]
    });

    const expected = {
        'action': 'update',
        'url': 'https://example.com/posts/hello-world',
        'update': {
            'replace': {},
            'add': {},
            'delete': [
                'category'
            ]
        }
    };

    return t.deepEqual(Object.assign({}, request), expected);
});

test('parseJSON: should not parse malformed update requests', t => {
    const request = micropub.parseJSON({
        'action': 'update',
        'url': 'https://example.com/posts/hello-world',
        'replace': 'foo'
    });

    const expected = {
        'action': 'update',
        'url': 'https://example.com/posts/hello-world',
        'update': {
            'replace': {},
            'add': {},
            'delete': {}
        }
    };

    return t.deepEqual(Object.assign({}, request), expected);
});

test('parseJSON: should not parse malformed update (replace) requests', t => {
    const request = micropub.parseJSON({
        'action': 'update',
        'url': 'https://example.com/posts/hello-world',
        'replace': {
            'content': 'Goodbye World'
        }
    });

    const expected = {
        'action': 'update',
        'url': 'https://example.com/posts/hello-world',
        'update': {
            'replace': {},
            'add': {},
            'delete': {}
        }
    };

    return t.deepEqual(Object.assign({}, request), expected);
});

test('parseJSON: should not parse malformed update (delete) requests', t => {
    const request = micropub.parseJSON({
        'action': 'update',
        'url': 'https://example.com/posts/hello-world',
        'delete': {
            'category': 'indieweb'
        }
    });

    const expected = {
        'action': 'update',
        'url': 'https://example.com/posts/hello-world',
        'update': {
            'replace': {},
            'add': {},
            'delete': {}
        }
    };

    return t.deepEqual(Object.assign({}, request), expected);
});

test('MicropubRequest#toMicroformats: should convert to microformats via parseForm', t => {
    const request = micropub.parseForm({
        'h': 'entry',
        'content': 'Hello World'
    });

    const expected = {
        'type': [
            'h-entry'
        ],
        'properties': {
            'content': [
                'Hello World'
            ]
        }
    };

    return t.deepEqual(request.toMicroformats(), expected);
});

test('MicropubRequest#toMicroformats: should convert to microformats via parseJSON', t => {
    const request = micropub.parseJSON({
        'type': [
            'h-entry'
        ],
        'properties': {
            'content': [
                'Hello World'
            ],
            'mp-slug': [
                'hello-world'
            ]
        }
    });

    const expected = {
        'type': [
            'h-entry'
        ],
        'properties': {
            'content': [
                'Hello World'
            ]
        }
    };

    return t.deepEqual(request.toMicroformats(), expected);
});

test('MicropubRequest#toMicroformats: should not convert to microformats for invalid action', t => {
    const request = micropub.parseForm({
        'action': 'delete',
        'url': 'https://example.com/posts/hello-world'
    });

    return t.is(request.toMicroformats(), null);
});

test('MicropubRequest#apply: should apply update (replace [replace]) requests', t => {
    const request = micropub.parseJSON({
        'action': 'update',
        'url': 'https://example.com/posts/hello-world',
        'replace': {
            'content': [
                'Goodbye World'
            ]
        }
    });

    const target = {
        'type': [
            'h-entry'
        ],
        'properties': {
            'content': [
                'Hello World'
            ]
        }
    };

    const expected = {
        'type': [
            'h-entry'
        ],
        'properties': {
            'content': [
                'Goodbye World'
            ]
        }
    };

    return t.deepEqual(request.apply(target), expected);
});

test('MicropubRequest#apply: should apply update (replace [create]) requests', t => {
    const request = micropub.parseJSON({
        'action': 'update',
        'url': 'https://example.com/posts/hello-world',
        'replace': {
            'content': [
                'Goodbye World'
            ]
        }
    });

    const target = {
        'type': [
            'h-entry'
        ],
        'properties': {}
    };

    const expected = {
        'type': [
            'h-entry'
        ],
        'properties': {
            'content': [
                'Goodbye World'
            ]
        }
    };

    return t.deepEqual(request.apply(target), expected);
});

test('MicropubRequest#apply: should apply update (add [concat]) requests', t => {
    const request = micropub.parseJSON({
        'action': 'update',
        'url': 'https://example.com/posts/hello-world',
        'add': {
            'category': [
                'indieweb'
            ]
        }
    });

    const target = {
        'type': [
            'h-entry'
        ],
        'properties': {
            'category': [
                'micropub'
            ]
        }
    };

    const expected = {
        'type': [
            'h-entry'
        ],
        'properties': {
            'category': [
                'micropub', 'indieweb'
            ]
        }
    };

    return t.deepEqual(request.apply(target), expected);
});

test('MicropubRequest#apply: should apply update (add [concat]) requests without duplicates', t => {
    const request = micropub.parseJSON({
        'action': 'update',
        'url': 'https://example.com/posts/hello-world',
        'add': {
            'category': [
                'indieweb'
            ]
        }
    });

    const target = {
        'type': [
            'h-entry'
        ],
        'properties': {
            'category': [
                'indieweb'
            ]
        }
    };

    const expected = {
        'type': [
            'h-entry'
        ],
        'properties': {
            'category': [
                'indieweb'
            ]
        }
    };

    return t.deepEqual(request.apply(target), expected);
});

test('MicropubRequest#apply: should apply update (add [create]) requests', t => {
    const request = micropub.parseJSON({
        'action': 'update',
        'url': 'https://example.com/posts/hello-world',
        'add': {
            'category': [
                'indieweb'
            ]
        }
    });

    const target = {
        'type': [
            'h-entry'
        ],
        'properties': {}
    };

    const expected = {
        'type': [
            'h-entry'
        ],
        'properties': {
            'category': [
                'indieweb'
            ]
        }
    };

    return t.deepEqual(request.apply(target), expected);
});

test('MicropubRequest#apply: should apply update (delete [value, from single value]) requests', t => {
    const request = micropub.parseJSON({
        'action': 'update',
        'url': 'https://example.com/posts/hello-world',
        'delete': {
            'category': [
                'indieweb'
            ]
        }
    });

    const target = {
        'type': [
            'h-entry'
        ],
        'properties': {
            'category': [
                'indieweb'
            ]
        }
    };

    const expected = {
        'type': [
            'h-entry'
        ],
        'properties': {
            'category': []
        }
    };

    return t.deepEqual(request.apply(target), expected);
});

test('MicropubRequest#apply: should apply update (delete [value, from multiple values]) requests', t => {
    const request = micropub.parseJSON({
        'action': 'update',
        'url': 'https://example.com/posts/hello-world',
        'delete': {
            'category': [
                'indieweb'
            ]
        }
    });

    const target = {
        'type': [
            'h-entry'
        ],
        'properties': {
            'category': [
                'indieweb',
                'micropub'
            ]
        }
    };

    const expected = {
        'type': [
            'h-entry'
        ],
        'properties': {
            'category': [
                'micropub'
            ]
        }
    };

    return t.deepEqual(request.apply(target), expected);
});

test('MicropubRequest#apply: should apply update (delete [property]) requests', t => {
    const request = micropub.parseJSON({
        'action': 'update',
        'url': 'https://example.com/posts/hello-world',
        'delete': [
            'category'
        ]
    });

    const target = {
        'type': [
            'h-entry'
        ],
        'properties': {
            'category': [
                'indieweb',
                'micropub'
            ]
        }
    };

    const expected = {
        'type': [
            'h-entry'
        ],
        'properties': {}
    };

    return t.deepEqual(request.apply(target), expected);
});
