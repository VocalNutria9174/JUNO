/* to do:
accomplishments/challenges:
replaced all jquery w/ vanilla javascript to handle interaction w/ the DOM
*/

$(document).ready(function() {

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
  shuffleDeck(deck);
}

function shuffleDeck(deck) { // Shuffle deck
  var i = deck.length;
  while(i) {
    var x = Math.floor(Math.random() * i--);
    var y = deck[i];
    deck[i] = deck[x];
    deck[x] = y;
  }
  dealCards(deck);
}

function dealCards(deck) {
  var computerHand = [];
  var playerHand = [];
  var discardPile = [];
  for(var i = 0; i < 14; i += 2) {
    computerHand.push(deck[i]);
    playerHand.push(deck[i + 1]);
  }
  discardPile.push(deck[14]);
  deck.splice(0, 15);
  var elem = "computerHand";
  displayHand(computerHand, elem);
  elem = "playerHand";
  displayHand(playerHand, elem);
  elem = "discardPile";
  displayHand(discardPile, elem);
  takeTurn(playerHand, discardPile, deck, computerHand);
}

function displayHand(cards, elem) {
  for(var i = 0; i < cards.length; i++) {
    var cardDiv1 = document.createElement("div");
    document.getElementById(elem).appendChild(cardDiv1);
    cardDiv1.setAttribute("class", "card " + cards[i].color);
    if(cards.length > 7) {
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
        var cardDivStyle = cardDiv1.getAttribute("style");
        if(cardDivStyle !== null) {
        cardDiv1.setAttribute("style", cardDivStyle + "; font-size: 175%");
        }
        else {
          cardDiv1.setAttribute("style", "font-size: 175%");
        }
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
  displayHand(hand, elem);
  // Move clicked card to top of discard pile (array)
  discardPile.unshift(card);
  // Remove previous card from discard pile (array)
  discardPile.splice(1, 1);
  // Remove previous discard pile (DOM)
  document.querySelector("#discardPile").removeChild(document.querySelector("#discardPile").firstChild);
  // Add new discard pile (DOM)
  displayHand(discardPile, "discardPile");
  }
}

function playWild(computerHand, discardPile, deck, playerHand) {
  document.getElementById("wild").removeAttribute("class", "hidden");
  document.getElementById("wild").onclick = function(event) {
    document.getElementById("wild").setAttribute("class", "hidden");
    document.querySelector("#discardPile").firstChild.setAttribute("class", "card " + event.target.id);
    discardPile[0].color = event.target.id;
    if(playerHand.length > 0) {
    computerTurn(computerHand, discardPile, deck, playerHand);
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
  };
}

function takeTurn(playerHand, discardPile, deck, computerHand) {
  function callbackThing(playableCardH, i, clickCard, event) {

    if(playableCardH[i].id === clickCard) {
          document.getElementById("playerWrapper").setAttribute("class", "disabled");
          document.getElementById("drawButton").setAttribute("class", "disabled");
          document.getElementById("passButton").setAttribute("class", "disabled");
          var rect1 = document.querySelector("#discardPile").firstChild.getBoundingClientRect();
          var rect2 = event.target.getBoundingClientRect();

  document.styleSheets[2].insertRule(".animated { -webkit-transform: translate(" + (rect1.left - rect2.left) + "px, " + (rect1.top - rect2.top) + "px); -moz-transform: translate(" + (rect1.left - rect2.left) + "px, " + (rect1.top - rect2.top) + "px); -ms-transform: translate(" + (rect1.left - rect2.left) + "px, " + (rect1.top - rect2.top) + "px); transform: translate(" + (rect1.left - rect2.left) + "px, " + (rect1.top - rect2.top) + "px); }", 0);
var holder = event.target.getAttribute("class");
event.target.setAttribute("class", holder + " animated");
            setTimeout(function() {
    document.styleSheets[2].deleteRule(0);
    var elem = "playerHand";
    cPlayCard(playableCardH[i], discardPile, playerHand, elem);
    if(playableCardH[i].color === "Wild") {
            playWild(computerHand, discardPile, deck, playerHand);
          }
          else if(playerHand.length > 0) {
            computerTurn(computerHand, discardPile, deck, playerHand);
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
      //if(playerHand.length > 7) {
      event.target.setAttribute("style", cardStyle);
    //}
    //else {
     //event.target.removeAttribute("style");
    //}
    }
  });
  document.querySelector("body").addEventListener("click", function(event) {
    var playableCardH = canPlay(playerHand, discardPile);
    if(event.target.parentNode.id === "playerHand" && document.getElementById("playerWrapper").className !== "disabled" && event.target.classList.contains("card")) {
      var clickCard = event.target.getAttribute("id");
      for(var i = 0; i < playableCardH.length; i++) {
        callbackThing(playableCardH, i, clickCard, event);

      }
    }
    else if(event.target.innerHTML === "draw" && event.target.className !== "disabled") {
      // Move card from front of deck to hand
      playerHand.push(deck[0]);
      deck.splice(0, 1);
      var elem = "playerHand";
      //var newComputerCard = [];
      //newComputerCard.push(hand[hand.length - 1]);
        var e = document.getElementById("playerHand");
        while(e.hasChildNodes()) {
          e.removeChild(e.lastChild);
        }
      displayHand(playerHand, elem);
      playableCardH = canPlay(playerHand, discardPile);
      event.target.className = "disabled";
      document.getElementById("passButton").removeAttribute("class", "disabled");
    }
    else if(event.target.innerHTML === "pass" && document.getElementById("drawButton").className === "disabled" && event.target.className !== "disabled") {
      //playableCardsPC = canPlay(computerHand, discardPile);
      computerTurn(computerHand, discardPile, deck, playerHand);
      event.target.className = "disabled";
      document.getElementById("playerWrapper").setAttribute("class", "disabled");
    }
  });
}

function playerStartTurn(playerHand, deck, discardPile, computerHand) {
  var elem = "playerHand";
  var num = null;
  if(discardPile[0].type === "Skip" && !(document.getElementById("discardPile").firstChild.classList.contains("disabled"))) {
    document.querySelector("#discardPile").firstChild.setAttribute("class", "card " + discardPile[0].color + " disabled");
    computerTurn(computerHand, discardPile, deck, playerHand);
  }
  else {
    document.getElementById("playerWrapper").removeAttribute("class", "disabled");
    document.getElementById("drawButton").removeAttribute("class", "disabled");
    if(discardPile[0].type === "Draw Two" && !(document.getElementById("discardPile").firstChild.classList.contains("disabled"))) {
      num = 2;
      drawMoreComputer(playerHand, deck, elem, num, discardPile);
    }
    else if(discardPile[0].type === "Wild Draw Four" && !(document.getElementById("discardPile").firstChild.classList.contains("disabled"))) {
      num = 4;
      drawMoreComputer(playerHand, deck, elem, num, discardPile);
    }
  }
}
/*
function playerStartTurn(playerHand, deck, discardPile, computerHand) {
  document.getElementById("playerWrapper").removeAttribute("class", "disabled");
  document.getElementById("drawButton").removeAttribute("class", "disabled");
  var elem = "playerHand";
  var num = 2;
  if(discardPile[0].type === "Draw Two" && !(document.getElementById("discardPile").firstChild.classList.contains("disabled"))) {
    drawMoreComputer(playerHand, deck, elem, num, discardPile);
    }
  else if(discardPile[0].type === "Wild Draw Four" && !(document.getElementById("discardPile").firstChild.classList.contains("disabled"))) {
    num = 4;
    drawMoreComputer(playerHand, deck, elem, num, discardPile);
    }
  else if(discardPile[0].type === "Skip" && !(document.getElementById("discardPile").firstChild.classList.contains("disabled"))) {
    document.querySelector("#discardPile").firstChild.setAttribute("class", "card " + discardPile[0].color + " disabled");
    computerTurn(computerHand, discardPile, deck, playerHand);
    }
}
*/
function drawMoreComputer(hand, deck, elem, num, discardPile) {
  for(var i = 0; i < num; i++) {
    hand.push(deck[i]);
  }
  var e = document.getElementById(elem);
    while(e.hasChildNodes()) {
      e.removeChild(e.lastChild);
    }
  displayHand(hand, elem);
    deck.splice(0, num);
    document.querySelector("#discardPile").firstChild.setAttribute("class", "card " + discardPile[0].color + " disabled");
  }

function computerTurn(hand, discardPile, deck, playerHand) {

  var playableCardsPC = canPlay(hand, discardPile);

  if(discardPile[0].type === "Draw Two" && !(document.getElementById("discardPile").firstChild.classList.contains("disabled"))) {
    setTimeout(initDrawTwo, 1000);
  }
  else if(discardPile[0].type === "Wild Draw Four" && !(document.getElementById("discardPile").firstChild.classList.contains("disabled"))) {
    setTimeout(initDrawFour, 1000);
  }
  else if(discardPile[0].type === "Skip" && !(document.getElementById("discardPile").firstChild.classList.contains("disabled"))) {
    document.querySelector("#discardPile").firstChild.setAttribute("class", "card " + discardPile[0].color + " disabled");
    playerStartTurn(playerHand, deck, discardPile, hand);
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
    drawMoreComputer(hand, deck, elem, num, discardPile);
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
    drawMoreComputer(hand, deck, elem, num, discardPile);
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
    hand.push(deck[0]);
    deck.splice(0, 1);
    var elem = "computerHand";
    var e = document.getElementById("computerHand");
    while(e.hasChildNodes()) {
      e.removeChild(e.lastChild);
    }
    displayHand(hand, elem);
    setTimeout(computerPlayCard, 1000);
  }
/*
  function computerPlayWild() {
    //var c = Math.floor(Date.now() / 1000);
    //console.log("C: chooses color of wild card " + c);
    document.querySelector("#discardPile").firstChild.setAttribute("class", "card " + colorsSorted[0]);
    discardPile[0].color = colorsSorted[0];
    playerStartTurn(playerHand, deck, discardPile, hand);
    //var d3 = Math.floor(Date.now() / 1000);
    //console.log("D3: turn ends - played a wild card " + d3);
  }
*/
  function CPC() {
    document.styleSheets[2].deleteRule(0);
    var elem = "computerHand";
    cPlayCard(playableCardsPC[0], discardPile, hand, elem);
    if(playableCardsPC[0].color === "Wild") {
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
        if(hand.length > 0) {
        playerStartTurn(playerHand, deck, discardPile, hand);
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
      }, 1000);
    }
    else if(hand.length > 0) {
      playerStartTurn(playerHand, deck, discardPile, hand);
      //var d2 = Math.floor(Date.now() / 1000);
      //console.log("D2: turn ends - played a card (not wild) " + d2);
    }
    else {
      var cardDiv = document.createElement("div");
        cardDiv.setAttribute("class", "placeholder");
        document.getElementById("computerHand").appendChild(cardDiv);
      setTimeout(function() {
        overlay();
        document.getElementById("gameOver").innerHTML = "The computer takes no joy in your loss.";
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
      playerStartTurn(playerHand, deck, discardPile, hand);
      //var d1 = Math.floor(Date.now() / 1000);
      //console.log("D1: turn ends - drew a card but had nothing to play" + d1);
    }
  }
}

function overlay() {
  document.getElementById("overlay").removeAttribute("class", "hidden");
}

makeCards();
/*setTimeout(function() {
overlay();
      document.getElementById("gameOver").innerHTML = "You won!";
      document.getElementById("gameOver").removeAttribute("class", "hidden");
    }, 1000);*/
/*overlay();
document.getElementById("gameOver").innerHTML = "The computer won.";*/
});