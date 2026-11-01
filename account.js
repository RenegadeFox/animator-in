// Animator In.com Account
// Remembers which account name is being used while you move between pages.
// (It is saved in the browser for this tab only, and it goes away when you close the tab.)

var DEFAULT_ACCOUNT_NAME = "Guest"; // used when nobody logged in
var MAX_ACCOUNT_NAME_LENGTH = 20;
var ACCOUNT_STORAGE_KEY = "animatorInAccountName";

// Removes extra spaces and cuts the name down if it is too long
function cleanAccountName(name) {
  return String(name || "").trim().slice(0, MAX_ACCOUNT_NAME_LENGTH);
}

// Gives back the saved name, or "Guest" if there isn't one
function getAccountName() {
  try {
    var savedName = cleanAccountName(sessionStorage.getItem(ACCOUNT_STORAGE_KEY));
    return savedName || DEFAULT_ACCOUNT_NAME;
  } catch (error) {
    return DEFAULT_ACCOUNT_NAME;
  }
}

// Saves a name. If the name is empty, it forgets the old one instead.
function saveAccountName(name) {
  var cleanName = cleanAccountName(name);
  if (!cleanName) {
    clearAccountName();
    return;
  }
  try {
    sessionStorage.setItem(ACCOUNT_STORAGE_KEY, cleanName);
  } catch (error) {
    // Some browsers block saving. Then the page just uses "Guest".
  }
}

function clearAccountName() {
  try {
    sessionStorage.removeItem(ACCOUNT_STORAGE_KEY);
  } catch (error) {
    // Nothing to do
  }
}
