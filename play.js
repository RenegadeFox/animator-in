// Animator In.com Video
// Plays one episode. Which one comes from the address, like
// play.html?id=avm&season=0&episode=0

var CREDIT_SECONDS = 5; // how long the tiny words stay before they fade

// ---------- Things on the page ----------
var player = document.getElementById("player");
var video = document.getElementById("video");
var credit = document.getElementById("credit");
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
