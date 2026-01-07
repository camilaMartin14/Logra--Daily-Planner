import { NoteApi } from './noteApi.js';
import { CategoryApi } from './categoryApi.js';
import { authToken } from './api.js';

let allNotes = [];
let currentFilter = 'active'; 
let categories = [];

const notesListEl = document.getElementById('notes-list');
const noteModalEl = document.getElementById('noteModal');
const noteForm = document.getElementById('noteForm');
const noteModalTitle = document.getElementById('noteModalTitle');
const noteIdInput = document.getElementById('noteId');
const noteTitleInput = document.getElementById('noteTitle');
const noteContentInput = document.getElementById('noteContent');
const noteCategoriesContainer = document.getElementById('note-categories-selection');
const btnNewNote = document.getElementById('btn-new-note');
const searchInput = document.getElementById('notes-search');
const categoryFilter = document.getElementById('notes-filter-category');
const btnFilterActive = document.getElementById('filter-active-notes');
const btnFilterArchived = document.getElementById('filter-archived-notes');

let noteModal;

async function fetchCategories() {
    if (!authToken) {
        const db = JSON.parse(localStorage.getItem('logra_categories') || '[]');
        updateCategorySelectors(db);
    } else {
        try {
            const cats = await CategoryApi.getAll();
            updateCategorySelectors(cats);
        } catch (e) {
            console.error('Error fetching categories for notes:', e);
        }
    }
}

async function loadNotes() {
    if (!authToken) {
        const db = JSON.parse(localStorage.getItem('logra_notes') || '[]');
        if (currentFilter === 'active') {
            allNotes = db.filter(n => !n.archived);
        } else {
            allNotes = db.filter(n => n.archived);
        }
        renderNotes();
        return;
    }
    try {
        if (currentFilter === 'active') {
            allNotes = await NoteApi.getActive();
        } else {
            allNotes = await NoteApi.getArchived();
        }
        renderNotes();
    } catch (e) {
        console.error('Error loading notes:', e);
    }
}

let dragSrcNoteEl = null;

function handleNoteDragStart(e) {
    dragSrcNoteEl = this;
    e.dataTransfer.effectAllowed = 'move';
    this.classList.add('dragging');
}

function handleNoteDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleNoteDragEnter(e) {
    this.classList.add('over');
}

function handleNoteDragLeave(e) {
    this.classList.remove('over');
}

function handleNoteDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    if (dragSrcNoteEl !== this) {
        const srcId = dragSrcNoteEl.dataset.id;
        const targetId = this.dataset.id;

        const srcIndex = allNotes.findIndex(n => n.id == srcId);
        const targetIndex = allNotes.findIndex(n => n.id == targetId);

        if (srcIndex >= 0 && targetIndex >= 0) {
            const [movedNote] = allNotes.splice(srcIndex, 1);
            allNotes.splice(targetIndex, 0, movedNote);
            
            if (!authToken) {
                const db = JSON.parse(localStorage.getItem('logra_notes') || '[]');
                
                const otherNotes = db.filter(n => !allNotes.some(an => an.id == n.id));
                const newDb = [...allNotes, ...otherNotes]; 
                
                localStorage.setItem('logra_notes', JSON.stringify(newDb));
            } else {
                console.warn("Backend reordering not fully supported yet.");
            }
            
            renderNotes();
        }
    }
    return false;
}

function handleNoteDragEnd(e) {
    this.classList.remove('dragging');
    notesListEl.querySelectorAll('.col-12').forEach(item => {
        item.classList.remove('over');
    });
}

