/**
 * @license Copyright (c) 2011, Moritz Laass All Rights Reserved.
 * released under the MIT license.
 * see: http://github.com/jomoho/yoda for details
 */

define(['sys' ,'socket.io'], function(sys, io){
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
		this._sync = function(){};
		this._message= function(){};
		//sockets
		this.io.on('connection', function(client){
			yoda.updateFacade();
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
						yoda.updateFacade();
						yoda._sync(client, msg);
					}					
					
				}else{
					yoda._message(client, msg);
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
						args[i] = client.sessionId;
					}else if(args[i] === '$time'){
						args[i] = new Date();
					}else if(typeof args[i]==='object'){
						args[i] = parseArgs(args[i], true);
					}
					//sys.puts('arg '+i+'\t'+args[i]);
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

	Yoda.prototype.sync = function(fn){
		this._sync= fn;
	};
	/**
	 * Add an instance 
	 * @param name name of the instance
	 * @param Class  must point to a constructor function
	 * @param opt (optional)options object
	 * # properties: 
	 * - instance (opt) a pre-configured instance
	 * - arguments (opt) arguments array for the Constructor
	 * 
	 */
	Yoda.prototype.addInstance = function(name, Class, opt){
		var cl = {};		
		if(typeof opt === 'undefined'){
			opt = {};
		}
		if(typeof Class === 'function'){
			cl = this.inst[name] = apply2(Class, opt.arguments);
		}else{
			throw 'need Class  to be a valid constructor';
		}
		
		if(typeof opt.instance !== 'undefined'){
			cl = this.inst[name] = opt.instance;
		}
		this.facade[name] = this.parseObj(cl, opt);
		this.facade[name]._yoda = {args: opt.arguments};
		
		//broadcast the new facades
		this.io.broadcast({facade: this.facade});
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
	Yoda.prototype.parseObj = function(obj, opt){
		var facade = {};
		
		opt.ignore = !!opt.ignore? opt.ignore: [];
		opt.include = !!opt.include? opt.include: [];
		
		for(var i in obj){
			var t = typeof obj[i];
			if(t === 'function'){
				if((!i.match(/^client/)) && !i.match(/^_/) && !(i in opt.ignore)){
					facade[i] = 'function';			
				}
			}else if(t === 'object'){
				if(! obj[i] instanceof Array){
					facade[i] = this.parseObj(obj[i]);
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
	Yoda.prototype.updateFacade = function(fac, inst){
		var self=this;
		var updateFacade = function(facade, instance){
			for(var i in facade){
				if(facade[i] !== 'function' && typeof instance[i] !== 'undefined' ){
					var t = typeof instance[i];
					if(t === 'object'){
						if(true || ! instance[i] instanceof Array){
							facade[i] = self.updateFacade(facade[i],instance[i]);
						}
						else{
							facade[i] = instance[i];
						}
					}else{
						facade[i] = instance[i];
					}
				}
			}
			return facade;
		};
		
		if(! arguments.length){
			for(var i in this.inst){
				return updateFacade(this.facade[i], this.inst[i]);
			}			
		}else if(arguments.length === 2){
			return updateFacade(fac, inst);
		}
	};
	Yoda.prototype.message = function(fn){
		this._message = fn;
	};
	Yoda.prototype.getInstance = function(name){
		return this.inst[name];
	};
	
	return Yoda;	
});