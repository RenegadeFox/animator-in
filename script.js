// Animator In.com Login

// ---------- Settings (change the secret login here) ----------
var CORRECT_PASSWORD = "password!123";
var EMAIL_MUST_END_WITH = "mail.com"; // the email can be anything, but it has to end with this
var PORTAL_PAGE = "portal.html"; // the page you go to after a correct login
var WATCH_PAGE = "watch.html";   // the page you go to when you press Watch without logging in

// ---------- Things on the page ----------
var fullscreenButton = document.getElementById("fullscreen-button");
var fullscreenTip = document.getElementById("fullscreen-tip");
var loginForm = document.getElementById("login-form");
var watchButton = document.getElementById("watch-button");
var usernameInput = document.getElementById("username-input");
var passwordInput = document.getElementById("password-input");
var emailInput = document.getElementById("email-input");
var errorMessage = document.getElementById("error-message");

// ---------- Full screen button ----------
function isFullscreen() {
  return document.fullscreenElement || document.webkitFullscreenElement;
}

// Shows the help message for 8 seconds
function showFullscreenTip() {
  fullscreenTip.hidden = false;
  setTimeout(function () {
    fullscreenTip.hidden = true;
  }, 8000);
}

function toggleFullscreen() {
  try {
    var result;
    if (isFullscreen()) {
      var exit = document.exitFullscreen || document.webkitExitFullscreen;
      result = exit.call(document);
    } else {
      // iPad Safari only knows the "webkit" version of this
      var page = document.documentElement;
      var enter = page.requestFullscreen || page.webkitRequestFullscreen;
      if (!enter) {
        showFullscreenTip();
        return;
      }
      result = enter.call(page);
    }
    if (result && result.catch) {
      result.catch(showFullscreenTip);
    }
  } catch (error) {
    showFullscreenTip();
  }
}

// Changes the button words depending on whether we are in full screen
function updateFullscreenButtonText() {
  fullscreenButton.textContent = isFullscreen() ? "✕ Exit Full Screen" : "⛶ Full Screen";
}

fullscreenButton.addEventListener("click", toggleFullscreen);
document.addEventListener("fullscreenchange", updateFullscreenButtonText);
document.addEventListener("webkitfullscreenchange", updateFullscreenButtonText);

// ---------- Login form ----------
loginForm.addEventListener("submit", function (event) {
  event.preventDefault(); // stops the page from reloading

  // The password has to match exactly.
  // The email can be anything as long as it ends with "mail.com" (capital letters are OK).
  // What is typed in the username box does not matter for logging in,
  // but it is remembered as the name for your account.
  var passwordIsCorrect = passwordInput.value === CORRECT_PASSWORD;
  var emailIsCorrect = emailInput.value.trim().toLowerCase().endsWith(EMAIL_MUST_END_WITH);
  var loginIsCorrect = passwordIsCorrect && emailIsCorrect;

  if (loginIsCorrect) {
    clearAccountProfile();                // start a fresh profile
    saveAccountName(usernameInput.value); // an empty username means the Guest account
    window.location.href = PORTAL_PAGE;   // go to the new page
  } else {
    errorMessage.hidden = false;
  }
});

// ---------- Watch button (before logging in) ----------
watchButton.addEventListener("click", function () {
  clearAccountProfile(); // nobody logged in, so use the default Guest account
  window.location.href = WATCH_PAGE;
});
