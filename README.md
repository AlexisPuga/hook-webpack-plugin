# Hook - webpack plugin

[![CircleCI](https://circleci.com/gh/AlexisPuga/hook-webpack-plugin.svg?style=svg)](https://circleci.com/gh/AlexisPuga/hook-webpack-plugin) [![Coverage Status](https://coveralls.io/repos/github/AlexisPuga/hook-webpack-plugin/badge.svg?branch=master)](https://coveralls.io/github/AlexisPuga/hook-webpack-plugin?branch=master) 

Create, intercept and/or extend the functionality of any plugin by using hooks from your config file.

## Installation
[![NPM](https://nodei.co/npm/hook-webpack-plugin.png?compact=true)](https://npmjs.org/package/hook-webpack-plugin)

``` npm i hook-webpack-plugin ```

## Usage
Add something like the following to your config file, in the plugin section (*see the wiki for more details.*):
```js
// webpack.config.js
const HookWebpackPlugin = require('hook-webpack-plugin');
// ...
plugins: [
    // ...
    new HookWebpackPlugin(hookName, hookFn, options)
    // ...
]
// ...
```

## Examples
**Creating a plugin**:
```js
// webpack.config.js
plugins: [
    new HookWebpackPlugin(hookName, compilerHook (...args) {
        // Do something awesome...
    })
]
```
**Registering a plugin**\*:
```js
// webpack.config.js
plugins: [
    new HookWebpackPlugin(hookName, function compilerHook (...args) {
        // ...
    }, {pluginName: 'MyAwesomePlugin'})
]
```
**\***: By default, the name of the plugin will be "HookWebpackPlugin" but you can modify it.
**Intercepting another plugin**\*:
```js
// webpack.config.js
plugins: [
    new ThirdPartyPlugin(options), // Call another plugin.
    new HookWebpackPlugin(hookName, () => {
        // Add functionalities, log or fix something, etc.
    }, {'pluginName': 'ThirdPartyPlugin'}) // Intercept it.
]
```
**\***: To intercept another plugin, <var>pluginName</var> must match the name of the plugin given in the source code.

## License
MIT
