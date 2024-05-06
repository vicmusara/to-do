class Todo {
    constructor(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.complete = false;
        this.notes = "";
        this.checklist = [];
    }

    toggleComplete() {
        this.complete = !this.complete;
    }
}

class Project {
    constructor(name) {
        this.name = name;
        this.todos = [];
    }

    addTodo(todo) {
        this.todos.push(todo);
    }

    removeTodo(index) {
        this.todos.splice(index, 1);
    }
}

const projects = [];

const contentDiv = document.getElementById("content");

function renderProjects() {
    contentDiv.innerHTML = "";
    projects.forEach((project, index) => {
        const projectDiv = document.createElement("div");
        projectDiv.classList.add("project");

        const projectTitle = document.createElement("h2");
        projectTitle.textContent = project.name;

        const todoList = document.createElement("div");

        project.todos.forEach((todo, todoIndex) => {
            const todoDiv = document.createElement("div");
            todoDiv.classList.add("todo");
            if (todo.complete) {
                todoDiv.classList.add("complete");
            }
            todoDiv.innerHTML = `
        <strong>${todo.title}</strong>
        <p>${todo.description}</p>
        <p>Due Date: ${todo.dueDate}</p>
        <p>Priority: ${todo.priority}</p>
        <p>Notes: ${todo.notes}</p>
        <p>Checklist: ${todo.checklist.join(', ')}</p>
        <button class="complete-btn">Complete</button>
        <button class="delete-btn">Delete</button>
      `;
            todoDiv.querySelector(".complete-btn").addEventListener("click", () => {
                todo.toggleComplete();
                renderProjects();
            });
            todoDiv.querySelector(".delete-btn").addEventListener("click", () => {
                project.removeTodo(todoIndex);
                renderProjects();
            });
            todoList.appendChild(todoDiv);
        });

        projectDiv.appendChild(projectTitle);
        projectDiv.appendChild(todoList);
        contentDiv.appendChild(projectDiv);
    });
}

function createNewProject() {
    const projectName = prompt("Enter project name:");
    if (projectName) {
        const newProject = new Project(projectName);
        projects.push(newProject);
        renderProjects();
    }
}

function initialize() {
    // Retrieve projects from localStorage if available
    const storedProjects = JSON.parse(localStorage.getItem("projects"));
    if (storedProjects) {
        storedProjects.forEach(projectData => {
            const project = new Project(projectData.name);
            projectData.todos.forEach(todoData => {
                const todo = new Todo(
                    todoData.title,
                    todoData.description,
                    todoData.dueDate,
                    todoData.priority
                );
                todo.complete = todoData.complete;
                todo.notes = todoData.notes || "";
                todo.checklist = todoData.checklist || [];
                project.addTodo(todo);
            });
            projects.push(project);
        });
        renderProjects();
    }
}

initialize();

document.getElementById("add-project-btn").addEventListener("click", createNewProject);

// Save projects to localStorage whenever projects are updated
function saveProjects() {
    localStorage.setItem("projects", JSON.stringify(projects));
}

window.addEventListener("beforeunload", saveProjects);
