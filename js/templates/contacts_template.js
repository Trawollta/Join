/**
 * Renders the main contacts view including the add contact button
 * 
 * @param {string} element The HTML element that invoked this function
 */
function renderContacts(element) {
    document.getElementById('help-link').classList.remove("d-none");
    navigationMenuClicked(element);
    let content = document.getElementById('content');
    content.innerHTML = /* html */ `
    <div id="leftside" class="contact-leftside">
        <div class="contact-left-button">
            <button class="addButton" onclick="renderAddContact()">
                <span>Add new Contact</span>
                <img src="./assets/img/person_add.svg">
            </button>
        </div>
        <div class="viewall scroll">
            <button id="responsiveButton"><img src="./assets/img/person_add.svg" onclick="renderAddContact()"></button>
            <div style="width: 100%" id="contactlist"></div>
        </div>
    </div>
            
    <div class="rightside" id="contactsforRespons">
        <div onclick="goBackToContacts()" class="arrowBack">
            <img src="./assets/img/arrow-left-line.svg" alt="Back" id="backArrow">
        </div>
        <div class="contacts-headline">
            <h1>Contacts</h1>
            <img class="contact-img" src="./assets/img/blue-stroke.svg">
            <h2>Better with a team</h2>
            <img class="contact-img-responsive" src="./assets/img/Vector 5.svg">
        </div>
        <div class="contactInfo" id="detailsContainer"></div>        
    </div>
    <div class="success-overlay" id="successOverlay">
        <div class="success-message">
            Contact succesfully saved
        </div>
    </div>
    <!-- Overlay neu -->
    <div class="contacts-overlay-content" id="overlay"> 
        <div class="contacts-overlay">
            <div class="darkside">
                <div id="contacts-overlay-headline"> 
                    <img src="./assets/img/logo-white.svg">
                    <h2 id="contacts-overlay-h2"></h2>
                    <h3 id="contacts-overlay-h3"></h3>
                    <span class="blue-line-horizontal"></span>               
                </div>
            </div>
            <div class="whiteside">
                <div class="contacts-overlay-close">
                    <div class="contacts-overlay-close-img" onclick="closeContactOverlay()">
                        <div class="contacts-overlay-close-X"></div>
                    </div>
                </div>
                <div class="whiteside-content">
                    <div id="contacts-overlay-whiteside-left">  
                        <div id="contacts-overlay-icon-border" class="contacts-overlay-icon-border">
                        </div>                  
                    </div>
                    <div class="contacts-overlay-whiteside-right">
                        <div class="inputContainer">
                            <form class="contact-input-area" onsubmit="saveContact(); return false;" >
                                <input id="contact-edit-index" type="hidden" value="-1">
                                <input class="inputName" type="text"placeholder="Surname Name" id="editName" required>  
                                <input class="inputMail" type="email"placeholder="Email" id="editEmail" required>           
                                <input class="inputPhone" type="number" min="0" step="1" placeholder="Phone" id="editPhone" required>
                                <div id="contacts-overlay-buttons">                                
                                </div>    
                            </form>                          
                        </div>
                    </div>
                </div>            
            </div>
        </div>
    </div>`;
    renderContactList();
}

/**
 * Fetches and loads contacts, then populates and displays them in the 
 * contact list sorted alphabetically
 */
async function renderContactList() {
    await loadContacts();
    let content = "";
    let currentInitial = "";
    for (const index in users) {
        if (users.hasOwnProperty(index)) {
            const user = users[index];
            if (user.name == "") {
                continue;
            }
            const userInitial = user.name[0].toUpperCase();
            user.color = getColor(user.name);
            if (!user.color) {
                user.color = colors[Math.floor(Math.random() * colors.length)];
            }
            if (userInitial !== currentInitial) {
                content += `<div class="alphabet-section" id="alphabet-${userInitial}">${userInitial}</div>`;
                currentInitial = userInitial;
            }
            content += /* html */ `
        <div class="contactfield-wrapper" id='painted${index}'>
            <div class="contactfield" onclick="showDetails('${index}'); changeBackgroundColor('${index}');">
                <div class="initials-logo" style="background-color: ${user.color}">${getInitials(user.name)}
                </div>
                    <div class="contact">
                    <span class= 'name'><p><h3>${user.name}</h3></p></span>
                    <span class='mail'><p><h3>${user.email}</h3></p></span>
                    </div>
            </div>
        </div>`;
        }
    }
    document.getElementById("contactlist").innerHTML = content;
}

/**
 * Displays the detailed view for a specific contact, including options to edit or delete
 * 
 * @param {string} index 
 */
