const assert = require('assert');

const micropub = require('..');

describe('parseForm', () => {
    it('should fail if input is null', () => {
        const request = micropub.parseForm(null);

        assert.deepEqual(request, null);
    });

    it('should fail if input is the empty string', () => {
        const request = micropub.parseForm('');

        assert.deepEqual(request, null);
    });

    it('should fail if input is an empty object', () => {
        const request = micropub.parseForm({});

        assert.deepEqual(request, null);
    });

    it('should parse basic h-entry', () => {
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

        assert.deepEqual(request, expected);
    });

    it('should parse h-entry with array values', () => {
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

        assert.deepEqual(request, expected);
    });

    it('should not include access token', () => {
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

        assert.deepEqual(request, expected);
    });

    it('should parse command', () => {
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

        assert.deepEqual(request, expected);
    });

    it('should not parse malformed command', () => {
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

        assert.deepEqual(request, expected);
    });

    it('should not parse update requests', () => {
        const request = micropub.parseForm({
            'action': 'update',
            'url': 'https://example.com/posts/hello-world'
        });

        assert.deepEqual(request, null);
    });

    it('should parse delete requests', () => {
        const request = micropub.parseForm({
            'action': 'delete',
            'url': 'https://example.com/posts/hello-world'
        });

        const expected = {
            'action': 'delete',
            'url': 'https://example.com/posts/hello-world'
        };

        assert.deepEqual(request, expected);
    });

    it('should not parse delete request without URL', () => {
        const request = micropub.parseForm({
            'action': 'delete'
        });

        assert.deepEqual(request, null);
    });

    it('should convert to microformats', () => {
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

        assert.deepEqual(request.toMicroformats(), expected);
    });

    it('should not convert to microformats for wrong action', () => {
        const request = micropub.parseForm({
            'action': 'delete',
            'url': 'https://example.com/posts/hello-world'
        });

        assert.deepEqual(request.toMicroformats(), null);
    });
});

describe('parseJSON', () => {
    it('should fail if input is null', () => {
        const request = micropub.parseJSON(null);

        assert.deepEqual(request, null);
    });

    it('should fail if input is the empty string', () => {
        const request = micropub.parseJSON('');

        assert.deepEqual(request, null);
    });

    it('should fail if input is an empty object', () => {
        const request = micropub.parseJSON({});

        assert.deepEqual(request, null);
    });

    it('should parse basic h-entry', () => {
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

        assert.deepEqual(request, expected);
    });

    it('should not include access token', () => {
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

        assert.deepEqual(request, expected);
    });

    it('should parse basic h-entry with HTML content', () => {
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

        assert.deepEqual(request, expected);
    });

    it('should parse command', () => {
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

        assert.deepEqual(request, expected);
    });

    it('should not parse malformed command', () => {
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

        assert.deepEqual(request, expected);
    });

    it('should not parse malformed type', () => {
        const request = micropub.parseJSON({
            'type': 'h-entry',
            'properties': {
                'content': [
                    'Hello World'
                ]
            }
        });

        assert.deepEqual(request, null);
    });

    it('should not parse without properties', () => {
        const request = micropub.parseJSON({
            'type': [
                'h-entry'
            ]
        });

        assert.deepEqual(request, null);
    });

    it('should not include malformed properties', () => {
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

        assert.deepEqual(request, expected);
    });

    it('should parse delete requests', () => {
        const request = micropub.parseJSON({
            'action': 'delete',
            'url': 'https://example.com/posts/hello-world'
        });

        const expected = {
            'action': 'delete',
            'url': 'https://example.com/posts/hello-world'
        };

        assert.deepEqual(request, expected);
    });

    it('should not parse delete request without URL', () => {
        const request = micropub.parseJSON({
            'action': 'delete'
        });

        assert.deepEqual(request, null);
    });

    it('should parse update (replace) requests', () => {
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

        assert.deepEqual(request, expected);
    });

    it('should parse update (add) requests', () => {
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

        assert.deepEqual(request, expected);
    });

    it('should parse update (delete [value]) requests', () => {
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

        assert.deepEqual(request, expected);
    });

    it('should parse update (delete [property]) requests', () => {
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

        assert.deepEqual(request, expected);
    });

    it('should not parse malformed update requests', () => {
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

        assert.deepEqual(request, expected);
    });

    it('should not parse malformed update (replace) requests', () => {
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

        assert.deepEqual(request, expected);
    });

    it('should not parse malformed update (delete) requests', () => {
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

        assert.deepEqual(request, expected);
    });

    it('should convert to microformats', () => {
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

        assert.deepEqual(request.toMicroformats(), expected);
    });

    it('should not convert to microformats for wrong action', () => {
        const request = micropub.parseJSON({
            'action': 'delete',
            'url': 'https://example.com/posts/hello-world'
        });

        assert.deepEqual(request.toMicroformats(), null);
    });

    it('should apply update (replace [replace]) requests', () => {
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

        assert.deepEqual(request.apply(target), expected);
    });

    it('should apply update (replace [create]) requests', () => {
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

        assert.deepEqual(request.apply(target), expected);
    });

    it('should apply update (add [concat]) requests', () => {
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

        assert.deepEqual(request.apply(target), expected);
    });

    it('should apply update (add [concat]) requests without duplicates', () => {
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

        assert.deepEqual(request.apply(target), expected);
    });

    it('should apply update (add [create]) requests', () => {
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

        assert.deepEqual(request.apply(target), expected);
    });

    it('should apply update (delete [value, from single value]) requests', () => {
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

        assert.deepEqual(request.apply(target), expected);
    });

    it('should apply update (delete [value, from multiple values]) requests', () => {
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

        assert.deepEqual(request.apply(target), expected);
    });

    it('should apply update (delete [property]) requests', () => {
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

        assert.deepEqual(request.apply(target), expected);
    });
});
