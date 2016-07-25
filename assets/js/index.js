var cards = [];

$(document).ready(function(){
	$.getJSON( "https://api.hearthstonejson.com/v1/latest/enUS/cards.collectible.json", function( data ) {
		
		$.each( data, function( i ) {
			items.push( "<li id='" + data[i]["id"] + "'>" + data[i]["name"] + "</li>" );
		});
		
		$( "<ul/>", {
			"class": "my-new-list",
		html: items.join( "" )
		}).appendTo("#collection");
	});
});