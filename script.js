document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTask');
    const todoList = document.getElementById('todoList');
    const taskCount = document.getElementById('taskCount');
    const clearCompletedBtn = document.getElementById('clearCompleted');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentFilter = 'all';

    renderTodos();
    updateTaskCount();

    function addTask(text) {
        if (text.trim()) {
            const todo = {
                id: Date.now(),
                text: text.trim(),
                completed: false
            };
            todos.push(todo);
            saveTodos();
            renderTodos();
            updateTaskCount();
            taskInput.value = '';
        }
    }

    // Event listeners
    addTaskBtn.addEventListener('click', () => addTask(taskInput.value));

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask(taskInput.value);
        }
    });

    todoList.addEventListener('click', (e) => {
        const item = e.target.closest('.todo-item');
        if (!item) return;

        const id = parseInt(item.dataset.id);

        if (e.target.classList.contains('delete-btn')) {
            todos = todos.filter(todo => todo.id !== id);
            saveTodos();
            renderTodos();
            updateTaskCount();
        } else if (e.target.classList.contains('todo-checkbox')) {
            const todo = todos.find(todo => todo.id === id);
            if (todo) {
                todo.completed = e.target.checked;
                saveTodos();
                renderTodos();
                updateTaskCount();
            }
        }
    });

    clearCompletedBtn.addEventListener('click', () => {
        todos = todos.filter(todo => !todo.completed);
        saveTodos();
        renderTodos();
        updateTaskCount();
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTodos();
        });
    });

    // Render todos
    function renderTodos() {
        const filteredTodos = todos.filter(todo => {
            if (currentFilter === 'active') return !todo.completed;
            if (currentFilter === 'completed') return todo.completed;
            return true;
        });

        todoList.innerHTML = filteredTodos.map(todo => `
            <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                <span class="todo-text">${todo.text}</span>
                <button class="delete-btn">Delete</button>
            </li>
        `).join('');
    }

    // Update task count
    function updateTaskCount() {
        const activeTasks = todos.filter(todo => !todo.completed).length;
        taskCount.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} left`;
    }

    // Save todos to localStorage
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }
});
