// Animator In.com Choose Account
// Asks "Are you sure you want to use this name?" and lets you change it.

// ---------- Things on the page ----------
var accountNameText = document.getElementById("account-name");
var confirmSection = document.getElementById("confirm-section");
var changeButton = document.getElementById("change-button");
var changeForm = document.getElementById("change-form");
var newNameInput = document.getElementById("new-name-input");
var nameErrorMessage = document.getElementById("name-error-message");
var cancelButton = document.getElementById("cancel-button");

// ---------- Showing the name ----------
// textContent shows the name as plain words, so nothing sneaky can run
function showAccountName() {
  accountNameText.textContent = getAccountName();
}

function showConfirmSection() {
  changeForm.hidden = true;
  confirmSection.hidden = false;
}

showAccountName();

// ---------- "No, change it" ----------
changeButton.addEventListener("click", function () {
  confirmSection.hidden = true;
  changeForm.hidden = false;
  nameErrorMessage.hidden = true;
  newNameInput.value = ""; // start with an empty box
  newNameInput.focus();
});

// ---------- "Save name" ----------
changeForm.addEventListener("submit", function (event) {
  event.preventDefault(); // stops the page from reloading

  var newName = cleanAccountName(newNameInput.value);
  if (!newName) {
    nameErrorMessage.hidden = false;
    return;
  }

  saveAccountName(newName);
  showAccountName();
  showConfirmSection(); // ask "Are you sure?" again with the new name
});

// ---------- "Cancel" ----------
cancelButton.addEventListener("click", showConfirmSection);
