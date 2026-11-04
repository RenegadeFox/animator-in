// Animator In.com Video
// Plays one episode. Which one comes from the address, like
// play.html?id=avm&season=0&episode=0

var CREDIT_SECONDS = 5; // how long the tiny words stay before they fade
var SKIP_BUTTON_SECONDS = 5; // how long the Skip intro button stays before it fades
var SKIP_FADE_SECONDS = 1.5; // must match --fade-seconds in play.css

// ---------- Things on the page ----------
var player = document.getElementById("player");
var video = document.getElementById("video");
var credit = document.getElementById("credit");
var skipButton = document.getElementById("skip-button");
var backLink = document.getElementById("back-link");
var notFoundMessage = document.getElementById("not-found");

// ---------- Find the episode ----------
var params = new URLSearchParams(window.location.search);
var showId = params.get("id");
var seasonNumber = parseInt(params.get("season"), 10);
var episodeNumber = parseInt(params.get("episode"), 10);

var show = null;
var episode = null;
if (showId && Object.prototype.hasOwnProperty.call(SHOW_PAGES, showId)) {
  show = SHOW_PAGES[showId];
  var season = show.seasons[seasonNumber];
  if (season) {
    episode = season.episodes[episodeNumber] || null;
  }
}

// ---------- Start ----------
if (episode && episode.video) {
  // The Back button goes to the show page this episode is from
  backLink.href = "show.html?id=" + encodeURIComponent(showId);
  document.title = "Animator In.com " + episode.title;
  video.src = episode.video;

  // Autoplay can be blocked, and that is fine: the play button still works
  var tryPlaying = video.play();
  if (tryPlaying && tryPlaying.catch) {
    tryPlaying.catch(function () {});
  }

  // An episode counts as watched once you reach the half-way point
  var countedAsWatched = false;
  video.addEventListener("timeupdate", function () {
    if (!countedAsWatched && video.duration > 0 && video.currentTime >= video.duration / 2) {
      countedAsWatched = true;
      markEpisodeWatched(showId, seasonNumber, episodeNumber);
    }
  });

  // ---------- Continue watching ----------
  // We remember where you stopped, so you can carry on from there later.
  var SAVE_EVERY_SECONDS = 2;
  var MIN_SECONDS_TO_SAVE = 5;   // a few seconds in is not worth remembering
  var lastSavedAt = -100;
  var finishedPlaying = false;

  function rememberPlace() {
    if (finishedPlaying || !(video.duration > 0) || video.currentTime < MIN_SECONDS_TO_SAVE) {
      return;
    }
    saveEpisodeProgress(showId, seasonNumber, episodeNumber, video.currentTime, video.duration);
    lastSavedAt = video.currentTime;
  }

  video.addEventListener("timeupdate", function () {
    if (Math.abs(video.currentTime - lastSavedAt) >= SAVE_EVERY_SECONDS) {
      rememberPlace();
    }
  });
  video.addEventListener("pause", rememberPlace);
  window.addEventListener("pagehide", rememberPlace);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") {
      rememberPlace();
    }
  });

  // Jump to where you stopped (unless that was almost the end)
  var savedSeconds = getEpisodeProgressSeconds(showId, seasonNumber, episodeNumber);
  video.addEventListener("loadedmetadata", function () {
    if (savedSeconds > 0 && savedSeconds < video.duration - 5) {
      video.currentTime = savedSeconds;
    }
  });

  // Reaching the end means you finished it, so it leaves Continue watching
  video.addEventListener("ended", function () {
    finishedPlaying = true;
    markEpisodeWatched(showId, seasonNumber, episodeNumber);
    clearEpisodeProgress(showId, seasonNumber, episodeNumber);
  });

  // ---------- Skip intro ----------
  // At the "from" time the button appears for a few seconds, then fades away.
  // Pressing it jumps the video to the "to" time.
  var skipIntro = episode.skipIntro;
  if (skipIntro) {
    var skipAlreadyShown = false;
    var skipFadeTimer = null;
    var skipHideTimer = null;

    function hideSkipButton() {
      window.clearTimeout(skipFadeTimer);
      window.clearTimeout(skipHideTimer);
      skipButton.hidden = true;
      skipButton.classList.remove("fade-out");
    }

    function showSkipButton() {
      hideSkipButton();
      skipButton.hidden = false;
      skipFadeTimer = window.setTimeout(function () {
        skipButton.classList.add("fade-out");
        skipHideTimer = window.setTimeout(hideSkipButton, SKIP_FADE_SECONDS * 1000);
      }, SKIP_BUTTON_SECONDS * 1000);
    }

    video.addEventListener("timeupdate", function () {
      var time = video.currentTime;
      if (time >= skipIntro.from && time < skipIntro.to) {
        // Only shows when the video first gets to the start of the intro,
        // not when you jump into the middle of it
        if (!skipAlreadyShown && time < skipIntro.from + 2) {
          skipAlreadyShown = true;
          showSkipButton();
        }
      } else {
        skipAlreadyShown = false; // outside the intro, so it can show again next time
        hideSkipButton();
      }
    });

    skipButton.addEventListener("click", function () {
      hideSkipButton();
      video.currentTime = skipIntro.to;
    });
  }

  // Tiny credit words, then they fade away
  if (episode.credit) {
    credit.textContent = episode.credit; // textContent shows plain words only
    credit.hidden = false;
    window.setTimeout(function () {
      credit.classList.add("fade-out");
    }, CREDIT_SECONDS * 1000);
  }
} else {
  player.hidden = true;
  notFoundMessage.hidden = false;
}
