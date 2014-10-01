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

var io = require('socket.io').listen(app),
    crypto = require('crypto'),
    users = [];

io.on('connection', function(socket) {
    var id = crypto.randomBytes(20).toString('hex');
    
    users.push({socket: socket, id: id, name: null});
    
    socket.emit('welcome', {message : 'welcome', id: id});
    
    sendUsers();
    
    socket.on('send', function(data) {
        if(data.username !== '') {
            setUsername(id, data.username);
        };
        
        if(data.toUser !== '') {
            users.forEach(function(user) {
                if(user.id === data.toUser || user.id === data.fromUser) {
                    user.socket.emit('receive', data);
                }
            });
        } else {
            io.sockets.emit('receive', data);
        }
    });
});


var sendUsers = function() {
    io.sockets.emit('users', users.map(function(user) {
		return { id: user.id, name: user.username };
	}));
};

var setUsername = function(id, name) {
    users.forEach(function(user) {
		if(user.id === id) {
			user.username = name;
			sendUsers();
		}
	});
};

