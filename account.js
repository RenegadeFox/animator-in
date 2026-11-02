// Animator In.com Account
// Remembers which account is being used while you move between pages:
// the name, the profile picture, and the background.
// (It is saved in the browser for this tab only, and it goes away when you close the tab.)

var DEFAULT_ACCOUNT_NAME = "Guest"; // used when nobody logged in
var MAX_ACCOUNT_NAME_LENGTH = 20;
var ACCOUNT_STORAGE_KEY = "animatorInAccountName";
var AVATAR_STORAGE_KEY = "animatorInAvatar";
var BACKGROUND_STORAGE_KEY = "animatorInBackground";
var WATCHED_STORAGE_KEY = "animatorInWatched";

// ---------- Profile pictures ----------
// The "id" is the file name inside images/avatars/ (without .webp).
// To add a new picture: put the file in images/avatars/ and add a line here.
var AVATARS = [
  { id: "blue-smiley", label: "Blue stick figure with a >:P face" },
  { id: "yellow-thinking", label: "Yellow stick figure thinking" },
  { id: "red-cat", label: "Red stick figure with cat ears" },
  { id: "green-sunglasses", label: "Green stick figure with sunglasses" },
  { id: "yellow-command-block", label: "Yellow stick figure next to a command block sign" },
  { id: "red-headband", label: "Red stick figure with a yellow headband" },
  { id: "purple-angel-sword", label: "Purple stick figure with wings and a golden sword" },
  { id: "light-blue-waving", label: "Light blue stick figure waving" },
  { id: "purple-mountain", label: "Purple stick figure in front of a mountain" },
  { id: "king-orange-staff", label: "Orange stick figure with a crown and a command block staff" },
  { id: "purple", label: "Purple stick figure" },
  { id: "orange-green-glow", label: "Orange stick figure with green glowing lines" },
  { id: "orange", label: "Orange stick figure" },
  { id: "orange-blade", label: "Orange stick figure with a blade" },
  { id: "pig-armor", label: "Pig in diamond armor with wings" }
];
var DEFAULT_AVATAR_ID = "light-blue-waving"; // the Guest picture

// ---------- Backgrounds ----------
// "css" is what the browser uses to paint the background.
var SOLID_BACKGROUNDS = [
  { id: "red", label: "Red", css: "#e53935" },
  { id: "orange", label: "Orange", css: "#fb8c00" },
  { id: "yellow", label: "Yellow", css: "#fdd835" },
  { id: "green", label: "Green", css: "#43a047" },
  { id: "blue", label: "Blue", css: "#1e88e5" },
  { id: "purple", label: "Purple", css: "#8e24aa" },
  { id: "pink", label: "Pink", css: "#ec407a" },
  { id: "gray", label: "Gray", css: "#546e7a" }
];
var GRADIENT_BACKGROUNDS = [
  { id: "sunset", label: "Sunset", css: "linear-gradient(135deg, #ff9a3c, #ff3d77, #7b2ff7)" },
  { id: "ocean", label: "Ocean", css: "linear-gradient(135deg, #00c6ff, #0072ff)" },
  { id: "forest", label: "Forest", css: "linear-gradient(135deg, #11998e, #38ef7d)" },
  { id: "fire", label: "Fire", css: "linear-gradient(135deg, #f12711, #f5af19)" },
  { id: "sky", label: "Sky", css: "linear-gradient(180deg, #5bc8f5, #f0e84a)" },
  { id: "candy", label: "Cotton candy", css: "linear-gradient(135deg, #ff9a9e, #a18cd1)" },
  { id: "night", label: "Night", css: "linear-gradient(135deg, #0f2027, #2c5364, #41295a)" },
  { id: "rainbow", label: "Rainbow", css: "linear-gradient(135deg, #e53935, #fb8c00, #fdd835, #43a047, #1e88e5, #8e24aa)" }
];

var HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;

// ---------- Saving and loading (safe even if the browser blocks saving) ----------
function readSaved(key) {
  try {
    return sessionStorage.getItem(key) || "";
  } catch (error) {
    return "";
  }
}

function writeSaved(key, value) {
  try {
    if (value) {
      sessionStorage.setItem(key, value);
    } else {
      sessionStorage.removeItem(key);
    }
  } catch (error) {
    // Some browsers block saving. Then the page just uses the defaults.
  }
}

// ---------- Name ----------

// Removes extra spaces and cuts the name down if it is too long
function cleanAccountName(name) {
  return String(name || "").trim().slice(0, MAX_ACCOUNT_NAME_LENGTH);
}

// Gives back the saved name, or "Guest" if there isn't one
function getAccountName() {
  return cleanAccountName(readSaved(ACCOUNT_STORAGE_KEY)) || DEFAULT_ACCOUNT_NAME;
}

