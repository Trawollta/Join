//////////////////////////////////////////////////////////////////////////////////////  Assignee Part   /////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Loops through contacts to render all assignee options for the assignee selector and renders them
 * Checks if user is already assigned
 *
 */
function taskRenderAssigneeOptions() {
    let selector = document.getElementById("assign_select");
    selector.innerHTML = "";
    for (let index = 0; index < users.length; index++) {
        let user = users[index];
        if (assignees.includes(user.id)) {
            taskCreateAssignedContact(user);
        } else {
            taskCreateUnassignedContact(user);
        }
    }
}

/**
 * assignees are saved by storing their id in the users array. This function goes through all ids that are assigned
 * and renders the respective user from the users array
 *
 *
 */
function taskRenderAssigneeList() {
    let list = document.getElementById("assigneeList");
    list.innerHTML = "";
    for (let i = 0; i < users.length; i++) {
        let user = users[i];
        if (assignees.includes(user.id)) {
            list.innerHTML += /*html*/ `
        <div class="initials-logo" style="background-color: ${user.color}">${getInitials(user.name)}</div>`;
        }
    }
}


/**
 * simple search function to find contacts to assign.
 * Checks if user is already assigned
 *
 */
function taskSearchAssignees() {
    let search = document.getElementById("assigner").value;
    let selector = document.getElementById("assign_select");
    if (search == "") {
        taskRenderAssigneeOptions();
    } else {
        selector.innerHTML = "";
        for (let i = 0; i < users.length; i++) {
            let user = users[i];
            if (user.name.toLowerCase().includes(search)) {
                if (assignees.includes(user.id)) {
                    taskCreateAssignedContact(user, i);
                } else {
                    taskCreateUnassignedContact(user, i);
                }
            }
        }
    }
}

/**
 * assigns a user by pushing the id of the users array into the assignee array
 *
 * @param {number} id id of the user in the users array
 */
function taskAssign(id) {
    assignees.push(id);
    let checkbox = document.getElementById(`assigneeCheckbox${id}`);
    let assignee = document.getElementById(`assignee${id}`)
    checkbox.src = "./assets/img/Check button.svg";
    assignee.onclick = null;
    assignee.onclick = function() {
        taskUnassign(id);
    };
    taskRenderAssigneeList();
}

/**
 * assigns a user by splicing the id of the users array from the assignee array
 *
 * @param {number} id id of the user in the users array
 */
function taskUnassign(id) {
    let position = assignees.indexOf(id);
    assignees.splice(position, 1);

    let checkbox = document.getElementById(`assigneeCheckbox${id}`);
    let assignee = document.getElementById(`assignee${id}`)
    checkbox.src = "./assets/img/Rectangle 5.svg";
    assignee.onclick = null;
    assignee.onclick = function() {
        taskAssign(id);
    };
    taskRenderAssigneeList();
}


/**
 * Opens the assignee option overlay, displays the list of assignees and un-flips the selector button.
 * This function also prevents the click event from propagating to any parent elements to avoid triggering taskCloseOverlay().
 *
 * @function
 * @param {Event} [event] - The click event object, if available.
 */
function taskOpenOverlay(event) {
    if (event) event.stopPropagation();

    let selector = document.getElementById("assigneeOptionContainer");
    let selectorButton = document.getElementById("assignmentSelectButton");

    // Displays the assignee options and adds a flip class to the select button
    selector.style.display = "flex";
    selectorButton.classList.add("flip");
    taskRenderAssigneeOptions();
}

/**
 * Toggles the visibility of the assignee option overlay.
 * If the overlay is currently hidden or not set, it will display the overlay and flip the selector button.
 * Otherwise, it hides the overlay and un-flips the selector button.
 * This function also prevents the click event from propagating to any parent elements to avoid triggering taskOpenOverlay(event).
 *
 * @function
 * @param {Event} [event] - The click event object, if available.
 */
function taskCloseOverlay(event, clickedElement) {
    if (event) event.stopPropagation();
    let selector = document.getElementById("assigneeOptionContainer");
    let selectorButton = document.getElementById("assignmentSelectButton");
    if (selector) {
        if (selector.style.display === "none" && clickedElement == selectorButton) {
            // Displays the assignee options and adds a flip class to the select button
            selector.style.display = "flex";
            selectorButton.classList.add("flip");
            taskRenderAssigneeOptions();
        } else {
            // Hides the assignee options and removes the flip class from the select button
            selector.style.display = "none";
            selectorButton.classList.remove("flip");
            taskRenderAssigneeOptions();
        }
    }


}

/**
 * This function prevents the click event from propagating to any parent elements to avoid triggering taskCloseOverlay().
 *
 * @param {event} e
 */
function preventClose(e) {
    e.stopPropagation();
}



/**
 * resets all error messages by making them invisible
 *
 */
function taskResetError() {
    document.getElementById("errorTitle").style.display = "none";
    document.getElementById("errorDate").style.display = "none";
    document.getElementById("errorDate").style.display = "none";
    document.getElementById("errorPriority").style.display = "none";
    document.getElementById("errorCategory").style.display = "none";
}


function displayTaskNotification() {
    document.getElementById('taskNotification').style.display = 'flex'
    setTimeout(() => {
        if (document.getElementById('taskNotification')) {
            document.getElementById('taskNotification').style.display = 'none'
        }
    }, 3000);
}



/**
 * goes through every single obligatory input and checks if thy have a value.
 * If no it will display an error message under the respective input
 *
 * @param {string} title values of the respective inputs
 * @param {date} dueDate values of the respective inputs
 * @param {number} category values of the respective inputs
 * @returns false or true
 */
function taskCheckInputValidity(title, dueDate, category) {
    let validitiy = true;
    if (title == "") {
        document.getElementById("errorTitle").style.display = "block";
        validitiy = false;
    }
    if (dueDate == "") {
        document.getElementById("errorDate").innerText =
            "This field needs to be filled out";
        document.getElementById("errorDate").style.display = "block";
        validitiy = false;
    } else {
        let selectedDate = new Date(dueDate).setHours(0, 0, 0, 0);
        let currentDate = new Date().setHours(0, 0, 0, 0);

        if (selectedDate < currentDate) {
            document.getElementById("errorDate").innerText =
                "Due date cannot be in the past";
            document.getElementById("errorDate").style.display = "block";
            validitiy = false;
        }
    }
    if (Prio.length == 0) {
        document.getElementById("errorPriority").style.display = "block";
        validitiy = false;
    }
    if (category == "null") {
        document.getElementById("errorCategory").style.display = "block";
        validitiy = false;
    }

    return validitiy;
}


///////////////////////////////////////////////////////////////////////////////////Janitorial Function\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

/**
 * immediately deletes all tasks from the server
 *
 */
async function FULLSTOP() {
    taskLists["toDo"] = [];
    taskLists["inProgress"] = [];
    taskLists["feedback"] = [];
    taskLists["done"] = [];

    await setItem("toDo", JSON.stringify(taskLists["toDo"]));
    await setItem("inProgress", JSON.stringify(taskLists["inProgress"]));
    await setItem("feedback", JSON.stringify(taskLists["feedback"]));
    await setItem("done", JSON.stringify(taskLists["done"]));
    boardCloseOverlay();
    boardLoadTasks();
}