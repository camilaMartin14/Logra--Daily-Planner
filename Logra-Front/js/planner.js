import { apiFetch, clearToken, authToken } from './api.js';
import { DayApi } from './dayApi.js';
import { TaskApi } from './taskApi.js';
import { CategoryApi } from './categoryApi.js';
import { Calendar } from './calendar.js';

document.addEventListener('DOMContentLoaded', () => { 
    const MOOD_MAP = {
        'happy': '¡Me siento feliz!',
        'neutral': 'Día tranquilo.',
        'sad': 'Mañana será mejor.'
    };

    let currentDayData = getEmptyDayData();
    let selectedDate = new Date();
    let currentFilter = 'all';
    let currentCategoryFilter = '';
    let categories = [];
    let taskCategoriesMap = {};
    let taskModal = null;
    let calendar = null;

    const els = {
        currentDate: document.getElementById('current-date'),
        prevDayBtn: document.getElementById('prev-day-btn'),
        nextDayBtn: document.getElementById('next-day-btn'),
        dayStatus: document.getElementById('day-status-indicator'),
        taskInput: document.getElementById('new-task-input'),
        taskCategoryInput: document.getElementById('new-task-category'),
        taskCategoryFilter: document.getElementById('task-category-filter'),
        addTaskBtn: document.getElementById('add-task-btn'),
        todoList: document.getElementById('todo-list'),
        emptyState: document.getElementById('empty-state'),
        filterBtns: document.querySelectorAll('.filter-btn[data-filter]'),
        countAll: document.getElementById('count-all'),
        countPending: document.getElementById('count-pending'),
        countCompleted: document.getElementById('count-completed'),
        moodBtns: document.querySelectorAll('.mood-btn'),
        moodText: document.getElementById('selected-mood-text'),
        dailyNote: document.getElementById('daily-note'),
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
        msgSaveTomorrowNote: document.getElementById('msg-save-tomorrow-note'),
        
        taskModalEl: document.getElementById('taskModal'),
        taskForm: document.getElementById('taskForm'),
        taskIdInput: document.getElementById('taskId'),
        taskDescInput: document.getElementById('taskDescription'),
        taskCategoriesContainer: document.getElementById('task-categories-selection'),
        monthPdfBtn: document.getElementById('btn-month-pdf')
    };

    async function fetchCategories() {
        if (!authToken) {
            const db = JSON.parse(localStorage.getItem('logra_categories') || '[]');
            updateCategorySelectors(db);
        } else {
            try {
                const cats = await CategoryApi.getAll();
                updateCategorySelectors(cats);
            } catch (e) {
                console.error('Error fetching categories for planner:', e);
            }
        }
    }

    function updateCategorySelectors(cats) {
        categories = cats;
        
        // Update Filter Select
        const currentFilterVal = els.taskCategoryFilter.value;
        els.taskCategoryFilter.innerHTML = '<option value="">Todas las cat.</option>';
        cats.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = c.name;
            els.taskCategoryFilter.appendChild(opt);
        });
        els.taskCategoryFilter.value = currentFilterVal; // Restore selection if still valid

        // Update New Task Select
        const currentNewTaskVal = els.taskCategoryInput.value;
        els.taskCategoryInput.innerHTML = '<option value="">Sin categoría</option>';
        cats.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = c.name;
            els.taskCategoryInput.appendChild(opt);
        });
        els.taskCategoryInput.value = currentNewTaskVal;

        // Update Edit Modal Checkboxes
        els.taskCategoriesContainer.innerHTML = '';
        cats.forEach(c => {
            const div = document.createElement('div');
            div.className = 'form-check form-check-inline';
            div.innerHTML = `
                <input class="form-check-input" type="checkbox" id="task-cat-${c.id}" value="${c.id}">
                <label class="form-check-label badge rounded-pill text-white" for="task-cat-${c.id}" style="background-color: ${c.color}; cursor: pointer;">
                    ${c.name}
                </label>
            `;
            els.taskCategoriesContainer.appendChild(div);
        });
    }

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
            dailyNote: backendData.dailyNote,
            tomorrowNote: backendData.morningNote,
            hydration: backendData.waterIntake || 0,
            sleep: backendData.sleepHours || 0,
            meals: {
                breakfast: backendData.breakfast || '',
                lunch: backendData.lunch || '',
                dinner: backendData.dinner || '',
                snack: backendData.snack || ''
            }
        };
    }

    function formatDateKey(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    async function loadDay() {
        try {
            if (calendar) calendar.setDate(selectedDate);
            const dateKey = formatDateKey(selectedDate);
            
            if (authToken) {
                const backendDay = await DayApi.obtenerOCrear(dateKey);
                currentDayData = mapBackendToFrontend(backendDay);
                
                // Mantener la fecha seleccionada por el usuario sin sobrescribir desde backend

                if (currentDayData && currentDayData.id) {
                    try {
                        const backendTasks = await TaskApi.listar(currentDayData.id);
                        if (backendTasks && Array.isArray(backendTasks)) {
                            currentDayData.tasks = backendTasks.map(t => ({
                                id: t.id,
                                text: t.description,
                                completed: t.isCompleted,
                                categories: t.categories || []
                            }));
                        }
                        
                        await loadTaskCategories();

                    } catch (err) {
                        console.error("Error cargando tareas:", err);
                    }
                }
            } else {
                const db = JSON.parse(localStorage.getItem('logra_db') || '{}');
                // Migración: si existen datos bajo la clave antigua (UTC via toISOString),
                // moverlos a la clave local consistente
                const legacyKey = new Date(selectedDate).toISOString().split('T')[0];
                if (!db[dateKey] && db[legacyKey]) {
                    db[dateKey] = db[legacyKey];
                    delete db[legacyKey];
                    localStorage.setItem('logra_db', JSON.stringify(db));
                }
                currentDayData = db[dateKey] || getEmptyDayData();
            }
        } catch (e) {
            console.warn("Error cargando día:", e);
            currentDayData = getEmptyDayData();
        }
        
        if (!currentDayData) currentDayData = getEmptyDayData();
        if (!Array.isArray(currentDayData.tasks)) currentDayData.tasks = [];
        
        if (!currentDayData.id && !authToken) currentDayData.id = Date.now();
        
        renderUI();
    }

    async function loadTaskCategories() {
        if (categories.length === 0) return;
        
        taskCategoriesMap = {};
        let loadedFromTasks = false;

        // Intentar poblar desde las tareas cargadas (si el backend devuelve categorías)
        if (currentDayData.tasks && currentDayData.tasks.length > 0) {
            currentDayData.tasks.forEach(t => {
                if (t.categories && Array.isArray(t.categories) && t.categories.length > 0) {
                    const mappedCats = t.categories.map(tc => {
                         const catId = typeof tc === 'object' ? tc.id : tc;
                         return categories.find(c => c.id == catId);
                    }).filter(Boolean);
                    
                    if (mappedCats.length > 0) {
                        taskCategoriesMap[t.id] = mappedCats;
                        loadedFromTasks = true;
                    }
                }
            });
        }

        // Si logramos cargar desde tareas, no hace falta hacer fetch individual
        if (loadedFromTasks) return;
        
        if (authToken) {
            const promises = categories.map(async cat => {
                try {
                    const tasks = await TaskApi.getByCategory(cat.id);
                    tasks.forEach(t => {
                        if (!taskCategoriesMap[t.id]) taskCategoriesMap[t.id] = [];
                        if (!taskCategoriesMap[t.id].some(existing => existing.id === cat.id)) {
                            taskCategoriesMap[t.id].push(cat);
                        }
                    });
                } catch (e) {
                    console.warn(`Failed to fetch tasks for category ${cat.id}`, e);
                }
            });

            await Promise.all(promises);
        } else {
            const localMap = JSON.parse(localStorage.getItem('logra_task_categories') || '{}');
            Object.keys(localMap).forEach(taskId => {
                const catIds = localMap[taskId];
                if (Array.isArray(catIds)) {
                    taskCategoriesMap[taskId] = catIds.map(id => categories.find(c => c.id == id)).filter(Boolean);
                }
            });
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
                    waterIntake: currentDayData.hydration,
                    sleepHours: currentDayData.sleep,
                    mood: currentDayData.mood,
                    dailyNote: currentDayData.dailyNote,
                    morningNote: currentDayData.tomorrowNote,
                    breakfast: currentDayData.meals.breakfast,
                    lunch: currentDayData.meals.lunch,
                    dinner: currentDayData.meals.dinner,
                    snack: currentDayData.meals.snack
                });
            }
        } else {
            const db = JSON.parse(localStorage.getItem('logra_db') || '{}');
            const dateKey = formatDateKey(selectedDate);
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
        renderDailyTextareas();
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
        els.contentWrapper.querySelectorAll('input, textarea, select').forEach(i => {
            // No deshabilitar elementos dentro de la lista de tareas
            if (i.closest('#todo-list')) return;
            i.disabled = disabled;
        });
        els.taskInput.disabled = disabled;
        els.addTaskBtn.disabled = disabled;
        document.querySelectorAll('.auth-teaser button').forEach(b => b.disabled = false);
    }

    let dragSrcEl = null;

    function handleTaskDragStart(e) {
        dragSrcEl = this;
        e.dataTransfer.effectAllowed = 'move';
        this.classList.add('dragging');
    }

    function handleTaskDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    function handleTaskDragEnter(e) {
        this.classList.add('over');
    }

    function handleTaskDragLeave(e) {
        this.classList.remove('over');
    }

    function handleTaskDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }

        if (dragSrcEl !== this) {
            const srcId = dragSrcEl.dataset.id;
            const targetId = this.dataset.id;

            // Encontrar índices en el array original
            const srcIndex = currentDayData.tasks.findIndex(t => t.id == srcId);
            const targetIndex = currentDayData.tasks.findIndex(t => t.id == targetId);

            if (srcIndex >= 0 && targetIndex >= 0) {
                // Mover elemento
                const [movedTask] = currentDayData.tasks.splice(srcIndex, 1);
                currentDayData.tasks.splice(targetIndex, 0, movedTask);
                
                saveCurrentDay();
                renderTasks();
            }
        }
        return false;
    }

    function handleTaskDragEnd(e) {
        this.classList.remove('dragging');
        els.todoList.querySelectorAll('.list-group-item').forEach(item => {
            item.classList.remove('over');
        });
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

        const catFilterId = els.taskCategoryFilter ? els.taskCategoryFilter.value : '';
        if (catFilterId) {
            visibleTasks = visibleTasks.filter(t => {
                const cats = taskCategoriesMap[String(t.id)] || taskCategoriesMap[t.id] || [];
                return cats.some(c => String(c.id) === String(catFilterId));
            });
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selected = new Date(selectedDate);
        selected.setHours(0, 0, 0, 0);
        const isReadOnly = selected < today;

        if (visibleTasks.length === 0) {
            els.emptyState.style.display = tasksArray.length === 0 ? 'block' : 'none';
            if (tasksArray.length > 0) {
                 const existingMsg = els.todoList.querySelector('.no-tasks-msg');
                 if (!existingMsg) {
                     const li = document.createElement('li');
                     li.className = 'list-group-item text-center text-muted fst-italic no-tasks-msg';
                     li.textContent = 'No hay tareas que coincidan con los filtros.';
                     els.todoList.appendChild(li);
                 }
            }
            return;
        }
        els.emptyState.style.display = 'none';

        visibleTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `list-group-item ${task.completed ? 'completed-task' : ''}`;
            li.dataset.id = task.id; // ID para drag & drop
            
            if (!isReadOnly) {
                li.setAttribute('draggable', 'true');
                li.addEventListener('dragstart', handleTaskDragStart);
                li.addEventListener('dragenter', handleTaskDragEnter);
                li.addEventListener('dragover', handleTaskDragOver);
                li.addEventListener('dragleave', handleTaskDragLeave);
                li.addEventListener('drop', handleTaskDrop);
                li.addEventListener('dragend', handleTaskDragEnd);
                li.style.cursor = 'grab';
            }

            // Permitir interacción con tareas incluso en días pasados
            const checkboxAttr = '';
            const actionStyle = '';
            const deleteAction = `onclick="window.handleDelete(${task.id})"`;
            const editAction = `onclick="window.handleEditTask(${task.id})"`;

            let cats = taskCategoriesMap[task.id] || [];
            


            const uniqueCats = [];
            const seenCatIds = new Set();
            cats.forEach(c => {
                if (!seenCatIds.has(c.id)) {
                    seenCatIds.add(c.id);
                    uniqueCats.push(c);
                }
            });

            const dots = uniqueCats.map(c => 
                `<span class="category-dot" style="background-color: ${c.color};" title="${c.name}"></span>`
            ).join('');
            
            const editButton = `
                <button class="edit-btn p-0 me-2" ${editAction} style="${actionStyle}" title="Editar">
                    <i class="bi bi-pencil"></i>
                </button>
            `;

            li.innerHTML = `
                <div class="d-flex align-items-center w-100">
                    <input class="form-check-input rounded-circle" type="checkbox" ${task.completed ? 'checked' : ''} ${checkboxAttr} onchange="window.handleToggle(${task.id})">
                    <div class="flex-grow-1 ms-2 d-flex align-items-center">
                        ${dots}
                        <span class="todo-text">${escapeHtml(task.text)}</span>
                    </div>
                    ${editButton}
                    <button class="delete-btn" ${deleteAction} style="${actionStyle}" title="Eliminar">
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

    function renderDailyTextareas() {
        els.dailyNote.value = currentDayData.dailyNote || '';
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
        const categoryId = els.taskCategoryInput.value;
        if (!text) return;

        if (!authToken) {
            if (!currentDayData.id) currentDayData.id = Date.now();
            const newTask = { id: Date.now(), text, completed: false };
            currentDayData.tasks.unshift(newTask);
            
            if (categoryId) {
                 const localMap = JSON.parse(localStorage.getItem('logra_task_categories') || '{}');
                 localMap[newTask.id] = [parseInt(categoryId)];
                 localStorage.setItem('logra_task_categories', JSON.stringify(localMap));
                 await loadTaskCategories(); 
            }
            
            await saveCurrentDay();
            renderTasks();
            els.taskInput.value = '';
            return;
        }

        if (!currentDayData.id) {
             try {
                const day = await DayApi.obtenerOCrear(selectedDate.toISOString().split('T')[0]);
                currentDayData.id = day.id;
             } catch(e) {
                 alert("Error sincronizando día con servidor.");
                 return;
             }
        }

        try {
            const newTask = await TaskApi.crear(currentDayData.id, text);
            
            if (categoryId) {
                await TaskApi.addCategory(newTask.id, categoryId);
            }
            
            const backendTasks = await TaskApi.listar(currentDayData.id);
            if (backendTasks && Array.isArray(backendTasks)) {
                currentDayData.tasks = backendTasks.map(t => ({
                    id: t.id,
                    text: t.description,
                    completed: t.isCompleted
                }));
            }

            await loadTaskCategories();

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
        if (authToken) {
        }
        selectedDate.setDate(selectedDate.getDate() + offset);
        loadDay();
    }

    function setupNavigation() {
        els.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const viewName = link.dataset.view;
                
                els.navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                Object.values(els.views).forEach(el => el.classList.add('d-none'));
                if (els.views[viewName]) {
                    els.views[viewName].classList.remove('d-none');
                }
            });
        });
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

        if (els.taskCategoryFilter) {
            els.taskCategoryFilter.addEventListener('change', () => {
                currentCategoryFilter = els.taskCategoryFilter.value;
                renderTasks();
            });
        }

        els.addTaskBtn.addEventListener('click', handleAddTask);
        els.taskInput.addEventListener('keypress', e => { if (e.key === 'Enter') handleAddTask(); });
        els.moodBtns.forEach(btn => btn.addEventListener('click', () => {
            const selectedMood = btn.getAttribute('data-mood');
            if (currentDayData.mood === selectedMood) {
                currentDayData.mood = null;
            } else {
                currentDayData.mood = selectedMood;
            }
            saveCurrentDay();
            renderMood();
        }));
        els.dailyNote.addEventListener('input', e => { currentDayData.dailyNote = e.target.value; if (!authToken) saveCurrentDay(); });

        Object.keys(els.mealInputs).forEach(key => els.mealInputs[key].addEventListener('input', e => { currentDayData.meals[key] = e.target.value; if (!authToken) saveCurrentDay(); }));
        if (els.btnSaveMeals) els.btnSaveMeals.addEventListener('click', async () => { await saveCurrentDay(); showSuccessMessage(els.msgSaveMeals); });
        if (els.btnSaveDailyNote) els.btnSaveDailyNote.addEventListener('click', async () => { await saveCurrentDay(); showSuccessMessage(els.msgSaveDailyNote); });
        if (els.btnSaveTomorrowNote) els.btnSaveTomorrowNote.addEventListener('click', async () => { await saveCurrentDay(); showSuccessMessage(els.msgSaveTomorrowNote); });
        if (els.btnLogout) els.btnLogout.addEventListener('click', () => { clearToken(); localStorage.removeItem('logra_user_name'); location.reload(); });
        
        window.addEventListener('categoriesUpdated', async (e) => {
            updateCategorySelectors(e.detail);
            await loadTaskCategories();
            renderTasks();
        });

        if (els.taskForm) {
            els.taskForm.addEventListener('submit', handleTaskSubmit);
        }
        if (els.monthPdfBtn) {
            els.monthPdfBtn.addEventListener('click', generateMonthPdf);
        }
    }

    async function handleTaskSubmit(e) {
        e.preventDefault();
        const id = els.taskIdInput.value;
        const description = els.taskDescInput.value;

        const selectedCats = Array.from(els.taskCategoriesContainer.querySelectorAll('input:checked'))
            .map(cb => parseInt(cb.value));

        if (!id) return;

        if (authToken) {
            try {
                const task = currentDayData.tasks.find(t => t.id == id);
                if (task) {
                    await TaskApi.actualizar(id, {
                        description: description,
                        isCompleted: task.completed
                    });
                }

                const currentCats = (taskCategoriesMap[id] || []).map(c => c.id);
                const toAdd = selectedCats.filter(id => !currentCats.includes(id));
                const toRemove = currentCats.filter(id => !selectedCats.includes(id));

                for (const catId of toAdd) {
                    await TaskApi.addCategory(id, catId);
                }
                for (const catId of toRemove) {
                    await TaskApi.removeCategory(id, catId);
                }

                await loadTaskCategories();
                
                 const backendTasks = await TaskApi.listar(currentDayData.id);
                if (backendTasks && Array.isArray(backendTasks)) {
                    currentDayData.tasks = backendTasks.map(t => ({
                        id: t.id,
                        text: t.description,
                        completed: t.isCompleted
                    }));
                }

            } catch (err) {
                console.error("Error actualizando tarea:", err);
                alert("Error actualizando tarea.");
            }
        } else {
             const task = currentDayData.tasks.find(t => t.id == id);
             if (task) {
                 task.text = description;
                 
                 const localMap = JSON.parse(localStorage.getItem('logra_task_categories') || '{}');
                 localMap[id] = selectedCats; 
                 localStorage.setItem('logra_task_categories', JSON.stringify(localMap));
                 
                 await loadTaskCategories();
                 await saveCurrentDay();
             }
        }

        if (taskModal) taskModal.hide();
        renderTasks();
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

        calendar = new Calendar('calendar-wrapper', async (date) => {
            selectedDate = date;
            await loadDay();
        });

        setupEventListeners();
        if (typeof bootstrap !== 'undefined') {
            if (els.taskModalEl) {
                taskModal = new bootstrap.Modal(els.taskModalEl);
            }
        }
        await loadDay();
        await fetchCategories();
        await loadTaskCategories();
        renderTasks(); // Re-renderizar después de cargar categorías
    }

    window.handleToggle = async function(taskId) {
        const task = currentDayData.tasks.find(t => t.id === taskId);
        if (!task) return;

        task.completed = !task.completed;

        if (authToken) {
            try {
                await TaskApi.actualizar(task.id, { 
                    description: task.text,
                    isCompleted: task.completed 
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
        } else {
            const localMap = JSON.parse(localStorage.getItem('logra_task_categories') || '{}');
            if (localMap[removed.id]) {
                delete localMap[removed.id];
                localStorage.setItem('logra_task_categories', JSON.stringify(localMap));
                await loadTaskCategories();
            }
        }

        await saveCurrentDay();
        renderTasks();
    };

    window.handleEditTask = function(taskId) {
        const task = currentDayData.tasks.find(t => t.id === taskId);
        if (!task) return;

        els.taskIdInput.value = task.id;
        els.taskDescInput.value = task.text;

        if (categories.length > 0) {
            const taskCats = taskCategoriesMap[task.id] || [];
            const taskCatIds = taskCats.map(c => c.id);

            els.taskCategoriesContainer.innerHTML = categories.map(cat => `
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="${cat.id}" id="task-cat-${cat.id}" ${taskCatIds.includes(cat.id) ? 'checked' : ''}>
                    <label class="form-check-label badge rounded-pill text-white" for="task-cat-${cat.id}" style="background-color: ${cat.color}; cursor: pointer;">
                        ${cat.name}
                    </label>
                </div>
            `).join('');

            els.taskCategoriesContainer.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    if (this.checked) {
                        els.taskCategoriesContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                            if (cb !== this) cb.checked = false;
                        });
                    }
                });
            });

            document.querySelector('#taskModal .modal-body .mb-3:nth-child(3)').style.display = 'block';
        } else {
             els.taskCategoriesContainer.innerHTML = '';
             document.querySelector('#taskModal .modal-body .mb-3:nth-child(3)').style.display = 'none';
        }

        if (taskModal) taskModal.show();
    };

    init();
    
    async function fetchDayData(date) {
        const key = formatDateKey(date);
        if (authToken) {
            try {
                const backendDay = await DayApi.obtenerOCrear(key);
                const mapped = mapBackendToFrontend(backendDay);
                if (mapped && backendDay && backendDay.id) {
                    try {
                        const ts = await TaskApi.listar(backendDay.id);
                        if (Array.isArray(ts)) {
                            mapped.tasks = ts.map(t => ({ id: t.id, text: t.description, completed: t.isCompleted }));
                        }
                    } catch(e) {}
                }
                return mapped;
            } catch(e) {
                return getEmptyDayData();
            }
        } else {
            const db = JSON.parse(localStorage.getItem('logra_db') || '{}');
            return db[key] || getEmptyDayData();
        }
    }
    
    async function generateMonthPdf() {
        const { jsPDF } = window.jspdf || {};
        if (!jsPDF) {
            alert('No se pudo cargar el generador de PDF.');
            return;
        }

        // UX: Feedback visual en el botón
        const btn = els.monthPdfBtn;
        const originalText = btn ? btn.innerText : '';
        if (btn) {
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Generando...';
            btn.disabled = true;
        }

        try {
            const base = calendar ? calendar.viewDate : new Date(selectedDate);
            const year = base.getFullYear();
            const month = base.getMonth();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const monthNames = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
            
            // --- 1. Recopilar Datos ---
            let tasksTotal = 0;
            let tasksCompleted = 0;
            let hydrationSum = 0;
            let hydrationCount = 0;
            let sleepSum = 0;
            let sleepCount = 0;
            
            const dailyData = [];

            // Iterar por todos los días del mes
            for (let d = 1; d <= daysInMonth; d++) {
                const date = new Date(year, month, d);
                const data = await fetchDayData(date); // Reutilizamos la función existente que ya maneja local/remoto
                const tasks = Array.isArray(data.tasks) ? data.tasks : [];
                
                tasksTotal += tasks.length;
                tasksCompleted += tasks.filter(t => t.completed).length;
                
                if (typeof data.hydration === 'number' && data.hydration > 0) { 
                    hydrationSum += data.hydration; 
                    hydrationCount++; 
                }
                if (typeof data.sleep === 'number' && data.sleep > 0) { 
                    sleepSum += data.sleep; 
                    sleepCount++; 
                }

                // Solo agregar al reporte si el día tiene contenido relevante
                if (tasks.length > 0 || data.dailyNote || data.mood) {
                    dailyData.push({
                        date: date,
                        dayLabel: date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' }),
                        tasks: tasks,
                        completedCount: tasks.filter(t => t.completed).length,
                        note: data.dailyNote,
                        mood: data.mood,
                        hydration: data.hydration,
                        sleep: data.sleep
                    });
                }
            }

            const avgHydration = hydrationCount ? (hydrationSum / hydrationCount).toFixed(1) : "0";
            const avgSleep = sleepCount ? (sleepSum / sleepCount).toFixed(1) : "0";

            // --- 2. Generar PDF ---
            const doc = new jsPDF({ unit: 'pt', format: 'a4' });
            const pageWidth = doc.internal.pageSize.getWidth();
            const margin = 40;
            const contentWidth = pageWidth - (margin * 2);
            
            // Colores de la marca (Logra Style)
            const colorPrimary = [226, 179, 196]; // #e2b3c4 (Rosa pastel)
            const colorPrimaryDark = [213, 155, 176]; // #d59bb0 (Rosa oscuro)
            const colorText = [93, 92, 97]; // #5d5c61 (Gris oscuro)
            const colorBgLight = [252, 240, 245]; // #fcf0f5 (Rosa muy suave fondo)
            const colorAccent = [166, 177, 225]; // #a6b1e1 (Lila/Azul)
            
            let y = margin + 20;

            // -- Encabezado --
            doc.setFont("helvetica", "bold");
            doc.setFontSize(24);
            doc.setTextColor(...colorPrimaryDark);
            doc.text(`Resumen Mensual: ${monthNames[month]} ${year}`, margin, y);
            y += 25;
            
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(...colorAccent);
            doc.text("Logra Daily Planner", margin, y);
            y += 35;

            // -- Resumen Estadístico (Caja) --
            doc.setDrawColor(...colorPrimary);
            doc.setFillColor(...colorBgLight);
            doc.roundedRect(margin, y, contentWidth, 75, 8, 8, 'FD');
            
            doc.setFontSize(11);
            doc.setTextColor(...colorText);
            
            const statsY = y + 25;
            const col2X = margin + 250;

            // Columna 1
            doc.setFont("helvetica", "bold");
            doc.text(`Total Tareas:`, margin + 20, statsY);
            doc.setFont("helvetica", "normal");
            doc.text(`${tasksTotal} (${tasksCompleted} completadas)`, margin + 110, statsY);
            
            doc.setFont("helvetica", "bold");
            doc.text(`Tasa de éxito:`, margin + 20, statsY + 25);
            doc.setFont("helvetica", "normal");
            const successRate = tasksTotal ? Math.round((tasksCompleted/tasksTotal)*100) : 0;
            doc.text(`${successRate}%`, margin + 110, statsY + 25);
            
            // Columna 2
            doc.setFont("helvetica", "bold");
            doc.text(`Hidratación Prom.:`, col2X, statsY);
            doc.setFont("helvetica", "normal");
            doc.text(`${avgHydration} vasos/día`, col2X + 110, statsY);

            doc.setFont("helvetica", "bold");
            doc.text(`Sueño Prom.:`, col2X, statsY + 25);
            doc.setFont("helvetica", "normal");
            doc.text(`${avgSleep} horas/día`, col2X + 110, statsY + 25);

            y += 110;

            // -- Detalle Diario --
            if (dailyData.length === 0) {
                 doc.setFont("helvetica", "italic");
                 doc.setTextColor(150, 150, 150);
                 doc.text("No hay registros de actividad para este mes.", margin, y);
            }

            dailyData.forEach((day, index) => {
                // Verificar espacio en página antes de empezar un nuevo día
                if (y > doc.internal.pageSize.getHeight() - 100) {
                    doc.addPage();
                    y = margin + 20;
                } else if (index > 0) {
                    // Separador entre días (excepto el primero) - Rosa suave
                    doc.setDrawColor(...colorPrimary);
                    doc.setLineWidth(0.5);
                    doc.line(margin, y - 10, pageWidth - margin, y - 10);
                    doc.setLineWidth(1); // Reset
                    y += 10;
                }

                // Fecha del día
                doc.setFont("helvetica", "bold");
                doc.setTextColor(...colorPrimaryDark);
                doc.setFontSize(13);
                const dayLabel = day.dayLabel.charAt(0).toUpperCase() + day.dayLabel.slice(1);
                doc.text(dayLabel, margin, y);
                
                // Mood (alineado a la derecha)
                if (day.mood) {
                     const moodMap = {
                        'happy': 'Feliz',
                        'neutral': 'Neutral',
                        'sad': 'Triste'
                    };
                    const moodText = moodMap[day.mood] || day.mood;
                    doc.setFont("helvetica", "italic");
                    doc.setFontSize(10);
                    doc.setTextColor(...colorAccent);
                    doc.text(`Mood: ${moodText}`, pageWidth - margin, y, { align: 'right' });
                }
                
                y += 20;

                // Lista de Tareas
                if (day.tasks.length > 0) {
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(10);
                    doc.setTextColor(...colorText);
                    
                    day.tasks.forEach(task => {
                        const status = task.completed ? "[x]" : "[ ]";
                        const taskText = `${status}  ${task.text}`;
                        
                        const splitText = doc.splitTextToSize(taskText, contentWidth - 30);
                        
                        if (y + (splitText.length * 14) > doc.internal.pageSize.getHeight() - margin) {
                            doc.addPage();
                            y = margin + 20;
                        }
                        
                        doc.text(splitText, margin + 15, y);
                        y += (splitText.length * 14);
                    });
                    y += 5;
                }

                // Nota del día
                if (day.note) {
                    if (y > doc.internal.pageSize.getHeight() - 60) {
                        doc.addPage();
                        y = margin + 20;
                    }
                    
                    doc.setFont("helvetica", "italic");
                    doc.setFontSize(10);
                    doc.setTextColor(...colorText);
                    
                    const notePrefix = "Nota: ";
                    const splitNote = doc.splitTextToSize(notePrefix + day.note, contentWidth - 35);
                    const noteHeight = (splitNote.length * 14) + 10;
                    
                    // Barra lateral decorativa para la nota - Rosa
                    doc.setDrawColor(...colorPrimary);
                    doc.setLineWidth(3);
                    doc.line(margin + 5, y + 2, margin + 5, y + noteHeight - 8);
                    doc.setLineWidth(1);
                    
                    doc.text(splitNote, margin + 15, y + 10);
                    y += noteHeight + 10;
                } else {
                    y += 10;
                }
            });

            const fileName = `Logra-${monthNames[month]}-${year}.pdf`;
            doc.save(fileName);
        } catch (error) {
            console.error(error);
            alert("Hubo un error generando el PDF. Revisa la consola para más detalles.");
        } finally {
            if (btn) {
                btn.innerText = originalText;
                btn.disabled = false;
            }
        }
    }
});
