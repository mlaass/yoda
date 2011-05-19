Yoda: May the force be synchronized
===================================

Yoda is a simple attempt to transcend the barrier between server and client 
javascript. With simple interface to run synchronized instances of the same 
classes on the server and in the browser.

Yoda builds on the solid foundations of [nodeJS](http://nodejs.org/), 
[Socket.IO](http://socket.io/) and [requireJS](http://requirejs.org/).

## Requirements

- Node v0.1.103+ with `crypto` module support (make sure you have OpenSSL
  headers when installing Node to get it

## Getting started

First have a look at the notorious chat example:

$ git clone http://github.com/jomoho/yoda.git
$ cd yoda
$ sh build.sh
$ node r.js server.js

## How To use Yoda

On the server you add an instance of your class to Yoda using .addInstance(name, Constructor}) 
server: 
	require(['http','./path/to/Yoda', './path/to/Cat'], function(http, Yoda, Cat){	
		var server = http.createServer()
		server.listen(8000);
		var yoda = new Yoda({listen: server});	
		yoda.addInstance('cat1', Cat);	
	});

On the client you use .entangleInstance(name, Constructor) to get the entangled version of your Class.
which can then be used by calling its member functions.
Note: you can have member functions on the client exclusively if you start their name with client
client:
	require(['YodaClient', 'Cat'], function(Yoda, Cat){	
		var yoda = new Yoda(8000);		
		
		yoda.ready(function(){		
			var cat = yoda.entangleInstance('cat1', Cat);				
			cat.meow();
						
			yoda.sync(function(){
				//member functions that start with client wont synchronize with the server
				//they just run on the client, which is useful for rendering
				cat.clientRender();
			});
		});	
	});


### License 

(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.