function renderNotes() {
    if (!notesListEl) return;
    notesListEl.innerHTML = '';

    const searchTerm = searchInput.value.toLowerCase();
    const catFilterId = categoryFilter.value;

    const filtered = allNotes.filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(searchTerm) || 
                              (note.content && note.content.toLowerCase().includes(searchTerm));
        const matchesCategory = !catFilterId || note.categories.some(c => c.id == catFilterId);
        return matchesSearch && matchesCategory;
    });

    if (filtered.length === 0) {
        notesListEl.innerHTML = '<div class="col-12 text-center text-muted py-5"><i class="bi bi-journal-x fs-1 opacity-50"></i><p>No se encontraron notas.</p></div>';
        return;
    }

    filtered.forEach(note => {
        const col = document.createElement('div');
        col.className = 'col-12 col-sm-6';
        col.dataset.id = note.id; // ID para drag & drop
        
        col.setAttribute('draggable', 'true');
        col.addEventListener('dragstart', handleNoteDragStart);
        col.addEventListener('dragenter', handleNoteDragEnter);
        col.addEventListener('dragover', handleNoteDragOver);
        col.addEventListener('dragleave', handleNoteDragLeave);
        col.addEventListener('drop', handleNoteDrop);
        col.addEventListener('dragend', handleNoteDragEnd);
        col.style.cursor = 'grab';
        
        let badges = '';
        let noteColor = '#ffffff';
        let titleStyle = 'color: #333;'; // Negro por defecto

        if (note.categories && note.categories.length > 0) {
            // Usar el color de la primera categoría
            noteColor = note.categories[0].color;
            titleStyle = 'color: #333;'; // Título oscuro
            
            badges = note.categories.map(c => 
                `<span class="badge rounded-pill me-1 text-white" style="background-color: rgba(0,0,0,0.2); font-size: 0.65em;">${escapeHtml(c.name)}</span>`
            ).join('');
        }

        const archiveIcon = currentFilter === 'active' ? 'bi-archive' : 'bi-archive-fill';
        const archiveTitle = currentFilter === 'active' ? 'Archivar' : 'Desarchivar';

        // Determinar si el color de fondo es oscuro para ajustar el texto
        
        col.innerHTML = `
            <div class="card h-100 shadow-sm border-0 note-card" style="background-color: ${noteColor}; transition: transform 0.2s; min-height: 220px;">
                <div class="card-body p-3 d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h6 class="card-title mb-0 fw-bold" style="${titleStyle} font-size: 1.1rem;">${escapeHtml(note.title)}</h6>
                        <div class="dropdown">
                            <button class="btn btn-link text-muted p-0" type="button" data-bs-toggle="dropdown" style="line-height: 1;">
                                <i class="bi bi-three-dots-vertical" style="font-size: 1rem;"></i>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0">
                                <li><a class="dropdown-item btn-edit-note small" href="#" data-id="${note.id}"><i class="bi bi-pencil me-2"></i>Editar</a></li>
                                <li><a class="dropdown-item btn-archive-note small" href="#" data-id="${note.id}"><i class="bi ${archiveIcon} me-2"></i>${archiveTitle}</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item text-danger btn-delete-note small" href="#" data-id="${note.id}"><i class="bi bi-trash me-2"></i>Eliminar</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="note-content-preview mb-3 flex-grow-1" style="font-size: 0.95rem; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(note.content || '')}</div>
                    <div class="mt-auto">
                        ${badges}
                    </div>
                </div>
            </div>
        `;
        notesListEl.appendChild(col);
    });

    attachNoteListeners();
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function attachNoteListeners() {
    document.querySelectorAll('.btn-edit-note').forEach(btn => {
        btn.addEventListener('click', (e) => { e.preventDefault(); openEditNote(btn.dataset.id); });
    });
    document.querySelectorAll('.btn-archive-note').forEach(btn => {
        btn.addEventListener('click', (e) => { e.preventDefault(); toggleArchiveNote(btn.dataset.id); });
    });
    document.querySelectorAll('.btn-delete-note').forEach(btn => {
        btn.addEventListener('click', (e) => { e.preventDefault(); deleteNote(btn.dataset.id); });
    });
}

function openEditNote(id) {
    const note = allNotes.find(n => n.id == id);
    if (!note) return;

    noteIdInput.value = note.id;
    noteTitleInput.value = note.title;
    noteContentInput.value = note.content;
    noteModalTitle.textContent = 'Editar Nota';
    
    const checkboxes = noteCategoriesContainer.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
        cb.checked = note.categories && note.categories.some(c => c.id == cb.value);
    });

    noteModal.show();
}

async function toggleArchiveNote(id) {
    if (!authToken) {
        const db = JSON.parse(localStorage.getItem('logra_notes') || '[]');
        const note = db.find(n => n.id == id);
        if (note) {
            note.archived = !note.archived;
            localStorage.setItem('logra_notes', JSON.stringify(db));
            loadNotes();
        }
        return;
    }
    try {
        if (currentFilter === 'active') {
            await NoteApi.archive(id);
        } else {
            await NoteApi.unarchive(id);
        }
        loadNotes();
    } catch (e) {
        console.error(e);
        alert('Error al cambiar estado de archivo');
    }
}

