// Animator In.com Privacy Policy
// The Back button goes to the page you came from (the login page or the watch page).
// If we can't tell, it goes to the login page.

var backLink = document.getElementById("back-link");

try {
  var cameFrom = new URL(document.referrer);
  // Only go back to pages on this same site
  if (document.referrer && cameFrom.origin === window.location.origin &&
      cameFrom.pathname !== window.location.pathname) {
    backLink.href = cameFrom.href;
  }
} catch (error) {
  // No referrer, so the Back button stays on its normal link (the login page)
}

// ---------- The Cookie Man ----------
var cookieAnswer = document.getElementById("cookie-answer");
var cookieMan = document.getElementById("cookie-man");
var touchOverlay = document.getElementById("touch-overlay");
var touchText = document.getElementById("touch-text");

// Settings (change them here)
var POKES_TO_MUNCH = 10;         // this many fast pokes and he gets eaten
var MAX_SECONDS_BETWEEN = 1.5;   // slower than this and the count starts over
var MUNCH_SECONDS = 3;           // how long "munch munch munch" stays
// How big the words are (in "vmin", a part of the screen) after each poke.
// By the 6th poke the words are repeated so they fill the whole screen.
var TEXT_SIZES = [0, 4, 6, 9, 13, 18, 25, 34, 45, 60];

var pokeCount = 0;
var eating = false;
var resetTimer = null;
var munchTimer = null;

function answerCookieMan(words) {
  cookieAnswer.textContent = words;
  cookieAnswer.hidden = false;
}

// Puts a phrase on the screen (textContent shows plain words only)
function showTouchText(phrase, size, repeat) {
  var words = [];
  for (var i = 0; i < repeat; i++) {
    words.push(phrase);
  }
  touchText.textContent = words.join(" ");
  touchText.style.fontSize = size + "vmin";
  touchOverlay.hidden = false;
}

function hideTouchText() {
  touchOverlay.hidden = true;
  touchText.textContent = "";
}

// Starts over: small cookie man, no big words
function resetPokes() {
  pokeCount = 0;
  hideTouchText();
}

function showCookieMan() {
  window.clearTimeout(resetTimer);
  window.clearTimeout(munchTimer);
  eating = false;
  resetPokes();
  cookieMan.classList.remove("is-eaten");
  cookieMan.hidden = false;
}

function hideCookieMan() {
  window.clearTimeout(resetTimer);
  window.clearTimeout(munchTimer);
  eating = false;
  resetPokes();
  cookieMan.hidden = true;
}

// The 10th fast poke: munch munch munch, and then he disappears
function munchAndVanish() {
  eating = true;
  window.clearTimeout(resetTimer);
  cookieMan.classList.add("is-eaten");
  showTouchText("MUNCH MUNCH MUNCH", 14, 1);
  munchTimer = window.setTimeout(hideCookieMan, MUNCH_SECONDS * 1000);
}

cookieMan.addEventListener("click", function () {
  if (eating) {
    return;
  }
  pokeCount++;
  window.clearTimeout(resetTimer);

  if (pokeCount >= POKES_TO_MUNCH) {
    munchAndVanish();
    return;
  }

  // Make the cookie squish a little each time
  cookieMan.classList.remove("is-poked");
  void cookieMan.offsetWidth; // lets the squish play again
  cookieMan.classList.add("is-poked");

  // The more pokes, the bigger the words (the biggest ones fill the screen)
  var repeat = pokeCount >= 6 ? 40 : 1;
  showTouchText("STOP TOUCHING ME", TEXT_SIZES[pokeCount], repeat);

  // Too slow? Then the count starts over
  resetTimer = window.setTimeout(resetPokes, MAX_SECONDS_BETWEEN * 1000);
});

document.getElementById("cookie-yes").addEventListener("click", function () {
  answerCookieMan("Great choice! Your cookie man is on his way. (He is not real. Please do not wait by the door.)");
  showCookieMan();
});

document.getElementById("cookie-no").addEventListener("click", function () {
  answerCookieMan("Okay! We still will not throw milk at you.");
  hideCookieMan();
});
