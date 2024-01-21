///BOARD TEMPLATES///

/**
 * renders the board into the content via multiple smaller functions
 *
 * @param {element} element element that needs to be displayed as active
 */
function renderBoard(element) {
    document.getElementById("help-link").classList.remove("d-none");
    navigationMenuClicked(element);
    let content = document.getElementById("content");
    content.innerHTML = /* html */ `
    ${renderBoardOverlay()}
    ${renderBoardBody()}`;
    overlay = document.getElementById("BoardOverlay");
    overlayBody = document.getElementById("boardOverlaybody");
    blocker = document.getElementById("blocker");
    boardLoadTasks();
}

/**
 *
 * @returns HTML code to create the board in the renderBoard() function
 */
function renderBoardOverlay() {
    return /* html */ `
    <section id="BoardOverlay" class="Boardoverlay" style="display: none;">
        <div id ="blocker" class="blocker"></div>
        <div id="boardOverlaybody" class="overlayBlank"></div>
    </section>`;
}

/**
 *
 * @returns HTML code to create the board in the renderBoard() function
 */
function renderBoardBody() {
    return /* html */ `
    <section class="boardbody">
        ${renderBoardHead()}
        ${renderBoardPanels()}
    </section>`;
}

/**
 *
 * @returns HTML code to create the board in the renderBoard() function
 */
function renderBoardPanels() {
    return /* html */ `
    <div class="panels">
        ${renderBoardTaskTodo()}
        ${renderBoardTaskProgress()}
        ${renderBoardTaskFeedback()}
        ${renderBoardTaskDone()}
    </div>`;
}

/**
 *
 * @returns HTML code to create the board in the renderBoard() function
 */
function renderBoardHead() {
    return /* html */ `
    <div class="head">
        <h1 class="h1">Board</h1>
        <div class="headleft">
            <div class="searchbar">
                <input onkeyup="boardResetSearch(), boardSearch()" type="text" id="taskSearch" placeholder="Find task">
                <div class="divider"></div>
                <div class="searchbutton">
                    <img onclick="boardSearch()" src="./assets/img/search.svg" alt="">
                </div>
            </div>
            <div class="headAddButton">
              <button onclick="boardAddTask('toDo'); taskSetPrio(1) ">Add task</button>
            </div>
        </div>
    </div>`;
}

/**
 *
 * @returns HTML code to create the board in the renderBoard() function
 */
function renderBoardTaskTodo() {
    return /* html */ `
    <div class="taskpanel">
        <div class="panelhead">
            <h2>To do</h2>
            <button onclick="boardAddTask('toDo')" class="add"></button>
        </div>
        <div id="toDo" class="panelbody" ondrop="drop('toDo')" ondragleave="removeHighlight(this)" ondragover="allowDrop(event); highlight(this)"></div>
    </div>`;
}

/**
 *
 * @returns HTML code to create the board in the renderBoard() function
 */
function renderBoardTaskProgress() {
    return /* html */ `
    <div class="taskpanel">
        <div class="panelhead">
            <h2>In progress</h2>
            <button onclick="boardAddTask('inProgress')" class="add"></button>
        </div>
        <div id="inProgress" class="panelbody" ondrop="drop('inProgress')" ondragleave="removeHighlight(this)" ondragover="allowDrop(event); highlight(this)"></div>
    </div>`;
}

/**
 *
 * @returns HTML code to create the board in the renderBoard() function
 */
function renderBoardTaskFeedback() {
    return /* html */ `
    <div class="taskpanel">
        <div class="panelhead">
            <h2>Await feedback</h2>
            <button onclick="boardAddTask('feedback')" class="add"></button>
        </div>
        <div id="awaitFeedback" class="panelbody" ondrop="drop('feedback')" ondragleave="removeHighlight(this)" ondragover="allowDrop(event); highlight(this)"></div>
    </div>`;
}

/**
 *
 * @returns HTML code to create the board in the renderBoard() function
 */
function renderBoardTaskDone() {
    return /* html */ `
    <div class="taskpanel">
        <div class="panelhead">
            <h2>Done</h2>
        </div>
        <div id="done" class="panelbody" ondrop="drop('done')" ondragleave="removeHighlight(this)" ondragover="allowDrop(event); highlight(this)"></div>
    </div>`;
}

/**
 * fetches the information about the task from the taskLists array and renders a task-card
 * 
 * @param {string} arrayAsString This is the name of the array inside "tasksLists" to which the task is supposed to be added
 * @param {number} i
 * @returns HTML to create the task card in the overlay
 */
