var cards = [];

$(document).ready(function(){
	$.getJSON( "https://api.hearthstonejson.com/v1/latest/enUS/cards.collectible.json", function( data ) {
		
		$.each( data, function( i ) {
			cards.push( "<li id='" + data[i]["id"] + "'>" + data[i]["name"] + "</li>" );
		});
		
		$( "<ul/>", {
			"class": "my-new-list",
		html: cards.join( "" )
		}).appendTo("#collection");
	});
});