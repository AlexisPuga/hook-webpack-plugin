/** A hook injector for Webpack. */
export default class HookWebpackPlugin {

    /**
     * @typedef {!object} options
     * @property {boolean} [sync=false]
     * @property {string} [pluginName='HookWebpackPlugin']
     */
    
    /**
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
     * @param {!hookName} hookName
     * @param {!hookFn} hookFn
     * @param {?options} opts
     */
    constructor (hookName, hookFn, opts) {
        Object.defineProperties(this, {
            /** @type {string} */
            hookName,
            /** @type {hookFn} */
            hookFn,
            /** @type {options} */
            options: Object.assign({
                sync: false,
                pluginName: 'HookWebpackPlugin'
            }, opts),
            /**
             * @type {webpackContext}
             * @private
             */
            _webpackContext: null
        });
    }

    /**
     * Update {@link webpackContext} and {@link inject} a Compiler hook.
     * Required for webpack.
     * @param {Compiler|Compilation} webpackContext
     */
    apply (webpackContext) {
        this.webpackContext = webpackContext;
        this.inject(this);
    }

    /**
     * Use `tap` or `tapPromise` to inject a hook during the compilation process.
     *
     * @param {HookWebpackPlugin} hookWebpackPlugin
     * @chainable
     */
    inject (hookWebpackPlugin) {
        const {hookName, hookFn, options} = this;
        const {pluginName, sync} = options;
        const {webpackContext} = hookWebpackPlugin._(privateKey);
        const hook = webpackContext.hooks[hookName];
        const isSyncOperation = /^Sync/.test(hook.constructor.name) || sync;

        if (isSyncOperation) {
            hook.tap(pluginName, (...args) => hookFn.apply(this, args));
        }
        else {
            hook.tapPromise(pluginName, async (...args) => await hookFn.apply(this, args));
        }

        return this;
    }

}
