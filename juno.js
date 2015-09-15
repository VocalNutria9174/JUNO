/* to do:
- update language in display cards section to use selectors
- change takeTurn function so that it's specific to the human player or structure so it will work for both

accomplishments/challenges:
replaced all jquery w/ vanilla javascript to handle interaction w/ the DOM

*/

$(document).ready(function() {
console.log(document);
document.body.setScaledFont = function(f) {
  var s = this.offsetWidth, fs = s * f;
  this.style.fontSize = fs + '%';
  return this;
};

document.body.setScaledFont(0.13);
window.onresize = function() {
    document.body.setScaledFont(0.13);
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
        makeDeck(String([x]), color, String([x]) + color + number);
        number += 1;
      }
      else {
        while(y < 2) {
          makeDeck(String([x]), color, String([x]) + color + number);
          number += 1;
          y += 1;
        }
        while(x === 9 && y < 3) {
          makeDeck("Draw Two", color, "drawTwo" + color + number);
          makeDeck("Draw Two", color, "drawTwo" + color + (number += 1));
          makeDeck("Reverse", color, "reverse" + color + (number += 1));
          makeDeck("Reverse", color, "reverse" + color + (number += 1));
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
  return deck;
}

function shuffleDeck(deck) { // Shuffle deck
  var i = deck.length;
  while(i) {
    var x = Math.floor(Math.random() * i--);
    var y = deck[i];
    deck[i] = deck[x];
    deck[x] = y;
  }
  return deck;
}

function dealComputer(deck) { // Deal cards to computer
  var computerHand = [];
  for(var i = 0; i < 14; i += 2) {
    computerHand.push(deck[i]);
  }
  return computerHand;
}

function dealPlayer(deck) { // Deal cards to player
  var playerHand = [];
  for(var i = 0; i < 14; i += 2) {
    playerHand.push(deck[i + 1]);
  }
  return playerHand;
}

function makeDiscardPile(deck) { // Make discard pile
  var discardPile = [];
  discardPile.push(deck[14]);
  return discardPile;
}

function displayCards(cards) { // Display cards
  switch(cards) {
  case computerHand:
    for(var i = 0; i < cards.length; i++) {
      var cardDiv1 = document.createElement("div");
      document.getElementById("computerHand").appendChild(cardDiv1);
      cardDiv1.setAttribute("class", "card " + cards[i].color);
      cardDiv1.setAttribute("id", cards[i].id);
      var cardTextDiv1 = document.createElement("div");
      document.getElementById(cards[i].id).appendChild(cardTextDiv1);
      cardTextDiv1.setAttribute("class", "cardText");
      cardTextDiv1.innerHTML = cards[i].type;
      //cardTextDiv1.innerHTML = "JUNO";
    }
    break;
  case playerHand:
    for(var x = 0; x < cards.length; x++) {
      var cardDiv2 = document.createElement("div");
      document.getElementById("playerHand").appendChild(cardDiv2);
      cardDiv2.setAttribute("class", "card " + cards[x].color);
      cardDiv2.setAttribute("id", cards[x].id);
      var cardTextDiv2 = document.createElement("div");
      document.getElementById(cards[x].id).appendChild(cardTextDiv2);
      cardTextDiv2.setAttribute("class", "cardText");
      cardTextDiv2.innerHTML = cards[x].type;
    }
    break;
  case discardPile:
      var cardDiv3 = document.createElement("div");
      document.getElementById("discardPile").appendChild(cardDiv3);
      cardDiv3.setAttribute("class", "card " + cards[0].color);
      cardDiv3.setAttribute("id", cards[0].id);
      var cardTextDiv3 = document.createElement("div");
      document.getElementById(cards[0].id).appendChild(cardTextDiv3);
      cardTextDiv3.setAttribute("class", "cardText");
      cardTextDiv3.innerHTML = cards[0].type;
    break;
  case playerHand[playerHand.length - 1]:
      var cardDiv4 = document.createElement("div");
      document.getElementById("playerHand").appendChild(cardDiv4);
      cardDiv4.setAttribute("class", "card " + playerHand[playerHand.length - 1].color);
      cardDiv4.setAttribute("id", playerHand[playerHand.length - 1].id);
      var cardTextDiv4 = document.createElement("div");
      document.getElementById(playerHand[playerHand.length - 1].id).appendChild(cardTextDiv4);
      cardTextDiv4.setAttribute("class", "cardText");
      cardTextDiv4.innerHTML = playerHand[playerHand.length - 1].type;
      break;
    case computerHand[computerHand.length - 1]:
    var cardDiv5 = document.createElement("div");
    document.getElementById("computerHand").appendChild(cardDiv5);
    cardDiv5.setAttribute("class", "card " + computerHand[computerHand.length - 1].color);
    cardDiv5.setAttribute("id", computerHand[computerHand.length - 1].id);
    var cardTextDiv5 = document.createElement("div");
    document.getElementById(computerHand[computerHand.length - 1].id).appendChild(cardTextDiv5);
    cardTextDiv5.setAttribute("class", "cardText");
    cardTextDiv5.innerHTML = computerHand[computerHand.length - 1].type;
    //cardTextDiv5.innerHTML = "JUNO";
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

function playCard(card, discardPile, hand) {
  // Remove clicked card from (DOM)
  var element = document.getElementById(card.id);
  element.parentNode.removeChild(element);
  // Move clicked card to top of discard pile (array)
  discardPile.unshift(card);
  // Remove previous discard pile (DOM)
  document.querySelector("#discardPile").removeChild(document.querySelector("#discardPile").firstChild);
  // Add new discard pile (DOM)
  displayCards(discardPile);
  // Remove clicked card from hand (array)
  for(var i = 0; i < hand.length; i++) {
    if(hand[i].id === card.id) {
      hand.splice(i, 1);
    }
  }
}

function playWild() {
  document.getElementById("wild").removeAttribute("class", "hidden");
  document.getElementById("wild").onclick = function(event) {
    document.getElementById("wild").setAttribute("class", "hidden");
    document.querySelector("#discardPile").firstChild.setAttribute("class", "card " + event.target.innerHTML);
    discardPile[0].color = event.target.innerHTML;
    computerTurn(computerHand, discardPile, deck);
  };
}

function takeTurn(hand, discardPile, deck) {
  document.querySelector("body").addEventListener("click", function(event) {
    var playableCardH = canPlay(playerHand, discardPile);
    if(event.target.parentNode.id === "playerHand" && document.getElementById("playerWrapper").className !== "disabled" && event.target.classList.contains("card")) {
      var clickCard = event.target.getAttribute("id");
      for(var i = 0; i < playableCardH.length; i++) {
        if(playableCardH[i].id === clickCard) {
          document.getElementById("playerWrapper").setAttribute("class", "disabled");
          document.getElementById("drawButton").setAttribute("class", "disabled");
          playCard(playableCardH[i], discardPile, hand);
          if(playableCardH[i].color === "Wild") {
            playWild();
          }
          else {
            computerTurn(computerHand, discardPile, deck);
          }
        }
      }
    }
    else if(event.target.innerHTML === "Draw" && event.target.className !== "disabled") {
      // Move card from front of deck to hand
      hand.push(deck[0]);
      deck.splice(0, 1);
      displayCards(hand[hand.length - 1]);
      playableCardH = canPlay(playerHand, discardPile);
      event.target.className = "disabled";
      document.getElementById("passButton").removeAttribute("class", "disabled");
    }
    else if(event.target.innerHTML === "Pass" && document.getElementById("drawButton").className === "disabled" && event.target.className !== "disabled") {
      //playableCardsPC = canPlay(computerHand, discardPile);
      computerTurn(computerHand, discardPile, deck);
      event.target.className = "disabled";
    }
  });
}

function computerTurn(hand, discardPile, deck) {
  var playableCardsPC = canPlay(computerHand, discardPile);
  setTimeout(func, 1000);
  function func() {
    if(playableCardsPC.length < 1) {
      hand.push(deck[0]);
      deck.splice(0, 1);
      displayCards(hand[hand.length - 1]);
    }
  }
  setTimeout(func2, 2000);
  function func2() {
    playableCardsPC = canPlay(computerHand, discardPile);
    if(playableCardsPC.length > 0) {
      playCard(playableCardsPC[0], discardPile, hand);
    }
    document.getElementById("playerWrapper").removeAttribute("class", "disabled");
    document.getElementById("drawButton").removeAttribute("class", "disabled");
  }
}

var deck = shuffleDeck(makeCards());
var computerHand = dealComputer(deck);
var playerHand = dealPlayer(deck);
var discardPile = makeDiscardPile(deck);
deck.splice(0, 15);
displayCards(computerHand);
displayCards(discardPile);
displayCards(playerHand);
takeTurn(playerHand, discardPile, deck);

});