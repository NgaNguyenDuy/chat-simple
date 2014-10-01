var debug = require('debug')('chatsimple'),
    http = require('http'),
    fs = require('fs'),
    port = process.env.PORT || 8008,
    html = fs.readFileSync(__dirname + '/html/index.html', {encoding: 'utf8'}),
	css = fs.readFileSync(__dirname + '/css/styles.css', {encoding: 'utf8'});


var app = http.createServer(function(req, res) {
    if(req.url === '/styles.css') {
        res.writeHead(200, {'Content-Type' : 'text/css'});
        res.end(css);
    } else {
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.end(html);
    }
}).listen(port, function() {
    debug('Server was running at port ' + port);
});


/*************** Socket IO config  */

// var io = require('socket.io').listen(app),
//     crypto = require('crypto');

