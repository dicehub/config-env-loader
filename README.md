# @dicehub/config-env-loader

[![npm version](https://badge.fury.io/js/%40dicehub%2Fconfig-env-loader.svg)](https://badge.fury.io/js/%40dicehub%2Fconfig-env-loader)

> Load configuration files based on `NODE_ENV` variable

## Install

```
npm install @dicehub/config-env-loader -S

# via yarn
yarn add @dicehub/config-env-loader
```

## Usage


### Set NODE_ENV
Only the file that corresponds to the `NODE_ENV` variable will be included
```bash
$ export NODE_ENV=development
```


### Create configuration file config/**development**.yaml:

```yaml
# <root>/config/development.yaml

TEST_VAR: 20
```


### Include the plugin in your entry file

```js
// <root>/index.js

require('@dicehub/config-env-loader')({
  // Config directory
  configPath: './config/',
});
```

And now, every variable that is in the file `config/development.yaml` is available through the `process.env`

```js
console.log(process.env.TEST_VAR) // '42';
```

The value is string because [https://nodejs.org/dist/latest-v10.x/docs/api/process.html#process_process_env](https://nodejs.org/dist/latest-v10.x/docs/api/process.html#process_process_env)

## Options:

```js
var conf = require('@dicehub/config-env-loader')({
  // The directory where the configuration files for the NODE_ENV are located
  configPath: './config/',

  // The array of files to be included, not depending on the NODE_ENV
  include: ['./common-config.yaml']
});

// The variable conf contains all that is included
// Except that the types are not converted
process.env.TEST_VAR // '42'
conf.TEST_VAR // 42
```
