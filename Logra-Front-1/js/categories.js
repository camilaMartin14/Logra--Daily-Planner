import { CategoryApi } from './categoryApi.js';
import { authToken } from './api.js';

let categories = [];
const categoriesListEl = document.getElementById('categories-list');
const categoryModalEl = document.getElementById('categoryModal');
const categoryForm = document.getElementById('categoryForm');
const categoryModalTitle = document.getElementById('categoryModalTitle');
const categoryIdInput = document.getElementById('categoryId');
const categoryNameInput = document.getElementById('categoryName');
const categoryColorInput = document.getElementById('categoryColor');
const btnNewCategory = document.getElementById('btn-new-category');

let categoryModal;

export async function loadCategories() {
    if (!authToken) {
        // Local Storage Mode
        const db = JSON.parse(localStorage.getItem('logra_categories') || '[]');
        categories = db;
        renderCategories();
        window.dispatchEvent(new CustomEvent('categoriesUpdated', { detail: categories }));
        return categories;
    }
    try {
        categories = await CategoryApi.getAll();
        renderCategories();
        // Dispatch event so other modules can update their selectors
        window.dispatchEvent(new CustomEvent('categoriesUpdated', { detail: categories }));
        return categories;
    } catch (e) {
        console.error('Error loading categories:', e);
        return [];
    }
}

function renderCategories() {
    if (!categoriesListEl) return;
    categoriesListEl.innerHTML = '';
    categories.forEach(cat => {
        const item = document.createElement('div');
        item.className = 'list-group-item d-flex justify-content-between align-items-center bg-transparent border-bottom px-0 py-2';
        item.innerHTML = `
            <div class="d-flex align-items-center">
                <span class="d-inline-block rounded-circle me-2" style="width: 12px; height: 12px; background-color: ${cat.color}; border: 1px solid #ddd;"></span>
                <span class="small fw-medium">${escapeHtml(cat.name)}</span>
            </div>
            <div>
                <button class="btn btn-link text-muted p-0 me-2 btn-edit-cat" data-id="${cat.id}" style="font-size: 0.85rem;"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-link text-danger p-0 btn-delete-cat" data-id="${cat.id}" style="font-size: 0.85rem;"><i class="bi bi-trash"></i></button>
            </div>
        `;
        categoriesListEl.appendChild(item);
    });

    // Re-attach listeners
    document.querySelectorAll('.btn-edit-cat').forEach(btn => {
        btn.addEventListener('click', () => openEditCategory(btn.dataset.id));
    });
    document.querySelectorAll('.btn-delete-cat').forEach(btn => {
        btn.addEventListener('click', () => deleteCategory(btn.dataset.id));
    });
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function openEditCategory(id) {
    const cat = categories.find(c => c.id == id);
    if (!cat) return;
    
    categoryIdInput.value = cat.id;
    categoryNameInput.value = cat.name;
    categoryColorInput.value = cat.color;
    categoryModalTitle.textContent = 'Editar Categoría';
    categoryModal.show();
}

async function deleteCategory(id) {
    if (!confirm('¿Seguro que quieres eliminar esta categoría?')) return;
    
    if (!authToken) {
        categories = categories.filter(c => c.id != id);
        localStorage.setItem('logra_categories', JSON.stringify(categories));
        loadCategories();
        return;
    }

    try {
        await CategoryApi.delete(id);
        loadCategories();
    } catch (e) {
        console.error(e);
        alert('Error al eliminar categoría');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Enable for everyone
    if (btnNewCategory) {
        categoryModal = new bootstrap.Modal(categoryModalEl);
        
        btnNewCategory.addEventListener('click', () => {
            categoryIdInput.value = '';
            categoryForm.reset();
            categoryModalTitle.textContent = 'Nueva Categoría';
            categoryModal.show();
        });

        categoryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = categoryIdInput.value;
            const data = {
                name: categoryNameInput.value,
                color: categoryColorInput.value
            };

            if (!authToken) {
                // Local Storage Save
                if (id) {
                    const idx = categories.findIndex(c => c.id == id);
                    if (idx !== -1) {
                        categories[idx] = { ...categories[idx], ...data };
                    }
                } else {
                    categories.push({ id: Date.now(), ...data });
                }
                localStorage.setItem('logra_categories', JSON.stringify(categories));
                categoryModal.hide();
                loadCategories();
                return;
            }

            try {
                if (id) {
                    await CategoryApi.update(id, data);
                } else {
                    await CategoryApi.create(data);
                }
                categoryModal.hide();
                loadCategories();
            } catch (err) {
                console.error(err);
                alert('Error al guardar categoría');
            }
        });
        
        loadCategories();
    }
});
