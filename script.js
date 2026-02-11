const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");
const completedList = document.getElementById("completedList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
let searchQuery = "";
let darkMode = localStorage.getItem("darkMode") === "true";
let lastBulkDelete = null;

function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

document.getElementById("backToTopBtn").addEventListener("click", scrollToTop);

window.addEventListener("scroll", () => {
  const btn = document.getElementById("backToTopBtn");
  btn.style.display = window.scrollY > 300 ? "block" : "none";
});

function renderTasks() {
  // Clear existing lists
  list.innerHTML = "";
  completedList.innerHTML = "";

  // Upcoming tasks are shown in a separate section
  const upcomingList = document.getElementById("upcomingList");
  upcomingList.innerHTML = "";

  // Trash is rendered separately to always show trashed items regardless of filter/search
  const trashList = document.getElementById("trashList");
  trashList.innerHTML = "";

  // Reorder sections when Upcoming filter is selected
  const activeSection = document.getElementById("activeSection");
  const completedSection = document.getElementById("completedSection");
  const upcomingSection = document.getElementById("upcomingSection");
  const trashSection = document.getElementById("trashSection");

  const activeListEl = document.getElementById("taskList");
  const completedListEl = document.getElementById("completedList");
  const upcomingListEl = document.getElementById("upcomingList");
  const trashListEl = document.getElementById("trashList");

  // If Upcoming filter is selected → move Upcoming section above Active
  if (currentFilter === "upcoming") {
    activeSection.parentNode.insertBefore(upcomingSection, activeSection);
    activeSection.parentNode.insertBefore(upcomingListEl, activeSection);
  } else {
    // Restore original order: Active → Completed → Upcoming → Trash
    activeSection.parentNode.insertBefore(activeSection, completedSection);
    activeSection.parentNode.insertBefore(activeListEl, completedSection);

    completedSection.parentNode.insertBefore(completedSection, upcomingSection);
    completedSection.parentNode.insertBefore(completedListEl, upcomingSection);

    upcomingSection.parentNode.insertBefore(upcomingSection, trashSection);
    upcomingSection.parentNode.insertBefore(upcomingListEl, trashSection);
  }

  // Track if there are active or completed tasks for bulk delete button states
  let hasActiveTasks = false;
  let hasCompletedTasks = false;

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.text.toLowerCase().includes(searchQuery);

    if (task.trash) return true; // Always show trashed tasks in the trash section

    if (currentFilter === "active")
      return !task.completed && matchesSearch;

    if (currentFilter === "completed")
      return task.completed && matchesSearch;

    if (currentFilter === "upcoming")
      return task.scheduledFor && !task.trash && matchesSearch;

    return matchesSearch;
  }
);

// Sort upcoming tasks by scheduled date (earliest first)
if (currentFilter === "upcoming") {
  filteredTasks.sort((a, b) => {
    const dateA = new Date(a.scheduledFor);
    const dateB = new Date(b.scheduledFor);
    return dateA - dateB;
  });
}

// Update filter button highlight
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.classList.remove("active");
});

