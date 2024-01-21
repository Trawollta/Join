let splashAnimation = "animate-fade-in";
let splashAnimation2 = "animate-fade-out";

///SUMMARY TEMPLATES///

/**
 * this function calls the render summary function
 * 
 * @param {HTMLElement} element - This element will get the class active
 */
function renderSummary(element) {
    document.getElementById("help-link").classList.remove("d-none");
    if (element != undefined) {
        navigationMenuClicked(element);
    }
    renderSummaryContent();
    splashAnimation = "animate-done";
    splashAnimation2 = "animate-done";
}

/**
 * this function render the summary content
 */
function renderSummaryContent() {
    let content = document.getElementById("content");
    content.innerHTML = /* html */ `
    ${renderSummaryWelcome("mobile "+splashAnimation2)}
    <div class="summary-content ${splashAnimation}">
        ${renderSummaryHeader()}
        <div class="summary-info">
            ${renderSummaryTask()}
            ${renderSummaryWelcome("desktop")}
        </div>
    </div>`;

}


function renderSummaryTask() {
    return /*html*/ `
    <div class="summary-task">
        <div class="summary-line1">
            ${renderSummaryTodo()}
            ${renderSummaryDone()}
        </div>
            ${renderSummaryUpcoming()}
        <div class="summary-line3">
            ${renderSummaryBoard()}
            ${renderSummaryProgress()}
            ${renderSummaryFeedback()}
        </div>
    </div>`;
}


function renderSummaryHeader() {
    return /* html */ `
    <div class="summary-header">
        <h1>Join 360</h1>
        <img class="img-full" src="./assets/img/blue-stroke.svg">
        <h2>Key Metrics at a Glance</h2>
        <img class="img-responsive d-none" src="./assets/img/blue-stroke.svg">
    </div>`;
}

/**
 * @returns html
 */
function renderSummaryTodo() {
    return /* html */ `
    <div class="summary-todo" onclick = "openBoard()">
        ${renderSummaryTodoSvg()}
        <div>
            <span id="todo-amount">${taskLists.toDo.length}</span>
            <p>To-do</p>
        </div>
    </div>`;
}

function renderSummaryTodoSvg() {
    return /* html */ `
    <svg width="69" height="70" viewBox="0 0 69 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="34.5" cy="35" r="34.5" fill="#2A3647"/>
        <mask id="mask0_86609_5986" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="18" y="19" width="33" height="32">
            <rect x="18.5" y="19" width="32" height="32" fill="#D9D9D9"/>
        </mask>
        <g mask="url(#mask0_86609_5986)">
            <path d="M25.1667 44.3332H27.0333L38.5333 32.8332L36.6667 30.9665L25.1667 42.4665V44.3332ZM44.2333 30.8998L38.5667 25.2998L40.4333 23.4332C40.9444 22.9221 41.5722 22.6665 42.3167 22.6665C43.0611 22.6665 43.6889 22.9221 44.2 23.4332L46.0667 25.2998C46.5778 25.8109 46.8444 26.4276 46.8667 27.1498C46.8889 27.8721 46.6444 28.4887 46.1333 28.9998L44.2333 30.8998ZM42.3 32.8665L28.1667 46.9998H22.5V41.3332L36.6333 27.1998L42.3 32.8665Z" fill="white"/>
        </g>
    </svg>`;
}

function renderSummaryDone() {
    return /* html */ `
    <div class="summary-done" onclick = "openBoard()">
        ${renderSummaryDoneSvg()}
        <div>
            <span id="done-amount">${taskLists.done.length}</span>
            <p>Done</p>
        </div>
    </div>`;
}

function renderSummaryDoneSvg() {
    return /* html */ `
    <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="35" cy="35" r="34.5" fill="#2A3647"/>
        <path d="M20.0283 35.0001L31.2571 46.0662L49.9717 23.9341" stroke="white" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
}

function renderSummaryUpcoming() {
    return /* html */ `
    <div class="summary-line2" onclick = "openBoard()">
    <div class="summary-upcoming">
        <div class="upcoming-amount">
            <div class="upcoming-img"></div>
            <div>
                <span id="upcoming-amount">${getCountPriority()}</span>
                <p>Urgent</p>
            </div>
        </div>
        <svg width="2" height="106" viewBox="0 0 2 106" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1.98828V104.011" stroke="#D1D1D1" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <div class="summary-date">
            <span class="next-date">${getDeadlineDate()}</span>
            <p>Upcoming Deadline</p>
        </div>                      
    </div>
    </div>`;
}

function renderSummaryBoard() {
    return /* html */ `
    <div class="summary-board" onclick = "openBoard()">
        <span id="board-amount">${taskLists.inProgress.length + taskLists.toDo.length + taskLists.feedback.length}</span>
        <p>Tasks in Board</p>
    </div>`;
}

function renderSummaryProgress() {
    return /* html */ `
    <div class="summary-progress" onclick = "openBoard()">
        <span id="progress-amount">${taskLists.inProgress.length}</span>
        <p>Tasks in Progress</p>
    </div>`;
}

function renderSummaryFeedback() {
    return /* html */ `
    <div class="summary-feedback" onclick = "openBoard()">
        <span id="feedback-amount">${taskLists.feedback.length}</span>
        <p>Awaiting Feedback</p>
    </div>`;
}


function renderSummaryWelcome(responsiveClass) {
    return /* html */ `
    <div class="summary-welcome ${responsiveClass}">
        <div class="summary-greeting">${greetTime()}</div>
        <div class="summary-user">${getUserGreeting()}</div>
    </div>`;
}