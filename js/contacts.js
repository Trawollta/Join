/**
 * // Define an empty array for users
 */
let users = [];
/*
 */
/**
 * // Define a string of alphabets and array of colors
 */
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const colors = [
    "#FF7A00",
    "#FF5EB3",
    "#6E52FF",
    "#9327FF",
    "#00BEE8",
    "#1FD7C1",
    "#FF745E",
    "#FFA35E",
    "#FC71FF",
    "#FFC701",
    "#0038FF",
    "#C3FF2B",
    "#FFE62B",
    "#FF4646",
    "#FFBB2B",
];
/**
 * // Load contacts from local storage and parse into the 'users' array
 */
async function loadContacts() {
    const contactsJSON = await getItem("contacts");
    users = JSON.parse(contactsJSON).map(jsonUser => User.fromJSON(jsonUser));
}

/**
 * // Get initials of a given name (First and Last name initials)
 * @param {string} name - Full name of the person for which initials are required
 * @returns 
 */
function getInitials(name) {
    const parts = name.split(" ");
    let initials = parts[0][0];
    if (parts.length > 1) {
        initials += parts[parts.length - 1][0];
    }
    return initials.toUpperCase();
}

/**
 * Change the background color of a selected contact
 * 
 * @param {string} index  The index of the contact in the users array to display details for
 */
function changeBackgroundColor(index) {
    for (let j = 0; j < users.length; j++) {
        document.getElementById(`painted${j}`).classList.remove("selected");
    }
    document.getElementById(`painted${index}`).classList.add("selected");
}

/**
 * Compute a color for a given name based on its character
 * 
 * @param {string} name 
 * @returns 
 */
function getColor(name) {
    const sum = name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const colorIndex = sum % colors.length;
    return colors[colorIndex];
}

/**
 * Delete a contact and also remove it from tasks they were assigned to
 * 
 * @param {string} index The index of the contact in the users array to display details for
 */
async function deleteContact(index) {
    removeUserfromTasks('toDo', users[index].id)
    removeUserfromTasks('inProgress', users[index].id)
    removeUserfromTasks('feedback', users[index].id)
    removeUserfromTasks('done', users[index].id)
    users.splice(index, 1);
    await setItem("contacts", users);
    renderContactList();
    document.getElementById("detailsContainer").innerHTML = "";
    closeContactOverlay();
}

/*
 * Open the contact edit/add overlay with slide in animation
 */
function openContactOverlay() {
    document.getElementById("overlay").style.animation = "slideIn 1s forwards";
}

/*
 *Close the contact edit/add overlay with slide out animation
 */
function closeContactOverlay() {
    document.getElementById("overlay").style.animation = "slideOut 1s forwards";
}

/*
 * Save a contact, either by adding a new one or editing an existing one
 */
async function saveContact() {
    let index = document.getElementById("contact-edit-index").value;
    let name = document.getElementById("editName").value;
    let email = document.getElementById("editEmail").value;
    let phone = document.getElementById("editPhone").value;
    let user;
    if (index == -1) {
        user = new User(name, email, phone);
        users.push(user);
    } else {
        user = users[index];
        user.setName(name);
        user.setPhone(phone);
        user.setEmail(email);
    }
    users.sort((a, b) => a.name.localeCompare(b.name));
    await setItem("contacts", users);
    renderContactList();
    closeContactOverlay();
    showSuccessOverlay();
    index = users.findIndex(element => element.id == user.id);
    showDetails(index);
}

/*
 * Go back to the contacts view
 */
function goBackToContacts() {
    renderContacts();
}

/**
 * Opens the contact options submenu
 */
function openContactSubmenu() {
    const optionsMenu = document.getElementById("optionsMenu");
    optionsMenu.classList.add("show-options-menu");
    document.getElementById("optionsMenu").style.animation = "slideIn 1s forwards";
}

/**
 * This function close the Contactsubmenu
 * 
 * @param {event} e -window onmousdown
 */
function closeContactSubmenu(e) {
    let menu = document.getElementById('optionsMenu');
    if (menu != undefined && menu.classList.contains('show-options-menu') && !menu.contains(e.target)) {
        menu.style.animation = "slideOut 1s forwards";
    }
}


function showSuccessOverlay() {
    const overlay = document.querySelector(".success-overlay");
    overlay.classList.add("show-success");

    // Automatisches Schließen nach z.B. 3 Sekunden
    setTimeout(() => {
        hideSuccessOverlay();
    }, 3000); // 3000ms = 3 Sekunden
}

/*
 *Show an overlay indicating a successful operation
 */
function hideSuccessOverlay() {
    const overlay = document.querySelector(".success-overlay");
    //Checks if the overlay is still there, to prevent an error-log in the console when you switch to a different submenu after adding a task
    if (overlay) {
        overlay.classList.remove("show-success");
    }
}

/**
 * Loops through all tasks in a tasklist, then loops through all assignees inside the tasks and if the id is inside an assignee array (which means the contact is assigned)
 * the ID will be deleted from the task. By looping backwards, if an item is removed, the items not yet checked won't shift, preventing any from being skipped.
 * Happens every time a contact is deleted
 * 
 * @param {string} arrayAsString This is the name of the array inside "tasksLists" to which the task is supposed to be added
 * @param {*} id id of the user thats about to be deleted
 */
async function removeUserfromTasks(arrayAsString, id) {
    let list = taskLists[arrayAsString]
    for (let index = 0; index < list.length; index++) {
        let task = list[index];
        let assignees = task['assignees'];
        for (let j = assignees.length - 1; j >= 0; j--) {
            if (assignees[j] == id) {
                assignees.splice(j, 1);
            }
        }
    }
    await setItem(arrayAsString, JSON.stringify(taskLists[arrayAsString]));
}