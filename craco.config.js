const path = require("path");
const CracoAlias = require("craco-alias");

console.log('SPARK_ENGINE_PATH', process.env.SPARK_ENGINE_PATH);
const SPARK_ENGINE_PATH = process.env.SPARK_ENGINE_PATH || path.resolve(__dirname, "node_modules/sparkengineweb");

module.exports = {
    plugins: [{
        plugin: CracoAlias,
        options: {
            unsafeAllowModulesOutsideOfSrc: true,
            aliases: {
                '@sparkengine': SPARK_ENGINE_PATH
            }
        }
    }]
}