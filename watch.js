// Animator In.com Watch
// Shows which account is watching: the name, the picture and the background.

// textContent shows the name as plain words, so nothing sneaky can run
document.getElementById("account-name").textContent = getAccountName();

// The profile picture (Guest gets the default picture)
var avatarId = getAvatarId();
var profileImage = document.getElementById("profile-image");
profileImage.src = getAvatarFile(avatarId);
profileImage.alt = getAvatarLabel(avatarId);

// The background you picked (nothing picked means the normal dark page)
var backgroundCss = backgroundToCss(getBackgroundSetting());
if (backgroundCss) {
  document.body.style.background = backgroundCss;
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundSize = "cover";
}
