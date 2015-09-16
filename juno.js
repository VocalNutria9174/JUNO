/* to do:
- update language in display cards section to use selectors
- change takeTurn function so that it's specific to the human player or structure so it will work for both

accomplishments/challenges:
replaced all jquery w/ vanilla javascript to handle interaction w/ the DOM

*/

$(document).ready(function() {

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
          //makeDeck("Reverse", color, "reverse" + color + (number += 1));
          //makeDeck("Reverse", color, "reverse" + color + (number += 1));
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
    cardDiv1.setAttribute("id", cards[i].id);
    var cardTextDiv1 = document.createElement("div");
    document.getElementById(cards[i].id).appendChild(cardTextDiv1);
    cardTextDiv1.setAttribute("class", "cardText");
    cardTextDiv1.innerHTML = cards[i].type;
    //if(element === "computerHand") {
    //  cardTextDiv1.innerHTML = "JUNO";
    //}
    //else {
      cardTextDiv1.innerHTML = cards[i].type;
    //}
  }
}
/*
function display(cards) { // Display cards
  switch(cards) {
  case computerHand:
    console.log(computerHand);
    var element = "computerHand";
    displayHand(cards, element);
    break;
  case playerHand:
    element = "playerHand";
    displayHand(cards, element);
    break;
  case discardPile:
    element = "discardPile";
    displayHand(cards, element);
    break;
  case playerHand[playerHand.length - 1]:
    var newPlayerCard = [];
    newPlayerCard.push(playerHand[playerHand.length - 1]);
    element = "playerHand";
    displayHand(newPlayerCard, element);
    break;
  case computerHand[computerHand.length - 1]:
    var newComputerCard = [];
    newComputerCard.push(computerHand[computerHand.length - 1]);
    element = "computerHand";
    displayHand(newComputerCard, element);
  }
}*/

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
  // Remove previous card from discard pile (array)
  discardPile.splice(1, 1);
  // Remove previous discard pile (DOM)
  document.querySelector("#discardPile").removeChild(document.querySelector("#discardPile").firstChild);
  // Add new discard pile (DOM)
  var elem = "discardPile";
  displayHand(discardPile, elem);
  // Remove clicked card from hand (array)
  for(var i = 0; i < hand.length; i++) {
    if(hand[i].id === card.id) {
      hand.splice(i, 1);
    }
  }
}

function playWild(computerHand, discardPile, deck) {
  document.getElementById("wild").removeAttribute("class", "hidden");
  document.getElementById("wild").onclick = function(event) {
    document.getElementById("wild").setAttribute("class", "hidden");
    document.querySelector("#discardPile").firstChild.setAttribute("class", "card " + event.target.innerHTML);
    discardPile[0].color = event.target.innerHTML;
    computerTurn(computerHand, discardPile, deck);
  };
}

function takeTurn(hand, discardPile, deck, computerHand) {
  document.querySelector("body").addEventListener("click", function(event) {
    //console.log(playerHand);
    var playableCardH = canPlay(hand, discardPile);
    if(event.target.parentNode.id === "playerHand" && document.getElementById("playerWrapper").className !== "disabled" && event.target.classList.contains("card")) {
      var clickCard = event.target.getAttribute("id");
      for(var i = 0; i < playableCardH.length; i++) {
        if(playableCardH[i].id === clickCard) {
          document.getElementById("playerWrapper").setAttribute("class", "disabled");
          document.getElementById("drawButton").setAttribute("class", "disabled");
          document.getElementById("passButton").setAttribute("class", "disabled");
          playCard(playableCardH[i], discardPile, hand);
          if(playableCardH[i].color === "Wild") {
            playWild(computerHand, discardPile, deck);
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
      var elem = "playerHand";
      var newPlayerCard = [];
      newPlayerCard.push(hand[hand.length - 1]);
      displayHand(newPlayerCard, elem);
      playableCardH = canPlay(hand, discardPile);
      event.target.className = "disabled";
      document.getElementById("passButton").removeAttribute("class", "disabled");
    }
    else if(event.target.innerHTML === "Pass" && document.getElementById("drawButton").className === "disabled" && event.target.className !== "disabled") {
      //playableCardsPC = canPlay(computerHand, discardPile);
      computerTurn(computerHand, discardPile, deck);
      event.target.className = "disabled";
      document.getElementById("playerWrapper").setAttribute("class", "disabled");
    }
  });
}

function computerTurn(hand, discardPile, deck) {
  var playableCardsPC = canPlay(hand, discardPile);
  /*setTimeout(funcx, 1000);
  function funcx() {
  if(discardPile[0].type === "Draw Two") {
            hand.push(deck[0]);
            deck.splice(0, 1);
            //display(hand[hand.length - 1]);
            hand.push(deck[0]);
            deck.splice(0, 1);
            elem = "computerHand";
            displayHand(hand, elem);
          }
        }*/
  setTimeout(func, 1200);
  function func() {
    if(playableCardsPC.length < 1) {
      hand.push(deck[0]);
      deck.splice(0, 1);
      var elem = "computerHand";
      var newComputerCard = [];
      newComputerCard.push(hand[hand.length - 1]);
      displayHand(newComputerCard, elem);
    }
  }
  setTimeout(func2, 2000);
  function func2() {
    playableCardsPC = canPlay(hand, discardPile);
    if(playableCardsPC.length > 0) {
      playCard(playableCardsPC[0], discardPile, hand);
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
          return handColors[x] - handColors[y];
        }).reverse();
        setTimeout(func3, 1000/*1000*/);
      }
    }
    function func3() {
    document.querySelector("#discardPile").firstChild.setAttribute("class", "card " + colorsSorted[0]);
    discardPile[0].color = colorsSorted[0];
  }
    console.log("ping");
    document.getElementById("playerWrapper").removeAttribute("class", "disabled");
    document.getElementById("drawButton").removeAttribute("class", "disabled");
  }
}

makeCards();
});