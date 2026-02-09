const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");
const completedList = document.getElementById("completedList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
  // Clear existing lists
  list.innerHTML = "";
  completedList.innerHTML = "";
  
  // Track if there are active or completed tasks for bulk delete button states
  let hasActiveTasks = false;
  let hasCompletedTasks = false;


  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.setAttribute("data-index", index);

    // COMPLETED TASKS
    if (task.completed) {
      li.className = "completed";

      // Show completed tasks in the completed section and active tasks in the active section
      hasCompletedTasks = true;

      // Show created date for active tasks, and completed date for completed tasks
      li.innerHTML = `
        <div>
          <strong class="task-text">${task.text}</strong><br>
          <small>Added: ${task.createdAt}</small><br>
          <small>Completed: ${task.completedAt}</small>
        </div>
        <div>
          <button class="restore-btn" onclick="toggleComplete(${index})">↩</button>
          <button class="edit-btn" onclick="editTask(${index})">Edit</button>
        </div>
      `;
      // Show completed tasks in the completed section and active tasks in the active section
      completedList.appendChild(li);

    // ACTIVE TASKS
    } else {
      // No special class for active tasks
      hasActiveTasks = true;

      // Show created date for active tasks, and completed date for completed tasks
      li.innerHTML = `
        <div>
          <strong class="task-text">${task.text}</strong><br>
          <small>Added: ${task.createdAt}</small>
        </div>
        <div>
          <button class="complete-btn" onclick="toggleComplete(${index})">✔</button>
          <button class="delete-btn" onclick="deleteTask(${index})">✖</button>
          <button class="edit-btn" onclick="editTask(${index})">Edit</button>
        </div>
      `;
      list.appendChild(li);
    }
  });

  // Active tasks delete button
  clearActiveBtn.disabled = !hasActiveTasks;
  clearActiveBtn.classList.toggle("active", hasActiveTasks);

  // Completed tasks delete button
  clearCompletedBtn.disabled = !hasCompletedTasks;
  clearCompletedBtn.classList.toggle("active", hasCompletedTasks);
}

function addTask() {
  if (input.value.trim() === "") return;

  tasks.push({
    text: input.value,
    completed: false,
    createdAt: new Date().toLocaleString(),
    completedAt: null
  });

  input.value = "";
  save();
}

function editTask(index) {
  const li = document.querySelector(`li[data-index="${index}"]`);
  const task = tasks[index];

  const input = document.createElement("input");
  input.type = "text";
  input.value = task.text;
  input.className = "edit-input";

  const textElement = li.querySelector(".task-text");
  textElement.replaceWith(input);
  input.focus();

  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      saveEdit();
    }
  });

  input.addEventListener("blur", saveEdit);

  function saveEdit() {
    const newText = input.value.trim();
    if (newText !== "") {
      task.text = newText;
    }
    save();
  }
}

const clearActiveBtn = document.getElementById("clearActiveBtn");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");

function toggleComplete(index) {
  const task = tasks[index];
  task.completed = !task.completed;

  if (task.completed) {
    task.completedAt = new Date().toLocaleString();
  } else {
    task.completedAt = null;
  }

  save();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  save();
}

function deleteActiveTasks() {
  if (!confirm("Delete all active tasks?")) return;

  tasks = tasks.filter(task => task.completed);
  save();
}

function deleteCompletedTasks() {
  if (!confirm("Delete all completed tasks?")) return;

  tasks = tasks.filter(task => !task.completed);
  save();
}

clearActiveBtn.addEventListener("click", deleteActiveTasks);
clearCompletedBtn.addEventListener("click", deleteCompletedTasks);

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

addBtn.addEventListener("click", addTask);

input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
}
});

renderTasks();
