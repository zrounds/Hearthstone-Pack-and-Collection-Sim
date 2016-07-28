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
//var cBound = 70.36, gcBound = 71.84, rBound = 93.44, grBound = 94.71, eBound = 98.79, geBound = 98.98, lBound = 99.92
var cBound = 76.25, gcBound = 77.75, rBound = 94.75, grBound = 95.75, eBound = 99, geBound = 99.16, lBound = 99.925
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
		collection[key] = {};
		collection[key]["normal"] = 0; 
		collection[key]["golden"] = 0; 
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
	//console.clear();
	//console.log(commonCards.length);
	
	
	
	//Determine rarity of 1-4
	//If none are better than common, restrict last card to rare or better 
	//Determine final rarity 
	for (var i = 0; i < $(".numPacks:checked").val(); i++){
		var rarities = [];
		for (var j=0; j<4; j++) rarities.push(getRandomArbitrary(0,100));
		if(rarities[0] <= gcBound && rarities[1] <= gcBound && rarities[2] <= gcBound && rarities[3] <= gcBound){
			rarities.push(getRandomArbitrary(gcBound + 0.0001,100));
		} else {
			rarities.push(getRandomArbitrary(0,100));
		} 
		//Distribute random cards based on rarity
		$.each(rarities, function(i){
			if(rarities[i] <= cBound){
				//Common
				var chosenCard = commonCards[getRandomInt(0,commonCards.length)]["id"];
				collection[chosenCard]["normal"] = collection[chosenCard]["normal"] + 1;
			}else if (rarities[i] > cBound && rarities[i] <= gcBound){
				//Golden Common
				var chosenCard = commonCards[getRandomInt(0,commonCards.length)]["id"];
				collection[chosenCard]["golden"] = collection[chosenCard]["golden"] + 1;
			} else if (rarities[i] > gcBound && rarities[i] <= rBound){
				//Rare
				var chosenCard = rareCards[getRandomInt(0,rareCards.length)]["id"];
				collection[chosenCard]["normal"] = collection[chosenCard]["normal"] + 1;
			} else if (rarities[i] > rBound && rarities[i] <= grBound){
				//Golden Rare
				var chosenCard = rareCards[getRandomInt(0,rareCards.length)]["id"];
				collection[chosenCard]["golden"] = collection[chosenCard]["golden"] + 1;
			} else if (rarities[i] > grBound && rarities[i] <= eBound){
				//Epic
				var chosenCard = epicCards[getRandomInt(0,epicCards.length)]["id"];
				collection[chosenCard]["normal"] = collection[chosenCard]["normal"] + 1;
			} else if (rarities[i] > eBound && rarities[i] <= geBound){
				//Golden Epic
				var chosenCard = epicCards[getRandomInt(0,epicCards.length)]["id"];
				collection[chosenCard]["golden"] = collection[chosenCard]["golden"] + 1;
			} else if (rarities[i] > geBound && rarities[i] <= lBound){
				//Legendary
				var chosenCard = legendaryCards[getRandomInt(0,legendaryCards.length)]["id"];
				collection[chosenCard]["normal"] = collection[chosenCard]["normal"] + 1;
			} else {
				//Golden Legendary (>99.92 && <= 100, but no reason to actually test this)
				var chosenCard = legendaryCards[getRandomInt(0,legendaryCards.length)]["id"];
				collection[chosenCard]["golden"] = collection[chosenCard]["golden"] + 1;
			}
		});
	}
	
	//Dump collection
	$("#collection").html("");
	for (var key in collection) {
		if (collection[key]["normal"] > 0) $("#collection").append(cards[key]["name"] + ": " + collection[key]["normal"] + "<br>");
		if (collection[key]["golden"] > 0) $("#collection").append(cards[key]["name"] + " (golden): " + collection[key]["golden"] + "<br>");
	};
	
	$("#history").prepend($("#message").html());
	$("#message").html("You bought " + $(".numPacks:checked").val() + " packs from the " + setNames[$(".sets:checked").val()] + " set.<br>");
}

function validationTest(){
	//TESTING IF I GENERATE THE EXPECTED PERCENTAGES 
	for (var i = 0; i<500; i ++){
		buyPacks();
		console.log(i);
	}
	console.log(collection);
	var c = 0, r = 0, e = 0, l = 0, gc = 0, gr = 0, ge = 0, gl = 0, totalCards = 0;
	for (var key in collection){
		switch (cards[key]["rarity"]){
			case "COMMON":
				c += collection[key]["normal"];
				gc += collection[key]["golden"];
				break;
			case "RARE":
				r += collection[key]["normal"];
				gr += collection[key]["golden"];
				break;
			case "EPIC":
				e += collection[key]["normal"];
				ge += collection[key]["golden"];
				break;
			case "LEGENDARY":
				l += collection[key]["normal"];
				gl += collection[key]["golden"];
				break;
		}
		totalCards += collection[key]["normal"];
		totalCards += collection[key]["golden"];
	}
	console.log("Total Cards in Collection: " + totalCards);
	console.log("Common: " + c);
	console.log("Common(%): " + (c/totalCards)*100);
	console.log("Golden Common: " + gc);
	console.log("Golden Common(%): " + (gc/totalCards)*100);
	console.log("Rare: " + r);
	console.log("Rare(%): " + (r/totalCards)*100);
	console.log("Golden Rare: " + gr);
	console.log("Golden Rare(%): " + (gr/totalCards)*100);
	console.log("Epic: " + e);
	console.log("Epic(%): " + (e/totalCards)*100);
	console.log("Golden Epic: " + ge);
	console.log("Golden Epic(%): " + (ge/totalCards)*100);
	console.log("Legendary: " + l);
	console.log("Legendary(%): " + (l/totalCards)*100);
	console.log("Golden Legendary: " + gl);
	console.log("Golden Legendary(%): " + (gl/totalCards)*100);
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

//Inclusive of min, exclusive on max
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

//Inclusive of min, exclusive of max
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}