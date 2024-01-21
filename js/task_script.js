const taskLists = {
    toDo: [],
    inProgress: [],
    feedback: [],
    done: [],
};

let assignees = [];
let subtasks = [];
let subtasksDone = [];
let Prio = [];
let priorities = [{
        priority: "Urgent",
        symbol: "./assets/img/Prio_alta.png",
        color: "rgb(255, 61, 0)",
    },
    {
        priority: "Medium",
        symbol: "./assets/img/Prio_media.png",
        color: "rgb(255, 168, 0)",
    },
    {
        priority: "Low",
        symbol: "./assets/img/Prio_baja.png",
        color: "rgb(122,226,41)",
    },
];

const categories = [{
        name: "CSS",
        color: "rgb(40,98,233)",
    },
    {
        name: "HTML",
        color: "rgb(233,98,40)",
    },
    {
        name: "Javascript",
        color: "rgb(247,214,36)",
    },
];

/**
 * This function is called when a new task is created, it compiles the data, validates it, saves it to the server and reloads the tasks
 * All inputs are reset, a notification is displayed and the Task-creator rerendered
 * If the task creator is opened in the board overlay, the overlay is closed
 *
 * @param {string} list  This is the name of the array inside "tasksLists" to which the task is supposed to be added
 */

async function taskAddTask(list) {
    taskResetError();
    let data = taskCompileTaskData();
    if (data != "error") {
        taskLists[list].push(data);
        taskResetForm();
        taskResetArrays();
        taskRenderAssigneeList();
        await setItem(list, JSON.stringify(taskLists[list]));
        if (overlayBody != undefined) {
            boardLoadTasks();
            boardCloseOverlay();
        } else {
            renderAddTask();
            setTimeout(()=> { 
                renderBoard(); }, 1700);
            displayTaskNotification();
        }
    }
}

/**
 * This function is called whenever a task is edited, it compiles the data, validates it, saves it to the server and reloads the tasks
 *
 * @param {string} arrayAsString This is the name of the array inside "tasksLists" to which the task is supposed to be added
 * @param {number} i This is the position of the edited task inside the array specified above
 */
async function taskAddEditedTask(arrayAsString, i) {
    taskResetError();
    let data = taskCompileTaskData();
    if (data != "error") {
        taskLists[arrayAsString][i] = data;
        taskCheckFinishedSubtasks(arrayAsString, i);
        taskResetForm();
        taskResetArrays();
        await setItem(arrayAsString, JSON.stringify(taskLists[arrayAsString]));

        boardCloseOverlay();
        boardLoadTasks();
    }
}

/**
 * Resets the task-form before rerendering. if else to check if the task creator is in the add task submenu or the board overlay
 * 
 * @param {string} arrayAsString 
 */
function clearTaskCreator(arrayAsString) {
    taskResetForm()
    if (overlayBody != undefined) {
        boardAddTask(arrayAsString)
    } else {
        renderAddTask()
    }

}

/**
 * Resets all values in input fields on the task-creation section
 *
 */
function taskResetForm() {
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("assign_select").value = null;
    document.getElementById("due").value = "";
    document.getElementById("category_selector").value = null;

}

/**
 * resets arrays after tasks have been edited, closed or created.
 *
 */
function taskResetArrays() {
    Prio = [];
    subtasks = [];
    subtasksDone = [];
    assignees = [];
}

/**
 * This function is called when a task is edited and it takes the priority, here shown as a number between 0 and 2. This way the priority can be displayed when the editor is opened
 *
 * @param {string} arrayAsString This is the name of the array inside "tasksLists" from which information is supossed to be taken
 * @param {number} i This is the position of the edited task inside the array specified above
 * @returns returns the 'value' of the priority
 */
function taskGetPrioforEditor(arrayAsString, i) {
    let x = null;
    let task = taskLists[arrayAsString][i];
    if (task["priority"]["priority"] == "Urgent") {
        x = 0;
    }
    if (task["priority"]["priority"] == "Medium") {
        x = 1;
    }
    if (task["priority"]["priority"] == "Low") {
        x = 2;
    }

    return x;
}

