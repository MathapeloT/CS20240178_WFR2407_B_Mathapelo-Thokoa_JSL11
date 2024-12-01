// TASK: import helper functions from utils
import {
  getTasks, createNewTask, patchTask, putTask, saveTasks, deleteTask,
} from "./utils/taskFunctions.js";

// TASK: import initialData
import {
  initialData
} from "./initialData.js";

/*************************************************************************************************************************************************
 * FIX BUGS!!!
 * **********************************************************************************************************************************************/

// Function checks if local storage already has data, if not it loads initialData to localStorage
function initializeData() {
  if (!localStorage.getItem("tasks")) {
    localStorage.setItem("tasks", JSON.stringify(initialData)); 
    localStorage.setItem("showSideBar", "true")
  } else {
    console.log("Data already exists in localStorage");
  }
}

// TASK: Get elements from the DOM
const elements = {
  darkIcon: document.getElementById("icon-dark"),
  typeToggle: document.getElementById("switch"),
  labelToggle: document.getElementById("label-checkbox-them"),
  navSideBar: document.getElementById("side-bar-div"),
  boardsNavLinks: document.getElementById("boards-nav-links-div"),
  logo: document.getElementById("logo"),
  sideLogo: document.getElementById("side-logo-div"),
  logoLight: document.getElementById("logo-light"),
  sidePanel: document.getElementById("sidepanel"), 
  typeToggle: document.getElementById("switch"),
  labelToggle: document.getElementById("label-checkbox-theme"),
  lightIcon: document.getElementById("icon-light"),
  showSideBarBtn: document.getElementById("show-side-bar-btn"),
  hideSideBarBtn: document.getElementById("hide-side-bar-btn"),
  hideSideBAr: document.getElementById("icone-hide-sidebar"),
  mainLayout: document.getElementById("layout"),
  mainHeader: document.getElementById("header"),
  headerBoardName: document.getElementById("header-board-name"),
  dropDownBtnIcon: document.getElementById("dropDownIcon"),
  dropDownBtn: document.getElementById("dropDownBtn"),
  addNewTaskBtn: document.getElementById("add-new-task-btn"),
  editBtn: document.getElementById("edit-board-btn"),
  editBtnDiv: document.getElementById("editBoardDiv"),
  deleteBtn: document.getElementById("deleteBoardBtn"),
  todoHeading: document.getElementById("toDoText"),
  todoDiv: document.getElementById("todo-head-div"),
  todoDot: document.getElementById("todo-dot"),
  doingHeading: document.getElementById("doingText"),
  doingDot: document.getElementById("doing-dot"),
  doingDiv: document.getElementById("doing-head-div"),
  doneHeading: document.getElementById("doneText"),
  doneDot: document.getElementById("done-dot"),
  doneDiv: document.getElementById("done-head-div"),
  createTaskBtn: document.getElementById("create-task-btn"),
  editTaskBtn: document.getElementById("edit-btn"),
  deleteTaskBtn: document.getElementById("delete-task-btn"),
  statusSelect: document.getElementById("select-status"),
  cancelAddTaskBtn: document.getElementById("cancel-add-task-btn"),
  editTaskInput: document.getElementById("edit-task-title-input"),
  editTaskModal: document.getElementById("edit-task-form"),
  editTaskWindow: document.getElementById("edit-task-modal"),
  editTaskDiv: document.getElementById("edit-task-header"),
  editInputArea: document.getElementById("edit-task-desc-input"),
  editSelectStatus: document.getElementById("edit-select-status"),
  cancelEditBtn: document.getElementById("cancel-edit-btn"),
  modalWindow: document.getElementById("new-task-modal-window"),
  modalTitle: document.getElementById("modal-title-input"),
  modalDescription: document.getElementById("modal-desc-input"),
  modalStatusSelect: document.getElementById("modal-select-status"),
  titleText: document.getElementById("title-input"),
  descriptionText: document.getElementById("desc-input"),
  filterDiv: document.getElementById("filterDiv"),
  editModalDiv: document.querySelectorAll(".edit-task-modal-window"),
  columnDivs: document.querySelectorAll(".colum-div"),
};

let activeBoard = "";

