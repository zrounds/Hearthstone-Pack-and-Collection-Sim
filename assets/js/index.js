var cards = {};
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
	//Create subsets of only the chosen set's cards, broken into rarities for convenience 
	var commonCards = [], rareCards = [], epicCards = [], legendaryCards = [];
	for (var key in cards){
		if (isCurrentlySelectedSet(cards[key])) {
			switch(cards[key]["rarity"]){
				case "COMMON":
					commonCards.push(cards[key]);
					break;
				case "RARE":
					rareCards.push(cards[key]);
					break;
				case "EPIC":
					epicCards.push(cards[key]);
					break;
				case "LEGENDARY":
					legendaryCards.push(cards[key]);
					break;
			}
		}
	}
	console.clear();
	console.log(commonCards);
	console.log(rareCards);
	console.log(epicCards);
	console.log(legendaryCards);
	console.log(getRandomArbitrary(0,100));
	
	//Determine rarity of 1-4
	//If none are better than common, restrict last card to rare or better 
	//Determine final rarity 
	for (var i = 0; i < $(".numPacks:checked").val(); i++){
		var rarities = [];
		for (var j=0; j<4; j++) rarities.push(getRandomArbitrary(0,100));
		if(rarities[0] < 5 && rarities[1] < 5 && rarities[2] < 5 && rarities[3] < 5){
			rarities.push();
		} else {
			rarities.push(getRandomArbitrary(0,100));
		}
		//Distribute random cards based on rarity
	}
	
	//Dump collection
	$("#collection").html("");
	for (var key in collection) {
		if (collection[key] > 0) $("#collection").append(cards[key]["name"] + ": " + collection[key] + "<br>");
	};
	
	$("#history").prepend($("#message").html());
	$("#message").html("You bought " + $(".numPacks:checked").val() + " packs from the " + setNames[$(".sets:checked").val()] + " set.<br>");
}

function isCurrentlySelectedSet(value,i){
	return value["set"] == $(".sets:checked").val();
}
/*
function isCommon(value){
	return value["rarity"] == "COMMON";
}

function isRare(value){
	return value["rarity"] == "RARE";
}

function isEpic(value){
	return value["rarity"] == "EPIC";
}

function isLegendary(value){
	return value["rarity"] == "LEGENDARY";
}*/

function isGreaterThanZero(value){
	return collection[value] > 0; 
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}