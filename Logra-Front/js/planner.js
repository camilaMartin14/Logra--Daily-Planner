document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'logra_db';
    const MOOD_MAP = {
        'happy': '¡Me siento feliz!',
        'neutral': 'Día tranquilo.',
        'sad': 'Mañana será mejor.'
    };

    let currentDate = new Date();
    let currentDayData = getEmptyDayData();
    let currentFilter = 'all'; 

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
        contentWrapper: document.querySelector('.content-wrapper'),
        // New elements
        hydrationContainer: document.getElementById('hydration-container'),
        sleepContainer: document.getElementById('sleep-container'),
        mealInputs: {
            breakfast: document.getElementById('meal-breakfast'),
            lunch: document.getElementById('meal-lunch'),
            dinner: document.getElementById('meal-dinner'),
            snack: document.getElementById('meal-snack')
        }
    };

    
    const DataManager = {
        async getDay(dateStr) {
            
            const db = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            return db[dateStr] || null;
        },

        async saveDay(dateStr, data) {
            const db = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            db[dateStr] = data;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
        }
    };


    function getFormattedDateKey(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
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
            tomorrowNote: '',
            hydration: 0,
            sleep: 0,
            meals: {
                breakfast: '',
                lunch: '',
                dinner: '',
                snack: ''
            }
        };
    }


    async function loadDay(date) {
        const dateKey = getFormattedDateKey(date);
        const data = authToken
    ? await DayApi.obtenerOCrear(dateKey)
    : await DataManager.getDay(dateKey);
        
        currentDayData = data ? data : getEmptyDayData();
        
        renderUI();
    }

    async function saveCurrentDay() {
    if (!authToken) {
        const dateKey = getFormattedDateKey(currentDate);
        await DataManager.saveDay(dateKey, currentDayData);
        updateStats();
        return;
    }

    // usuario logueado → backend
    await DayApi.actualizar(currentDayData.id, {
        aguaConsumida: currentDayData.hydration,
        horasSueno: currentDayData.sleep,
        mood: currentDayData.mood,
        notaDia: currentDayData.dailyNote,
        notaManiana: currentDayData.tomorrowNote,
        desayuno: currentDayData.meals.breakfast,
        almuerzo: currentDayData.meals.lunch,
        cena: currentDayData.meals.dinner,
        snack: currentDayData.meals.snack
    });
}


    function changeDate(offset) {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + offset);
        currentDate = newDate;
        
        loadDay(currentDate);
    }

    function setFilter(filter) {
        currentFilter = filter;
        renderTasks();
        updateFilterUI();
    }


    function renderUI() {
        renderHeader();
        renderTasks();
        renderMood();
        renderWellness();
        renderMeals();
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
            els.taskInput.placeholder = "Escribe una nueva tarea...";
            disableInputs(false);
        }
    }

    function disableInputs(disabled) {
        const inputs = els.contentWrapper.querySelectorAll('input, textarea, select');
        inputs.forEach(i => i.disabled = disabled);
        
        els.taskInput.disabled = disabled;
        els.addTaskBtn.disabled = disabled;
    }

    function renderTasks() {
        els.todoList.innerHTML = '';

        let visibleTasks = currentDayData.tasks;
        if (currentFilter === 'pending') {
            visibleTasks = currentDayData.tasks.filter(t => !t.completed);
        } else if (currentFilter === 'completed') {
            visibleTasks = currentDayData.tasks.filter(t => t.completed);
        }

        if (visibleTasks.length === 0) {
            if (currentDayData.tasks.length > 0) {
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

    function renderWellness() {
        els.hydrationContainer.innerHTML = '';
        for (let i = 1; i <= 8; i++) {
            const btn = document.createElement('button');
            const isActive = i <= (currentDayData.hydration || 0);
            btn.className = `wellness-btn ${isActive ? 'active' : ''}`;
            btn.innerHTML = `<i class="bi bi-cup-straw wellness-icon"></i>`;
            btn.title = `${i} vaso${i !== 1 ? 's' : ''}`;
            btn.onclick = () => handleHydrationClick(i);
            els.hydrationContainer.appendChild(btn);
        }

        els.sleepContainer.innerHTML = '';
        for (let i = 1; i <= 8; i++) {
            const btn = document.createElement('button');
            const isActive = i <= (currentDayData.sleep || 0);
            btn.className = `wellness-btn ${isActive ? 'sleep-active' : ''}`;
            btn.innerHTML = `<i class="bi bi-moon-stars-fill wellness-icon"></i>`;
            btn.title = `${i} hora${i !== 1 ? 's' : ''}`;
            btn.onclick = () => handleSleepClick(i);
            els.sleepContainer.appendChild(btn);
        }
    }

    function renderMeals() {
        const meals = currentDayData.meals || { breakfast: '', lunch: '', dinner: '', snack: '' };
        els.mealInputs.breakfast.value = meals.breakfast || '';
        els.mealInputs.lunch.value = meals.lunch || '';
        els.mealInputs.dinner.value = meals.dinner || '';
        els.mealInputs.snack.value = meals.snack || '';
    }


    async function handleAddTask() {
    const text = els.taskInput.value.trim();
    if (text === '') return;

    if (!authToken) {
        // LOCAL
        currentDayData.tasks.unshift({
            id: Date.now(),
            text,
            completed: false
        });
        await saveCurrentDay();
        renderTasks();
        updateStats();
        els.taskInput.value = '';
        return;
    }

    // BACKEND
    const tarea = await TaskApi.crear(currentDayData.id, text);

    currentDayData.tasks.unshift({
        id: tarea.id,
        text: tarea.descripcion,
        completed: tarea.realizada
    });

    els.taskInput.value = '';
    renderTasks();
    updateStats();
    }

    window.handleToggle = async function(id) {
    const task = currentDayData.tasks.find(t => t.id === id);
    if (!task) return;

    if (!authToken) {
        task.completed = !task.completed;
        await saveCurrentDay();
        renderTasks();
        updateStats();
        return;
    }

    await TaskApi.actualizar(id, {
        descripcion: task.text,
        realizada: !task.completed
    });

    task.completed = !task.completed;
    renderTasks();
    updateStats();
    };


    window.handleDelete = async function(id) {
    if (!authToken) {
        currentDayData.tasks = currentDayData.tasks.filter(t => t.id !== id);
        await saveCurrentDay();
        renderTasks();
        updateStats();
        return;
    }

    await TaskApi.eliminar(id);
    currentDayData.tasks = currentDayData.tasks.filter(t => t.id !== id);
    renderTasks();
    updateStats();
    };


    function handleHydrationClick(count) {
        if (els.contentWrapper.classList.contains('read-only-mode')) return;
        
        if (currentDayData.hydration === count) {
            currentDayData.hydration = count - 1;
        } else {
            currentDayData.hydration = count;
        }
        saveCurrentDay();
        renderWellness();
    }

    function handleSleepClick(count) {
        if (els.contentWrapper.classList.contains('read-only-mode')) return;

        currentDayData.sleep = count;
        saveCurrentDay();
        renderWellness();
    }


    function setupEventListeners() {
        els.prevBtn.addEventListener('click', () => changeDate(-1));
        els.nextBtn.addEventListener('click', () => changeDate(1));

        els.addTaskBtn.addEventListener('click', handleAddTask);
        els.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleAddTask();
        });

        els.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                setFilter(btn.dataset.filter);
            });
        });

        els.moodBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const mood = btn.getAttribute('data-mood');
                currentDayData.mood = mood;
                saveCurrentDay();
                renderMood();
            });
        });

        els.dailyNote.addEventListener('input', (e) => {
            currentDayData.dailyNote = e.target.value;
            saveCurrentDay();
        });

        els.tomorrowNote.addEventListener('input', (e) => {
            currentDayData.tomorrowNote = e.target.value;
            saveCurrentDay();
        });

        Object.keys(els.mealInputs).forEach(key => {
            els.mealInputs[key].addEventListener('input', (e) => {
                if (!currentDayData.meals) currentDayData.meals = {};
                currentDayData.meals[key] = e.target.value;
                saveCurrentDay();
            });
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

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

    init();

    async function init() {
        setupEventListeners();
        await loadDay(currentDate);
    }
});
