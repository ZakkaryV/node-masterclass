const http = require("http");
const https = require("https");
const fs = require("fs");
const url = require("url");
const { StringDecoder } = require("string_decoder");
const config = require("./config");

// HTTP Server
const httpServer = http.createServer((req, res) => {
    unifiedServer(req,res);
});

httpServer.listen(config.httpPort, () => {
    console.log(`HTTP Server is listening on port ${config.httpPort} in ${config.envName} mode.`);
});

httpServer.listen()

// HTTPS Server
const httpsOptions = {
    key: fs.readFileSync("./https/key.pam"),
    cert: fs.readFileSync("./https/cert.pam")
}

const httpsServer = https.createServer(httpsOptions, (req, res) => {
    unifiedServer(req,res);
});

httpsServer.listen(config.httpsPort, () => {
    console.log(`HTTPS Server is listening on port ${config.httpsPort} in ${config.envName} mode.`);
});

httpsServer.listen()

// Choose the right server
const unifiedServer = (req, res) => {
        // Get an object representing the parsed url
        const parsedUrl = url.parse(req.url, true);

        // Make the path easy to read
        const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, "")
    
        // Get the query params as an object
        const queryStringObject = parsedUrl.query;
    
        // Get the request method
        const method = req.method.toLowerCase();
    
        // Get the request headers as an object
        const headers = req.headers;
    
        // Extract payload from readable stream
        const decoder = new StringDecoder('utf-8');
    
        let buffer = ""
    
        req.on('data', d => {
            buffer += decoder.write(d)
        })
    
        req.on('end', () => {
            buffer += decoder.end();
    
            // Choose the handler this request should go to 
            const chosenHandler = typeof(router[path]) !== undefined
                ? router[path]
                : handlers.notFound
    
            const data = {
                path,
                queryStringObject,
                method,
                headers,
                payload: buffer
            };
    
            chosenHandler(data, (statusCode, payload) => {
                statusCode = typeof(statusCode) === "number" ? statusCode : 200;
                payload = typeof(payload) === "object" ? payload : {};
    
                let payloadString = JSON.stringify(payload);
    
                res.setHeader("Content-Type", "application/json")
                res.writeHead(statusCode);
                res.end(payloadString);
    
                console.log("Returning: ", statusCode, payloadString)
            })
        })
} 

// Define req handlers
const handlers = {
    sample: function(data, cb) {
        cb(406, {name: "sampleHandler"})
    },
    notFound: function(data, cb) {
        cb(404);
    }
}

// Define a req router
const router = {
    "sample": handlers.sample
}