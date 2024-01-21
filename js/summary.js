/**
 * This function changes the greeting text depending on the time 
 * 
 * @returns the greeting value
 */
function greetTime() {
    let date = new Date();
    let hour = date.getHours();
    let greeting = "";

    if (hour >= 17) {
        greeting = 'Good evening';
    } else if (hour >= 14) {
        greeting = `Good afternoon`;
    } else if (hour >= 11) {
        greeting = `Welcome`;
    } else if (hour >= 6) {
        greeting = `Good morning`;
    } else if (hour >= 0) {
        greeting = `Don't feed the Gremlins`;
    }
    if (currentUser.name == 'Guest') {
        greeting += '!';
    } else {
        greeting += ',';
    }
    return greeting;
}

/**
 * This function get the current user name
 * 
 * @returns the name of the current user
 */
function getUserGreeting() {
    if (currentUser.name == 'Guest') {
        return '';
    }
    return currentUser.name;

}

/**
 * This function searches all arrays for priority and counts them
 * 
 * @returns the amount of priority
 */
function getCountPriority() {
    let amountUrgent = 0;
    taskLists.feedback.concat(taskLists.toDo).concat(taskLists.inProgress).map((element) => {
        if (element.priority.priority == 'Urgent') {
            amountUrgent++
        }
    });
    return amountUrgent;
}

/**
 * This function searches all arrays for the earliest date
 * 
 * @returns the next deadline date
 */
function getDeadlineDate() {
    let earliestDate = 0;
    taskLists.feedback.concat(taskLists.toDo).concat(taskLists.inProgress).find((element) => {
        if (element.dueDate < earliestDate || earliestDate == 0) {
            earliestDate = element.dueDate;
        }
    });
    if (earliestDate == 0) {
        return "";
    }
    const timeOptions = { month: "long", day: "numeric", year: "numeric" }
    return new Date(earliestDate).toLocaleString("en", timeOptions);
}

/**
 * This function opens the board
 */
function openBoard() {
    let element = document.getElementById("navBoardButton");
    renderBoard(element);
}