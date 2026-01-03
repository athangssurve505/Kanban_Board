// ======================================================
// 1️⃣ DOM ELEMENT & CONSTANT REFERENCES
// ======================================================

// Windows / Containers
const newTaskWindow = document.querySelector(".new-task-adder-window");
const to_Do_Bottom = document.querySelector(".to-do .bottom");
const in_progress_Bottom = document.querySelector(".in-progress .bottom");
const done_Bottom = document.querySelector(".done .bottom");

// Status constants
const STATUS = {
  TODO: "to-do",
  IN_PROGRESS: "in-progress",
  DONE: "done"
};

// Count display elements
const to_Do_para = document.querySelector(".to-do #to-do-para");
const in_progress_para = document.querySelector(".in-progress #in-progress-para");
const done_para = document.querySelector(".done #done-para");

// All columns (drop targets)
let allCols = document.querySelectorAll(".cols .bottom");

// Buttons
const newTaskOpenBtn = document.querySelector("#new-task-opener");
const closeBtn = document.querySelector(".close");
const newTaskCreatorBtn = document.querySelector("#new-task-creator");

// Inputs
const title = document.querySelector("#title");
const content = document.querySelector("#content");


// ======================================================
// 2️⃣ HELPER & CORE LOGIC FUNCTIONS
// ======================================================

// Input validation
function checkInputs() {
  newTaskCreatorBtn.disabled = !(title.value.trim() && content.value.trim());
}

// Get tasks from localStorage
function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

// Save tasks to localStorage
function setTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add new task
function addTaskToStorage() {
  const tasks = getTasks();

  tasks.push({
    id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    title: title.value,
    content: content.value,
    status: STATUS.TODO
  });

  setTasks(tasks);
  fetchTasksFromStorage();
}

// Render tasks to DOM
function fetchTasksFromStorage() {
  const tasks = getTasks();

  // Clear all columns
  to_Do_Bottom.innerHTML = "";
  in_progress_Bottom.innerHTML = "";
  done_Bottom.innerHTML = "";

  tasks.forEach((task) => {
    const taskDiv = document.createElement("div");
    const titleElement = document.createElement("h1");
    const contentElement = document.createElement("p");
    const deleteBtn = document.createElement("button");

    taskDiv.dataset.id = task.id;
    taskDiv.draggable = true;

    titleElement.textContent = task.title;
    contentElement.textContent = task.content;

    taskDiv.classList.add("card");
    deleteBtn.classList.add("btn");
    deleteBtn.textContent = "Delete";
    deleteBtn.dataset.action = "delete";

    taskDiv.append(titleElement, contentElement, deleteBtn);

    if (task.status === STATUS.TODO) to_Do_Bottom.appendChild(taskDiv);
    else if (task.status === STATUS.IN_PROGRESS) in_progress_Bottom.append(taskDiv);
    else done_Bottom.appendChild(taskDiv);

    // Drag start
    taskDiv.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", task.id);
    });
  });

  countCards();
}

// Update task count UI
function countCards() {
  to_Do_para.innerHTML = to_Do_Bottom.children.length;
  in_progress_para.innerHTML = in_progress_Bottom.children.length;
  done_para.innerHTML = done_Bottom.children.length;
}

// Delete task
function deleteTask(taskId) {
  const tasks = getTasks();
  const updatedTasks = tasks.filter(task => task.id !== taskId);
  setTasks(updatedTasks);
}


// ======================================================
// 3️⃣ EVENT LISTENERS
// ======================================================

// Input listeners
title.addEventListener("input", checkInputs);
content.addEventListener("input", checkInputs);

// Modal open / close
newTaskOpenBtn.addEventListener("click", () => {
  newTaskWindow.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  newTaskWindow.style.display = "none";
});

// Create task button
newTaskCreatorBtn.addEventListener("click", () => {
  addTaskToStorage();

  newTaskCreatorBtn.setAttribute("disabled", true);
  setTimeout(() => {
    newTaskCreatorBtn.removeAttribute("disabled");
  }, 1000);
});

// Column events (delete + drag & drop)
allCols.forEach((col) => {

  // Delete button (event delegation)
  col.addEventListener("click", (e) => {
    if (e.target.dataset.action === "delete") {
      const taskCard = e.target.closest(".card");
      const taskId = taskCard.dataset.id;
      deleteTask(taskId);
      taskCard.remove();
    }
  });

  // Drag hover effects
  col.addEventListener("dragover", (e) => {
    e.preventDefault();
    col.classList.add("drag-hover");
  });

  col.addEventListener("dragenter", () => col.classList.add("drag-hover"));
  col.addEventListener("dragleave", () => col.classList.remove("drag-hover"));

  // Drop handler
  col.addEventListener("drop", (e) => {
    e.preventDefault();
    col.classList.remove("drag-hover");

    const taskId = e.dataTransfer.getData("text/plain");
    const tasks = getTasks();
    const draggedTask = tasks.find(task => task.id === taskId);
    if (!draggedTask) return;

    draggedTask.status = col.dataset.col;
    setTasks(tasks);
    fetchTasksFromStorage();
  });
});


// ======================================================
// 4️⃣ INITIAL FUNCTION CALLS
// ======================================================

fetchTasksFromStorage();
