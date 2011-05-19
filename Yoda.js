/**
 * @license Copyright (c) 2011, Moritz Laass All Rights Reserved.
 * released under the MIT license.
 * see: http://github.com/jomoho/yoda for details
 */

define(['sys' ,'./Socket.IO-node'], function(sys, io){
	/**
	 *@constructor
	 *@param options configuration options
	 *#properties:
	 *
	 *-listen: server or port to listen to
	 */
	var Yoda = function(options){		
		this.options = options;
		var yoda = this;
		this.io = io.listen(options.listen || 80);	
		
		this.inst = {};
		this.facade = {};
		
		//sockets
		this.io.on('connection', function(client){
			client.send({facade: yoda.facade});			
			client.broadcast({ announcement: client.sessionId + ' connected' });
			
			client.on('message', function(msg){
				if(msg.type === 'yoda'){
					msg.client = client.sessionId;
					var cl = yoda.inst[msg.instance];	
					var args = msg.arguments = parseArgs(msg.arguments);		
					
					client.broadcast(msg);
					if(typeof cl[msg.fn] === 'function'){
						cl[msg.fn].apply(cl, args);						
						client.send(msg);
					}
				}				
			});
			
			client.on('disconnect', function(){
				client.broadcast({ announcement: client.sessionId + ' disconnected' });
			});
			
			//parsing the arguments object into an array and exchanging $ values
			var parseArgs = function(args, asObj){
				var r = [];
				
				if(!!asObj && !(args instanceof Array)){
					r = {};
				}
				for(var i in args){					
					if(args[i] === '$id'){
						args[i]= client.sessionId;
					}else if(args[i] === '$time'){
						args[i] = new Date();
					}else if(typeof args[i]==='object'){
						args[i] = parseArgs(args[i], true);
					}
					sys.puts('arg '+i+'\t'+args[i]);
					r[i] = args[i];
				}
				return r;
			};
		});
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

	Yoda.prototype.sync = function(){
		//broadcast the new facades
		this.io.broadcast({facade: this.facade});
	};
	/**
	 * Add an instance 
	 * @param name name of the instance
	 * @param opt options object
	 * # properties: 
	 * - Class  must point to a constructor function
	 * - instance (opt) a pre-configured instance
	 * - arguments (opt) arguments array for the Constructor
	 * 
	 */
	Yoda.prototype.addInstance = function(name, opt){
		var cl = {};		
		if(typeof opt.Class === 'function'){
			cl = this.inst[name] = apply2(opt.Class, opt.arguments);
		}else{
			throw 'opt needs Class property';
		}
		
		if(typeof opt.instance !== 'undefined'){
			cl = opt.instanc;
		}
		this.facade[name] = this.parseObj(cl);
		this.facade[name]._yoda = {args: opt.arguments};
		
		this.sync();
	};
	Yoda.prototype.removeInstance = function(name){
		delete this.inst[name];
		delete this.facade[name];
	};
	/**
	 * 
	 * @param obj instance obj to parse
	 * @returns [object] Facade
	 */
	Yoda.prototype.parseObj = function(obj){
		var facade = {};
		for(var i in obj){
			var t = typeof obj[i];
			if(t === 'function'){
				if(!i.match(/^client/)){
					facade[i] = 'function';			
				}
			}else if(t === 'object'){
				if(! obj[i] instanceof Array){
					facade[i] = parseObject(obj[i]);
				}
				else{
					facade[i] = obj[i];
				}
			}else{
				facade[i] = obj[i];
			}			
		}
		return facade;		
	};
	
	return Yoda;	
});