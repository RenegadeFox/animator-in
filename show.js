// Animator In.com Show
// The page for one show: the banner, the name, the seasons and the episodes.
// Which show it is comes from the address, like show.html?id=avm

// ---------- Things on the page ----------
var banner = document.getElementById("banner");
var bannerImage = document.getElementById("banner-image");
var showTitle = document.getElementById("show-title");
var seasonSection = document.getElementById("season-section");
var seasonList = document.getElementById("season-list");
var episodeList = document.getElementById("episode-list");
var statusMessage = document.getElementById("status-message");
var notFoundMessage = document.getElementById("not-found");

// ---------- Find the show ----------
var showId = new URLSearchParams(window.location.search).get("id");
var show = null;
if (showId && Object.prototype.hasOwnProperty.call(SHOW_PAGES, showId)) {
  show = SHOW_PAGES[showId];
}

// ---------- Episodes ----------
function showStatusMessage(words) {
  statusMessage.textContent = words;
  statusMessage.hidden = false;
}

// Puts the episodes of one season on the page
function showEpisodes(season, seasonIndex) {
  episodeList.textContent = ""; // empties the list

  season.episodes.forEach(function (episode, index) {
    var item = document.createElement("li");

    var button = document.createElement("button");
    button.type = "button";
    button.className = "episode";

    var thumbnail = document.createElement("img");
    thumbnail.className = "episode-thumbnail";
    thumbnail.src = episode.thumbnail;
    thumbnail.alt = "";
    thumbnail.draggable = false;

    // Episodes are numbered in order: 1. The rediscovery
    var title = document.createElement("span");
    title.className = "episode-title";
    title.textContent = (index + 1) + ". " + episode.title; // textContent shows plain words only

    button.addEventListener("click", function () {
      if (episode.video) {
        // Opens the video page for this exact episode
        window.location.href = "play.html?id=" + encodeURIComponent(showId) +
          "&season=" + seasonIndex + "&episode=" + index;
      } else {
        showStatusMessage("“" + episode.title + "” is coming soon!");
      }
    });

    button.appendChild(thumbnail);
    button.appendChild(title);
    item.appendChild(button);
    episodeList.appendChild(item);
  });
}

// ---------- Seasons ----------
function showSeasons() {
  var seasonButtons = [];

  show.seasons.forEach(function (season, index) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "season-button";
    button.setAttribute("aria-pressed", index === 0 ? "true" : "false");

    var inner = document.createElement("span");
    inner.className = "season-button-inner";
    inner.textContent = season.name;
    button.appendChild(inner);

    button.addEventListener("click", function () {
      seasonButtons.forEach(function (other) {
        other.setAttribute("aria-pressed", other === button ? "true" : "false");
      });
      statusMessage.hidden = true;
      showEpisodes(season, index);
    });

    seasonButtons.push(button);
    seasonList.appendChild(button);
  });

  showEpisodes(show.seasons[0], 0); // starts on the first season
}

// ---------- Start ----------
if (show) {
  document.title = "Animator In.com " + show.title;
  bannerImage.src = show.banner;
  bannerImage.alt = show.title;
  showTitle.textContent = show.title;
  if (show.seasons.length > 0) {
    showSeasons();
  } else {
    seasonSection.hidden = true; // no episodes yet, so no season button or list
  }
} else {
  banner.classList.add("no-picture"); // keeps room for the Back button
  bannerImage.hidden = true;
  showTitle.hidden = true;
  seasonSection.hidden = true;
  notFoundMessage.hidden = false;
}
