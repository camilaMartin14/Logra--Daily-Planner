document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration & Constants ---
    const STORAGE_KEY = 'logra_db';
    const MOOD_MAP = {
        'happy': '¡Me siento feliz!',
        'neutral': 'Día tranquilo.',
        'sad': 'Mañana será mejor.'
    };

    // --- State Management ---
    let currentDate = new Date();
    let currentDayData = getEmptyDayData();
    let currentFilter = 'all'; // 'all', 'pending', 'completed'

    // --- DOM Elements ---
    const els = {
        currentDate: document.getElementById('current-date'),
        dayStatus: document.getElementById('day-status-indicator'),
        prevBtn: document.getElementById('prev-day-btn'),
        nextBtn: document.getElementById('next-day-btn'),
        taskInput: document.getElementById('new-task-input'),
        addTaskBtn: document.getElementById('add-task-btn'),
        todoList: document.getElementById('todo-list'),
        emptyState: document.getElementById('empty-state'),
        // pendingCount: document.getElementById('pending-count'), // Removed
        filterBtns: document.querySelectorAll('.filter-btn'),
        countAll: document.getElementById('count-all'),
        countPending: document.getElementById('count-pending'),
        countCompleted: document.getElementById('count-completed'),
        moodBtns: document.querySelectorAll('.mood-btn'),
        moodText: document.getElementById('selected-mood-text'),
        dailyNote: document.getElementById('daily-note'),
        tomorrowNote: document.getElementById('tomorrow-note'),
        contentWrapper: document.querySelector('.content-wrapper')
    };

    // --- Initialization ---
    init();

    async function init() {
        setupEventListeners();
        await loadDay(currentDate);
    }

    // --- Data Manager (Simulating API) ---
    // In a real app, these would be fetch() calls to a backend.
    
    const DataManager = {
        async getDay(dateStr) {
            // Simulate network delay
            // await new Promise(r => setTimeout(r, 100));
            
            const db = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            return db[dateStr] || null;
        },

        async saveDay(dateStr, data) {
            const db = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            db[dateStr] = data;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
        }
    };

    // --- Date Logic ---

    function getFormattedDateKey(date) {
        // Returns YYYY-MM-DD
        return date.toISOString().split('T')[0];
    }

    function getDisplayDate(date) {
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const str = date.toLocaleDateString('es-ES', options);
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function isSameDay(d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getDate() === d2.getDate();
    }

    function getEmptyDayData() {
        return {
            tasks: [],
            mood: null,
            dailyNote: '',
            tomorrowNote: ''
        };
    }

    // --- Core Logic ---

    async function loadDay(date) {
        const dateKey = getFormattedDateKey(date);
        const data = await DataManager.getDay(dateKey);
        
        currentDayData = data ? data : getEmptyDayData();
        
        renderUI();
    }

    async function saveCurrentDay() {
        const dateKey = getFormattedDateKey(currentDate);
        await DataManager.saveDay(dateKey, currentDayData);
        // We don't re-render everything on save to avoid losing focus, 
        // but we might update stats.
        updateStats();
    }

    function changeDate(offset) {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + offset);
        currentDate = newDate;
        
        // Add fade out effect could go here
        loadDay(currentDate);
    }

    function setFilter(filter) {
        currentFilter = filter;
        renderTasks();
        updateFilterUI();
    }

    // --- Rendering ---

    function renderUI() {
        renderHeader();
        renderTasks();
        renderMood();
        renderNotes();
        updateStats();
        updateFilterUI();
        applyDayStatusStyles();
    }

    function renderHeader() {
        els.currentDate.textContent = getDisplayDate(currentDate);
        
        const today = new Date();
        const dateKey = getFormattedDateKey(currentDate);
        const todayKey = getFormattedDateKey(today);

        let statusText = '';
        if (dateKey === todayKey) {
            statusText = 'Hoy';
        } else if (currentDate < today && dateKey !== todayKey) {
            statusText = 'Historial (Solo lectura)';
        } else {
            statusText = 'Futuro (Planificando)';
        }
        els.dayStatus.textContent = statusText;
    }

    function applyDayStatusStyles() {
        const today = new Date();
        // Reset time for accurate comparison
        today.setHours(0,0,0,0);
        const checkDate = new Date(currentDate);
        checkDate.setHours(0,0,0,0);

        els.contentWrapper.classList.remove('read-only-mode', 'future-mode');

        if (checkDate < today) {
            els.contentWrapper.classList.add('read-only-mode');
            els.taskInput.placeholder = "No puedes editar días pasados";
            disableInputs(true);
        } else if (checkDate > today) {
            els.contentWrapper.classList.add('future-mode');
            els.taskInput.placeholder = "Planifica para el futuro...";
            disableInputs(false);
        } else {
            // Today
            els.taskInput.placeholder = "Escribe una nueva tarea...";
            disableInputs(false);
        }
    }

    function disableInputs(disabled) {
        // Only disable inputs within the main content wrapper, excluding modals
        const inputs = els.contentWrapper.querySelectorAll('input, textarea, select');
        inputs.forEach(i => i.disabled = disabled);
        
        // Specific handling for buttons if needed, but CSS handles pointer-events
        // We do strictly disable the task input to prevent enter key submission
        els.taskInput.disabled = disabled;
        els.addTaskBtn.disabled = disabled;
    }

    function renderTasks() {
        els.todoList.innerHTML = '';

        // Filter tasks
        let visibleTasks = currentDayData.tasks;
        if (currentFilter === 'pending') {
            visibleTasks = currentDayData.tasks.filter(t => !t.completed);
        } else if (currentFilter === 'completed') {
            visibleTasks = currentDayData.tasks.filter(t => t.completed);
        }

        if (visibleTasks.length === 0) {
            // Show a different message based on filter? For now, standard empty state
            if (currentDayData.tasks.length > 0) {
                 // Tasks exist but filtered out
                 const msg = document.createElement('div');
                 msg.className = 'text-center py-4 text-muted fst-italic';
                 msg.textContent = currentFilter === 'pending' ? '¡Todo completado!' : 'Aún no hay tareas completadas.';
                 els.todoList.appendChild(msg);
                 els.emptyState.style.display = 'none';
            } else {
                els.emptyState.style.display = 'block';
            }
        } else {
            els.emptyState.style.display = 'none';
            
            visibleTasks.forEach(task => {
                const li = document.createElement('li');
                li.className = `list-group-item ${task.completed ? 'completed-task' : ''}`;
                
                // Note: We use global handlers for simplicity in this generated code,
                // passing the ID.
                li.innerHTML = `
                    <div class="d-flex align-items-center w-100">
                        <input class="form-check-input rounded-circle" type="checkbox" 
                            ${task.completed ? 'checked' : ''} 
                            onchange="window.handleToggle(${task.id})">
                        <span class="todo-text flex-grow-1">${escapeHtml(task.text)}</span>
                        <button class="delete-btn" onclick="window.handleDelete(${task.id})" title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                `;
                els.todoList.appendChild(li);
            });
        }
    }

    function updateStats() {
        const total = currentDayData.tasks.length;
        const pending = currentDayData.tasks.filter(t => !t.completed).length;
        const completed = currentDayData.tasks.filter(t => t.completed).length;

        els.countAll.textContent = total;
        els.countPending.textContent = pending;
        els.countCompleted.textContent = completed;
    }

    function updateFilterUI() {
        els.filterBtns.forEach(btn => {
            if (btn.dataset.filter === currentFilter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    function renderMood() {
        els.moodBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-mood') === currentDayData.mood) {
                btn.classList.add('active');
            }
        });
        
        if (currentDayData.mood) {
            els.moodText.textContent = MOOD_MAP[currentDayData.mood];
            els.moodText.style.opacity = '1';
        } else {
            els.moodText.textContent = '';
        }
    }

    function renderNotes() {
        els.dailyNote.value = currentDayData.dailyNote || '';
        els.tomorrowNote.value = currentDayData.tomorrowNote || '';
    }

    // --- Action Handlers ---

    function handleAddTask() {
        const text = els.taskInput.value.trim();
        if (text === '') return;

        const newTask = {
            id: Date.now(),
            text: text,
            completed: false
        };

        currentDayData.tasks.unshift(newTask);
        els.taskInput.value = '';
        
        // If we add a task while in 'completed' filter, we should probably switch to 'all' or 'pending'
        // or just accept it won't be seen immediately. Let's switch to 'all' for clarity.
        if (currentFilter === 'completed') {
            setFilter('all');
        }

        saveCurrentDay();
        renderTasks();
        updateStats();
    }

    window.handleToggle = function(id) {
        const task = currentDayData.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            saveCurrentDay();
            renderTasks();
            updateStats();
        }
    };

    window.handleDelete = function(id) {
        currentDayData.tasks = currentDayData.tasks.filter(t => t.id !== id);
        saveCurrentDay();
        renderTasks();
        updateStats();
    };

    // --- Event Listeners ---

    function setupEventListeners() {
        // Navigation
        els.prevBtn.addEventListener('click', () => changeDate(-1));
        els.nextBtn.addEventListener('click', () => changeDate(1));

        // Tasks
        els.addTaskBtn.addEventListener('click', handleAddTask);
        els.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleAddTask();
        });

        // Filters
        els.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                setFilter(btn.dataset.filter);
            });
        });

        // Mood
        els.moodBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const mood = btn.getAttribute('data-mood');
                currentDayData.mood = mood;
                saveCurrentDay();
                renderMood();
            });
        });

        // Notes (Auto-save on input)
        els.dailyNote.addEventListener('input', (e) => {
            currentDayData.dailyNote = e.target.value;
            saveCurrentDay();
        });

        els.tomorrowNote.addEventListener('input', (e) => {
            currentDayData.tomorrowNote = e.target.value;
            saveCurrentDay();
        });
    }

    // --- Utilities ---
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // --- Password Toggle (kept from original) ---
    window.togglePassword = function(id) {
        const input = document.getElementById(id);
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        
        const btn = input.nextElementSibling;
        const icon = btn.querySelector('i');
        if (type === 'text') {
            icon.classList.remove('bi-eye');
            icon.classList.add('bi-eye-slash');
        } else {
            icon.classList.remove('bi-eye-slash');
            icon.classList.add('bi-eye');
        }
    };
});
