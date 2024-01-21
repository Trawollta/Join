/**
 * This function render the navigation
 */
function renderNavigation() {
    let content = document.getElementById('left-layout');
    content.innerHTML = /* html */ `
    <nav>
        ${renderNavHeader()}
        ${renderNavMenu()}
        ${renderNavFooter()}        
    </nav>`;
}


function renderNavHeader() {
    return /* html */ `<div class = "navigation-img" >
            <img class = "navigation-logo"src = "./assets/img/logo-white.svg">
        </div>`;
}


function renderNavMenu() {
    if (currentUser === null) {
        return " ";
    } else {
        return /* html */ `<div class = "navigation-menu">
    <div class = "menu-button active" onclick = "renderSummary(this);">
        <div class = "menu-icon summary"></div><span> Summary </span>
    </div>
    <div class = "menu-button" onclick = "renderAddTask(this); taskSetPrio(1)">
        <div class = "menu-icon add-task" ></div><span>Add Task</span>
    </div>
    <div id="navBoardButton" class = "menu-button" onclick = "renderBoard(this)">
        <div class = "menu-icon board" ></div><span>Board</span>
    </div>
    <div id="navContactButton" class = "menu-button" onclick = "renderContacts(this)">
        <div class = "menu-icon contacts"></div><span>Contacts</span>
    </div>
    </div>`;
    }
}


function renderNavFooter() {
    return /* html */ `<div class = "footer">
    <div class = "menu-button" onclick = "navigationMenuClicked(this); renderPolicy()"><p>Privacy Policy</p></div>
    <div class = "menu-button" onclick = "navigationMenuClicked(this); renderNotice();"><p>Legal Notice</p></div>
</div >`;
}


function renderHeader() {
    let content = document.getElementById('header');
    content.innerHTML = /* html */ `
        ${renderHeaderHeadline()}
        ${renderHeaderProfile()}
        ${renderHeaderSubMenu()}`;
}


function renderHeaderHeadline() {
    return /* html */ `    
    <img class="grey-logo d-none" src="./assets/img/logo_main.svg">
    <div class="headline">
        <span>Kanban Project Management Tool</span>
    </div>`;
}


function renderHeaderProfile() {
    if (currentUser === null) {
        return "";
    } else {
        return /* html */ `
    <div class="headline-profile">
        <div id="help-link">
            <div onclick="renderHelp()"><img src="./assets/img/help.svg"></div>
        </div>
        <div onclick="openHeaderSubmenu()" id="user-profile-initials">${currentUser.name.split(" ").map((element) => element[0]).join("")}</div>
    </div>`;
    }
}


function renderHeaderSubMenu() {
    return /* html */ `
    <div id="headersubmenu" class="header-submenu d-none">
        <div onclick ="renderNotice()">
            <p>Legal Notice</p>
        </div>
        <div onclick = "renderPolicy()">
            <p>Privacy Policy</p>
        </div>
        <div onclick="logOut()">
            <p>Log out</p>
        </div>            
    </div>`;
}