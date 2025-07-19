const path = require("path");
const CracoAlias = require("craco-alias");

const SPARK_ENGINE_PATH = path.resolve(__dirname, "node_modules/sparkengineweb");

module.exports = {
    plugins: [{
        plugin: CracoAlias,
        options: {
            unsafeAllowModulesOutsideOfSrc: true,
            aliases: {
                '@sparkengine': SPARK_ENGINE_PATH
            }
        }
    }],
    eslint: {
        // Use our eslint config instead
        enable: false,
    },
    webpack: {
        configure: (webpackConfig) => {
            // Ignore source map warnings for Monaco editor
            webpackConfig.ignoreWarnings = [
                /Failed to parse source map/,
            ];
            return webpackConfig;
        },
    },
}