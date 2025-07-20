document.addEventListener("DOMContentLoaded", () => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = storedTasks;
    updateTasksList();
    updateStats();
});
// Add to app.js
document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
});

// Load saved theme
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
}
let tasks = [];
let currentFilter = 'all';

const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

const addTask = (e) => {
    e.preventDefault();
    const taskInput = document.getElementById('taskInput');
    const dueDate = document.getElementById('dueDate').value;
    const priority = document.getElementById('priority').value;
    const text = taskInput.value.trim();

    if (text) {
        tasks.push({
            text,
            completed: false,
            dueDate,
            priority
        });
        taskInput.value = "";
        updateTasksList();
        updateStats();
        saveTasks();
    }
};

const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    updateTasksList();
    updateStats();
    saveTasks();
};

const deleteTask = (index) => {
    tasks.splice(index, 1);
    updateTasksList();
    updateStats();
    saveTasks();
};

const editTask = (index) => {
    const task = tasks[index];
    document.getElementById('taskInput').value = task.text;
    document.getElementById('dueDate').value = task.dueDate;
    document.getElementById('priority').value = task.priority;
    deleteTask(index);
};

const updateStats = () => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
    document.getElementById('progress').style.width = `${progress}%`;
    document.getElementById('numbers').innerText = `${completedTasks}/${totalTasks}`;

    if (totalTasks && completedTasks === totalTasks) {
        blastConfetti();
    }
};

// Modify the existing updateTasksList() to accept a parameter
const updateTasksList = (tasksToRender = tasks) => {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    // Combine current filter with search (if any)
    const filteredTasks = tasksToRender.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true; // 'all'
    });

    filteredTasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <div class="taskItem">
                <div class="task ${task.completed ? 'completed' : ''}">
                    <input type="checkbox" ${task.completed ? 'checked' : ''}>
                    <p>${task.text}</p>
                    ${task.dueDate ? `<span class="due-date">${formatDate(task.dueDate)}</span>` : ''}
                    <span class="priority ${task.priority}" style="margin:10px">${task.priority}</span>
                </div>
                <div class="icons">
                    <img src="edit.png" onclick="editTask(${index})">
                    <img src="bin.png" onclick="deleteTask(${index})">
                </div>
            </div>
        `;
        listItem.querySelector('input').addEventListener('change', () => toggleTaskComplete(index));
        taskList.appendChild(listItem);
    });
};

// New search function
document.getElementById('searchInput').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    if (searchTerm === '') {
        updateTasksList(); // Show all tasks if search is empty
        return;
    }
    const searchedTasks = tasks.filter(task => 
        task.text.toLowerCase().includes(searchTerm)
    );
    updateTasksList(searchedTasks);
});

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

// Filter buttons
document.getElementById('filterAll').addEventListener('click', () => {
    currentFilter = 'all';
    updateActiveFilter('filterAll');
    updateTasksList();
});

document.getElementById('filterActive').addEventListener('click', () => {
    currentFilter = 'active';
    updateActiveFilter('filterActive');
    updateTasksList();
});

document.getElementById('filterCompleted').addEventListener('click', () => {
    currentFilter = 'completed';
    updateActiveFilter('filterCompleted');
    updateTasksList();
});

const updateActiveFilter = (activeId) => {
    document.querySelectorAll('.filters button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(activeId).classList.add('active');
};
// Add to app.js
document.getElementById('searchInput').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredTasks = tasks.filter(task => 
        task.text.toLowerCase().includes(searchTerm)
    );
    renderTasks(filteredTasks);
});

function renderTasks(taskArray) {
    // Modify updateTasksList() to use this
}

// Form submission
document.getElementById('taskForm').addEventListener('submit', addTask);

// Confetti function (keep existing)
const blastConfetti = () => { 
  const count = 200,
  defaults = {
    origin: { y: 0.7 },
  };

function fire(particleRatio, opts) {
  confetti(
    Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio),
    })
  );
}

fire(0.25, {
  spread: 26,
  startVelocity: 55,
});

fire(0.2, {
  spread: 60,
});

fire(0.35, {
  spread: 100,
  decay: 0.91,
  scalar: 0.8,
});

fire(0.1, {
  spread: 120,
  startVelocity: 25,
  decay: 0.92,
  scalar: 1.2,
});

fire(0.1, {
  spread: 120,
  startVelocity: 45,
});
};