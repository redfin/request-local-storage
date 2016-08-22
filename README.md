# request-local-storage
[![Build Status][build-badge-img]][build-url] [![NPM version][npm-version-img]][npm-url] [![NPM license][npm-license-img]][npm-url] [![Powered by Redfin][redfin-img]][redfin-url]

This module uses
[continuation-local-storage](https://github.com/othiym23/node-continuation-local-storage)
to provide access to objects that are scoped to the lifespan of a request.

## Usage:

### Storage access

Use `getNamespace` to retrieve a module-level object provider.

Note that `getNamespace` _returns a function_.  It should be called at the
module level.  The function that's returned must be called _for each access_.

Example:

```javascript
const RLS = require('request-local-storage').getNamespace();

function getInstance() {

	// Call `RLS()` to get the _current_ request's local object.
	if (!RLS().instance) {
		RLS().instance = new Instance();
	}

	return RLS().instance;
}
```

### Request initialization

It's easy!

#### Server

Say you have a request handling function that looks like:

```javascript
function handle(req, res, next) {
	...
}
```

You can initialize `request-local-storage` like this:

```javascript
const RequestLocalStorage = require('request-local-storage');

function handle(req, res, next) { RequestLocalStorage.startRequest(() => {
	...
}}
```

#### Browser

In the browser you don't need to wrap a function.  Just call
`RequestLocalStorage.startRequest()` whenever you start a new request.

### Patching 3rd party packages

Need to patch `Q` or some other package?  No problem!

```javascript
RequestLocalStorage.patch(require('cls-q'));
```

### Find out more

Check out the [design doc](/docs/design.md)

[build-badge-img]: https://travis-ci.org/redfin/request-local-storage.svg?branch=master
[build-url]: https://travis-ci.org/redfin/request-local-storage
[npm-version-img]: https://badge.fury.io/js/request-local-storage.svg
[npm-url]: https://npmjs.org/package/request-local-storage
[redfin-url]: https://www.redfin.com
[redfin-img]: https://img.shields.io/badge/Powered%20By-Redfin-c82021.svg
[npm-license-img]: https://img.shields.io/npm/l/request-local-storage.svg
