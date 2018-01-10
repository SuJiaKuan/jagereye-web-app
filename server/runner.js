/*
    eslint
        import/no-commonjs: 0
*/

require('babel-core/register');
require('babel-polyfill');
require.extensions['.css'] = () => {
    return;
};
require('./app.js');