/**
 * Sets the priority of an opened or currently created task for later storage. Colors the respective button as well
 *
 * @param {number} x A number between 0 and 2 that signals the respecive priority
 */
function taskSetPrio(x) {
    Prio = [];
    Prio.push(priorities[x]);
    taskColorPriorityButtons(x);
}

/**
 * adds a new subtask in the subtask array, resets the input and renders all current subtasks
 *
 */
function taskAddSubtask() {
    let subtask = document.getElementById("subtasks");
    let newSubtask = {
        task: subtask.value,
        done: 0,
    };
    subtasks.push(newSubtask);
    subtask.value = "";
    taskRenderSubtasks();
    taskChangeSubtaskAppearance();
}

/**
 * enables the fucntion taskAddSubtask() to be called on the enter key, if a value is present
 *
 */
function taskAddSubtasksOnEnter(event) {
    let subtask = document.getElementById("subtasks");
    if (event.keyCode == 13) {
        event.preventDefault();
        if (subtask != "") {
            taskAddSubtask();
        }
    }
}

/**
 * loops through all subtasks in the subtasks array and displays them
 *
 */
function taskRenderSubtasks() {
    let subTaskDisplay = document.getElementById("addedSubtasks");
    subTaskDisplay.innerHTML = "";
    for (let i = 0; i < subtasks.length; i++) {
        let subtaskelement = subtasks[i];
        subTaskDisplay.innerHTML += /*html*/ `

    <div class="subtaskElement" id="subtask${i}">
      <div class="subtaskElementBody">
        <img class="dot" src="./assets/img/dot.svg" alt="">
        <p>${subtaskelement["task"]}</p>
      </div>
      <div class="subtaskTools">
        <img onclick="taskCutSubtask(${i})" src="./assets/img/delete.svg" alt="">
        <img onclick="taskEditSubtask(${i})" src="./assets/img/edit.svg" alt="">
      </div>
    </div>
    `;
    }
}

/**
 * deletes the pressed subtask and rerenders the list of subtasks
 *
 * @param {number} i index of the respective subtask in the subtasks array
 */
function taskCutSubtask(i) {
    subtasks.splice(i, 1);
    taskRenderSubtasks(i);
}

/**
 * renders an input and two new buttons in the place of a displayed subtask. Gives the input the value of the subtask previously displayed.
 * The buttons have the options to save the edited subtask or delete it
 *
 * @param {number} i index of the respective subtask in the subtasks array
 */
function taskEditSubtask(i) {
    let currentValue = subtasks[i]["task"];
    let subTaskDisplay = document.getElementById(`subtask${i}`);
    subTaskDisplay.innerHTML = "";
    subTaskDisplay.innerHTML = `
      <input type="text" id="editedInput${i}" value="${currentValue}"  />
      <div>
        <img onclick="taskCutSubtask( ${i})" src="./assets/img/delete.svg" alt="">
        <img onclick="taskSaveSubtaskEdit(${i})" src="./assets/img/Vector 17.svg" alt="">
      </div>
    `;
}

/**
 * saves an edited subtasks and rerenders the list of subtasks
 *
 * @param {*number} i index of the respective subtask in the subtasks array
 */
function taskSaveSubtaskEdit(i) {
    let editedValue = document.getElementById(`editedInput${i}`).value;
    subtasks[i]["task"] = editedValue;
    taskRenderSubtasks();
}

/**
 * clears the subtask input
 */
function taskClearSubtask() {
    document.getElementById("subtasks").value = "";
}

/**
 * renders in the clear or save buttons into the subtask input div when something is written in the input
 *
 */
