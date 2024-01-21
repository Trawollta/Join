/**
 * This function start the app and render the login-mask or the summary
 */
async function app() {
    if (currentUser === null) {
        renderLoginMask();
        fillRememberedEmail();
        await loadUsers();
    } else {
        await getAppData();
        renderLayout();
        renderNavigation();
        renderHeader();
        renderSummary();
    }
}

/**
 * This function create the basic for the content
 */
function renderLayout() {
    let content = document.getElementById("content-app");
    content.innerHTML = "";
    content.innerHTML = /* html */ `
    <div id="left-layout"></div>
    <div id="right-layout">
        <div id="header"></div>
        <div id="content"></div>
    </div>`;
}

/**
 * This function render legal notice content
 */
function appLegalNotice() {
    renderLayout();
    renderNavigation();
    renderHeader();
    renderNotice();
}

/**
 * This function render privacy policy content
 */
function appPrivacyPolicy() {
    renderLayout();
    renderNavigation();
    renderHeader();
    renderPolicy();
}

/**
 * This function load all data from storage
 */
async function getAppData() {
    await loadContacts();
    await boardLoadFromStorage("toDo");
    await boardLoadFromStorage("inProgress");
    await boardLoadFromStorage("feedback");
    await boardLoadFromStorage("done");
}

/**
 * Loads the users from storage and returns them as an object.
 *
 * @return {Object} The users loaded from storage.
 */
async function loadUsers() {
    try {
        const storedUsersJSON = await getItem("users");
        if (storedUsersJSON) {
            regUsers = JSON.parse(storedUsersJSON);
        } else {
            regUsers = {};
        }
    } catch (e) {
        // console.error("Load users error:", e);
        return {};
    }
}

let currentlyDisplayedContactIndex = null;
let screenData = {
    internalWidth: ''
};

/**
 * checks the screenwidth every time it changes to find out if a change of layouts is required
 * 
 *  */
function checkScreenWidth() {
    if (window.innerWidth >= 1190) {
        screenData.Screenwidth = 'fullscreen';
    } else {
        screenData.Screenwidth = 'mobile';
    }
}

/**
 * Watches for a change in screenwidth to a predetermined width to see if the layout needs to be changed
 * 
 */
Object.defineProperty(screenData, 'Screenwidth', {
    get() {
        return this.internalWidth;
    },
    set(newVal) {
        if (newVal !== this.internalWidth) { // checks if value is actually changing
            this.internalWidth = newVal;
            onScreenwidthChange();; // calls the function when Screenwidth changes
        }
    }
});

/**
 * automatically displays the contact information if the card is already displayed. Checks for the currentlyDisplayedContactIndex to make sure the card is not rendered until you click the required button
 */
function onScreenwidthChange() {
    if (currentlyDisplayedContactIndex !== null) {
        let index = currentlyDisplayedContactIndex;
        showDetails(index);
    }
}
/**
 * close submenu on mousedown event
 * @param {event} e 
 */
window.onmousedown = function(e) {
    closeHeaderSubmenu(e);
    closeContactSubmenu(e);
}