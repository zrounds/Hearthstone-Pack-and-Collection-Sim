var cards = [];
var sets = [];

$(document).ready(function(){
	
	$.ajax({
        url: "https://api.hearthstonejson.com/v1/latest/enUS/cards.collectible.json",
        type: "GET",
		async: false,
        success: function (data, xhr, status) {
			cards = data.slice();
        }
    });
	$.each(cards, function(i) {
		if ($.inArray(cards[i]["set"], sets) < 0){
			sets.push(cards[i]["set"]);
		}
	});
	$.each(sets, function(i){
		$("#selectSet").append("<input type = 'radio' class = 'sets' name = 'sets' id = '" + sets[i] + "' value = '" + sets[i] + "'> " + sets[i] +  ((i < sets.length - 1) ? " | " : ""));
	});
	$("#"+sets[0]).prop("checked", true);
});

function buyPacks(){
	$("#collection").append("You bought " + $(".numPacks:checked").val() + " packs from the " + $(".sets:checked").val() + " set.<br>");
}