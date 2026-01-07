import { apiFetch } from './api.js';

export const NoteApi = {
    getActive() {
        return apiFetch('/notes/active');
    },

    getArchived() {
        return apiFetch('/notes/archived');
    },

    getById(id) {
        return apiFetch(`/notes/${id}`);
    },

    create(data) {
        return apiFetch('/notes', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    update(id, data) {
        return apiFetch(`/notes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    delete(id) {
        return apiFetch(`/notes/${id}`, {
            method: 'DELETE'
        });
    },

    archive(id) {
        return apiFetch(`/notes/${id}/archive`, {
            method: 'POST'
        });
    },

    unarchive(id) {
        return apiFetch(`/notes/${id}/unarchive`, {
            method: 'POST'
        });
    },

    addCategory(id, categoryId) {
        return apiFetch(`/notes/${id}/categories/${categoryId}`, {
            method: 'POST'
        });
    },

    removeCategory(id, categoryId) {
        return apiFetch(`/notes/${id}/categories/${categoryId}`, {
            method: 'DELETE'
        });
    }
};
