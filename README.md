# JML Tools

This library is aimed at providing a set of tools to work with XML-based markup JSON data similar to (but not the same as) _JSON-ML_ in JavaScript. The "markup language" (_JML_) is defined by the _non-compact_ JSON structure proposed by the [xml-js library](https://github.com/nashwaan/xml-js). It can be converted lossless to and from XML documents including _mixed-content elements_. The tools are fully _namespace aware_.

[![Build Status](https://travis-ci.org/yngwi/jml-tools.svg?branch=master)](https://travis-ci.org/yngwi/json-ml-tools)

## Usage

### Installation

`npm install jml-tools --save`

or

`yarn add jml-tools`

### Quick start

```js
import {create} from 'jml-tools';
const name = 'person';
const data = {content: 'Freddie Mercury'};
const jmlObject = create(name, data);
console.log(jmlObject);

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

This library provides the following functionalities:

### <a name="create"></a>create

Manually creates a JML object that is fully compatible with [xml-js](https://github.com/nashwaan/xml-js).

#### Syntax

```
create(name[, data])
```

#### Parameters

##### name

A _string_, either prefixed or not that will be the name of the object to be created.

##### data

An optional data object that can have any or all of the following properties:

| Property | Description    | Examples           |
|----------|----------------|-------------------|
| namespaces | An _object array_ describing the elements' namespaces with the namespace URI and an optional prefix both as _string_ values. | `[{prefix: 'ns', uri: 'http://example.com/ns'}]`<br/>`[{uri: 'http://example.com/default'}, {prefix: 'ns', 'uri: 'http://example.org/ns'}]` |
| content | The content (if any). Can be a _string_ for pure text content, a single JML _object_ or an _array_ of JML objects. | `'Freddie Mercury'` |
| attributes | All attributes as an object of _string_ key-value pairs. The values will be converted to strings if necessary. | `{date: '2017-12-31', time: '23:12'}` |

#### Usage example

```js
import {create} from 'jml-tools';
const name = 'person';
const data = {content: 'Freddie Mercury'};
const jmlObject = create(name, data);
console.log(jmlObject);

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

### serialize

Serializes a JML object to a string according to fully qualified mappings that target either the whole object or individual child objects. This can, for example, be used to transform arbitrary structures into HTML or a different JSON representation.

#### Syntax

```
serialize(jmlObject, mappings[, options])
```

#### Parameters

##### jmlObject

A valid JML _object_ as created by the [create](#create) method and [xml-js](https://github.com/nashwaan/xml-js). It will be serialized according to the provided mappings.

##### mappings

The rules to apply to the _jmlObject_. It describes how its contents will be serialized. It can any of the following:

1. An _object_ consisting of _string_ key-value pairs describing the mapping into serialized XML. An asterisk (`*`) as key is interpreted as the default mapping to use if no other mapping matches.
2. An _object_ consisting of key-key value pairs similar to option _1_ above with the difference that the value is not a string but a function that should return the transformed content as a _string_. The functions' signature is `function({name, contents, attributes})`.
3. A _function_ that will be applied to each child object (similar to the child elements in XML). The functions' signature is `function({name, contents, attributes})`.

_Note 1: The options 1 and 2 can be mixed with each other. It is possible to map some keys to string values and some to functions._

_Note 2: If the object to be match by options 1 and 2 above are qualified, the objects' namespace needs to be declared in the [options](#serialize_options) object and the correct prefixes need to be added to the keys to match the specific objects._

| Example | Description |
|---------|-------------|
| ``({content, name}) => `<span data-name="${name}">${content}</span>`)`` | A single function is applied to the object and all its child objects. It maps the content into `span` elements with the objects' names as `data-name` attributes.|
|`{'ns:paragraph': 'p', 'bold': 'b', '*': 'span'}`| This mapping object matches all `paragraph` objects in the namespace prefixed with `ns` and unqualified `bold` objects. All other, unmapped, objects are matched by the _asterisk_. All _string_ values describe simple XML element names to wrap the objects' contents into (see the [usage example](#serialize_usage_example)).  |
|`{'ns:paragraph': 'p', 'bold': ({content}) => content}`| This mapping object is similar to the preceding one with the difference that the mapping for the `bold` key is described by a function that only returns the content for each object without wrapping it into something. The other difference is that the asterisk-default mapping is missing. This way, all objects not matched by paragraph and bold will be ignored.|

##### <a name="serialize_options"></a>options

An optional object that describes the options for the serialization:

| Property | Description    | Examples           |
|----------|----------------|-------------------|
| namespaces | An _object array_ describing the elements' namespaces with the namespace URI and an optional prefix both as _string_ values. | `[{prefix: 'ns', uri: 'http://example.com/ns'}]`<br/>`[{uri: 'http://example.com/default'}, {prefix: 'ns', 'uri: 'http://example.org/ns'}]` |
| skipEmpty | A _boolean_ that sets whether or not to skip empty objects during the serialization. Defaults to _false_. | `true` |

#### <a name="serialize_usage_example"></a>Usage example

```js
import {serialize} from 'jml-tools';
// original XML:
// <paragraph xmlns="http://example.com/ns">JSON is just as <emphasized>fun</emphasized> as XML.</paragraph>
const jmlObject = {
    elements: [{
        type: 'element',
        name: 'paragraph',
        attributes: {
            xmlns: 'http://example.com/ns'
        },
        elements: [
            {type: 'text', text: 'JSON is just as '},
            {
                type: 'element',
                name: 'emphasized',
                elements: [
                    {type: 'text', text: 'fun'}
                ]
            },
            {type: 'text', text: ' as XML.'}
        ]
    }]
};
const mappings = {
    'ns:paragraph': 'p',
    'ns:emphasized': 'i'
};
const options = {
    namespaces: [{
        prefix: 'ns',
        uri: 'http://example.com/ns'
    }]
};
const serialized = serialize(jmlObject, mappings, options);
console.log(serialized);

// Output:
// <p>JSON is just as <i>fun</i> as XML.</p>
```

## Authors

* **Daniel Jeller**

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

Thanks to [@nashwaan](https://github.com/nashwaan) for his excellent xml-js library.
