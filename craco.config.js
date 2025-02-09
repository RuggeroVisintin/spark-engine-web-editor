const path = require("path");

const SPARK_ENGINE_PATH = process.env.SPARK_ENGINE_PATH || path.resolve(__dirname, "node_modules/sparkengineweb");

console.log('SPARK_ENGINE_PATH', SPARK_ENGINE_PATH);

module.exports = {
    webpack: {
        alias: {
            '@sparkengine': SPARK_ENGINE_PATH
        },
        configure: webpackConfig => {
            const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
                ({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin'
            );

            webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);
            return webpackConfig;
        }
    }
}