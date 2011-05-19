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

Have a look at the notorious chat example:

$ git clone http://github.com/jomoho/yoda
$ cd yoda
$ git submodule init
$ git submodule update
$ cd example
$ node r.js server.js

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