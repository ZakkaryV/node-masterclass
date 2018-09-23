const environments = {
    staging: {
        httpPort: 3001,
        httpsPort: 3000,
        envName: "staging"
    }, 
    production: {
        httpPort: 8080,
        httpsPort: 8081,
        envName: "production"
    }
}

const currentEnv = typeof(process.env.NODE_ENV) === "string"
    ? process.env.NODE_ENV.toLowerCase()
    : "";

const environmentToExport = typeof(environments[currentEnv]) === "object"
    ? environments[currentEnv]
    : environments["staging"];

module.exports = environmentToExport;