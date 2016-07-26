var cards = [];
var collection = {};
var sets = ["EXPERT1", "GVG", "TGT", "OG"];
var setsToSkip = ["CORE","HERO_SKINS", "PROMO", "REWARD"]; 
var adventureSets = ["LOE", "BRM", "NAXX"];
var setNames = {"EXPERT1":"Classic", 
				"CORE":"Basic", 
				"GVG": "Goblins Versus Gnomes", 
				"TGT":"The Grand Tournament",
				"OG":"Whispers of the Old Gods",
				"LOE":"League of Explorers",
				"BRM":"Black Rock Mountain",
				"NAXX":"Curse of Naxxramus"}

$(document).ready(function(){
	
	$.ajax({
        url: "https://api.hearthstonejson.com/v1/latest/enUS/cards.collectible.json",
        type: "GET",
		async: false,
        success: function (data, xhr, status) {
			//cards = data.slice();
			$.each(data, function(i){
				cards[data[i]["id"]] = data[i];
			});
        }
    });
	//Defunct - I decided to hard-code the sets because the API does not put a distinction b/w adventures and expansions and I need the distinction 
	/*$.each(cards, function(i) {
		if ($.inArray(cards[i]["set"], sets) < 0 && $.inArray(cards[i]["set"], setsToSkip) < 0){
			sets.push(cards[i]["set"]);
		}
	});*/
	$.each(sets, function(i){
		$("#selectSet").append("<input type = 'radio' class = 'sets' name = 'sets' id = '" + sets[i] + "' value = '" + sets[i] + "'> " + setNames[sets[i]] +  ((i < sets.length - 1) ? " | " : ""));
	});
	$("#"+sets[0]).prop("checked", true);
	for (var key in cards){
		collection[key] = 0; 
	};
	
});

function buyPacks(){
	
	//Subset of only the chosen set's cards
	var selectedSet = cards.filter(isCurrentlySelectedSet);
	console.log(getRandomArbitrary(0,100));
	
	//Dump collection
	$("#collection").html("");
	for (var key in collection) {
		if (collection[key] > 0) $("#collection").append(cards[key]["name"] + ": " + collection[key] + "<br>");
	};
	
	$("#message").html("You bought " + $(".numPacks:checked").val() + " packs from the " + setNames[$(".sets:checked").val()] + " set.<br>");
	$("#history").append("You bought " + $(".numPacks:checked").val() + " packs from the " + setNames[$(".sets:checked").val()] + " set.<br>");
}

function isCurrentlySelectedSet(value){
	return value["set"] == $(".sets:checked").val();
}

function isGreaterThanZero(value){
	return collection[value] > 0; 
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}