// Extracts unique board names from tasks
// TASK: FIX BUGS
function fetchAndDisplayBoardsAndTasks() {
  const tasks = getTasks();
  const boards = [...new Set(tasks.map((task) => task.board).filter(Boolean))];
  displayBoards(boards);
  if (boards.length > 0) {
    const localStorageBoard = JSON.parse(localStorage.getItem("activeBoard"));
    activeBoard = localStorageBoard ? localStorageBoard :  boards[0]; 
    elements.headerBoardName.textContent = activeBoard;
    styleActiveBoard(activeBoard);
    refreshTasksUI();
  }
};

// Creates different boards in the DOM
// TASK: Fix Bugs
function displayBoards(boards) {
  const boardsContainer = document.getElementById("boards-nav-links-div");
  boardsContainer.innerHTML = ""; // Clears the container

  boards.forEach((board) => {
    const boardElement = document.createElement("button");
    boardElement.textContent = board;
    boardElement.classList.add("board-btn");
    boardElement.addEventListener("click", () => { 
      elements.headerBoardName.textContent = board;
      filterAndDisplayTasksByBoard(board);
      activeBoard = board //assigns active board
      localStorage.setItem("activeBoard", JSON.stringify(activeBoard))
      styleActiveBoard(activeBoard);
    });
    boardsContainer.appendChild(boardElement);
  });

};

// Filters tasks corresponding to the board name and displays them on the DOM.
// TASK: Fix Bugs
function filterAndDisplayTasksByBoard(boardName) {
  const tasks = getTasks(); // Fetch tasks from a simulated local storage function
  const filteredTasks = tasks.filter((task) => task.board === boardName);

  // Ensure the column titles are set outside of this function or correctly initialized before this function runs

  elements.columnDivs.forEach(column => {
    const status = column.getAttribute("data-status");
    // Reset column content while preserving the column title
    column.innerHTML = `<div class="column-head-div">
                          <span class="dot" id="${status}-dot"></span>
                          <h4 class="columnHeader">${status.toUpperCase()}</h4>
                        </div>`;

    const tasksContainer = document.createElement("div");
    tasksContainer.classList.add("tasks-container");
    column.appendChild(tasksContainer);

    filteredTasks.filter(task => task.status === status)
    .forEach(task => { 
      const taskElement = document.createElement("div");
      taskElement.classList.add("task-div");
      taskElement.textContent = task.title;
      taskElement.setAttribute("data-task-id", task.id);

      // Listen for a click event on each task and open a modal
      taskElement.addEventListener("click", () => { 
        openEditTaskModal(task);
      });

      tasksContainer.appendChild(taskElement);
    });
  });
}


function refreshTasksUI() {
  filterAndDisplayTasksByBoard(activeBoard);
};

// Styles the active board by adding an active class
// TASK: Fix Bugs
function styleActiveBoard(boardName) {
  document.querySelectorAll(".board-btn").forEach(btn => { 
    if(btn.textContent === boardName) {
      btn.classList.add("active")
    } else {
      btn.classList.remove("active") 
    }
  });
};


function addTaskToUI(task) {
  const column = document.querySelector(`.column-div[data-status="${task.status}"]`); 
  if (!column) {
    console.error(`Column not found for status: ${task.status}`);
    return;
  }

  let tasksContainer = column.querySelector(".tasks-container");
  if (!tasksContainer) {
    console.warn(`Tasks container not found for status: ${task.status}, creating one.`);
    tasksContainer = document.createElement("div");
    tasksContainer.className = "tasks-container";
    column.appendChild(tasksContainer);
  }

  const taskElement = document.createElement("div");
  taskElement.className = "task-div";
  taskElement.textContent = task.title; // Modify as needed
  taskElement.setAttribute("data-task-id", task.id);

  taskElement.addEventListener("click", () => {
    openEditTaskModal(task);
  });
  
  tasksContainer.appendChild(taskElement); 
}



