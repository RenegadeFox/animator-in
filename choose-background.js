// Animator In.com Choose Background
// Lets you pick a color or gradient, and shows a preview.

var WATCH_PAGE = "watch.html"; // the next page

// ---------- Things on the page ----------
var backgroundForm = document.getElementById("background-form");
var profilePreview = document.getElementById("profile-preview");
var previewImage = document.getElementById("preview-image");
var previewName = document.getElementById("preview-name");
var solidSwatches = document.getElementById("solid-swatches");
var gradientSwatches = document.getElementById("gradient-swatches");
var customBox = document.getElementById("custom-box");
var customColor1Input = document.getElementById("custom-color-1-input");
var customColor2Input = document.getElementById("custom-color-2-input");
var customGradientCheckbox = document.getElementById("custom-gradient-checkbox");

// The background that is picked right now ("" means the normal dark page)
var currentSetting = getBackgroundSetting();

// ---------- Preview ----------
var avatarId = getAvatarId();
previewImage.src = getAvatarFile(avatarId);
previewImage.alt = getAvatarLabel(avatarId);
previewName.textContent = getAccountName(); // textContent shows plain words only

function updatePreview() {
  // An empty value puts the normal dark page color back
  profilePreview.style.background = backgroundToCss(currentSetting);
  customBox.classList.toggle("is-picked", currentSetting.indexOf("custom:") === 0);
}

// ---------- Colors and gradients ----------
function buildSwatches(container, backgrounds) {
  backgrounds.forEach(function (background) {
    var value = "preset:" + background.id;

    var swatch = document.createElement("label");
    swatch.className = "swatch";
    swatch.title = background.label;

    var radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "background";
    radio.value = value;
    radio.className = "visually-hidden";
    radio.checked = value === currentSetting;
    radio.setAttribute("aria-label", background.label);

    var color = document.createElement("span");
    color.className = "swatch-color";
    color.style.background = background.css;

    radio.addEventListener("change", function () {
      currentSetting = value;
      updatePreview();
    });

    swatch.appendChild(radio);
    swatch.appendChild(color);
    container.appendChild(swatch);
  });
}

buildSwatches(solidSwatches, SOLID_BACKGROUNDS);
buildSwatches(gradientSwatches, GRADIENT_BACKGROUNDS);

// ---------- Make your own ----------
function buildCustomSetting() {
  var setting = "custom:" + customColor1Input.value;
  if (customGradientCheckbox.checked) {
    setting += ":" + customColor2Input.value;
  }
  return setting;
}

// If a custom background was saved before, show its colors in the boxes
if (currentSetting.indexOf("custom:") === 0) {
  var savedColors = currentSetting.split(":");
  customColor1Input.value = savedColors[1];
  customGradientCheckbox.checked = savedColors.length === 3;
  if (savedColors.length === 3) {
    customColor2Input.value = savedColors[2];
  }
}

function useCustomBackground() {
  customColor2Input.disabled = !customGradientCheckbox.checked;

  currentSetting = buildCustomSetting();

  // Un-pick the colors and gradients above
  var radios = backgroundForm.querySelectorAll('input[name="background"]');
  for (var i = 0; i < radios.length; i++) {
    radios[i].checked = false;
  }

  updatePreview();
}

customColor1Input.addEventListener("input", useCustomBackground);
customColor2Input.addEventListener("input", useCustomBackground);
customGradientCheckbox.addEventListener("change", useCustomBackground);

customColor2Input.disabled = !customGradientCheckbox.checked;
updatePreview();

// ---------- Done ----------
backgroundForm.addEventListener("submit", function (event) {
  event.preventDefault(); // stops the page from reloading

  saveBackgroundSetting(currentSetting);
  window.location.href = WATCH_PAGE;
});