document
  .querySelector(`.filter-btn[data-filter="${currentFilter}"]`)
  .classList.add("active");

  filteredTasks.forEach(task => {
  const li = document.createElement("li");
  const originalIndex = tasks.indexOf(task);
  li.setAttribute("data-index", originalIndex);

  if (task.trash) {
    li.innerHTML = `
      <div>
        <strong class="task-text">${task.text}</strong><br>
        <small>Deleted</small>
      </div>
      <div>
        <button class="restore-btn" onclick="restoreFromTrash(${originalIndex})">↩</button>
        <button class="delete-btn" onclick="permanentDelete(${originalIndex})">✖</button>
      </div>
    `;
    trashList.appendChild(li);
    return;
  }

  if (task.completed) {
    hasCompletedTasks = true;

    li.className = "completed";
    li.innerHTML = `
      <div>
        <strong class="task-text">${task.text}</strong><br>
        <small>Added: ${task.createdAt}</small><br>
        <small>Completed: ${task.completedAt}</small><br>
        ${task.scheduledFor ? `<br><small>Scheduled: ${task.scheduledFor}</small>` : ""}
      </div>
      <div>
        <button class="restore-btn" onclick="toggleComplete(${originalIndex})">↩</button>
        <button class="delete-btn" onclick="deleteCompletedTask(${originalIndex})">✖</button>
      </div>
    `;
    completedList.appendChild(li);
  } else {
    hasActiveTasks = true;

    // Detect overdue tasks
    let isOverdue = false;
    if (task.scheduledFor && !task.completed) {
      const scheduledDate = new Date(task.scheduledFor);
      const now = new Date();
      if (scheduledDate < now) {
        isOverdue = true;
      }
    }

    li.innerHTML = `
      <div>
        <strong class="task-text">${task.text}</strong><br>
        <small>Added: ${task.createdAt}</small><br>
        ${task.scheduledFor ? `<small>Scheduled: ${task.scheduledFor}</small>` : ""}
        <small>${task.scheduledFor ? `Scheduled: ${task.scheduledFor}` : ""}</small>
        ${isOverdue ? `<br><small class="overdue">Overdue</small>` : ""}
      </div>
      <div>
        <button class="complete-btn" onclick="toggleComplete(${originalIndex})">✔</button>
        <button class="delete-btn" onclick="deleteTask(${originalIndex})">✖</button>
        <button class="edit-btn" onclick="editTask(${originalIndex})">Edit</button>
      </div>
    `;
    list.appendChild(li);
  }
});

  // Build Upcoming section (all scheduled tasks, regardless of filter)
  const upcomingTasks = tasks
    .filter(task => task.scheduledFor && !task.trash && !task.completed)
    .sort((a, b) => new Date(a.scheduledFor) - new Date(b.scheduledFor));

  upcomingTasks.forEach(task => {
    const li = document.createElement("li");
    const index = tasks.indexOf(task);

    // Detect overdue tasks (scheduled time < now AND not completed)
    let isOverdue = false;
    if (task.scheduledFor && !task.completed) {
      const scheduledDate = new Date(task.scheduledFor);
      const now = new Date();
      if (scheduledDate < now) {
        isOverdue = true;
      }
    }

    li.innerHTML = `
      <div>
        <strong class="task-text">${task.text}</strong><br>
        <small>Status: ${task.completed ? "Completed" : "Active"}</small><br>
        <small>Scheduled: ${task.scheduledFor}</small>
        ${isOverdue ? `<br><small class="overdue">Overdue</small>` : ""}
      </div>
    `;

    if (isOverdue) {
      li.classList.add("overdue-task");
    }

    upcomingList.appendChild(li);
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

  const dateInput = document.getElementById("taskDate").value;
  const timeInput = document.getElementById("taskTime").value;

  let scheduledFor = null;

  // Validate past date/time and show error if invalid
  if (dateInput && timeInput) {
    const selectedDateTime = new Date(`${dateInput}T${timeInput}`);
    const now = new Date();

    scheduledFor = `${dateInput} ${timeInput}`;
  }

  tasks.push({
    text: input.value,
    completed: false,
    trash: false,
    createdAt: new Date().toLocaleString(),
    completedAt: null,
    scheduledFor: scheduledFor
  });

  input.value = "";
  document.getElementById("taskDate").value = "";
  document.getElementById("taskTime").value = "";

  save();
}

const toggleScheduleBtn = document.getElementById("toggleScheduleBtn");
const scheduleFields = document.getElementById("scheduleFields");

toggleScheduleBtn.addEventListener("click", () => {
  const isVisible = scheduleFields.style.display === "flex";

  scheduleFields.style.display = isVisible ? "none" : "flex";
  toggleScheduleBtn.textContent = isVisible ? "Schedule Task" : "Hide Scheduler";
});

function editTask(index) {
  const li = document.querySelector(`li[data-index="${index}"]`);
  const task = tasks[index];

  const contentDiv = li.querySelector("div");

  // Clear the content div so we can rebuild it cleanly
  contentDiv.innerHTML = "";

  // TEXT INPUT
  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.value = task.text;
  textInput.className = "edit-input";

  // DATE INPUT
  const dateInput = document.createElement("input");
  dateInput.type = "date";
  dateInput.className = "edit-input";

  // TIME INPUT
  const timeInput = document.createElement("input");
  timeInput.type = "time";
  timeInput.className = "edit-input";

  // Pre-fill if scheduled
  if (task.scheduledFor) {
    const [date, time] = task.scheduledFor.split(" ");
    dateInput.value = date;
    timeInput.value = time;
  }

  // SAVE BUTTON
  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save";
  saveBtn.className = "edit-save-btn";
  saveBtn.style.background = "#4caf50";

  // CANCEL BUTTON
  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.className = "edit-cancel-btn";
  cancelBtn.style.background = "#e57373";

  // Append inputs + buttons
  contentDiv.appendChild(textInput);
  contentDiv.appendChild(dateInput);
  contentDiv.appendChild(timeInput);
  contentDiv.appendChild(saveBtn);
  contentDiv.appendChild(cancelBtn);

  textInput.focus();

  saveBtn.addEventListener("click", () => {
  const newText = textInput.value.trim();
  const newDate = dateInput.value;
  const newTime = timeInput.value;

  if (newText !== "") {
    task.text = newText;
  }

  const userEnteredSchedule = newDate && newTime;
  const originallyScheduled = !!task.scheduledFor;

  // CASE 1: User entered a new schedule
  if (userEnteredSchedule) {
    const selectedDateTime = new Date(`${newDate}T${newTime}`);
    const now = new Date();

    task.scheduledFor = `${newDate} ${newTime}`;
  }

  // CASE 2: Task was scheduled before, but user cleared fields
  else if (originallyScheduled && !userEnteredSchedule) {
    task.scheduledFor = null;
  }

  // CASE 3: Task was never scheduled and user left fields empty
  // → do nothing (do NOT add a schedule)

  save();
});

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

function showStatus(message) {
  const statusMsg = document.getElementById("statusMsg");
  statusMsg.textContent = message;
  statusMsg.style.opacity = "1";

  setTimeout(() => {
    statusMsg.style.opacity = "0";
  }, 3000);
}

function deleteCompletedTasks() {
  if (!confirm("Move all completed tasks to Trash?")) return;

  lastBulkDelete = tasks.filter(task => task.completed && !task.trash);

  tasks.forEach(task => {
    if (task.completed) {
      task.trash = true;
    }
  });

  showStatus("Completed tasks moved to Trash.");
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

const clearTrashBtn = document.getElementById("clearTrashBtn");

function clearTrash() {
  if (!confirm("Permanently delete all items in Trash?")) return;

  tasks = tasks.filter(task => !task.trash);

  showStatus("Trash cleared.");
  save();
}

clearTrashBtn.addEventListener("click", clearTrash);
