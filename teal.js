// Animator In.com Ask Teal
// Shows 5 loading screens, one after the other, then the screens where Teal
// tells you what to watch.

// ---------- Settings (change them here) ----------
var SECONDS_PER_SCREEN = 5; // how long each loading screen stays
var SECONDS_PER_RESULT = 5; // how long the first Teal screen stays before the next one

// The words at the top of each loading screen, in order.
// The first screen has no words.
var LOADING_SCREEN_WORDS = [
  "",
  "Checking recommended",
  "Looking through shows and movies",
  "Finding the best fit",
  "Teal is thinking"
];

// The words on the screens after loading, for when you have not watched anything.
// The last screen stays until you press "Back to shows".
var NOTHING_WATCHED_WORDS = [
  "Since you watched… u haven’t watched anything",
  "I would recommend watching something"
];

// ---------- Things on the page ----------
var loadingScreen = document.getElementById("loading-screen");
var loadingWords = document.getElementById("loading-words");
var resultScreen = document.getElementById("result-screen");
var resultWords = document.getElementById("result-words");

var currentScreenNumber = 0; // 0 is the first loading screen
var currentResultNumber = 0; // 0 is the first Teal screen

// ---------- Loading screens ----------
// The animation keeps playing. Only the words change.
function showLoadingScreen(screenNumber) {
  loadingWords.textContent = LOADING_SCREEN_WORDS[screenNumber];
}

// The words fade out, change, and fade back in
function goToNextLoadingScreen() {
  currentScreenNumber++;

  // After the last loading screen, show what Teal says
  if (currentScreenNumber >= LOADING_SCREEN_WORDS.length) {
    showResultScreens();
    return;
  }

  loadingWords.classList.add("is-fading");
  setTimeout(function () {
    showLoadingScreen(currentScreenNumber);
    loadingWords.classList.remove("is-fading");
  }, 400);

  setTimeout(goToNextLoadingScreen, SECONDS_PER_SCREEN * 1000);
}

// ---------- Teal tells you what to watch ----------
// Nothing keeps track of what you have watched yet,
// so everyone gets the "you haven't watched anything" screens.
function showResultScreens() {
  loadingScreen.hidden = true;
  resultScreen.hidden = false;
  resultWords.textContent = NOTHING_WATCHED_WORDS[0];
  setTimeout(goToNextResultScreen, SECONDS_PER_RESULT * 1000);
}

function goToNextResultScreen() {
  currentResultNumber++;
  if (currentResultNumber >= NOTHING_WATCHED_WORDS.length) {
    return; // the last screen stays
  }

  resultWords.classList.add("is-fading");
  setTimeout(function () {
    resultWords.textContent = NOTHING_WATCHED_WORDS[currentResultNumber];
    resultWords.classList.remove("is-fading");
  }, 400);

  setTimeout(goToNextResultScreen, SECONDS_PER_RESULT * 1000);
}

// ---------- Start ----------
showLoadingScreen(0);
setTimeout(goToNextLoadingScreen, SECONDS_PER_SCREEN * 1000);