function taskChangeSubtaskAppearance() {
    if (document.getElementById("subtasks").value != "") {
        document.getElementById("subtaskField").innerHTML = /*html*/ `

    <div class="buttonwrapper"><img onclick="taskClearSubtask()" src="./assets/img/close.svg" alt=""></div> 
    <img src="./assets/img/Vector 3.svg" alt="">
    <div class="buttonwrapper"><img onclick="taskAddSubtask()" src="./assets/img/Vector 17.svg" alt=""></div>  
    `;
    } else {
        document.getElementById("subtaskField").innerHTML =
            '<img src="./assets/img/Subtasks icons11.svg" alt="">';
    }
}

/**
 * opens the contact page and the overlay to add a new contact
 *
 */
function goToContacts() {
    let element = document.getElementById("navContactButton");
    renderContacts(element);
    renderAddContact();
}

/**
 * This is called by the taskAddTask(list) and task_addEditedTask(list) function.
 * reads out the values from all necesarry inputs.
 * Then checks if the value has the right format and returns either correctly input data or an error
 *
 * @returns correct data or a string saying "error"
 *
 */
function taskCompileTaskData() {
    title = document.getElementById("title");
    description = document.getElementById("description");
    dueDate = document.getElementById("due");
    category = document.getElementById("category_selector");

    const validity = taskCheckInputValidity(
        title.value,
        dueDate.value,
        category.value
    );

    if (validity == true) {
        let date = new Date(dueDate.value);
        let data = {
            title: title.value,
            description: description.value,
            assignees: assignees,
            dueDate: date.getTime(),
            category: category.value,
            priority: Prio[0],
            subtasks: subtasks,
            subtasksDone: subtasksDone,
        };
        return data;
    } else {
        return "error";
    }
}

/**
 * styles the button of te chosen priority
 *
 * @param {number} x This is the number of the respecive priority 0 for urgent, 1 for medium, 2 for low
 */
function taskColorPriorityButtons(x) {
    //changes the backgroundcolor based on the selected Priority
    document.getElementById(`Prio0`).style.backgroundColor = "white";
    document.getElementById(`Prio1`).style.backgroundColor = "white";
    document.getElementById(`Prio2`).style.backgroundColor = "white";
    document.getElementById(
        `Prio${x}`
    ).style.backgroundColor = `${priorities[x]["color"]}`;

    //Adds classes that make the image and text white
    document.getElementById(`Prio0`).classList.remove("whiteFilterText");
    document.getElementById(`Prio1`).classList.remove("whiteFilterText");
    document.getElementById(`Prio2`).classList.remove("whiteFilterText");
    document.getElementById(`Prio${x}`).classList.add("whiteFilterText");

    document.getElementById(`Prio0_img`).classList.remove("whiteFilterImg");
    document.getElementById(`Prio1_img`).classList.remove("whiteFilterImg");
    document.getElementById(`Prio2_img`).classList.remove("whiteFilterImg");
    document.getElementById(`Prio${x}_img`).classList.add("whiteFilterImg");
}

/**
 * subtasks have a value corresponding to whether or not they are finished.
 * finished subtasks have the number 1, unfinished ones have the number 0
 * This function loops through all subtasks in a saved task and checks if they are done.
 * If they are done, they get pushed into the finishedSubtasks array
 *
 * @param {string} list This is the name of the array inside "tasksLists" from which information is supossed to be taken
 * @param {number} i This is the position of the edited task inside the array specified above
 */
function taskCheckFinishedSubtasks(list, i) {
    let subtasks = taskLists[list][i]["subtasks"];
    let finishedSubtasks = taskLists[list][i]["subtasksDone"];
    for (let j = 0; j < subtasks.length; j++) {
        let subtask = subtasks[j];
        if (subtask["done"] > 0) {
            finishedSubtasks.push(subtask);
        }
    }
}


/**
 * adds the different categories as option elements from the categories array. The index will lter determine the category
 *
 */
function taskRenderCategoryOptions() {
    let selector = document.getElementById("category_selector");
    for (let index = 0; index < categories.length; index++) {
        const category = categories[index];
        selector.innerHTML += `
        <option value="${index}">${category["name"]}</option>
        `;
    }
}