// Load the built-in http module
const http = require('http');

// Define the hostname and port
const hostname = '127.0.0.1';
const port = 3000;

// Create an HTTP server
const server = http.createServer((req, res) => {
  // Set the response HTTP headers
  res.statusCode = 200; // OK
  res.setHeader('Content-Type', 'text/plain');

  // Handle the root route
  if (req.url === '/') {
    res.end('Hello, World!');
  } else {
    res.statusCode = 404; // Not Found
    res.end('Page not found');
  }
});

// Start the server and listen on the specified port
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
