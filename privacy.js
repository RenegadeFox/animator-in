// Animator In.com Privacy Policy
// The Back button goes to the page you came from (the login page or the watch page).
// If we can't tell, it goes to the login page.

var backLink = document.getElementById("back-link");

try {
  var cameFrom = new URL(document.referrer);
  // Only go back to pages on this same site
  if (document.referrer && cameFrom.origin === window.location.origin &&
      cameFrom.pathname !== window.location.pathname) {
    backLink.href = cameFrom.href;
  }
} catch (error) {
  // No referrer, so the Back button stays on its normal link (the login page)
}
