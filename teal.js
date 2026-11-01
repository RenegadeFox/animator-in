// Animator In.com Ask Teal
// Shows 5 loading screens, one after the other, then the last screen.

// ---------- Settings (change them here) ----------
var SECONDS_PER_SCREEN = 10; // how long each loading screen stays

// The words at the top of each loading screen, in order.
// The first screen has no words.
var LOADING_SCREEN_WORDS = [
  "",
  "Checking recommended",
  "Looking through shows and movies",
  "Finding the best fit",
  "Teal is thinking"
];

// ---------- Things on the page ----------
var loadingScreen = document.getElementById("loading-screen");
var loadingWords = document.getElementById("loading-words");
var nothingWatchedScreen = document.getElementById("nothing-watched-screen");

var currentScreenNumber = 0; // 0 is the first screen

// ---------- Loading screens ----------
// The animation keeps playing. Only the words change.
function showLoadingScreen(screenNumber) {
  loadingWords.textContent = LOADING_SCREEN_WORDS[screenNumber];
}

// The words fade out, change, and fade back in
function goToNextScreen() {
  currentScreenNumber++;

  // After the last loading screen, show the final screen
  if (currentScreenNumber >= LOADING_SCREEN_WORDS.length) {
    showNothingWatchedScreen();
    return;
  }

  loadingWords.classList.add("is-fading");
  setTimeout(function () {
    showLoadingScreen(currentScreenNumber);
    loadingWords.classList.remove("is-fading");
  }, 400);

  setTimeout(goToNextScreen, SECONDS_PER_SCREEN * 1000);
}

// ---------- Final screen ----------
// Nothing keeps track of what you have watched yet,
// so everyone gets the "you haven't watched anything" screen.
function showNothingWatchedScreen() {
  loadingScreen.hidden = true;
  nothingWatchedScreen.hidden = false;
}

// ---------- Start ----------
showLoadingScreen(0);
setTimeout(goToNextScreen, SECONDS_PER_SCREEN * 1000);