async function deleteNote(id) {
    if (!confirm('¿Eliminar esta nota permanentemente?')) return;
    
    if (!authToken) {
        let db = JSON.parse(localStorage.getItem('logra_notes') || '[]');
        db = db.filter(n => n.id != id);
        localStorage.setItem('logra_notes', JSON.stringify(db));
        loadNotes();
        return;
    }

    try {
        await NoteApi.delete(id);
        loadNotes();
    } catch (e) {
        console.error(e);
        alert('Error al eliminar nota');
    }
}

function updateCategorySelectors(cats) {
    categories = cats;
    
    categoryFilter.innerHTML = '<option value="">Todas las categorías</option>';
    cats.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.name;
        categoryFilter.appendChild(opt);
    });

    noteCategoriesContainer.innerHTML = '';
    cats.forEach(c => {
        const div = document.createElement('div');
        div.className = 'form-check form-check-inline';
        div.innerHTML = `
            <input class="form-check-input" type="checkbox" id="note-cat-${c.id}" value="${c.id}">
            <label class="form-check-label badge rounded-pill text-white" for="note-cat-${c.id}" style="background-color: ${c.color}; cursor: pointer;">
                ${c.name}
            </label>
        `;
        const checkbox = div.querySelector('input');
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                noteCategoriesContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                    if (cb !== this) cb.checked = false;
                });
            }
        });
        noteCategoriesContainer.appendChild(div);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (btnNewNote) {
        noteModal = new bootstrap.Modal(noteModalEl);

        btnNewNote.addEventListener('click', () => {
            noteIdInput.value = '';
            noteForm.reset();
            noteModalTitle.textContent = 'Nueva Nota';
            noteCategoriesContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
            noteModal.show();
        });

        noteForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = noteIdInput.value;
            const data = {
                title: noteTitleInput.value,
                content: noteContentInput.value
            };

            const selectedIds = Array.from(noteCategoriesContainer.querySelectorAll('input:checked')).map(cb => parseInt(cb.value));
            const selectedCats = categories.filter(c => selectedIds.includes(c.id));

            if (!authToken) {
                const db = JSON.parse(localStorage.getItem('logra_notes') || '[]');
                if (id) {
                    const idx = db.findIndex(n => n.id == id);
                    if (idx !== -1) {
                        db[idx] = { ...db[idx], ...data, categories: selectedCats };
                    }
                } else {
                    db.push({ id: Date.now(), ...data, categories: selectedCats, archived: false });
                }
                localStorage.setItem('logra_notes', JSON.stringify(db));
                noteModal.hide();
                loadNotes();
                return;
            }

            try {
                let noteId = id;
                if (id) {
                    await NoteApi.update(id, data);
                } else {
                    const res = await NoteApi.create(data);
                    noteId = res.id;
                }

                const selectedIds = Array.from(noteCategoriesContainer.querySelectorAll('input:checked')).map(cb => parseInt(cb.value));
                

                let existingIds = [];
                if (id) {
                    const note = allNotes.find(n => n.id == id);
                    if (note && note.categories) existingIds = note.categories.map(c => c.id);
                }

                const toAdd = selectedIds.filter(x => !existingIds.includes(x));
                const toRemove = existingIds.filter(x => !selectedIds.includes(x));

                for (const catId of toAdd) {
                    await NoteApi.addCategory(noteId, catId);
                }
                for (const catId of toRemove) {
                    await NoteApi.removeCategory(noteId, catId);
                }

                noteModal.hide();
                loadNotes();

            } catch (err) {
                console.error(err);
                alert('Error al guardar nota');
            }
        });

        btnFilterActive.addEventListener('click', () => {
            currentFilter = 'active';
            btnFilterActive.classList.add('active');
            btnFilterArchived.classList.remove('active');
            loadNotes();
        });

        btnFilterArchived.addEventListener('click', () => {
            currentFilter = 'archived';
            btnFilterArchived.classList.add('active');
            btnFilterActive.classList.remove('active');
            loadNotes();
        });

        searchInput.addEventListener('input', renderNotes);
        categoryFilter.addEventListener('change', renderNotes);

        window.addEventListener('categoriesUpdated', (e) => {
            updateCategorySelectors(e.detail);
        });

        fetchCategories();
        loadNotes();
    }
});
