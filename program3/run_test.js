const http = require('http');
const path = require('path');

// Run tests against the server handler directly or via http.createServer
const serverPath = path.join(__dirname, 'server.js');
console.log('Testing Program 3: Node.js Bus Pass Management Server (Without Express)');
console.log('Student Roll No: 14 | Course Outcome: CO4');
console.log('='.repeat(70));

// Let's spawn or require the server
const server = require('./server'); // check if server exports or runs
