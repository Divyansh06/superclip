const http = require('http');
const App = require('./app');

const port = process.env.PORT || 3000;

const server = http.createServer(App);

server.listen(port);