const tap = require('tap');
const webpack = require('webpack');
const {compile} = require('../helpers');
const HookWebpackPlugin = require('../../src/HookWebpackPlugin');

tap.test('HookWebpackPlugin', {'autoend': true}, (t) => {
    t.test('Should throw if something is invalid', (st) => {
        [
            [
                [],
                '`hookName` and `hookFn` are both required.'
            ],
            [
                [{}],
                '`hookName` must be a string.'
            ],
            [
                ['hookName', null],
                '`hookFn` must be a function.'
            ]
        ].forEach((values) => {
            const [args, reason] = values;

            st.throws(() => {
                /* eslint-disable-next-line no-new */
                new HookWebpackPlugin(...args);
            }, TypeError, reason);
        });

        st.end();
    });

    t.test('Should inject nested hooks', () => new Promise((resolve, reject) => {
        const compiler = webpack({
            'plugins': [
                new HookWebpackPlugin('emit', (compilation, callback) => {
                    new HookWebpackPlugin('seal', () => callback()).
                        apply(compilation);
                }),
                new HookWebpackPlugin('done', (stats) => resolve(stats)),
                new HookWebpackPlugin('failed', (error) => reject(error))
            ]
        });

        compile(compiler);
    }));

    t.test('Should inject multiple hooks', () => new Promise((resolve, reject) => {
        const compiler = webpack({
            'plugins': [
                new HookWebpackPlugin('shouldEmit', () => false),
                new HookWebpackPlugin('emit', () => reject(new Error('Compilation should not be executed.'))),
                new HookWebpackPlugin('done', (stats) => resolve(stats)),
                new HookWebpackPlugin('failed', (error) => reject(error))
            ]
        });

        compile(compiler);
    }));

    t.test('Should intercept another plugin', () => new Promise((resolve, reject) => {
        const thirdPartyPlugin = new HookWebpackPlugin('emit', () => {
            reject(new Error('This plugin should NOT be called.'));
        }, {'hookName': 'thirdPartyPlugin'});
        const compiler = webpack({
            'plugins': [
                new HookWebpackPlugin('shouldEmit', () => false, {
                    'hookName': 'thirdPartyPlugin'
                }),
                thirdPartyPlugin,
                new HookWebpackPlugin('done', (stats) => resolve(stats), {
                    'hookName': 'thirdPartyPlugin'
                })
            ]
        });

        compile(compiler);
    }));

    t.test('Should use a sync hook', () => new Promise((resolve, reject) => {
        const compiler = webpack({
            'plugins': [
                new HookWebpackPlugin('emit', () => false, {
                    'sync': true
                }),
                new HookWebpackPlugin('done', (stats) => resolve(stats)),
                new HookWebpackPlugin('failed', (error) => reject(error))
            ]
        });

        compile(compiler);
    }));
});
