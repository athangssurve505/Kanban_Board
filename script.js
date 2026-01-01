const newTaskWindow = document.querySelector(".new-task-adder-window");
const to_Do_Bottom = document.querySelector(".to-do .bottom");


// Buttons
const newTaskOpenBtn = document.querySelector("#new-task-opener")
const closeBtn = document.querySelector(".close")
const newTaskCreatorBtn = document.querySelector("#new-task-creator")

//Inputs
const title = document.querySelector("#title")
const content = document.querySelector("#content")


function checkInputs() {
    newTaskCreatorBtn.disabled = !(
      title.value.trim() &&
      content.value.trim()
    );
  }
  
function addTaskToStorage() {
    // 1. Read existing tasks OR fallback
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  
    // 2. Add new task
    tasks.push({
      id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      title: title.value,
      content: content.value,
    });
  
    // 3. Save back as string
    localStorage.setItem("tasks", JSON.stringify(tasks));
  
  }
  

function fetchTasksFromStorage(){
  if(localStorage.getItem("tasks")){
    const tasksHolder = JSON.parse(localStorage.getItem("tasks"));
    tasksHolder.forEach(task =>{
      const taskDiv = document.createElement("div");
      const titleElement = document.createElement("h1");
      const contentElement = document.createElement("p");
      const deleteBtn = document.createElement("button");
      taskDiv.dataset.id = task.id;

    titleElement.textContent = task.title;
    contentElement.textContent = task.content;

    taskDiv.classList.add("card");
    deleteBtn.classList.add("btn")

    deleteBtn.innerHTML = "Delete"
    deleteBtn.dataset.action = "delete";
    taskDiv.append(titleElement,contentElement,deleteBtn);

    to_Do_Bottom.appendChild(taskDiv);

    
    
    })
  }
}

function deleteTask(taskId){
  const tasks  = JSON.parse(localStorage.getItem("tasks"));

  const updatedTasks = tasks.filter(task => task.id !== taskId);

  localStorage.setItem("tasks",updatedTasks);

}

fetchTasksFromStorage();

// Event listeners 
title.addEventListener("input", checkInputs);
content.addEventListener("input", checkInputs);

newTaskOpenBtn.addEventListener("click",()=>{
    newTaskWindow.style.display = "flex";
})
closeBtn.addEventListener("click",()=>{
    newTaskWindow.style.display = "none";
})

newTaskCreatorBtn.addEventListener("click",()=>{
  addTaskToStorage();
})

to_Do_Bottom.addEventListener("click", (e)=>{

  if(e.target.dataset.action ==="delete"){
    const taskCard = e.target.closest(".card");
    taskId = taskCard.dataset.id;
    deleteTask();
    taskCard.remove();
    
    }
  
})




   