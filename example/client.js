require(['../YodaClient', './Chat'], function(Yoda, Chat){	
	yoda = new Yoda(8000);		
	
	yoda.ready(function(){		
		var chat = yoda.entangleInstance('chat', Chat);
		$('#chat').html(chat.clientRenderHtml());
		
		$('#form').submit(function(e){
			chat.post({time: '$time', client: '$id', text: $('#input').val()});
			$('#input').val('');
			e.preventDefault();
			return 0;
		});
		yoda.sync(function(){
			$('#chat').html(chat.clientRenderHtml());
		});
	});	
});