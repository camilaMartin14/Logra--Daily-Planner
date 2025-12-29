document.addEventListener('DOMContentLoaded', () => { 
    const MOOD_MAP = {
        'happy': '¡Me siento feliz!',
        'neutral': 'Día tranquilo.',
        'sad': 'Mañana será mejor.'
    };

    let currentDayData = getEmptyDayData();
    let selectedDate = new Date();
    let currentFilter = 'all';

    const els = {
        currentDate: document.getElementById('current-date'),
        prevDayBtn: document.getElementById('prev-day-btn'),
        nextDayBtn: document.getElementById('next-day-btn'),
        dayStatus: document.getElementById('day-status-indicator'),
        taskInput: document.getElementById('new-task-input'),
        addTaskBtn: document.getElementById('add-task-btn'),
        todoList: document.getElementById('todo-list'),
        emptyState: document.getElementById('empty-state'),
        filterBtns: document.querySelectorAll('.filter-btn'),
        countAll: document.getElementById('count-all'),
        countPending: document.getElementById('count-pending'),
        countCompleted: document.getElementById('count-completed'),
        moodBtns: document.querySelectorAll('.mood-btn'),
        moodText: document.getElementById('selected-mood-text'),
        dailyNote: document.getElementById('daily-note'),
        tomorrowNote: document.getElementById('tomorrow-note'),
        contentWrapper: document.querySelector('.content-wrapper'),
        hydrationContainer: document.getElementById('hydration-container'),
        sleepContainer: document.getElementById('sleep-container'),
        mealInputs: {
            breakfast: document.getElementById('meal-breakfast'),
            lunch: document.getElementById('meal-lunch'),
            dinner: document.getElementById('meal-dinner'),
            snack: document.getElementById('meal-snack')
        },
        authTeaserLogin: document.getElementById('auth-teaser-login'),
        authTeaserLogout: document.getElementById('auth-teaser-logout'),
        userNameDisplay: document.getElementById('user-name-display'),
        btnLogout: document.getElementById('btn-logout'),
        authOnlyElements: document.querySelectorAll('.auth-only'),
        btnSaveMeals: document.getElementById('btn-save-meals'),
        btnSaveDailyNote: document.getElementById('btn-save-daily-note'),
        btnSaveTomorrowNote: document.getElementById('btn-save-tomorrow-note'),
        msgSaveMeals: document.getElementById('msg-save-meals'),
        msgSaveDailyNote: document.getElementById('msg-save-daily-note'),
        msgSaveTomorrowNote: document.getElementById('msg-save-tomorrow-note')
    };

    function getEmptyDayData() {
        return {
            tasks: [],
            mood: null,
            dailyNote: '',
            tomorrowNote: '',
            hydration: 0,
            sleep: 0,
            meals: { breakfast: '', lunch: '', dinner: '', snack: '' }
        };
    }

    function mapBackendToFrontend(backendData) {
        if (!backendData) return getEmptyDayData();
        return {
            id: backendData.id,
            tasks: [], 
            mood: backendData.mood,
            dailyNote: backendData.notaDia,
            tomorrowNote: backendData.notaManiana,
            hydration: backendData.aguaConsumida || 0,
            sleep: backendData.horasSueno || 0,
            meals: {
                breakfast: backendData.desayuno || '',
                lunch: backendData.almuerzo || '',
                dinner: backendData.cena || '',
                snack: backendData.snack || ''
            }
        };
    }

    async function loadDay() {
        try {
            const dateKey = selectedDate.toISOString().split('T')[0];
            
            if (authToken) {
                const backendDay = await DayApi.obtenerOCrear(dateKey);
                currentDayData = mapBackendToFrontend(backendDay);
                
                if (currentDayData && currentDayData.id) {
                    try {
                        const backendTasks = await TaskApi.listar(currentDayData.id);
                        if (backendTasks && Array.isArray(backendTasks)) {
                            currentDayData.tasks = backendTasks.map(t => ({
                                id: t.id,
                                text: t.descripcion,
                                completed: t.realizada
                            }));
                        }
                    } catch (err) {
                        console.error("Error cargando tareas:", err);
                    }
                }
            } else {
                const db = JSON.parse(localStorage.getItem('logra_db') || '{}');
                currentDayData = db[dateKey] || getEmptyDayData();
            }
        } catch (e) {
            console.warn("Error cargando día:", e);
            currentDayData = getEmptyDayData();
        }
        
        if (!currentDayData) currentDayData = getEmptyDayData();
        if (!Array.isArray(currentDayData.tasks)) currentDayData.tasks = [];
        
        if (!currentDayData.id) currentDayData.id = authToken ? await createBackendDay() : Date.now();
        
        renderUI();
    }

    async function createBackendDay() {
        const dateStr = selectedDate.toISOString().split('T')[0];
        try {
            const result = await apiFetch('/dia', {
                method: 'POST',
                body: JSON.stringify({ fecha: dateStr }) 
            });

            return result?.id || null;
        } catch (e) {
            console.error("No se pudo crear el día en backend:", e);
            return null;
        }
    }



    async function saveCurrentDay() {

    if (!currentDayData.meals) {
        currentDayData.meals = {
            breakfast: '',
            lunch: '',
            dinner: '',
            snack: ''
        };
    }

    if (authToken) {
        if (currentDayData.id) {
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
    } else {
        const db = JSON.parse(localStorage.getItem('logra_db') || '{}');
        const dateKey = selectedDate.toISOString().split('T')[0];
        db[dateKey] = currentDayData;
        localStorage.setItem('logra_db', JSON.stringify(db));
    }

    updateStats();
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
        els.currentDate.textContent = selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        
const today = new Date();
        const isToday = selectedDate.toDateString() === today.toDateString();
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const isTomorrow = selectedDate.toDateString() === tomorrow.toDateString();

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const isYesterday = selectedDate.toDateString() === yesterday.toDateString();

        if (isToday) els.dayStatus.textContent = 'Hoy';
        else if (isTomorrow) els.dayStatus.textContent = 'Planificando';
        else if (isYesterday) els.dayStatus.textContent = 'Ayer';
        else els.dayStatus.textContent = '';
    }

    function applyDayStatusStyles() {
        const today = new Date();
        
        today.setHours(0, 0, 0, 0);
        const selected = new Date(selectedDate);
        selected.setHours(0, 0, 0, 0);

 if (selected < today) {
            
            els.contentWrapper.classList.add('read-only-mode');
            els.contentWrapper.classList.remove('future-mode');
            els.taskInput.placeholder = "Día pasado (Solo lectura)";
            disableInputs(true);
 } else if (selected > today) {
             
             els.contentWrapper.classList.remove('read-only-mode');
             els.contentWrapper.classList.add('future-mode');
             els.taskInput.placeholder = "Planifica para el futuro...";
             disableInputs(false);
} else {
            
            els.contentWrapper.classList.remove('read-only-mode', 'future-mode');
            els.taskInput.placeholder = "Escribe una nueva tarea...";
            disableInputs(false);
        }
    }

    function disableInputs(disabled) {
        els.contentWrapper.querySelectorAll('input, textarea, select').forEach(i => i.disabled = disabled);
        els.taskInput.disabled = disabled;
        els.addTaskBtn.disabled = disabled;
    }

    function renderTasks() {
        els.todoList.innerHTML = '';
        const tasksArray = Array.isArray(currentDayData.tasks) ? currentDayData.tasks : [];
        let visibleTasks = tasksArray;

        if (currentFilter === 'pending') {
            visibleTasks = visibleTasks.filter(t => !t.completed);
        } else if (currentFilter === 'completed') {
            visibleTasks = visibleTasks.filter(t => t.completed);
        }
        
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selected = new Date(selectedDate);
        selected.setHours(0, 0, 0, 0);
        const isReadOnly = selected < today;

        if (visibleTasks.length === 0) {
            els.emptyState.style.display = tasksArray.length === 0 ? 'block' : 'none';
            if (tasksArray.length > 0) {
                const msg = document.createElement('div');
                msg.className = 'text-center py-4 text-muted fst-italic';
                msg.textContent = '¡Todo completado!';
                els.todoList.appendChild(msg);
            }
            return;
        }
        els.emptyState.style.display = 'none';
        visibleTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `list-group-item ${task.completed ? 'completed-task' : ''}`;
            
            
            const checkboxAttr = isReadOnly ? 'disabled' : '';
            const deleteBtnStyle = isReadOnly ? 'display: none;' : '';
            const deleteAction = isReadOnly ? '' : `onclick="window.handleDelete(${task.id})"`;

            li.innerHTML = `
                <div class="d-flex align-items-center w-100">
                    <input class="form-check-input rounded-circle" type="checkbox" ${task.completed ? 'checked' : ''} ${checkboxAttr} onchange="window.handleToggle(${task.id})">
                    <span class="todo-text flex-grow-1">${escapeHtml(task.text)}</span>
                    <button class="delete-btn" ${deleteAction} style="${deleteBtnStyle}" title="Eliminar">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `;
            els.todoList.appendChild(li);
        });
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
        els.filterBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === currentFilter));
    }

    function renderMood() {
        els.moodBtns.forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-mood') === currentDayData.mood));
        els.moodText.textContent = currentDayData.mood ? MOOD_MAP[currentDayData.mood] : '';
    }

    function renderNotes() {
        els.dailyNote.value = currentDayData.dailyNote || '';
        els.tomorrowNote.value = currentDayData.tomorrowNote || '';
    }

    function renderWellness() {
        els.hydrationContainer.innerHTML = '';
        for (let i = 1; i <= 8; i++) {
            const btn = document.createElement('button');
            btn.className = `wellness-btn ${i <= currentDayData.hydration ? 'active' : ''}`;
            btn.innerHTML = `<i class="bi bi-cup-straw wellness-icon"></i>`;
            btn.title = `${i} vaso${i !== 1 ? 's' : ''}`;
            btn.onclick = () => handleHydrationClick(i);
            els.hydrationContainer.appendChild(btn);
        }
        els.sleepContainer.innerHTML = '';
        for (let i = 1; i <= 8; i++) {
            const btn = document.createElement('button');
            btn.className = `wellness-btn ${i <= currentDayData.sleep ? 'sleep-active' : ''}`;
            btn.innerHTML = `<i class="bi bi-moon-stars-fill wellness-icon"></i>`;
            btn.title = `${i} hora${i !== 1 ? 's' : ''}`;
            btn.onclick = () => handleSleepClick(i);
            els.sleepContainer.appendChild(btn);
        }
    }

    function renderMeals() {
    Object.keys(els.mealInputs).forEach(key => {
        els.mealInputs[key].value = currentDayData.meals?.[key] || '';
    });
}


    
    async function handleAddTask() {
        const text = els.taskInput.value.trim();
        if (!text) return;

        const todayKey = selectedDate.toISOString().split('T')[0];

        if (!authToken) {
            if (!currentDayData.id) currentDayData.id = Date.now();
            currentDayData.tasks.unshift({ id: Date.now(), text, completed: false });
            await saveCurrentDay();
            renderTasks();
            els.taskInput.value = '';
            return;
        }

        if (!currentDayData.id) {
            currentDayData.id = await createBackendDay();
            if (!currentDayData.id) {
                alert("No se pudo crear el día en el servidor.");
                return;
            }
        }

        try {
            await TaskApi.crear(currentDayData.id, text);
            
            
            const backendTasks = await TaskApi.listar(currentDayData.id);
            if (backendTasks && Array.isArray(backendTasks)) {
                currentDayData.tasks = backendTasks.map(t => ({
                    id: t.id,
                    text: t.descripcion,
                    completed: t.realizada
                }));
                
                currentDayData.tasks.sort((a, b) => b.id - a.id);
            }

            await saveCurrentDay();
            renderTasks();
            els.taskInput.value = '';
        } catch (e) {
            console.error("Error creando tarea:", e);
            alert("No se pudo crear la tarea en el servidor.");
        }
    }

    function handleHydrationClick(count) {
        currentDayData.hydration = currentDayData.hydration === count ? count - 1 : count;
        saveCurrentDay();
        renderWellness();
    }

    function handleSleepClick(count) {
        currentDayData.sleep = count;
        saveCurrentDay();
        renderWellness();
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function changeDate(offset) {
        selectedDate.setDate(selectedDate.getDate() + offset);
        loadDay();
    }

    function setupEventListeners() {
        els.prevDayBtn.addEventListener('click', () => changeDate(-1));
        els.nextDayBtn.addEventListener('click', () => changeDate(1));

        els.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                currentFilter = btn.dataset.filter;
                updateFilterUI();
                renderTasks();
            });
        });

        els.addTaskBtn.addEventListener('click', handleAddTask);
        els.taskInput.addEventListener('keypress', e => { if (e.key === 'Enter') handleAddTask(); });
        els.moodBtns.forEach(btn => btn.addEventListener('click', () => { currentDayData.mood = btn.getAttribute('data-mood'); saveCurrentDay(); renderMood(); }));
        els.dailyNote.addEventListener('input', e => { currentDayData.dailyNote = e.target.value; if (!authToken) saveCurrentDay(); });
        els.tomorrowNote.addEventListener('input', e => { currentDayData.tomorrowNote = e.target.value; if (!authToken) saveCurrentDay(); });
        Object.keys(els.mealInputs).forEach(key => els.mealInputs[key].addEventListener('input', e => { currentDayData.meals[key] = e.target.value; if (!authToken) saveCurrentDay(); }));
        if (els.btnSaveMeals) els.btnSaveMeals.addEventListener('click', async () => { await saveCurrentDay(); showSuccessMessage(els.msgSaveMeals); });
        if (els.btnSaveDailyNote) els.btnSaveDailyNote.addEventListener('click', async () => { await saveCurrentDay(); showSuccessMessage(els.msgSaveDailyNote); });
        if (els.btnSaveTomorrowNote) els.btnSaveTomorrowNote.addEventListener('click', async () => { await saveCurrentDay(); showSuccessMessage(els.msgSaveTomorrowNote); });
        if (els.btnLogout) els.btnLogout.addEventListener('click', () => { clearToken(); localStorage.removeItem('logra_user_name'); location.reload(); });
    }

    function showSuccessMessage(el) {
        el.style.opacity = '1';
        setTimeout(() => el.style.opacity = '0', 2000);
    }

    function updateAuthUI() {
        const loggedIn = !!authToken;
        els.authTeaserLogin.classList.toggle('d-none', loggedIn);
        els.authTeaserLogout.classList.toggle('d-none', !loggedIn);
        els.authOnlyElements.forEach(el => el.classList.toggle('d-none', !loggedIn));
        if (loggedIn) els.userNameDisplay.textContent = localStorage.getItem('logra_user_name') || 'Usuario';
    }

    async function init() {
        updateAuthUI();
        setupEventListeners();
        await loadDay();
    }

    window.handleToggle = async function(taskId) {
        const task = currentDayData.tasks.find(t => t.id === taskId);
        if (!task) return;

        task.completed = !task.completed;

        if (authToken) {
            try {
                await TaskApi.actualizar(task.id, { 
                    descripcion: task.text,
                    realizada: task.completed 
                });
            } catch (e) {
                console.error('Error actualizando tarea en backend:', e);
                alert('No se pudo actualizar la tarea en el servidor.');
                task.completed = !task.completed; 
            }
        }

        await saveCurrentDay();
        renderTasks();
    };

    window.handleDelete = async function(taskId) {
        const index = currentDayData.tasks.findIndex(t => t.id === taskId);
        if (index === -1) return;

        const confirmed = confirm('¿Seguro que quieres eliminar esta tarea?');
        if (!confirmed) return;

        const [removed] = currentDayData.tasks.splice(index, 1);

        if (authToken) {
            try {
                await TaskApi.eliminar(removed.id);
            } catch (e) {
                console.error('Error eliminando tarea en backend:', e);
                alert('No se pudo eliminar la tarea en el servidor.');
                currentDayData.tasks.splice(index, 0, removed); 
            }
        }

        await saveCurrentDay();
        renderTasks();
    };

    init();
});
