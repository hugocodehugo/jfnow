# jfnow

A simple Node.js utility that returns the current date and time.

## Install

```bash
npm install jfnow
```

## Usage

### Programmatic

```js
const { jfnow, jfnowFormatted } = require('jfnow');

// Returns a Date object for right now
const now = jfnow();

// Returns a human-readable string (uses Intl.DateTimeFormat under the hood)
console.log(jfnowFormatted());
// e.g. "Sunday, April 19, 2026 at 9:11:28 AM UTC"

// Custom formatting options (same as Intl.DateTimeFormat options)
console.log(jfnowFormatted({ dateStyle: 'short', timeStyle: 'short' }));
// e.g. "4/19/26, 9:11 AM"
```

### CLI

```bash
node index.js
# Sunday, April 19, 2026 at 9:11:28 AM UTC
```

## API

### `jfnow()`

Returns the current `Date` object.

### `jfnowFormatted([options])`

Returns the current date and time as a locale-aware string.

- `options` — optional [`Intl.DateTimeFormat` options](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) object. Defaults to `{ dateStyle: 'full', timeStyle: 'long' }`.

## License

ISC
