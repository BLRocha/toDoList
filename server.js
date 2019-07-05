const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  // console.log(req.url)
  if (req.url === '/') {
    fs.readFile('./index.html', (err, data) => {
      return res.end(data);
    });
  };
  fs.readFile(`.${req.url}`, (err, data) => {
    return res.end(data);
  });
});

server.listen('8080', console.log('server on port 8080'))