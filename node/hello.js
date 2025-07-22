const http = require('http'); // Importing the http module
const fs = require('fs'); // Importing the file system module
const path = require('path'); // Importing the path module

const PORT = 3000; // Defining the port number

const server = http.createServer((req, res) => {
    if (req.url === '/' || req.url === '/node_index.html') {
        // Serve the HTML file
        const filePath = path.join(__dirname, 'node_index.html');
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Internal Server Error');
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.end(content);
            }
        });
    } else if (req.url === '/sayHello' && req.method === 'GET') {
        // Handle the sayHello route
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Hello, Node Js World!' }));
    } else {
        // Handle other routes
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('404 Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});