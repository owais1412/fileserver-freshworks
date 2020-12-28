# Filestore

This project was generated with [Node](https://github.com/nodejs/node) version v14.13.0.
Run `npm install` to install all the dependencies.

## Usage

Import `index.js` file from the root directory like `const Filestore = require("path/to/index.js").Filestore`.

```javascript
const Filestore = require("path/to/index.js").Filestore

function main() {
    const store = new Filestore(); // or new Filestore(customPath)
    // Default path is the home directory.

    // optional argument timeToLive can be provided for a key
    // returns 1 if entry is added successfully
    // returns -1 if entry cannot be added and error message is printed on the console.
    const result = store.addEntry(key, value, timeToLive?);

    // returns corresponding json value for the given key
    // if key does not exist then it returns -1 and error message is printed on the console.
    const value = store.readByKey(key);

    // returns 1 if entry is deleted successfully
    // returns -1 if entry cannot be deleted and error message is printed on the console.
    const removeEntry = store.deleteByKey(key);
}
```

## Testing

Run `npm test` to run unit tests.

## Platforms

Tested on Windows 10 and Linux WSL2.