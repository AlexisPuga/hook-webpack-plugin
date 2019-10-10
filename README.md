<p>
    <a href='https://coveralls.io/github/AlexisPuga/hook-webpack-plugin?branch=master'><img src='https://coveralls.io/repos/github/AlexisPuga/hook-webpack-plugin/badge.svg?branch=master' alt='Coverage Status'/></a>
    <a href='https://circleci.com/gh/AlexisPuga/hook-webpack-plugin'><img align='right' src='https://circleci.com/gh/AlexisPuga/hook-webpack-plugin.svg?style=svg' alt='CircleCI'/></a>
</p>

<br/>

<h2 align='center'>Hook - webpack plugin</h2>

**Create** custom plugins from your config file and avoid loosing time finding or maintaining a simple plugin.

**Intercept** any plugin and customize it to match your preferences.

**Group** your hooks to create a new plugin and modify it when you want.

## Contents
- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
    - [Creating a plugin](#creating-a-plugin)
    - [Registering a plugin](#registering-a-plugin)
    - [Intercepting another plugin](#intercepting-another-plugin)
- [License](#license)

## Installation

<a href='https://npmjs.org/package/hook-webpack-plugin'><img align='right' src='https://nodei.co/npm/hook-webpack-plugin.png?compact=true' alt='NPM'/></a>

**Via npm:**
```
npm i hook-webpack-plugin
```

**Via yarn:**
```
yarn add hook-webpack-plugin --dev
```

## Usage

Add something like the following to your config file, in the plugin section:

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

### Creating a plugin

```js
// webpack.config.js

plugins: [
    new HookWebpackPlugin(hookName, compilerHook (...args) {
        // Do something awesome...
    })
]

```

### Registering a plugin

By default, the name of the plugin will be "HookWebpackPlugin" but you can modify it.

```js
// webpack.config.js

plugins: [
    new HookWebpackPlugin(hookName, function compilerHook (...args) {
        // ...
    }, {pluginName: 'MyAwesomePlugin'})
]

```

### Intercepting another plugin

To intercept another plugin, <var>pluginName</var> must match the name of the plugin given in the source code.

```js
// webpack.config.js

plugins: [
    new ThirdPartyPlugin(options), // Call another plugin.
    new HookWebpackPlugin(hookName, () => {
        // Add functionalities, log or fix something, etc.
    }, {'pluginName': 'ThirdPartyPlugin'}) // Intercept it.
]

```

## License
hook-webpack-plugin is [MIT licensed](./LICENSE).