// Saves a name. If the name is empty, it forgets the old one instead.
function saveAccountName(name) {
  writeSaved(ACCOUNT_STORAGE_KEY, cleanAccountName(name));
}

function clearAccountName() {
  writeSaved(ACCOUNT_STORAGE_KEY, "");
}

// ---------- Profile picture ----------
function findAvatar(id) {
  for (var i = 0; i < AVATARS.length; i++) {
    if (AVATARS[i].id === id) {
      return AVATARS[i];
    }
  }
  return null;
}

// The picture that was picked, or "" if nothing was picked yet
function getSavedAvatarId() {
  var savedId = readSaved(AVATAR_STORAGE_KEY);
  return findAvatar(savedId) ? savedId : "";
}

// The picture that was picked, or the Guest picture
function getAvatarId() {
  return getSavedAvatarId() || DEFAULT_AVATAR_ID;
}

function saveAvatarId(id) {
  writeSaved(AVATAR_STORAGE_KEY, findAvatar(id) ? id : "");
}

function getAvatarFile(id) {
  return "images/avatars/" + id + ".webp";
}

function getAvatarLabel(id) {
  var avatar = findAvatar(id);
  return avatar ? avatar.label : "";
}

// ---------- Background ----------
// A background is saved as words:
//   "preset:sunset"          one of the backgrounds above
//   "custom:#ff0000"         one color you made yourself
//   "custom:#ff0000:#0000ff" two colors you made yourself (a gradient)
function findBackground(id) {
  var all = SOLID_BACKGROUNDS.concat(GRADIENT_BACKGROUNDS);
  for (var i = 0; i < all.length; i++) {
    if (all[i].id === id) {
      return all[i];
    }
  }
  return null;
}

// Turns the saved words into CSS. Gives back "" if there is nothing (or it is not valid).
function backgroundToCss(setting) {
  var parts = String(setting || "").split(":");

  if (parts[0] === "preset") {
    var preset = findBackground(parts[1]);
    return preset ? preset.css : "";
  }

  if (parts[0] === "custom" && HEX_COLOR_PATTERN.test(parts[1] || "")) {
    if (parts.length === 2) {
      return parts[1];
    }
    if (parts.length === 3 && HEX_COLOR_PATTERN.test(parts[2])) {
      return "linear-gradient(135deg, " + parts[1] + ", " + parts[2] + ")";
    }
  }

  return "";
}

function getBackgroundSetting() {
  var setting = readSaved(BACKGROUND_STORAGE_KEY);
  return backgroundToCss(setting) ? setting : "";
}

function saveBackgroundSetting(setting) {
  writeSaved(BACKGROUND_STORAGE_KEY, backgroundToCss(setting) ? setting : "");
}

// ---------- Start over ----------
// Forgets the name, the picture and the background (back to Guest)
// ---------- What you have watched ----------
// An episode counts as watched when you get to the HALF-way point of the video,
// even if you stop after that. Each one is saved like  avm:0:1
// (show id : season number : episode number, counting from 0).
var WATCHED_FORMAT = /^[a-z0-9-]+:\d+:\d+$/;

// Gives back the list of watched episodes, like ["avm:0:0", "avm:0:1"]
function getWatchedEpisodes() {
  var saved = readSaved(WATCHED_STORAGE_KEY);
  if (!saved) {
    return [];
  }
  return saved.split(",").filter(function (item) {
    return WATCHED_FORMAT.test(item); // ignores anything that does not look right
  });
}

// Saves one episode as watched. The list keeps the newest at the end, so a
// show you watch again moves to the end (the same episode is never saved twice).
function markEpisodeWatched(showId, seasonNumber, episodeNumber) {
  var item = showId + ":" + seasonNumber + ":" + episodeNumber;
  if (!WATCHED_FORMAT.test(item)) {
    return;
  }
  var list = getWatchedEpisodes().filter(function (other) {
    return other !== item;
  });
  list.push(item);
  writeSaved(WATCHED_STORAGE_KEY, list.join(","));
}

// Gives back the id of the show you watched most recently (or "" if none)
function getMostRecentWatchedShowId() {
  var list = getWatchedEpisodes();
  if (list.length === 0) {
    return "";
  }
  return list[list.length - 1].split(":")[0];
}

// Gives back the ids of the shows you have watched at least one episode of
function getWatchedShowIds() {
  var ids = [];
  getWatchedEpisodes().forEach(function (item) {
    var id = item.split(":")[0];
    if (ids.indexOf(id) === -1) {
      ids.push(id);
    }
  });
  return ids;
}

function clearAccountProfile() {
  clearAccountName();
  writeSaved(WATCHED_STORAGE_KEY, "");
  writeSaved(AVATAR_STORAGE_KEY, "");
  writeSaved(BACKGROUND_STORAGE_KEY, "");
}
