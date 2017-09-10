# JSON-ML Tools

This library is aimed at providing a set of tools to work with marked up data similar to _JSON-ML_ in JavaScript. It is assumed that any JSON-ML (abbreviated _JML_) objects have to be compatible to the _non-compact_ JSON structure proposed by the [xml-js library](https://github.com/nashwaan/xml-js) to be fully convertible to and from XML documents including _mixed-content elements_.

## Usage

### Installation

`npm install json-ml-tools --save dev`

or

`yarn add json-ml-tools --dev`

### Quick start

```js
import {createElement} from 'json-ml-tools';
const name = 'person';
const data = {content: 'Freddie Mercury'};
const jmlElement = createElement(name, data);
console.log(jmlElement);

// Output:
// {
//     "elements": [
//         {
//             "elements": [
//                 {
//                     "text": "Freddie Mercury",
//                     "type": "text"
//                 }
//             ],
//             "name": "person",
//             "type": "element"
//         }
//     ]
// }
```

### Running tests

`npm test`

## API Reference

This library provides the following functionallities:

### createElement

Manually creates a JML element that is fully compatible with [xml-js](https://github.com/nashwaan/xml-js).

```js
import {createElement} from 'json-ml-tools';
const name = 'person';
const data = {content: 'Freddie Mercury'};
const jmlElement = createElement(name, data);
console.log(jmlElement);
```

#### Possible element data

The data object can have any or all of the following properties:

| Property | Description    | Example           |
|----------|------------|----------------------|
| namespace | An object describing the elements' namespace with an optional prefix and an URI    | `{prefix: 'ex', uri: 'http://example.com/ns'}` |
| content | The content (if any). Can be a string for pure text content, a single JML object or an array of JML objects. | `'Freddie Mercury'` |
| attributes | All attributes as an object of key-value pairs. The values will be converted to strings if necessary. | `{date: '2017-12-31', time: '23:12'}` |

## Authors

* **Daniel Jeller**

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

Thanks to [@nashwaan](https://github.com/nashwaan) for his excellent xml-js library.
