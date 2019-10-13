/** A hook injector for Webpack config. */
class HookWebpackPlugin {
    /**
     * Options for {@link HookWebpackPlugin}.
     *
     * @typedef {!object} options
     * @property {boolean} [sync=false]
     * @property {string} [pluginName=HookWebpackPlugin]
     */

    /**
     * The listener for the hook.
     *
     * @typedef {function} hookFn
     * @this HookWebpackPlugin
     * @param {...*} args - The hook arguments.
     */

    /**
     * A valid compiler/compilation hook, like "done"... See:
     * <ul>
     *     <li><a href='https://webpack.js.org/api/compiler-hooks/' target='_blank'>Compiler hooks</a>.</li>
     *     <li><a href='https://webpack.js.org/api/compilation-hooks/' target='_blank'>Compilation hooks</a>.</li>
     * </ul>
     * <em>Keep in mind that compilation hooks are expected to be inside a compiler hook.</em>
     * @typedef {string} hookName
     */

    /**
     * The Compiler or Compilation instance from Webpack.
     * @typedef {Compiler|Compilation} webpackContext
     */

    /**
     * @param {!hookName} hookName - The name of a compiler/compilation hook.
     * @param {!hookFn} hookFn - The listener for the hook.
     * @param {options} [opts] - Some options.
     *
     * @example <caption>Using compiler hooks</caption>
     * // webpack.config.js
     * plugins: [
     *     new HookWebpackPlugin('shouldEmit', function compilerHook (compilation) {
     *         return false;
     *     }),
     *     new HookWebpackPlugin('emit', function compilerHook (compilation) {
     *         // Never got called.
     *     })
     * ]
     *
     * @example <caption>Using compilation hooks</caption>
     * // webpack.config.js
     * plugins: [
     *     new HookWebpackPlugin('emit', function compilerHook (compilation) {
     *         new HookWebpackPlugin('seal', function compilationHook (module) {
     *             // ...
     *         }).apply(compilation);
     *     })
     * ]
     *
     * @example <caption>[Beta] Intercepting another plugin</caption>
     * // webpack.config.js
     * plugins: [
     *     new HookWebpackPlugin('shouldEmit', () => false, {'pluginName': 'ThirdPartyPlugin'}),
     *     new ThirdPartyPlugin(options) // Never emitted.
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
            /** @member {string} */
            'hookName': {
                'value': hookName
            },
            /** @member {hookFn} */
            'hookFn': {
                'value': hookFn
            },
            /** @member {options} */
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
}

module.exports = HookWebpackPlugin;
