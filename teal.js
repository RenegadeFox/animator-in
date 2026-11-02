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

// What Teal says when you HAVE watched something. It goes by the show you watched
// most recently (the id is the one in shows.js, like "avm").
//   watchedName   - the show's name, used in "Since you watched…"
//   recommendations - Teal picks one of these at random each time.
//                     "title" is the show Teal recommends, "reason" goes under it.
var RECOMMENDATIONS = {
  avm: {
    watchedName: "Animation versus Minecraft",
    recommendations: [
      {
        title: "Animation versus Minecraft the Original",
        reason: "It shows what happened before Season 1. If you want to know what all " +
          "those flashbacks mean, I would suggest watching Animation versus Minecraft the Original."
      },
      {
        title: "Green, Influencer Arc",
        reason: "It’s where Green wants to make a video and become an influencer on " +
          "YouTube and eventually other platforms."
      },
      {
        title: "Animation versus Animator, Victim",
        reason: "It’s the continuation of the first one, called Virus, and it’s one of " +
          "the other main Alan Becker series along with Animation versus Minecraft."
      }
    ]
  }
};

// ---------- Things on the page ----------
var loadingScreen = document.getElementById("loading-screen");
var loadingWords = document.getElementById("loading-words");
var resultScreen = document.getElementById("result-screen");
var resultText = document.getElementById("result-text");
var resultWords = document.getElementById("result-words");
var resultReason = document.getElementById("result-reason");

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
// Each screen is the big words and (maybe) a smaller reason under them.
var resultScreens = [];

// Works out which Teal screens to show, using what you have watched
function pickResultScreens() {
  var watchedId = getMostRecentWatchedShowId();

  // Watched something, and Teal knows what to say about it
  if (watchedId && Object.prototype.hasOwnProperty.call(RECOMMENDATIONS, watchedId)) {
    var info = RECOMMENDATIONS[watchedId];
    var choice = info.recommendations[Math.floor(Math.random() * info.recommendations.length)];
    return [
      { words: "Since you watched " + info.watchedName + "…", reason: "" },
      { words: "I would recommend " + choice.title, reason: choice.reason }
    ];
  }

  // Not watched anything
  return NOTHING_WATCHED_WORDS.map(function (words) {
    return { words: words, reason: "" };
  });
}

// textContent shows plain words only
function showResultScreen(screen) {
  resultWords.textContent = screen.words;
  resultReason.textContent = screen.reason;
  resultReason.hidden = !screen.reason;
}

function showResultScreens() {
  resultScreens = pickResultScreens();
  loadingScreen.hidden = true;
  resultScreen.hidden = false;
  showResultScreen(resultScreens[0]);
  setTimeout(goToNextResultScreen, SECONDS_PER_RESULT * 1000);
}

function goToNextResultScreen() {
  currentResultNumber++;
  if (currentResultNumber >= resultScreens.length) {
    return; // the last screen stays
  }

  resultText.classList.add("is-fading");
  setTimeout(function () {
    showResultScreen(resultScreens[currentResultNumber]);
    resultText.classList.remove("is-fading");
  }, 400);

  setTimeout(goToNextResultScreen, SECONDS_PER_RESULT * 1000);
}

// ---------- Start ----------
showLoadingScreen(0);
setTimeout(goToNextLoadingScreen, SECONDS_PER_SCREEN * 1000);
