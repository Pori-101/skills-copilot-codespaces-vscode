// Create web server
// 1. Create a server
// 2. Define a port
// 3. Define a route
// 4. Define a response
// 5. Start the server

// 1. Create a server
const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const comments = require('./comments.json');

const server = http.createServer((req, res) => {
	// 3. Define a route
	const pathName = url.parse(req.url, true).pathname;
	const query = url.parse(req.url, true).query;
	// console.log(url.parse(req.url, true));

	if (pathName === '/comments' && req.method === 'GET') {
		// 4. Define a response
		res.writeHead(200, { 'Content-type': 'application/json' });
		res.end(JSON.stringify(comments));
	} else if (pathName === '/comments' && req.method === 'POST') {
		// 4. Define a response
		let body = '';
		req.on('data', (chunk) => {
			body += chunk;
		});
		req.on('end', () => {
			const newComment = qs.parse(body);
			comments.push(newComment);
			fs.writeFile('./comments.json', JSON.stringify(comments), 'utf-8', (err) => {
				if (err) {
					res.writeHead(500, { 'Content-type': 'application/json' });
					res.end(JSON.stringify({ message: 'Error writing to file' }));
				} else {
					res.writeHead(201, { 'Content-type': 'application/json' });
					res.end(JSON.stringify(newComment));
				}
			});
		});
	} else {
		res.writeHead(404, { 'Content-type': 'application/json' });
		res.end(JSON.stringify({ message: 'Route not found' }));
	}
});

// 2. Define a port
server.listen(8000, '