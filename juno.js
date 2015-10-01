/* to do:
accomplishments/challenges:
replaced all jquery w/ vanilla javascript to handle interaction w/ the DOM
*/

window.onload = function() {
/*
function cookie() {
  var now = new Date();
  var time = now.getTime();
  var expireTime = time + 1000*36000;
  now.setTime(expireTime);
  var tempExp = 'Wed, 31 Oct 2012 08:50:17 GMT';
  document.cookie = 'cookie=ok;expires='+now.toGMTString()+';path=/';
  //console.log(document.cookie);
}
*/
document.body.setScaledFont = function(f) {
  var s = this.offsetWidth, fs = s * f;
  this.style.fontSize = fs + '%';
  return this;
};

document.body.setScaledFont(0.14);
window.onresize = function() {
    document.body.setScaledFont(0.14);
};

function makeCards() { // Initialize deck and create cards
  var round = 1;
  var deck = [];
  function makeDeck(type, color, id) {
    deck[deck.length] = {
      type: type,
      color: color,
      id: id
    };
  }
  var number = 1;
  var color = "";
  for(var i = 0; i < 4; i++) {
    if(i === 0) {
      color = "Blue";
    }
    else if(i === 1) {
      color = "Green";
    }
    else if(i === 2) {
      color = "Red";
    }
    else {
      color = "Yellow";
    }
    for(var x = 0; x < 10; x++) {
      var y = 0;
      if(x < 1) {
        makeDeck(x, color, String([x]) + color + number);
        number += 1;
      }
      else {
        while(y < 2) {
          makeDeck(x, color, String([x]) + color + number);
          number += 1;
          y += 1;
        }
        while(x === 9 && y < 3) {
          makeDeck("Draw Two", color, "drawTwo" + color + number);
          makeDeck("Draw Two", color, "drawTwo" + color + (number += 1));
          makeDeck("Skip", color, "skip" + color + (number += 1));
          makeDeck("Skip", color, "skip" + color + (number += 1));
          number += 1;
          y += 1;
        }
        while(i === 3 && x === 9 && y < 7) {
          makeDeck("Wild", "Wild", "wild" + number);
          number += 1;
          y += 1;
        }
        while(i === 3 && x === 9 && y < 11) {
          makeDeck("Wild Draw Four", "Wild", "wildDrawFour" + number);
          number += 1;
          y += 1;
        }
      }
    }
  }
  shuffleDeck(deck, round);
}

function shuffleDeck(deck, round) { // Shuffle deck
  var i = deck.length;
  while(i) {
    var x = Math.floor(Math.random() * i--);
    var y = deck[i];
    deck[i] = deck[x];
    deck[x] = y;
  }
  if(round === 1) {
  dealCards(deck, round);
  }
}

function dealCards(deck, round) {
  var computerHand = [];
  var playerHand = [];
  var discardPile = [];
  for(var i = 0; i < 14; i += 2) {
    computerHand.push(deck[i]);
    playerHand.push(deck[i + 1]);
  }
  while(deck[14].color === "Wild") {
    var x = deck[14];
    deck.splice(14, 1);
    deck.push(x);
  }
  discardPile.push(deck[14]);
  deck.splice(0, 15);
  var elem = "computerHand";
  displayHand(computerHand, elem, computerHand.length);
  elem = "playerHand";
  displayHand(playerHand, elem, playerHand.length);
  elem = "discardPile";
  displayHand(discardPile, elem, 1);
  intro();
  takeTurn(playerHand, discardPile, deck, computerHand, round);
  //console.log(deck.length);
}

function displayHand(cards, elem, num) {
  for(var i = 0; i < num; i++) {
    var cardDiv1 = document.createElement("div");
    document.getElementById(elem).appendChild(cardDiv1);
    cardDiv1.setAttribute("class", "card " + cards[i].color);
    if(num > 7) {
      cardDiv1.setAttribute("style", "z-index: " + (i + 1) + "; right: " + i * (((cards.length - 7) * (0.1428 * 100)) / (cards.length - 1)) + "%");
    }
    cardDiv1.setAttribute("id", cards[i].id);
    var cardTextDiv1 = document.createElement("div");
    document.getElementById(cards[i].id).appendChild(cardTextDiv1);
    cardTextDiv1.setAttribute("class", "cardText");
    cardTextDiv1.innerHTML = cards[i].type;
    if(elem === "computerHand") {
      cardTextDiv1.innerHTML = "JUNO";
    }
    else {
      cardTextDiv1.innerHTML = cards[i].type;
      if(typeof cards[i].type === "number") {
        //var cardDivStyle = cardDiv1.getAttribute("style");
        //if(cardDivStyle !== null) {
        cardDiv1.firstChild.setAttribute("style", "font-size: 170%; margin-top: 39.5%");
        //}
        //else {
        //  cardDiv1.setAttribute("style", "font-size: 175%; margin-top: 25%");
        //}
      }
    }
  }
}

function canPlay(hand, discardPile) { // Determine which cards the current player can play
  var playableCards = [];
  for(var i = 0; i < hand.length; i++) {
    if(hand[i].type === discardPile[0].type || hand[i].color === discardPile[0].color || hand[i].color === "Wild") {
      playableCards.push(hand[i]);
    }
  }
  return playableCards;
}

function cPlayCard(card, discardPile, hand, elem) {
  // Remove clicked card from hand (array)
  for(var i = 0; i < hand.length; i++) {
    if(hand[i].id === card.id) {
      hand.splice(i, 1);
    }

  var e = document.getElementById(elem);
    while(e.hasChildNodes()) {
      e.removeChild(e.lastChild);
    }
  }
  displayHand(hand, elem, hand.length);
  // Move clicked card to top of discard pile (array)
  discardPile.unshift(card);
  // Remove previous card from discard pile (array)
  //discardPile.splice(1, 1);
  // Remove previous discard pile (DOM)
  document.querySelector("#discardPile").removeChild(document.querySelector("#discardPile").firstChild);
  // Add new discard pile (DOM)
  displayHand(discardPile, "discardPile", 1);
  
}

function playWild(computerHand, discardPile, deck, playerHand, round) {
  document.getElementById("wildMenu").removeAttribute("class", "hidden");
  document.getElementById("wildMenu").onclick = function(event) {
  if(event.target.parentNode.id === "wildMenu" && event.target.tagName === "BUTTON") {


    document.getElementById("wildMenu").setAttribute("class", "hidden");
    document.querySelector("#discardPile").firstChild.setAttribute("class", "card " + event.target.id);
    discardPile[0].color = event.target.id;
    if(playerHand.length > 0) {
    computerTurn(computerHand, discardPile, deck, playerHand, round);
    }
    else {
      var cardDiv = document.createElement("div");
        cardDiv.setAttribute("class", "placeholder");
        document.getElementById("playerHand").appendChild(cardDiv);
      setTimeout(function() {
        overlay();
        document.getElementById("gameOver").innerHTML = "You won!";
        document.getElementById("gameOver").removeAttribute("class", "hidden");
      }, 1000);
    }
  }
};
}

function takeTurn(playerHand, discardPile, deck, computerHand, round) {
  function callbackThing(playableCardH, i, clickCard, event, holder, round) {
    if(playableCardH[i].id === clickCard) {
      yelp = "true";
          document.getElementById("playerWrapper").setAttribute("class", "disabled");
          document.getElementById("drawButton").setAttribute("class", "disabled");
          document.getElementById("passButton").setAttribute("class", "disabled");
          var rect1 = document.querySelector("#discardPile").firstChild.getBoundingClientRect();
          var rect2 = event.target.getBoundingClientRect();

  document.styleSheets[2].insertRule(".animated { -webkit-transform: translate(" + (rect1.left - rect2.left) + "px, " + (rect1.top - rect2.top) + "px); -moz-transform: translate(" + (rect1.left - rect2.left) + "px, " + (rect1.top - rect2.top) + "px); -ms-transform: translate(" + (rect1.left - rect2.left) + "px, " + (rect1.top - rect2.top) + "px); transform: translate(" + (rect1.left - rect2.left) + "px, " + (rect1.top - rect2.top) + "px); }", 0);
event.target.setAttribute("class", holder + " animated");
            setTimeout(function() {
    document.styleSheets[2].deleteRule(0);
    var elem = "playerHand";
    cPlayCard(playableCardH[i], discardPile, playerHand, elem);
    playerFace(playerHand);
    if(playableCardH[i].color === "Wild") {
            playWild(computerHand, discardPile, deck, playerHand, round);
          }
          else if(playerHand.length > 0) {
            computerTurn(computerHand, discardPile, deck, playerHand, round);
          }
          else {
            var cardDiv = document.createElement("div");
              cardDiv.setAttribute("class", "placeholder");
              document.getElementById("playerHand").appendChild(cardDiv);
            setTimeout(function() {
              overlay();
              document.getElementById("gameOver").innerHTML = "You won!";
              document.getElementById("gameOver").removeAttribute("class", "hidden");
            }, 1000);
          }
  }, 300);
  }
}

  var cardStyle = "";
  var cardStyleNew = "";
  document.getElementById("playerHand").addEventListener("mouseover", function(event) {
    if(event.target.classList.contains("card")) {
      cardStyle = event.target.getAttribute("style");
      if(playerHand.length > 7) {
      cardStyleNew = cardStyle.replace(/z-index: \w*;/, "z-index: " + (playerHand.length + 1) + ";");
      event.target.setAttribute("style", cardStyleNew + "; bottom: 10px"/*+ "; width: 13%; margin-top: -1%"*/);
    }
    else if(cardStyle !== "null") {
      event.target.setAttribute("style", cardStyle + "; z-index: 2; bottom: 10px"/*+ "; width: 13%; margin-top: -1%"*/);
    }
    else {
      event.target.setAttribute("style", "z-index: 2; bottom: 10px"/*+ "; width: 13%; margin-top: -1%"*/);
    }
    }
  });
  document.getElementById("playerHand").addEventListener("mouseout", function(event) {
    if(event.target.classList.contains("card")) {
      event.target.setAttribute("style", cardStyle);
    }
  });
  document.querySelector("body").addEventListener("click", function(event) {
    if(!(document.getElementById("intro3").classList.contains("hidden")) && (event.target.parentNode.id === "playerHand" || event.target.innerHTML === "draw")) {
      document.getElementById("intro3").setAttribute("class", "hidden");
    }
    //var yelp = false;
    var playableCardH = canPlay(playerHand, discardPile);
    if(event.target.parentNode.id === "playerHand" && document.getElementById("playerWrapper").className !== "disabled" && event.target.classList.contains("card")) {
      var clickCard = event.target.getAttribute("id");
      var holder = event.target.getAttribute("class");
      for(var i = 0; i < playableCardH.length; i++) {
        callbackThing(playableCardH, i, clickCard, event, holder, round);
      if(i === (playableCardH.length - 1) && !(event.target.classList.contains("animated"))) {
        event.target.setAttribute("class", holder + " shake");
        setTimeout(wait, 600);
      }
      }
    }
    else if(event.target.innerHTML === "draw" && event.target.className !== "disabled") {
      // Move card from front of deck to hand
      checkDeck(deck, discardPile, round);
      playerHand.push(deck[0]);
      deck.splice(0, 1);
      var elem = "playerHand";
        var e = document.getElementById("playerHand");
        while(e.hasChildNodes()) {
          e.removeChild(e.lastChild);
        }
      displayHand(playerHand, elem, playerHand.length);
      playerFace(playerHand);
      playableCardH = canPlay(playerHand, discardPile);
      event.target.className = "disabled";
      document.getElementById("passButton").removeAttribute("class", "disabled");
          //for(j = 0; j < discardPile.length; j++) {
  //console.log(j + ": " + discardPile[j].id);
//}
//console.log(deck.length);
//console.log("deck: " + deck.length);
//console.log("discard pile: " + discardPile.length);
    }
    else if(event.target.innerHTML === "pass" && document.getElementById("drawButton").className === "disabled" && event.target.className !== "disabled") {
      //playableCardsPC = canPlay(computerHand, discardPile);
      computerTurn(computerHand, discardPile, deck, playerHand, round);
      event.target.className = "disabled";
      document.getElementById("playerWrapper").setAttribute("class", "disabled");
    }
    function wait() {
            event.target.setAttribute("class", holder);
          }
  });
}

function playerStartTurn(playerHand, deck, discardPile, computerHand, round) {
  var elem = "playerHand";
  var num = null;
  if(discardPile[0].type === "Skip" && !(document.getElementById("discardPile").firstChild.classList.contains("disabled"))) {
    document.querySelector("#discardPile").firstChild.setAttribute("class", "card " + discardPile[0].color + " disabled");
    computerTurn(computerHand, discardPile, deck, playerHand, round);
  }
  else {
    document.getElementById("playerWrapper").removeAttribute("class", "disabled");
    document.getElementById("drawButton").removeAttribute("class", "disabled");
    document.getElementById("playerFace").setAttribute("class", "anim");
    setTimeout(function() {
      document.getElementById("playerFace").removeAttribute("class", "anim");
    }, 400);
    if(discardPile[0].type === "Draw Two" && !(document.getElementById("discardPile").firstChild.classList.contains("disabled"))) {
      num = 2;
      drawMoreComputer(playerHand, deck, elem, num, discardPile, round);
    }
    else if(discardPile[0].type === "Wild Draw Four" && !(document.getElementById("discardPile").firstChild.classList.contains("disabled"))) {
      num = 4;
      drawMoreComputer(playerHand, deck, elem, num, discardPile, round);
    }
  }
  playerFace(playerHand);
}

function drawMoreComputer(hand, deck, elem, num, discardPile, round) {
  for(var i = 0; i < num; i++) {
    checkDeck(deck, discardPile, round);
    hand.push(deck[0]);
    deck.splice(0, 1);
  }
  var e = document.getElementById(elem);
    while(e.hasChildNodes()) {
      e.removeChild(e.lastChild);
    }
  displayHand(hand, elem, hand.length);
    //deck.splice(0, num);
    document.querySelector("#discardPile").firstChild.setAttribute("class", "card " + discardPile[0].color + " disabled");
  }

function computerTurn(hand, discardPile, deck, playerHand, round) {
//console.log("deck: " + deck.length);
  //console.log("discard pile: " + discardPile.length);
  var playableCardsPC = canPlay(hand, discardPile);

  if(discardPile[0].type === "Draw Two" && !(document.getElementById("discardPile").firstChild.classList.contains("disabled"))) {
    setTimeout(initDrawTwo, 1000);
  }
  else if(discardPile[0].type === "Wild Draw Four" && !(document.getElementById("discardPile").firstChild.classList.contains("disabled"))) {
    //document.getElementById("computerFace").setAttribute("src", "face03.png");
    setTimeout(initDrawFour, 1000);
  }
  else if(discardPile[0].type === "Skip" && !(document.getElementById("discardPile").firstChild.classList.contains("disabled"))) {
    document.querySelector("#discardPile").firstChild.setAttribute("class", "card " + discardPile[0].color + " disabled");
    playerStartTurn(playerHand, deck, discardPile, hand, round);
  }
  else if(playableCardsPC.length < 1) {
    setTimeout(computerDrawCard, 1000);
  }
  else {
    setTimeout(computerPlayCard, 1000);
  }


  function initDrawTwo() {
    //console.log("X1: Draw Two on the discard pile");
    var elem = "computerHand";
    var num = 2;
    drawMoreComputer(hand, deck, elem, num, discardPile, round);
    playableCardsPC = canPlay(hand, discardPile);
    if(playableCardsPC.length < 1) {
    setTimeout(computerDrawCard, 1000);
    }
    else {
      setTimeout(computerPlayCard, 1000);
    }
  }

function initDrawFour() {
    //console.log("X2: Draw Four on the discard pile");
    var elem = "computerHand";
    var num = 4;
    drawMoreComputer(hand, deck, elem, num, discardPile, round);
    playableCardsPC = canPlay(hand, discardPile);
    if(playableCardsPC.length < 1) {
    setTimeout(computerDrawCard, 1000);
    }
    else {
      setTimeout(computerPlayCard, 1000);
    }
  }

  function computerDrawCard() {
    //var a = Math.floor(Date.now() / 1000);
    //console.log("A: no playable cards; draws a card " + a);
    checkDeck(deck, discardPile, round);
    hand.push(deck[0]);
    deck.splice(0, 1);
    var elem = "computerHand";
    var e = document.getElementById("computerHand");
    while(e.hasChildNodes()) {
      e.removeChild(e.lastChild);
    }
    displayHand(hand, elem, hand.length);
    setTimeout(computerPlayCard, 1000);
  }

  function CPC() {
    document.styleSheets[2].deleteRule(0);
    var elem = "computerHand";
    cPlayCard(playableCardsPC[0], discardPile, hand, elem);
    if(playableCardsPC[0].color === "Wild" && hand.length > 0) {
      var handColors = {};
      hand.forEach(function(i) {
        handColors[i.color] = (handColors[i.color] || 0 ) + 1;
      });
      var handColorsA = [];
      for(var j = 0; j < handColorsA.length; j++) {
        handColorsA.push([j, handColors[j]]);
      }
      var colorsSorted = [];
      colorsSorted = Object.keys(handColors).sort(function(x, y) {
        return handColors[x] - handColors[y]; }).reverse();
      setTimeout(function() {
        document.querySelector("#discardPile").firstChild.setAttribute("class", "card " + colorsSorted[0]);
        discardPile[0].color = colorsSorted[0];
        //if(hand.length > 0) {
        playerStartTurn(playerHand, deck, discardPile, hand, round);
      //}
      //else {
        //var cardDiv = document.createElement("div");
          //cardDiv.setAttribute("class", "placeholder");
          //document.getElementById("computerHand").appendChild(cardDiv);
        //setTimeout(function() {
          //overlay();
          //document.getElementById("gameOver").innerHTML = "The computer won.";
          //document.getElementById("gameOver").removeAttribute("class", "hidden");
        //}, 1000);
      //}
      }, 1000);
    }
    else if(hand.length > 0) {
      playerStartTurn(playerHand, deck, discardPile, hand, round);
      //var d2 = Math.floor(Date.now() / 1000);
      //console.log("D2: turn ends - played a card (not wild) " + d2);
    }
    else {
      var cardDiv = document.createElement("div");
        cardDiv.setAttribute("class", "placeholder");
        document.getElementById("computerHand").appendChild(cardDiv);
      setTimeout(function() {
        overlay();
        document.getElementById("gameOver").innerHTML = "The computer won.";
        document.getElementById("gameOver").removeAttribute("class", "hidden");
      }, 1000);
    }
  }

  function computerPlayCard() {
    playableCardsPC = canPlay(hand, discardPile);
    if(playableCardsPC.length > 0) {
      //var b = Math.floor(Date.now() / 1000);
      //console.log("B: plays a card " + b);
      var rect1 = document.querySelector("#discardPile").firstChild.getBoundingClientRect();
      var rect2 = document.getElementById(playableCardsPC[0].id).getBoundingClientRect();
document.styleSheets[2].insertRule(".animated { -webkit-transform: translate(" + (rect1.left - rect2.left) + "px, " + (rect1.top - rect2.top) + "px); -moz-transform: translate(" + (rect1.left - rect2.left) + "px, " + (rect1.top - rect2.top) + "px); -ms-transform: translate(" + (rect1.left - rect2.left) + "px, " + (rect1.top - rect2.top) + "px); transform: translate(" + (rect1.left - rect2.left) + "px, " + (rect1.top - rect2.top) + "px); }", 0);
      var holder = document.getElementById(playableCardsPC[0].id).getAttribute("class");
      document.getElementById(playableCardsPC[0].id).setAttribute("class", holder + " animated");
      if(hand.length < 8) {
        document.getElementById(playableCardsPC[0].id).setAttribute("style", "z-index: 1");
      }
      setTimeout(CPC, 300);
    }
    else {
      playerStartTurn(playerHand, deck, discardPile, hand, round);
      //var d1 = Math.floor(Date.now() / 1000);
      //console.log("D1: turn ends - drew a card but had nothing to play" + d1);
    }
  }
}

function overlay() {
  document.getElementById("overlay").removeAttribute("class", "hidden");
}

function playerFace(playerHand) {
  if(playerHand.length >= 6) {
    document.getElementById("playerFace").setAttribute("src", "./images/oldFaces/face00.png");
  }
  else if(playerHand.length >= 4) {
    document.getElementById("playerFace").setAttribute("src", "./images/oldFaces/face05.png");
  }
  else if(playerHand.length >= 2) {
    document.getElementById("playerFace").setAttribute("src", "./images/oldFaces/face01.png");
  }
  else if(playerHand.length === 1) {
    document.getElementById("playerFace").setAttribute("src", "./images/oldFaces/face07.png");
  }
}

function intro() {
  setTimeout(showIntro, 500);
function showIntro() {
document.getElementById("intro3").removeAttribute("class", "hidden");
  }

/*function showIntro() {
document.getElementById("intro1").removeAttribute("class", "hidden");
setTimeout(hideIntro, 1800);
  }
  function hideIntro() {
document.getElementById("intro1").setAttribute("class", "hidden");
setTimeout(showIntro2, 500);
  }
  function showIntro2() {
document.getElementById("intro2").removeAttribute("class", "hidden");
setTimeout(hideIntro2, 3200);
  }
    function hideIntro2() {
document.getElementById("intro2").setAttribute("class", "hidden");
setTimeout(showIntro3, 500);
  }
  function showIntro3() {
document.getElementById("intro3").removeAttribute("class", "hidden");
setTimeout(hideIntro3, 3200);
  }
    function hideIntro3() {
document.getElementById("intro3").setAttribute("class", "hidden");
  }*/
}

function checkDeck(deck, discardPile, round) {
  if(deck.length === 0) {
    console.log("start - deck length: " + deck.length);
    round++;
    for(i = 1; i < discardPile.length; i++) {
      if(discardPile[i].type === "Wild" || discardPile[i].type === "Wild Draw Four") {
        discardPile[i].color = "Wild";
      }
      deck.push(discardPile[i]);
    }
    discardPile.splice(1, discardPile.length);
    shuffleDeck(deck, round);
    console.log("end - deck length: " + deck.length);
    console.log("deck:");
    for(i = 0; i < deck.length; i++) {
      console.log(i + deck[i].id);
    }
    console.log("discard pile:");
    for(i = 0; i < discardPile.length; i++) {
      console.log(i + discardPile[i].id);
    }
  }
}

//cookie();
makeCards();
/*setTimeout(function() {
overlay();
      document.getElementById("gameOver").innerHTML = "You won!";
      document.getElementById("gameOver").removeAttribute("class", "hidden");
    }, 1000);*/
/*overlay();
document.getElementById("gameOver").innerHTML = "The computer won.";*/
};