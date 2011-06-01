/**
 * @license Copyright (c) 2011, Moritz Laass All Rights Reserved.
 * released under the MIT license.
 * see: http://github.com/jomoho/yoda for details
 */

define( function(){
	/**
	 * @constructor
	 * @param port port to connect to	 
	 */
	var YodaClient = function(port){
		
		var socket = this.socket = new io.Socket(null, {port: port, rememberTransport: false});
		var yoda = this;
		
		yoda.facade = {};
		yoda.inst = {};
		yoda.firstSync = true;
		
		console.log('yoda client connecting '+ socket.host+' ...');
		
		var message = function(msg){
			if(!!console){
				console.log(msg);
			}			
		};
		
		socket.connect();

		socket.on('message', function(obj){
			message(obj);
			if(typeof obj.facade !== 'undefined'){
				yoda.facade = obj.facade;				
				if(yoda.firstSync){
					yoda._ready(obj);
				}
				yoda.firstSync = false;
			}
			if(obj.type === 'yoda'){
				var msg = obj;
				var cl = yoda.inst[msg.instance];					
				
				var args=[];
				for(var i in msg.arguments){
					args.push(msg.arguments[i]);
				}
				if(typeof cl[msg.fn] === 'function'){
					cl[msg.fn].orig.apply(cl, args);	
					yoda._sync(obj);
				}
			}
		});
		
		socket.on('connect', function(){message('Connected');});
		socket.on('disconnect', function(){ message('Disconnected');});
		socket.on('reconnect', function(){ message('Reconnected to server');});
		socket.on('reconnecting', function( nextRetry ){ message('Attempting to re-connect to the server, next attempt in ' + nextRetry + 'ms');});
		socket.on('reconnect_failed', function(){ message('Reconnected to server FAILED.');});


		this._sync = function(){};
		this._ready = function(){};
	};
	var apply2= function(){
	    function tempCtor() {};
	    return function(ctor, args){
	        tempCtor.prototype = ctor.prototype;
	        var instance = new tempCtor();
	        ctor.apply(instance,args);
	        return instance;
	    };
	}();
	
	/**
	 * 
	 * @param inst name of the instance, must be the same as the one configured on the server
	 * @param Class constructor function, usually the same as on the server
	 * @returns new facade object which behaves like it is an instance of Class
	 */
	YodaClient.prototype.entangleInstance = function(inst, Class){
		var facade = this.facade[inst];
		var args= facade._yoda.args;
		var cl = this.inst[inst] = apply2(Class, args);
		
		var self = this;
		
		var createCall = function(iname, fname, orig){
			var facade = function(){
				var args = arguments;
				self.socket.send({type: 'yoda', instance: iname, fn: fname, arguments: args});				
			};
			facade.orig = fn;
			return facade;
			
		};
		
		for(var i in facade){
			if(facade[i] === 'function'){
				var fn = cl[i];				 
				cl[i] = createCall(inst, i, cl[i] );
			}else{
				cl[i] = facade[i];
			}
		}
		return cl;		
	};
	/**
	 *  callback
	 * @param fn
	 */
	YodaClient.prototype.ready= function(fn){
		this._ready=fn;
	};
	/**
	 * callback
	 * @param fn
	 */
	YodaClient.prototype.sync= function(fn){
		this._sync=fn;
	};
	
	return YodaClient;
});