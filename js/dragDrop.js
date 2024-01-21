let currentDraggedElement;
let cloneMoveTouch;
let onTouchScrollInterval;

/**
 * This function saves the selected task in a variable
 *
 * @param {string} srcArray - this is the name of the array to move from
 * @param {number} srcIndex - this is the index of the task in the array that is to be moved
 */
function startDragging(srcArray, srcIndex) {
    currentDraggedElement = { srcArray, srcIndex };
}

/**
 * This function adds the taks to be moved to the target array and deletes it from the source array
 *
 * @param {string} targetArrayName - this is the name of the array into which the task should be moved
 */
function drop(targetArrayName) {
    removeHighlight();
    tryMoveTaskToArray(targetArrayName);
}

/**
 * This function saves the selected task in a variable
 *
 * @param {string} srcArray - this is the name of the array to move from
 * @param {number} srcIndex - this is the index of the task in the array that is to be moved
 * @param {touchstart} event
 */
function startTouching(srcArray, srcIndex, event) {
    currentDraggedElement = { srcArray, srcIndex };
    cloneMoveTouch = event.currentTarget.cloneNode(true);
    cloneMoveTouch.classList.add("taskcard-clone");
    cloneMoveTouch.style.width = `${event.currentTarget.clientWidth}px`;
    document.body.appendChild(cloneMoveTouch);
}

/**
 * Moves the selected task and makes the moving visible
 *
 * @param {touchmove} event
 */
function moveTouching(event) {
    cloneMoveTouch.xy = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
    };
    cloneMoveTouch.style.top = `${cloneMoveTouch.xy.y}px`;
    cloneMoveTouch.style.left = `${cloneMoveTouch.xy.x}px`;
    let activePanel = getTouchMoveInPanel();
    removeHighlight();
    if (activePanel != "") {
        highlight(activePanel);
    }
    checkAutoScroll(event);
}

/**
 * This function adds the taks to be moved to the target array and deletes it from the source array
 */
async function endTouching() {
    try {
        let targetArray = getTouchMoveInArrayName();
        if (targetArray != "") {
            tryMoveTaskToArray(targetArray);
        }
    } catch (error) {
        console.error(error);
    } finally {
        cancelTouch();
    }
}

/**
 * Cancel the touch drop action
 */
function cancelTouch() {
    currentDraggedElement = {};
    removeHighlight();
    document.querySelectorAll(".taskcard-clone").forEach((e) => e.remove());
    cloneMoveTouch.remove();
}

/**
 * get the name of the array which is related to the panel where task is droped
 * 
 * @returns the name of the array
 */
function getTouchMoveInArrayName() {
    let targetPanel = getTouchMoveInPanel();
    if (targetPanel == "") {
        return "";
    }
    return targetPanel.id.replace("awaitFeedback", "feedback");
}

/**
 * get the related panel where the touch move event is currently positioned
 * 
 * @returns panelobject or empty
 */
function getTouchMoveInPanel() {
    if (cloneMoveTouch.xy == undefined) {
        return "";
    }
    let panelList = document.querySelectorAll(".panelbody");
    for (let i = 0; i < panelList.length; i++) {
        const panel = panelList[i];
        let pXY = panel.getClientRects()[0];
        if (
            pXY.left < cloneMoveTouch.xy.x &&
            cloneMoveTouch.xy.x < pXY.right &&
            pXY.top < cloneMoveTouch.xy.y &&
            cloneMoveTouch.xy.y < pXY.bottom
        ) {
            return panel;
        }
    }
    return "";
}

/**
 * try to move the selected task to the new array
 * 
 * @param {string} targetArrayName 
 */
async function tryMoveTaskToArray(targetArrayName) {
    let sourceArrayName = currentDraggedElement.srcArray;
    let targetArray = taskLists[targetArrayName];
    let sourceArray = taskLists[sourceArrayName];
    let sourceIndex = currentDraggedElement.srcIndex;
    if (sourceArray != targetArray) {
        let taskToMove = sourceArray.splice(sourceIndex, 1);
        targetArray.push(taskToMove[0]);
        await setItem(targetArrayName, JSON.stringify(targetArray));
        await setItem(sourceArrayName, JSON.stringify(sourceArray));
        boardLoadTasks();
        removeHighlight();
    }
}

/**
 * This function allows to drop elements here
 *
 * @param {event} ev - drop event
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * This function highlights the element over which a task is dragged
 *
 * @param {HTMLElement} element - This element will get the class panelbody-highlight
 */
function highlight(element) {
    element.classList.add("panelbody-highlight");
}

/**
 * This function remove the class panelbody-highlight
 */
function removeHighlight() {
    let activeElement = document.querySelector(".panelbody.panelbody-highlight");
    if (activeElement != undefined) {
        activeElement.classList.remove("panelbody-highlight");
    }
}


/**
 * Fuction is called by the moveTouching() function to allow for a dymanic scroll during the drag-drop on mobile devices
 * It calculates the top and bottom 30 pixels. When a touch is registered in the defined areas an interval is called that scrolls up or down.
 * Scroll speed is dynamically determined by how high/low the user touches.
 * clears interval every time an area is touched to avoid stacking intervals
 * 
 * @param {event} event the event of someone touching the screen
 */
function checkAutoScroll(event) {
    let panelsDiv = document.querySelector(".panels");
    let rect = panelsDiv.getBoundingClientRect();

    let touchY = event.touches[0].clientY;
    let topLimit = rect.top + 30;
    let bottomLimit = rect.bottom - 30;

    if (touchY <= topLimit) {
        clearInterval(onTouchScrollInterval);
        onTouchScrollInterval = setInterval(() => {
            panelsDiv.scrollTop -= 10 + (topLimit - touchY);
        }, 50);
    } else if (touchY >= bottomLimit) {
        clearInterval(onTouchScrollInterval);
        onTouchScrollInterval = setInterval(() => {
            panelsDiv.scrollTop += 10 - (bottomLimit - touchY) // Scroll down a bit
        }, 50);
    } else {
        clearInterval(onTouchScrollInterval);
    }
}