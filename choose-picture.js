// Animator In.com Choose Picture
// Shows all the profile pictures and lets you pick one.

var BACKGROUND_PAGE = "choose-background.html"; // the next page

// ---------- Things on the page ----------
var avatarGrid = document.getElementById("avatar-grid");
var pictureForm = document.getElementById("picture-form");
var nextButton = document.getElementById("next-button");

// The picture that is picked right now ("" means none yet)
var selectedAvatarId = getSavedAvatarId();

// ---------- Build the picture choices ----------
AVATARS.forEach(function (avatar) {
  var choice = document.createElement("label");
  choice.className = "avatar-choice";

  var radio = document.createElement("input");
  radio.type = "radio";
  radio.name = "avatar";
  radio.value = avatar.id;
  radio.className = "visually-hidden";
  radio.checked = avatar.id === selectedAvatarId;
  radio.setAttribute("aria-label", avatar.label);

  var image = document.createElement("img");
  image.src = getAvatarFile(avatar.id);
  image.alt = ""; // the radio button already has the words
  image.draggable = false;

  radio.addEventListener("change", function () {
    selectedAvatarId = avatar.id;
    nextButton.disabled = false;
  });

  choice.appendChild(radio);
  choice.appendChild(image);
  avatarGrid.appendChild(choice);
});

// You can only press Next after you pick a picture
nextButton.disabled = !selectedAvatarId;

// ---------- Next ----------
pictureForm.addEventListener("submit", function (event) {
  event.preventDefault(); // stops the page from reloading

  if (!selectedAvatarId) {
    return;
  }

  saveAvatarId(selectedAvatarId);
  window.location.href = BACKGROUND_PAGE;
});
