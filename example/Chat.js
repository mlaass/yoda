define([],function(){
	var Chat = function(){
		this.history = [];
	};
	Chat.prototype.post = function(msg){		
		this.history.push(msg);
		
		if(this.history.length>15){
			this.history.shift();
		}
	};	
	Chat.prototype.clientRenderHtml = function(){
		var r = '';
		for(var i in this.history){
			r+= '<p>['+this.history[i].time+'] <b>'+this.history[i].client+': </b>'+this.history[i].text+'</p>';
		}
		return r;
	};	
	return Chat;
});