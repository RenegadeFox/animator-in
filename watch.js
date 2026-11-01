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
    showStatusMessage("“" + show.title + "” is coming soon!");
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

// ---------- Ask Teal ----------
tealButton.addEventListener("click", function () {
  window.location.href = TEAL_PAGE; // the Ask Teal loading screens
});
