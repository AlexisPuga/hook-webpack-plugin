/** A hook injector for Webpack. */
module.exports = class HookWebpackPlugin {
    /**
     * @typedef {!object} options
     * @property {boolean} [sync=false]
     * @property {string} [pluginName='HookWebpackPlugin']
     */

    /**
     * The listener for the hook.
     *
     * @typedef {function} hookFn
     * @this HookWebpackPlugin
     * @param {...*} args - The hook arguments.
     */

    /**
     * A valid compiler/compilation hook, like "done"...
     *     See:
     *     - https://webpack.js.org/api/compiler-hooks/
     *     - https://webpack.js.org/api/compilation-hooks/
     * Keep in mind that compilation hooks are expected to be inside a compiler hook.
     * @typedef {string} hookName
     */

    /**
     * The Compiler or Compilation instance from Webpack.
     * @typedef {Compiler|Compilation} webpackContext
     */

    /**
     * @param {!hookName} hookName - A compiler/compilation hook.
     * @param {!hookFn} hookFn - Some function.
     * @param {?options} opts - Some options.
     *
     * @example <caption>Using compiler hooks</caption>
     * // webpack.config.js
     * plugins: [
     *     new HookWebpackPlugin('shouldEmit', function (compilation) {
     *         return false;
     *     }),
     *     new HookWebpackPlugin('emit', function (compilation) {
     *         // Never got called.
     *     })
     * ]
     *
     * @example <caption>Using compilation hooks</caption>
     * // webpack.config.js
     * plugins: [
     *     new HookWebpackPlugin('compilation', function (compilation) {
     *         new HookWebpackPlugin('buildModule', function (module) {
     *             // ...
     *         }).apply(compilation);
     *     })
     * ]
     */
    constructor (hookName, hookFn, opts) {
        const options = Object.freeze({
            'sync': false,
            'pluginName': 'HookWebpackPlugin',
            ...opts
        });

        if (typeof hookName !== 'string') {
            throw new TypeError('1st argument must be a string.');
        }

        if (typeof hookFn !== 'function') {
            throw new TypeError('2nd argument must be a function.');
        }

        Object.defineProperties(this, {
            /** @type {string} */
            'hookName': {
                'value': hookName
            },
            /** @type {hookFn} */
            'hookFn': {
                'value': hookFn
            },
            /** @type {options} */
            'options': {
                'value': options
            }
        });
    }

    /**
     * Use `tap` or `tapAsync` to inject a hook during the compilation process.
     *
     * @param {Compiler|Compilation} webpackContext
     * @chainable
     */
    apply (webpackContext) {
        const {hookName, hookFn, options} = this;
        const {pluginName, sync} = options;
        const hook = webpackContext.hooks[hookName];
        const isSyncOperation = /^Sync/.test(hook.constructor.name) || sync;

        if (isSyncOperation) {
            hook.tap(pluginName, (...args) => hookFn.apply(this, args));
        }
        else {
            hook.tapAsync(pluginName, (...args) => hookFn.apply(this, args));
        }

        return this;
    }
};
