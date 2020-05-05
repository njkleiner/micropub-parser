# micropub-parser

Parse [Micropub](https://www.w3.org/TR/micropub/) requests.

## Install

`$ npm install @njkleiner/micropub-parser`

## Usage

```javascript
const micropub = require('@njkleiner/micropub');

micropub.parseForm({
    'h': 'entry',
    'access_token': '2ab96390c7dbe3439de74d0c9b0b1767',
    'content': 'Hello World',
    'mp-slug': 'hello-world'
});
// => {'type': 'entry', 'action': 'create', 'properties': {'content': ['Hello World']}, 'commands': {'slug': ['hello-world']}}

micropub.parseJSON({
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
// => {'type': 'h-entry', 'action': 'create', 'properties': {'content': ['Hello World']}, 'commands': {'slug': ['hello-world']}}
```

## Contributing

You can contribute to this project by [sending patches](https://git-send-email.io) to `noah@njkleiner.com`.

## Authors

* [Noah Kleiner](https://github.com/njkleiner)

See also the list of [contributors](https://github.com/njkleiner/micropub-parser/contributors) who participated in this project.

## License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

This module is essentially a JavaScript port of [p3k-micropub](https://github.com/aaronpk/p3k-micropub), written by [Aaron Parecki](https://github.com/aaronpk).
