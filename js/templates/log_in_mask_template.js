let startAnimationLogo = "animate-logo-start";
let startAnimationMask = "animate-Mask-start";
let startAnimationColor = "animate-start-color";

/**
 * Renders the login mask on the page.
 *
 * @param {string} containerId - The ID of the container element where the login mask will be rendered.
 * @param {string} rememberedEmail - The email address that the user previously entered and chose to be remembered.
 */
function renderLoginMask() {
    var container = document.getElementById("content-app");

    container.innerHTML = /*html*/ `<div id="login_signupBody" class="${startAnimationColor}">
    <div class="login-headline">
      <div class="logo ${startAnimationLogo}"></div>
      <div class="headline-right ${startAnimationMask}">
        <span>Not a Join user?</span>
        <button id="SignUpbtn" type="button" onclick="renderSignUpMask()">Sign Up</button>
      </div>
    </div>
    <div class="login-area">
      <form class="${startAnimationMask}" onsubmit="logIn(); return false;" id="login_form">
        <div id="loginHead">
          <h1 id="loginTitle">Log in</h1>
          <div id="loginInput">
            <input type="email" id="loginEmail" class="inputEmailImg" placeholder="Email" />
            <input class="loginPassword" id="loginPassword" type="password" minlength="8" placeholder="Password" onkeyup="changePasswordImg(this)" />
            <div  class="password-img" onclick="togglePasswordVisibility(this)"></div>
          </div>
          <div id="loginRememberMe">
            <input type="checkbox" id="loginRemember" onclick="rememberMe()"/>
            <label for="loginRemember">Remember me</label> 
          </div>
          <div id="loginButtons">
            <button class="login-btn" type="submit">Log in</button>
            <button class="guest-login-btn" type="button" onclick="logInGuest()">Guest Log in</button>
          </div>
        </div>  
      </form>
      <div id="loginMsgBox" class="alert">User or password incorrect. Check your input.</div>
    </div>
      <div class="legalNotice ${startAnimationMask}">
      <a href="privacy_policy.html" target="_blank">Privacy Policy</a>
      <a href="legal_notice.html" target="_blank">Legal Notice</a>
      </div>`;

    startAnimationLogo = "";
    startAnimationMask = "";
    startAnimationColor = "";
}