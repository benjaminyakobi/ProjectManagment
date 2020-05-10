var http = require('http');
var fs = require('fs');
var express = require('express');
var todoController = require(__dirname + '/controller/tdController')

var app = express();
console.log(__dirname);
app.use(express.static(__dirname));
todoController(app);
app.listen(3000);


/*
var kk = 3000;
var server = http.createServer(function (req, res) {
    if (req.url == '/index.html' || req.url == '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        var myReadStream = fs.createReadStream(__dirname + '/index.html', 'utf8');
        myReadStream.pipe(res);
    }

}
)
server.listen(kk, '127.0.0.1');
console.log('sssddd');*/