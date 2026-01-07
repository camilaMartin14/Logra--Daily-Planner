import { apiFetch } from './api.js';

export const CategoryApi = {
    getAll() {
        return apiFetch('/categories');
    },

    getById(id) {
        return apiFetch(`/categories/${id}`);
    },

    create(data) {
        return apiFetch('/categories', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    update(id, data) {
        return apiFetch(`/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    delete(id) {
        return apiFetch(`/categories/${id}`, {
            method: 'DELETE'
        });
    }
};
