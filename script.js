const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");
const completedList = document.getElementById("completedList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
let searchQuery = "";
let darkMode = localStorage.getItem("darkMode") === "true";
let lastBulkDelete = null;

function renderTasks() {
  // Clear existing lists
  list.innerHTML = "";
  completedList.innerHTML = "";

  const trashList = document.getElementById("trashList");
  trashList.innerHTML = "";

  // Track if there are active or completed tasks for bulk delete button states
  let hasActiveTasks = false;
  let hasCompletedTasks = false;

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.text.toLowerCase().includes(searchQuery);

    if (task.trash) return true; // Always show trashed tasks in the trash section

    if (currentFilter === "active") return !task.completed && matchesSearch;
    if (currentFilter === "completed") return task.completed && matchesSearch;
    return matchesSearch;
});

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.setAttribute("data-index", index);

    // Trash tasks
    if (task.trash) {
      // Show created date for active tasks, and completed date for completed tasks
      li.innerHTML = `
        <div>
          <strong class="task-text">${task.text}</strong><br>
          <small>Deleted</small>
        </div>
        <div>
          <button class="restore-btn" onclick="restoreFromTrash(${index})">↩</button>
          <button class="delete-btn" onclick="permanentDelete(${index})">✖</button>
        </div>
      `;
      // Don't show trashed tasks in active/completed lists
      trashList.appendChild(li);
      return;
    }

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
          <button class="delete-btn" onclick="deleteCompletedTask(${index})">✖</button>
          <button class="edit-btn" onclick="editTask(${index})">Edit</button>
        </div>
      `;
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
    trash: false,
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
  tasks[index].trash = true;
  save();
}

function deleteCompletedTask(index) {
  if (!confirm("Move this completed task to Trash?")) return;
  deleteTask(index);
}


function deleteActiveTasks() {
  if (!confirm("Delete all active tasks?")) return;

  lastBulkDelete = tasks.filter(task => !task.completed);
  tasks = tasks.filter(task => task.completed);
  save();
}

function deleteCompletedTasks() {
  if (!confirm("Move all completed tasks to Trash?")) return;

  lastBulkDelete = tasks.filter(task => task.completed && !task.trash);

  tasks.forEach(task => {
    if (task.completed) {
      task.trash = true;
    }
  });

  save();
}

clearActiveBtn.addEventListener("click", deleteActiveTasks);
clearCompletedBtn.addEventListener("click", deleteCompletedTasks);

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  undoBtn.style.display = lastBulkDelete ? "block" : "none";
  renderTasks();
}

addBtn.addEventListener("click", addTask);

input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
}
});

renderTasks();

const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");

searchInput.addEventListener("input", () => {
  searchQuery = searchInput.value.toLowerCase();
  renderTasks();
});

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;

    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    renderTasks();
  });
});

const darkModeToggle = document.getElementById("darkModeToggle");

function applyDarkMode() {
  document.body.classList.toggle("dark", darkMode);
  darkModeToggle.textContent = darkMode ? "☀️ Light Mode" : "🌙 Dark Mode";
}

darkModeToggle.addEventListener("click", () => {
  darkMode = !darkMode;
  localStorage.setItem("darkMode", darkMode);
  applyDarkMode();
});

applyDarkMode();

const undoBtn = document.getElementById("undoBtn");
undoBtn.style.display = lastBulkDelete ? "block" : "none";

undoBtn.addEventListener("click", () => {
  if (!lastBulkDelete) return;

  lastBulkDelete.forEach(task => {
    task.trash = false;
  });

  lastBulkDelete = null;
  undoBtn.style.display = "none";
  save();
});

function restoreFromTrash(index) {
  tasks[index].trash = false;
  save();
}

function permanentDelete(index) {
  if (!confirm("Delete permanently?")) return;
  tasks.splice(index, 1);
  save();
}
