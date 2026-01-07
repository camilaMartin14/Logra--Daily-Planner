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
        
        let badges = '';
        if (note.categories) {
            badges = note.categories.map(c => 
                `<span class="badge rounded-pill me-1 text-white" style="background-color: ${c.color}; font-size: 0.65em;">${escapeHtml(c.name)}</span>`
            ).join('');
        }

        const archiveIcon = currentFilter === 'active' ? 'bi-archive' : 'bi-archive-fill';
        const archiveTitle = currentFilter === 'active' ? 'Archivar' : 'Desarchivar';

        col.innerHTML = `
            <div class="card h-100 shadow-sm border-0 bg-light note-card">
                <div class="card-body p-2">
                    <div class="d-flex justify-content-between align-items-start mb-1">
                        <h6 class="card-title mb-0 text-truncate fw-bold" style="max-width: 85%; font-size: 0.95rem;">${escapeHtml(note.title)}</h6>
                        <div class="dropdown">
                            <button class="btn btn-link text-muted p-0" type="button" data-bs-toggle="dropdown" style="line-height: 1;">
                                <i class="bi bi-three-dots-vertical" style="font-size: 0.85rem;"></i>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0">
                                <li><a class="dropdown-item btn-edit-note small" href="#" data-id="${note.id}"><i class="bi bi-pencil me-2"></i>Editar</a></li>
                                <li><a class="dropdown-item btn-archive-note small" href="#" data-id="${note.id}"><i class="bi ${archiveIcon} me-2"></i>${archiveTitle}</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item text-danger btn-delete-note small" href="#" data-id="${note.id}"><i class="bi bi-trash me-2"></i>Eliminar</a></li>
                            </ul>
                        </div>
                    </div>
                    <p class="card-text text-muted small note-content-preview mb-2" style="font-size: 0.85rem; line-height: 1.4;">${escapeHtml(note.content || '')}</p>
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

        loadNotes();
    }
});