function showDetails(index) {
    currentlyDisplayedContactIndex = index;
    const user = users[index];
    const initials = getInitials(user.name);
    let leftside = document.getElementById("leftside");
    let contactsforresponse = document.getElementById("contactsforRespons");

    if (screenData.internalWidth == "mobile" && leftside && contactsforresponse) {
        leftside.style.display = "none";
        contactsforresponse.style.display = "flex";
    }
    if (screenData.internalWidth == "fullscreen" && leftside && contactsforresponse) {
        leftside.style.display = "flex";
        contactsforresponse.style.display = "flex";
    }
    const detailsContent = /* html */ `
    <div class="contactCard">
        <div class="contactView">
            <div class="detailsLogo" style="background-color: ${user.color}; margin: 0;">${initials}</div>
            <div class="contactUser">
                <h3>${user.name}</h3>
                <div class="contactsIcons">
                    <div class="iconWrapper" onclick="renderEditContact(${index})">
                        <img class="icon" src="./assets/img/edit.svg">
                        <span class="iconText">Edit</span>
                    </div>
                    <div class="iconWrapper" onclick="deleteContact(${index})">
                        <img class="icon" src="./assets/img/delete.svg">
                        <span class="iconText">Delete</span>
                    </div>
                </div>
            </div>
        </div>
        <div class=contactoverview>
            <div class="contactInformation">
                <h3>Contact Information</h3>
                <h4>Email</h4>
                <p class="email-blue">${user.email}</p>
                <h4>Phone</h4>
                <p><h5>${user.phone}</h5></p>
            </div>
        </div>
        <button class="options-button" onclick="openContactSubmenu()"><img src="./assets/img/more_vert.svg"></button>            
            <div class="options-menu" id="optionsMenu">
                <div class="iconWrapper" onclick="renderEditContact(${index})">
                    <img class="icon" src="./assets/img/edit.svg">
                    <span class="iconText">Edit</span>
                </div>
                <div class="iconWrapper" onclick="deleteContact(${index})">
                    <img class="icon" src="./assets/img/delete.svg">
                    <span class="iconText">Delete</span>
                </div>
            </div>
    </div>`;
    let detailsContainerContent = document.getElementById("detailsContainer");
    if (detailsContainerContent !== undefined) {
        detailsContainerContent.innerHTML = detailsContent;
    }
}

/**
 * This function render the add contact content in the overlay 
 */
function renderAddContact() {
    openContactOverlay();
    let overlayH2Content = document.getElementById("contacts-overlay-h2");
    overlayH2Content.innerHTML = `Add contact`;
    let overlayH3Content = document.getElementById("contacts-overlay-h3");
    overlayH3Content.innerHTML = `Tasks are better with a team!`;
    let overlayIcon = document.getElementById("contacts-overlay-whiteside-left");
    overlayIcon.innerHTML = /*html*/ `<div class="contacts-overlay-icon-border">
    <div class="contacts-overlay-icon">
        <img src="./assets/img/person2.svg">
    </div>
    </div>`;
    let overlayButtons = document.getElementById("contacts-overlay-buttons");
    overlayButtons.innerHTML = `<button type="button" class="cancelBtn" onclick="closeContactOverlay()">Cancel</button>
    <button class="createBtn" type="submit">Create Contact<img src="./assets/img/check.png"></button>`;
    document.getElementById("contact-edit-index").value = -1;
    document.getElementById("editName").value = '';
    document.getElementById("editEmail").value = '';
    document.getElementById("editPhone").value = '';
}

/**
 * This function render the edit contact content in the overlay 
 */
function renderEditContact(index) {
    openContactOverlay();
    let overlayH2Content = document.getElementById("contacts-overlay-h2");
    overlayH2Content.innerHTML = `Edit contact`;
    let overlayH3Content = document.getElementById("contacts-overlay-h3");
    overlayH3Content.innerHTML = ``;
    const user = users[index];
    const userInitials = getInitials(user.name);
    let overlayIcon = document.getElementById("contacts-overlay-whiteside-left");
    overlayIcon.innerHTML = /*html*/ `
        <div class="detailsLogo" style="background-color: ${user.color}; margin: 0;">${userInitials}</div>`;
    let overlayButtons = document.getElementById("contacts-overlay-buttons");
    overlayButtons.innerHTML = `<button type="button" class="cancelBtn" onclick="deleteContact(${index})">Delete</button>
    <button class="createBtn" type="submit">Save<img src="./assets/img/check.png"></button>`;
    document.getElementById("contact-edit-index").value = index;
    document.getElementById("editName").value = user.name;
    document.getElementById("editEmail").value = user.email;
    document.getElementById("editPhone").value = user.phone;
}