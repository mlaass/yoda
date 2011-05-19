require(['http', 'url', 'fs', 'sys', '../Yoda', './Chat'], 
		function(http, url, fs, sys, Yoda, Chat){
	
	var server = http.createServer(function(req, res) {		
		// your normal server code
		var path = url.parse(req.url).pathname;
		switch (path) {
		case '/server.js':
			path= '/404';
		case '/':
			path = '/index.html';
			break;
		case '/YodaClient.js':
			path= './YodaClient.js';
			break;
		}		
		fs.readFile('.'+ path, function(err, data) {
			if (err) return send404(res);
			var ct = path.substr(path.length - 3) === '.js' ? 'text/javascript' : 'text/html';
			ct = path.substring(path.length-4) === '.css' ? 'text/stylesheet' : ct;
			
			res.writeHead(200, {'Content-Type' : ct });
			res.write(data, 'utf8');
			res.end();
		});
		
	}),	send404 = function(res) {
		res.writeHead(404);
		res.write('<h1>404</h1>');
		res.end();
	};

	server.listen(8000);
	sys.puts('Server running at http://127.0.0.1:8000/');	
	
	var yoda = new Yoda({listen: server});	
	//add an instance of the Chat class to Yoda
	yoda.addInstance('chat', Chat);	
});