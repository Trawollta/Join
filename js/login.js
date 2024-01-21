let currentUser = null;
let isGuestUser = false;

/**
 * This function checks the value of the input field and changes the image
 */
function changePasswordImg(element) {
  let passwordField = element;
  passwordField.type = "password";
  if (passwordField.value != "") {
    passwordField.nextElementSibling.style.backgroundImage =
      "url(./assets/img/visibility_off.svg)";
  } else {
    passwordField.nextElementSibling.style.backgroundImage =
      "url(./assets/img/lock.svg)";
  }
}

/**
 * This function checks the value of the input field and makes the password visible or invisible
 *
 * @returns void
 */
function togglePasswordVisibility(element) {
  let passwordField = element.previousElementSibling;
  if (passwordField.value == "") {
    return;
  }
  if (passwordField.type === "password") {
    element.style.backgroundImage = "url(./assets/img/visibility.svg)";
    passwordField.type = "text";
  } else {
    element.style.backgroundImage = "url(./assets/img/visibility_off.svg)";
    passwordField.type = "password";
  }
}

/**
 * Logs in the user with the provided email and password.
 *
 * @return {Promise<void>} - Resolves when the user is logged in.
 */
async function logIn() {
  const emailInput = document.getElementById("loginEmail");
  const passwordInput = document.getElementById("loginPassword");

  const usersData = await getItem("users");
  const users = JSON.parse(usersData);

  // Überprüfen, ob die eingegebene E-Mail in den Benutzerdaten vorhanden ist
  if (users.hasOwnProperty(emailInput.value)) {
    const userData = users[emailInput.value];

    // Überprüfen, ob das eingegebene Passwort mit dem gespeicherten Passwort übereinstimmt
    if (userData.password === passwordInput.value) {
      // Kopiere alle Benutzerdaten in den currentUser
      currentUser = {
        email: emailInput.value,
        name: userData.name,
        color: "#7D0C03",
        user: "current",
      };
      isGuestUser = false;
      app();
    } else {
      msgAlert();
      setTimeout(function () {
        app();
      }, 2000);
    }
  } else {
    msgAlert();
    setTimeout(function () {
      app();
    }, 2000);
  }
}

/**
 * Logs in a guest user.
 *
 * @return {undefined} No return value.
 */
function logInGuest() {
  currentUser = {
    name: "Guest",
    email: "guest@join",
    color: "#0D0D0F",
    user: "current",
  };
  isGuestUser = true;
  app();
}

/**
 * Logs out the current user and calls the app function.
 *
 * @param {none} - No parameters.
 * @return {none} - No return value.
 */
function logOut() {
  currentUser = null;
  splashAnimation = "animate-fade-in";
  splashAnimation2 = "animate-fade-out";
  app();
}

/**
 * Saves the value of the login email input to localStorage if the remember checkbox is checked,
 * otherwise removes the entry from localStorage.
 *
 * @param {undefined}
 * @return {undefined}
 */
function rememberMe() {
  var loginRememberCheckbox = document.getElementById("loginRemember");
  var loginEmailInput = document.getElementById("loginEmail");

  if (loginRememberCheckbox.checked) {
    // Wenn die Checkbox ausgewählt ist, schreibe den Wert von loginEmail ins localStorage
    var emailValue = loginEmailInput.value;
    localStorage.setItem("rememberedEmail", emailValue);
  } else {
    // Wenn die Checkbox nicht ausgewählt ist, entferne den Eintrag aus dem localStorage
    localStorage.removeItem("rememberedEmail");
  }
}

/**
 * Fills the login email input field with the remembered email, if available.
 *
 * @param {type} paramName - description of parameter
 * @return {type} description of return value
 */
function fillRememberedEmail() {
  var loginEmailInput = document.getElementById("loginEmail");
  var rememberedEmail = localStorage.getItem("rememberedEmail");

  if (rememberedEmail) {
    loginEmailInput.value = rememberedEmail;
  }
}

/**
 * This function displays a message alert box on the webpage.
 *
 * @param {string} paramName - The ID of the message box element.
 * @return {undefined} This function does not return a value.
 */
function msgAlert() {
  var signUpMsgBox = document.getElementById("loginMsgBox");
  if (signUpMsgBox.style.display === "") {
    signUpMsgBox.style.display = "block";
  } else {
  }
}
