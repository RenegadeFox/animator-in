// Animator In.com Watch
// The main screen: your profile, the shows and movies, Ask Teal, and the search bar.

var TEAL_PAGE = "teal.html"; // the page you go to when you press Ask Teal

// ---------- Things on the page ----------
var showRow = document.getElementById("show-row");
var noResultsMessage = document.getElementById("no-results");
var tealButton = document.getElementById("teal-button");
var statusMessage = document.getElementById("status-message");
var searchForm = document.getElementById("search-form");
var searchInput = document.getElementById("search-input");

// ---------- Your profile ----------
// textContent shows the name as plain words, so nothing sneaky can run
document.getElementById("account-name").textContent = getAccountName();

// The profile picture (Guest gets the default picture)
var avatarId = getAvatarId();
var profileImage = document.getElementById("profile-image");
profileImage.src = getAvatarFile(avatarId);
profileImage.alt = ""; // the name is right next to it

// The background you picked (nothing picked means the normal dark page)
var backgroundCss = backgroundToCss(getBackgroundSetting());
if (backgroundCss) {
  document.body.style.background = backgroundCss;
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundSize = "cover";
}

// ---------- Messages ----------
function showStatusMessage(words) {
  statusMessage.textContent = words;
  statusMessage.hidden = false;
}

// ---------- Shows and movies ----------
// Every show is a button with its picture. We keep each button next to its title.
var posterButtons = [];

SHOWS.forEach(function (show) {
  var button = document.createElement("button");
  button.type = "button";
  button.className = "show-poster";
  button.title = show.title;

  var image = document.createElement("img");
  image.src = show.image;
  image.alt = show.title;
  image.draggable = false;

  button.addEventListener("click", function () {
    if (show.page) {
      window.location.href = show.page; // shows with their own page open it
    } else {
      showStatusMessage("“" + show.title + "” is coming soon!");
    }
  });

  button.appendChild(image);
  showRow.appendChild(button);
  posterButtons.push({ title: show.title, button: button });
});

// ---------- Search ----------
// Shows only the shows whose title has the words you typed (capital letters don't matter)
function searchShows() {
  var words = searchInput.value.trim().toLowerCase();
  var foundCount = 0;

  posterButtons.forEach(function (poster) {
    var matches = poster.title.toLowerCase().indexOf(words) !== -1;
    poster.button.hidden = !matches;
    if (matches) {
      foundCount++;
    }
  });

  noResultsMessage.hidden = foundCount > 0;
}

searchInput.addEventListener("input", searchShows);

// Pressing Enter should not reload the page
searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  searchShows();
});

// ---------- Continue watching ----------
var continueSection = document.getElementById("continue-section");
var continueList = document.getElementById("continue-list");

// Turns seconds into words like 5:12
function formatTime(totalSeconds) {
  var minutes = Math.floor(totalSeconds / 60);
  var seconds = totalSeconds % 60;
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

// Builds the "Continue watching" list from the places you stopped (newest first)
function showContinueWatching() {
  continueList.textContent = ""; // empties the list
  var count = 0;

  getProgressList().reverse().forEach(function (progress) {
    // Only shows episodes that really exist in shows.js
    if (!Object.prototype.hasOwnProperty.call(SHOW_PAGES, progress.showId)) {
      return;
    }
    var show = SHOW_PAGES[progress.showId];
    var season = show.seasons[progress.season];
    var episode = season && season.episodes[progress.episode];
    if (!episode || !episode.video) {
      return;
    }

    var item = document.createElement("li");
    item.className = "continue-item";

    // The picture and words: press them to carry on watching
    var playLink = document.createElement("a");
    playLink.className = "continue-play";
    playLink.href = "play.html?id=" + encodeURIComponent(progress.showId) +
      "&season=" + progress.season + "&episode=" + progress.episode;

    var thumbnailBox = document.createElement("span");
    thumbnailBox.className = "continue-thumbnail-box";
    var thumbnail = document.createElement("img");
    thumbnail.className = "continue-thumbnail";
    thumbnail.src = episode.thumbnail;
    thumbnail.alt = "";
    thumbnail.draggable = false;

    // The blue bar along the bottom shows how far you got
    var bar = document.createElement("span");
    bar.className = "continue-bar";
    var barFill = document.createElement("span");
    barFill.className = "continue-bar-fill";
    var percent = Math.min(100, Math.round((progress.seconds / progress.duration) * 100));
    barFill.style.width = percent + "%";
    bar.appendChild(barFill);
    thumbnailBox.appendChild(thumbnail);
    thumbnailBox.appendChild(bar);

    // textContent shows plain words only
    var words = document.createElement("span");
    words.className = "continue-words";
    var showName = document.createElement("span");
    showName.className = "continue-show-name";
    showName.textContent = show.title;
    var episodeName = document.createElement("span");
    episodeName.className = "continue-episode-name";
    episodeName.textContent = (progress.episode + 1) + ". " + episode.title;
    var timeLeft = document.createElement("span");
    timeLeft.className = "continue-time";
    timeLeft.textContent = formatTime(progress.seconds) + " of " + formatTime(progress.duration);
    words.appendChild(showName);
    words.appendChild(episodeName);
    words.appendChild(timeLeft);

    playLink.appendChild(thumbnailBox);
    playLink.appendChild(words);

    // "Finished" counts it as watched and takes it off the list
    var finishedButton = document.createElement("button");
    finishedButton.type = "button";
    finishedButton.className = "finished-button";
    finishedButton.textContent = "Finished";
    finishedButton.setAttribute("aria-label", "Finished " + show.title + " " + episodeName.textContent);
    finishedButton.addEventListener("click", function () {
      markEpisodeWatched(progress.showId, progress.season, progress.episode);
      clearEpisodeProgress(progress.showId, progress.season, progress.episode);
      showContinueWatching();
    });

    item.appendChild(playLink);
    item.appendChild(finishedButton);
    continueList.appendChild(item);
    count++;
  });

  continueSection.hidden = count === 0;
}

showContinueWatching();

// Coming back with the Back button can show an old copy of this page, so redo the list
window.addEventListener("pageshow", showContinueWatching);

// ---------- Ask Teal ----------
tealButton.addEventListener("click", function () {
  window.location.href = TEAL_PAGE; // the Ask Teal loading screens
});
