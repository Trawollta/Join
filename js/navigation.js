/**
 * This function is used to change the color of a clicked menu button
 * 
 * @param {HTMLElement} element - This element will get the class active
 */
function navigationMenuClicked(element) {
    let activeElement = document.querySelector('.menu-button.active');
    if (activeElement != undefined) {
        activeElement.classList.remove('active');
    }
    if (element != undefined)
        element.classList.add('active');
}

/**
 * This function opens the headersubmenu
 */
function openHeaderSubmenu() {
    document.getElementById('headersubmenu').classList.remove("d-none");
}

/**
 * This function close the Headersubmenu
 * 
 * @param {event} e -window onmousdown
 */
function closeHeaderSubmenu(e) {
    let menu = document.getElementById('headersubmenu');
    if (menu != undefined && !menu.contains(e.target)) {
        menu.classList.add("d-none");
    }
}