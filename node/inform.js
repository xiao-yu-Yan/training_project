const http = require('http'); // Importing the http module
const fs = require('fs'); // Importing the file system module
const path = require('path'); // Importing the path module
const querystring = require('querystring'); // Importing querystring for parsing POST data

const PORT = 3000; // Defining the port number

const server = http.createServer((req, res) => {
    if (req.url === '/' || req.url === 'index.html') {
        // Serve the HTML file
        const filePath = path.join(__dirname, 'index.html');
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
    } else if (req.url === '/submitForm' && req.method === 'POST') {
        // Handle form submission
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // Collect POST data
        });

        req.on('end', () => {
            const formData = querystring.parse(body); // Parse the form data
            console.log('Form Data:', formData); // Log the form data to the console

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Form submitted successfully!', data: formData }));
        });
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