function createFullTaskCard(arrayAsString, i) {
    let task = taskLists[arrayAsString][i];
    let category = task["category"];
    let date = new Date(task["dueDate"]).toLocaleString("en", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
    return /*html*/ `
    <section id="DeleteOverlay" class="deleteOverlay" style="display: none;">
       <div onclick="boardGoBack()" id ="Deleteblocker" class="deleteBlocker"></div>
       <div id="DeleteOverlaybody" class="deleteOverlayBlank"></div>
    </section>
    <div class="FullTaskCard">
      <div class="cardheadFull">
          <div class="categorycardFull" style="background-color: ${categories[category]["color"]};">${categories[category]["name"]}</div>
              <img onclick="boardCloseOverlay()" src="./assets/img/close.svg" alt="">
          </div>
          <div class="FullTaskCardBody">
          <h2 class="titleFull">${task["title"]}</h2>
          <p class="descriptionFull">
             ${task["description"]}
          </p>
          <div class="duedateFull">
              <p>Due Date:</p>
          <p>${date}</p>
          </div>
      <div class="prioFull">
          <p>Priority:</p>
          <div>
              ${task["priority"]["priority"]}
              <img class="prioPictureFull" src="${task["priority"]["symbol"]}" alt="">
          </div>
      </div>
      <div class="assigneesFull">
              <p>Assigned to:</p>
          <div class="assigneeListFull scroll" id="assigneeListFull"></div>
      </div>
      <div class="subtasksFull">
          <p>Subtasks:</p>
          <div id="SubtaskListFull" class="subtaskListFull scroll"></div>
        </div>
      
      <div class="editorbarFull">
          <button onclick="boardRenderWarning('${arrayAsString}', ${i})" class="del">Delete</button>
          <img src="./assets/img/Vector 3.svg" alt="">
          <button onclick="boardEditTask('${arrayAsString}', ${i})" class="edit">Edit</button>
      </div>
      </div>
    </div>
      `;
}

/**
 * fetches the information about the task from the taskLists array and renders a task-card
 *
 * @param {string} arrayAsString This is the name of the array inside "tasksLists" to which the task is supposed to be added
 * @param {number} i This is the index of the rendered task in its respective array
 * @returns HTML to create the small task card in the board
 */
function boardCreateTaskCard(arrayAsString, i) {
    let task = taskLists[arrayAsString][i];
    let category = task["category"];
    return /*html*/ `
        <div draggable="true" ontouchcancel="cancelTouch();" ontouchstart="startTouching('${arrayAsString}', ${i}, event);" ontouchmove="moveTouching(event);" ontouchend="endTouching();" ondragstart="startDragging('${arrayAsString}',${i})" onclick="boardRenderFullTaskCard('${arrayAsString}', ${i})" class="taskcard">
          <div class="categorycard" style="background-color: ${categories[category]["color"]};">${categories[category]["name"]}</div>
          <h2>${task["title"]}</h2>
          <p class="descriptioncard">
              ${task["description"]}
          </p>
          <div id="subtaskscard${arrayAsString}${i}" class="subtaskscard">
              <label>${task["subtasksDone"].length}/${task["subtasks"].length} Subtasks</label>
              <progress id="progressbar${arrayAsString}${i}" max="100" value="0"></progress>
          </div>
          <div class="cardBottom">
              <div id="assignees${arrayAsString}${i}" class="assignees"></div>
              <img src="${task["priority"]["symbol"]}" alt=""> 
          </div>
        </div>
      `;
}

/**
 * fetches the information about the task from the taskLists array and renders an editor, with the information from the JSON as the value of the inputs
 * 
 * @param {string} arrayAsString This is the name of the array inside "tasksLists" to which the task is supposed to be added
 * @param {*} i 
 * @returns  HTML to create the task card editor in the overlay
 */
function boardCreateTaskEditor(arrayAsString, i) {
    let task = taskLists[arrayAsString][i];
    subtasks = task["subtasks"];
    assignees = task["assignees"];
    let date = new Date(task["dueDate"]);

    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let year = date.getFullYear();
    return /*html*/ `
  <div onclick="taskCloseOverlay(event, this)" class="cardheadEdit">
    <img onclick="boardCloseOverlay()" src="./assets/img/close.svg" alt="">
  </div>
  <div onclick="taskCloseOverlay(event, this)" class="TaskEditorBody scroll">
      <input id="category_selector" style="display: none" value="${task["category"]}" type="text">
  <div class="titleEdit">
    <h2>Title</h2>
    <input id="title" type="textbox" placeholder="Enter a title" value="${task["title"]}">
    <div class="Taskerror" style="display: none;" id="errorTitle"> This field needs to be filled out</div>
  </div>
  <div class="descriptionEdit">
    <h2>Description</h2>
    <textarea name="" class="scroll" id="description" cols="56" rows="10" placeholder="Enter a Description">${task["description"]}</textarea>
  </div>
  <div class="duedateEdit">
      <p>Due Date:</p>
      <input id="due" type="date" data-date="" data-date-format="DD MMMM YYYY" value="${year}-${month}-${day}">
      <div class="Taskerror" style="display: none;" id="errorDate">You can not select a date that is in the Past</div>
  </div>
  <div class="prioEdit">
      <p>Priority:</p>
        <div class="priocontainerEdit">
          <div onclick="taskSetPrio(0)" id="Prio0">
            Urgent
            <img id="Prio0_img" src="./assets/img/Prio_alta.png" class="">
          </div>
          <div onclick="taskSetPrio(1)" id="Prio1">
            Medium
            <img id="Prio1_img" src="./assets/img/Prio_media.png" class="">
          </div>
          <div onclick="taskSetPrio(2)" id="Prio2">
            Low
            <img id="Prio2_img" src="./assets/img/Prio_baja.png" class="">
          </div>
        </div>
        <div class="Taskerror" style="display: none;" id="errorPriority"> You need to Select a Priority</div>
        <div class="Taskerror" style="display: none;" id="errorCategory">You need to Select a Category</div>
  </div>
  <div class="assignment">
      <h2>Assigned to</h2>
      <div onclick="taskOpenOverlay(event)" class="assignmentInput" id="assignmentInput">
        <input  onkeyup="taskSearchAssignees()" id="assigner" class="assignmentSelect" placeholder="Select contact to assign">
        <div id="assignmentSelectButton" onclick="taskCloseOverlay(event, this)">
          <img src="./assets/img/arrow_drop_downaa.svg" alt="">
        </div>
      </div> 
      <div onclick="preventClose(event)" class="assigneeOptionContainer" id="assigneeOptionContainer" style="display: none">
          <div  id="assign_select" class="assignmentContainer scroll"></div>
          <div class="ContactButtonContainer">
              <div onclick="goToContacts()" class="newContactButton" id="assignmentNewContact">Add New contact
                  <img src="./assets/img/person_add.svg" alt="">
              </div> 
          </div>
      </div>
      <div class="assigneeList scroll" id="assigneeList"></div>
  </div>
  <div class="subtasksEdit">
      <p>Subtasks:</p>
      <div class="subtaskInputContainer">
          <input class="subtaskInput" onkeyup="taskChangeSubtaskAppearance()" onkeydown="taskAddSubtasksOnEnter(event)" id="subtasks" type="text" placeholder="Add new Subtask">
          <div class="subtaskimages" id="subtaskField">
              <img src="./assets/img/Subtasks icons11.svg" alt="">
          </div>
      </div>
      <div class="addedSubtasks scroll" id="addedSubtasks"></div>
  </div>
  </div>
  <div class="editorBottom">
    <button onclick="taskAddEditedTask('${arrayAsString}', ${i})" class="create">Ok</button>
  </div>
  </div>
  `;
}


/**
 * 
 * @returns HTML for the boardDisplayAssigneesFull
 */
function boardCreateAssigneesFull(user) {
    return /*html*/ `
  <div class="assigneeFull">
    <div class="initials-logo" style="background-color: ${
      user.color
    }">${getInitials(user.name)}</div>
    <div class="assigneeNameFull">${user.name}</div>
  </div>
  `;
}

/**
 * 
 * @returns HTML for the boardDisplayAssignees
 */
function boardCreateAssignees(user) {
    return /*html*/ `
  <div class="initials-logo" style="background-color: ${
    user.color
  }">${getInitials(user.name)}</div>`;
}

/**
 * 
 * @param {integer} count count of assignees
 * @returns 
 */
function boardCreateAssigneesCount(count) {
    return /*html*/ `
  <div class="initials-logo" style="background-color: ${getColor(count)}">
    +${count}
  </div>`;
}

function boardCreateUnfinishedSubtasksFull(arrayAsString, i, j, subtask) {
    return /*html*/ `
  <div class="singleSubtaskFull">
    <img id="checkbox${j}" class="checkbox" onclick="boardFinishSubtask('${arrayAsString}', ${i}, ${j})" src="./assets/img/Rectangle 5.svg" alt="">
    <p>
      ${subtask["task"]}
    </p>
  </div>
  `;
}

function boardCreateFinishedSubtasksFull(arrayAsString, i, j, subtask) {
    return /*html*/ `
  <div class="singleSubtaskFull">
    <img id="checkbox${j}" class="checkbox" onclick="boardRevertSubtask('${arrayAsString}', ${i}, ${j})" src="./assets/img/Check button.svg" alt="">
    <p>
      ${subtask["task"]}
    </p>
  </div>
  `;
}