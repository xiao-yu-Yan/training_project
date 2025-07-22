const http = require('http'); // Importing the http module
const data={name:"Node.js",
    type: "Runtime",
    language: "JavaScript",
    version: "14.17.0",
}

const server = http.createServer((req, res) => {
    // check if the request URL is for the API
    if (req.url === '/api') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data)); // Sending JSON response
        return;
    }else{
        // If the request URL is not for the API, return a 404 error
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }

}   );

const PORT = 4000; // Defining the port number
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
}   ); // Start the server and listen on the specified port