const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");
const completedList = document.getElementById("completedList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
  list.innerHTML = "";
  completedList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    if (task.completed) {
      li.className = "completed";
      li.innerHTML = `
        <div>
          <strong>${task.text}</strong><br>
          <small>Added: ${task.createdAt}</small><br>
          <small>Completed: ${task.completedAt}</small>
        </div>
        <button onclick="toggleComplete(${index})">↩</button>
      `;
      completedList.appendChild(li);
    } else {
      li.innerHTML = `
        <div>
          <strong>${task.text}</strong><br>
          <small>Added: ${task.createdAt}</small>
        </div>
        <div>
          <button onclick="toggleComplete(${index})">✔</button>
          <button onclick="deleteTask(${index})">✖</button>
        </div>
      `;
      list.appendChild(li);
    }
  });
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
