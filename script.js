// DOM Elements
const inputBox = document.getElementById("input");
const todoList = document.getElementById("todo-lists");
const icon = document.getElementById("icon");
const cbox = document.querySelector(".cbox");
const todoCount = document.getElementById("todo_count");
const clearCompletedBtn = document.getElementById("clear-completed");
const views = document.querySelectorAll(".views p");

// Variables
let count = 0;
let currentView = "all";

// Theme-related functions
const setDarkMode = () => {
  document.body.setAttribute("data-theme", "dark");
  localStorage.setItem("selectedTheme", "dark");
  localStorage.setItem("selectedCheck", "icon-check-dark.svg");
  updateCheckIcons()
};

const setLightMode = () => {
  document.body.setAttribute("data-theme", "light");
  localStorage.setItem("selectedTheme", "light");
  localStorage.setItem("selectedCheck", "icon-check.svg");
  updateCheckIcons()
};

const updateCheckIcons = () => {
  const currentTheme = localStorage.getItem("selectedTheme");
  const selectedCheck = localStorage.getItem("selectedCheck");

  const checkIcons = document.querySelectorAll(".cbox");

  checkIcons.forEach((checkIcon) => {
    const isChecked = checkIcon.getAttribute("data-checked") === "true";

    if (isChecked) {
      checkIcon.src = `./images/${selectedCheck}`;
    } else {
      checkIcon.src = `./images/${
        currentTheme === "dark" ? "icon-check-dark.svg" : "icon-check.svg"
      }`;
    }
  });
};

// Todo-related functions
const updateTodoCount = () => {
  count = todoList.querySelectorAll(".row.divider").length;
  todoCount.textContent = `${count} item${count !== 1 ? "s" : ""} left`;
};

const createTodoElement = (text) => {
  const todo = document.createElement("div");
  todo.className = "row divider";
  todo.draggable = true;

  const wrapper = document.createElement("div");
  wrapper.className = "wrapper";

  const check = document.createElement("img");
  check.className = "cbox";
  check.src = `./images/${localStorage.getItem("selectedCheck")}`;
  check.setAttribute("data-checked", "false");

  const p = document.createElement("p");
  p.textContent = text;

  const cross = document.createElement("img");
  cross.className = "cross";
  cross.src = "./images/icon-cross.svg";
  cross.style.display = "none";

  wrapper.appendChild(check);
  wrapper.appendChild(p);
  todo.appendChild(wrapper);
  todo.appendChild(cross);

  return { todo, check, p, cross };
};

const handleTodoClick = (check, p) => {
  const isChecked = check.getAttribute("data-checked") === "true";
  check.setAttribute("data-checked", String(!isChecked));

  if (isChecked) {
    check.src = `./images/${localStorage.getItem("selectedCheck")}`;
    updateTodoCount();
    p.classList.remove("cross-out");
  } else {
    check.src = "./images/icon-checked.svg";
    updateTodoCount();
    p.classList.add("cross-out");
  }
};

const handleTodoMouseEnter = (cross) => {
  cross.style.display = "block";
};

const handleTodoMouseLeave = (cross) => {
  cross.style.display = "none";
};

const handleTodoRemove = (todo) => {
  todoList.removeChild(todo);
  updateTodoCount();
};

const handleClearCompleted = () => {
  const completedTodos = todoList.querySelectorAll(
    ".row.divider [data-checked='true']"
  );

  completedTodos.forEach((todo) => {
    todoList.removeChild(todo.parentElement.parentElement);
  });

  updateTodoCount();
};

// Filter functions
const filterTodos = (view) => {
  const todos = todoList.querySelectorAll(".row.divider");

  todos.forEach((todo) => {
    const isCompleted =
      todo.querySelector(".cbox").getAttribute("data-checked") === "true";

    if (view === "all") {
      todo.style.display = "flex";
    } else if (view === "active") {
      todo.style.display = isCompleted ? "none" : "flex";
    } else if (view === "completed") {
      todo.style.display = isCompleted ? "flex" : "none";
    }
  });
};

const setActiveView = (view) => {
  views.forEach((viewElement) => {
    if (viewElement.textContent.toLowerCase() === view) {
      viewElement.classList.add("active");
    } else {
      viewElement.classList.remove("active");
    }
  });
};

const handleViewClick = (event) => {
  const selectedView = event.target.textContent.toLowerCase();

  if (selectedView !== currentView) {
    setActiveView(selectedView);
    filterTodos(selectedView);
    currentView = selectedView;
  }
};

// Drag and drop functions
let draggedTodo;

const handleDragStart = (event) => {
  draggedTodo = event.target;
  event.dataTransfer.setData("text/plain", "dummy"); // Required for Firefox
  event.target.classList.add("dragging");
};

const handleDragOver = (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
};

const handleDragEnter = (event) => {
  event.target.classList.add("over");
};

const handleDragLeave = (event) => {
  event.target.classList.remove("over");
};

const handleDrop = (event) => {
  event.preventDefault();
  const targetTodo = event.target.closest(".row.divider");

  if (targetTodo && targetTodo !== draggedTodo) {
    const targetIndex = Array.from(todoList.children).indexOf(targetTodo);
    const draggedIndex = Array.from(todoList.children).indexOf(draggedTodo);

    if (targetIndex < draggedIndex) {
      todoList.insertBefore(draggedTodo, targetTodo);
    } else {
      todoList.insertBefore(draggedTodo, targetTodo.nextSibling);
    }
  }

  event.target.classList.remove("over");
};

// Event Listeners
inputBox.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    addTodo();
  }
});

views.forEach((view) => {
  view.addEventListener("click", handleViewClick);
});

icon.addEventListener("click", () => {
  const currentTheme = localStorage.getItem("selectedTheme");

  if (currentTheme === "dark") {
    setLightMode();
    icon.src = "./images/icon-moon.svg";
  } else {
    setDarkMode();
    icon.src = "./images/icon-sun.svg";
  }

  cbox.src = `./images/${localStorage.getItem("selectedCheck")}`;
});

clearCompletedBtn.addEventListener("click", handleClearCompleted);

// Initial setup
const selectedTheme = localStorage.getItem("selectedTheme");
cbox.src = `./images/${localStorage.getItem("selectedCheck")}`;

if (selectedTheme === "dark") {
  setDarkMode();
  icon.src = "./images/icon-sun.svg";
} else {
  setLightMode();
  icon.src = "./images/icon-moon.svg";
}

// Function to add a new todo
function addTodo() {
  const text = inputBox.value.trim();
  if (text === "") return;

  const { todo, check, p, cross } = createTodoElement(text);

  check.addEventListener("click", () => {
    handleTodoClick(check, p);
  });

  cross.addEventListener("click", () => {
    handleTodoRemove(todo);
  });

  todo.addEventListener("mouseenter", () => {
    handleTodoMouseEnter(cross);
  });

  todo.addEventListener("mouseleave", () => {
    handleTodoMouseLeave(cross);
  });

  todo.addEventListener("dragstart", handleDragStart);
  todo.addEventListener("dragover", handleDragOver);
  todo.addEventListener("dragenter", handleDragEnter);
  todo.addEventListener("dragleave", handleDragLeave);
  todo.addEventListener("drop", handleDrop);
  todo.addEventListener("dragend", () => {
    todo.classList.remove("dragging");
  });

  todoList.appendChild(todo);
  updateTodoCount();
  inputBox.value = "";
}
