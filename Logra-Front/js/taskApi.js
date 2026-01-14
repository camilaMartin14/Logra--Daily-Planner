import { apiFetch } from './api.js';

export const TaskApi = {
    create(dayId, text) {
        return apiFetch(`/tasks/day/${dayId}`, {
            method: 'POST',
            body: JSON.stringify({ description: text })
        });
    },

    getAll(dayId) {
        return apiFetch(`/tasks/day/${dayId}`);
    },

    getByCategory(categoryId) {
        return apiFetch(`/tasks/category/${categoryId}`);
    },

    update(id, data) {
        return apiFetch(`/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    delete(id) {
        return apiFetch(`/tasks/${id}`, {
            method: 'DELETE'
        });
    },

    addCategory(id, categoryId) {
        return apiFetch(`/tasks/${id}/categories/${categoryId}`, {
            method: 'POST'
        });
    },

    removeCategory(id, categoryId) {
        return apiFetch(`/tasks/${id}/categories/${categoryId}`, {
            method: 'DELETE'
        });
    }
};
