document.addEventListener('DOMContentLoaded', () => { 
    const MOOD_MAP = {
        'happy': '¡Me siento feliz!',
        'neutral': 'Día tranquilo.',
        'sad': 'Mañana será mejor.'
    };

    let currentDayData = getEmptyDayData();
    const els = {
        currentDate: document.getElementById('current-date'),
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

    async function loadDay() {
        try {
            if (authToken) {
                // Usamos la fecha de hoy para cargar
                const dateKey = new Date().toISOString().split('T')[0];
                currentDayData = await DayApi.obtenerOCrear(dateKey);
            } else {
                const db = JSON.parse(localStorage.getItem('logra_db') || '{}');
                currentDayData = db['today'] || getEmptyDayData();
            }
        } catch (e) {
            console.warn("Error cargando día:", e);
            currentDayData = getEmptyDayData();
        }
        
        // Garantizar estructura
        if (!currentDayData) currentDayData = getEmptyDayData();
        if (!Array.isArray(currentDayData.tasks)) currentDayData.tasks = [];
        
        // Asegurar ID
        if (!currentDayData.id) currentDayData.id = authToken ? await createBackendDay() : Date.now();
        
        renderUI();
    }

    // Función para extraer el userId del token JWT
    function getUsuarioIdFromToken() {
        if (!authToken) return null;
        try {
            const payload = JSON.parse(atob(authToken.split('.')[1]));
            return payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || payload.sub;
        } catch {
            return null;
        }
    }

async function createBackendDay() {
    const dateStr = new Date().toISOString().split('T')[0];
    try {
        const usuarioId = getUsuarioIdFromToken(); // asegurate de tener esta función
        if (!usuarioId) throw new Error("No hay usuario logueado");

        const result = await apiFetch('/dia', {
            method: 'POST',
            body: JSON.stringify({ fecha: dateStr, usuarioId }) // "usuarioId" coincide con tu DTO
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
        db['today'] = currentDayData;
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
        els.currentDate.textContent = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        els.dayStatus.textContent = 'Hoy';
    }

    function applyDayStatusStyles() {
        els.contentWrapper.classList.remove('read-only-mode', 'future-mode');
        els.taskInput.placeholder = "Escribe una nueva tarea...";
        disableInputs(false);
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
            li.innerHTML = `
                <div class="d-flex align-items-center w-100">
                    <input class="form-check-input rounded-circle" type="checkbox" ${task.completed ? 'checked' : ''} onchange="window.handleToggle(${task.id})">
                    <span class="todo-text flex-grow-1">${escapeHtml(task.text)}</span>
                    <button class="delete-btn" onclick="window.handleDelete(${task.id})" title="Eliminar">
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
        els.filterBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === 'all'));
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


    // Agregar tarea en backend
    async function handleAddTask() {
        const text = els.taskInput.value.trim();
        if (!text) return;

        const todayKey = new Date().toISOString().split('T')[0];

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
            const tarea = await TaskApi.crear(currentDayData.id, text);
            if (tarea) {
                currentDayData.tasks.unshift({ id: tarea.id, text: tarea.descripcion, completed: tarea.realizada });
                await saveCurrentDay();
                renderTasks();
                els.taskInput.value = '';
            }
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

    function setupEventListeners() {
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

    init();
});

window.handleToggle = async function(taskId) {
    const task = currentDayData.tasks.find(t => t.id === taskId);
    if (!task) return;

    task.completed = !task.completed;

    if (authToken) {
        try {
            await TaskApi.actualizar(task.id, { realizada: task.completed });
        } catch (e) {
            console.error('Error actualizando tarea en backend:', e);
            alert('No se pudo actualizar la tarea en el servidor.');
            task.completed = !task.completed; // revertir cambio
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
            currentDayData.tasks.splice(index, 0, removed); // revertir eliminación
        }
    }

    await saveCurrentDay();
    renderTasks();
};


