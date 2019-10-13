<p>
    <a href='https://coveralls.io/github/AlexisPuga/hook-webpack-plugin?branch=master' target='_blank'><img src='https://coveralls.io/repos/github/AlexisPuga/hook-webpack-plugin/badge.svg?branch=master' alt='Coverage Status'/></a>
    <a href='https://circleci.com/gh/AlexisPuga/hook-webpack-plugin' target='_blank'><img align='right' src='https://circleci.com/gh/AlexisPuga/hook-webpack-plugin.svg?style=svg' alt='CircleCI'/></a>
</p>

<br/>

## Hook - webpack plugin

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
- [More info](#more-info)
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
Then, replace the following values:

<dl>
    <dt><var>hookName</var>: string</dt>
    <dd>The name of a <a href='https://webpack.js.org/api/compiler-hooks/' target='_blank'/>compiler</a>/<a href='https://webpack.js.org/api/compilation-hooks/' target='_blank'>compilation</a> hook. <i>Something like "emit", "done", ...</i></dd>
    <dt><var>hookFn</var>: function</dt>
    <dd>The listener for the hook.</dd>
    <dt><var>options</var>: object<sub>opt</sub></dt>
    <dd>
        <table>
            <thead>
                <tr>
                    <th>Property</th>
                    <th>Default</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th>sync</th>
                    <td>false [async when possible]</td>
                    <td>If a truthy value is given use `tap`, otherwise use `tapAsync`.</td>
                </tr>
                <tr>
                    <th>pluginName</th>
                    <td>HookWebpackPlugin</td>
                    <td>Value to use in tap/tapAsync methods.</td>
                </tr>
            </tbody>
        </table>
    </dd>
</dl>

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

*Name your plugin and group multiple hooks together, internally.*

```js
// webpack.config.js

plugins: [
    new HookWebpackPlugin(hookName, compilerHook, {pluginName: 'MyAwesomePlugin'}),
    new HookWebpackPlugin(anotherHookName, anotherCompilerHook, {pluginName: 'MyAwesomePlugin'})
]

```

### Intercepting another plugin

*Set the `pluginName` option to the internal name of the plugin you want to intercept.*

```js
// webpack.config.js

plugins: [
    new ThirdPartyPlugin(options),
    new HookWebpackPlugin(hookName, () => {
        // Your code...
    }, {'pluginName': 'ThirdPartyPlugin'})
]

```

## More info

Check the [docs](https://github.com/AlexisPuga/hook-webpack-plugin/wiki) for more details.

## License
hook-webpack-plugin is [MIT licensed](./LICENSE).
