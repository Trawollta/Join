let regUsers = {};

/**
 * Renders the sign-up mask on the page.
 *
 * @return {Promise} A promise that resolves when the mask is rendered.
 */
async function renderSignUpMask() {
  var container = document.getElementById("content-app");
  container.innerHTML = /*html*/ `
      <div id="login_signupBody">
        <div class="login-headline">
          <img id="logo" src="./assets/img/logo_main.svg" alt="Logo">
          <div class="headline-right">
          </div>
        </div>
        <div class="signUp-formular">
        <form id="signUp_form" onsubmit="register(); return false;">
          <div id="loginArrow">
            <img id="loginArrowImg" src="./assets/img/arrow-left-line.svg" alt="Arrow" onclick="app()">
          </div>
          <div id="loginHead">
            <h1 id="loginTitle">Sign Up</h1>
          </div>
          <div id="loginInput">
            <input required type="text" id="signUpName" class="inputNameSignUp" placeholder="Name" />
            <input required type="email" id="signUpEmail" class="inputEmailImg" placeholder="Email" />
            <input required type="password" id="signUpPw" class="inputPassword" minlength="8" placeholder="Password" onkeyup="changePasswordImg(this)" />
            <div class="password-img" onclick="togglePasswordVisibility(this)"></div>
            <input required type="password" id="signUpPw2" class="inputPassword" minlength="8" placeholder="Confirm Password" onkeyup="changePasswordImg(this)"/>
            <div class="password-img" onclick="togglePasswordVisibility(this)"></div>
          </div>
          <div id="loginCheckbox">
            <input required class="" type="checkbox" value="" id="signUpCheck" unchecked/>
            <span>I accept the <a href="privacy_policy.html" target="_blank">Privacy Policy</a></span> 
          </div>
          <div id="loginButtons">
            <input style="display:none;" id="signUpBtn" class="signUpBtn" type="submit">
            <button onclick="signUpBtn.click();">Sign Up</button>
          </div>
        </form>
      </div>
      <div id="signUpMsgBox">You Signed Up successfully</div>
      </div>
      <div id="signUpAlert" class="alert">Passwords do not match. Check your input.</div>
      `;
}

/**
 * Register a new user.
 *
 * @return {Promise<void>} Returns a Promise that resolves with no value.
 */
async function register() {
  if (signUpPw.value !== signUpPw2.value) {
    msgSignUpAlert();
    return;
  }

  const newUser = {
    name: signUpName.value,
    password: signUpPw.value,
  };

  regUsers[signUpEmail.value] = newUser;

  await setItem("users", JSON.stringify(regUsers));

  msgSignUp();

  setTimeout(function () {
    app();
  }, 1500);

  resetForm();
}

/**
 * Resets the form by clearing the values of the input fields.
 *
 * @param {type} - No parameters needed.
 * @return {type} - No return value.
 */
function resetForm() {
  signUpName.value = "";
  signUpEmail.value = "";
  signUpPw.value = "";
  signUpPw2.value = "";
}

/**
 * A description of the entire function.
 *
 * @return {undefined} No return value
 */
function msgSignUp() {
  var signUpMsgBox = document.getElementById("signUpMsgBox");
  if (signUpMsgBox.style.display === "") {
    signUpMsgBox.style.display = "block";
  } else {
  }
}

/**
 * Displays a sign-up alert message box and hides it after 1.5 seconds.
 *
 * @param {none} none - No parameters.
 * @return {none} No return value.
 */
function msgSignUpAlert() {
  var signUpMsgBox = document.getElementById("signUpAlert");
  signUpMsgBox.style.display = "block";

  setTimeout(function () {
    signUpMsgBox.style.display = "none";
  }, 1500);
}
