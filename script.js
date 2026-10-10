// Animator In.com Login

// ---------- Settings (change the secret login here) ----------
var CORRECT_PASSWORD = "152df56hfji";
var CORRECT_EMAIL = "super awesome finnley dude12";

// ---------- Things on the page ----------
var fullscreenButton = document.getElementById("fullscreen-button");
var fullscreenTip = document.getElementById("fullscreen-tip");
var loginForm = document.getElementById("login-form");
var passwordInput = document.getElementById("password-input");
var emailInput = document.getElementById("email-input");
var successMessage = document.getElementById("success-message");
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

  // Needs the exact password and email, but ignores what is typed in the username
  var loginIsCorrect =
    passwordInput.value === CORRECT_PASSWORD && emailInput.value === CORRECT_EMAIL;

  successMessage.hidden = !loginIsCorrect;
  errorMessage.hidden = loginIsCorrect;
});