function setupEventListeners() {
  // Cancel adding new task event listener
  const cancelAddTaskBtn = document.getElementById("cancel-add-task-btn");
  cancelAddTaskBtn.addEventListener("click", () => {
    toggleModal(false);
    resetFormInputs();
    elements.filterDiv.style.display = "none"; // Also hide the filter overlay
  });

  // Clicking outside the modal to close it
  filterDiv.addEventListener("click", () => {
    toggleModal(false);
    resetFormInputs();
    elements.filterDiv.style.display = "none"; // Also hide the filter overlay
  });

  // Show sidebar event listener
  elements.hideSideBarBtn.addEventListener("click", () => toggleSidebar(false));
  elements.showSideBarBtn.addEventListener("click", () => toggleSidebar(true));

  // Theme switch event listener
  elements.typeToggle.addEventListener("change", toggleTheme);

  // Show Add New Task Modal event listener
  elements.addNewTaskBtn.addEventListener("click", () => {
    toggleModal(true);
    elements.filterDiv.style.display = "block"; // Also show the filter overlay
  });

  // Add new task form submission event listener
  elements.modalWindow.addEventListener("submit", (event) => {
    addTask(event);
  });
}; 

// Toggles tasks modal
// Task: Fix bugs
function toggleModal(show, modal = elements.modalWindow) {
  modal.style.display = show ? "block" : "none"; 
};

function resetFormInputs() {
  elements.titleText.value = "";
  elements.descriptionText.value = "";
  elements.statusSelect.value = "";
};

/*************************************************************************************************************************************************
 * COMPLETE FUNCTION CODE
 * **********************************************************************************************************************************************/

function addTask(event) {
  event.preventDefault(); 

  //Assign user input to the task object
    const task = {
      status: document.getElementById("select-status").value,
      title: document.getElementById("title-input").value,
      description: document.getElementById("desc-input").value,
      board: activeBoard,
    };
    const newTask = createNewTask(task);
    if (newTask) {
      addTaskToUI(newTask);
      toggleModal(false);
      elements.filterDiv.style.display = "none"; // Also hide the filter overlay
      event.target.reset();
      refreshTasksUI();
    }
}


function toggleSidebar(show) {
 const sideBar = document.getElementById("side-bar-div");
 sideBar.style.display = show ? "block" : "none";
 elements.showSideBarBtn.style.display = show ? "none" : "block";
}

function toggleTheme() {
 const logo = document.getElementById("logo");
 const isLightTheme = document.body.classList.toggle("light-theme");
 logo.setAttribute("src", isLightTheme? "./assets/logo-light.svg" : "./assets/logo-dark.svg");
}



function openEditTaskModal(task) {
  // Set task details in modal inputs

  const title = document.getElementById("edit-task-title-input");
  const desc = document.getElementById("edit-task-desc-input");
  const status = document.getElementById("edit-select-status");

  title.value = task.title;
  desc.value = task.description;
  status.value = task.status;

  // Get button elements from the task modal

  const saveChangesBtn = elements.saveChangesBtn;
  const deleteTaskBtn = document.getElementById("delete-task-btn");
  const cancelEditBtn = document.getElementById("cancel-edit-btn");

  cancelEditBtn.addEventListener("click", () => (elements.editTaskModalWindow.style.display = "none")
);
  // Call saveTaskChanges upon click of Save Changes button
 
  saveChangesBtn.onclick = () => saveTaskChanges(task.id);


  // Delete task using a helper function and close the task modal

  deleteTaskBtn.onclick = () => {
    deleteTask(task.id);
    toggleModal(false, elements.editTaskWindow); // Show the edit task modal
    refreshTasksUI();
};


function saveTaskChanges(taskId) {
  // Get new user inputs
  

  // Create an object with the updated task details
  const updatedTask = {
    title: elements.editTaskTitleInput,value,
    description: elements.editTaskDescInput.value,
    status: elements.editSelectStatus.value,
    board: activeBoard,
  } 

  // Update task using a helper function
  putTask(taskId, updatedTask);

  // Close the modal and refresh the UI to reflect the changes
  elements.editTaskModalWindow.style.display = "none";
  refreshTasksUI();
};
}

/*************************************************************************************************************************************************/

document.addEventListener("DOMContentLoaded", function() {
  initializeData();
  init(); // init is called after the DOM is fully loaded
  refreshTasksUI();
});

function init() {
  initializeData();
  setupEventListeners();

  const showSidebar = localStorage.getItem("showSideBar") === 'true';
  toggleSidebar(showSidebar);
  const isLightTheme = localStorage.getItem("light-theme") === 'enabled';
  document.body.classList.toggle("light-theme", isLightTheme);
  fetchAndDisplayBoardsAndTasks(); // Initial display of boards and tasks
}; 
