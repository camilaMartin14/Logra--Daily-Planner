const API_BASE = 'https://localhost:7271/api';

export let authToken = localStorage.getItem('logra_token');

export function setToken(token) {
    authToken = token;
    localStorage.setItem('logra_token', token);
}

export function clearToken() {
    authToken = null;
    localStorage.removeItem('logra_token');
}

export async function apiFetch(url, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` })
    };

    const response = await fetch(`${API_BASE}${url}`, {
        ...options,
        headers
    });

    if (response.status === 401) {
        clearToken();
        throw new Error('No autorizado');
    }

    if (!response.ok) {
        const msg = await response.text();
        const error = new Error(msg);
        error.status = response.status;
        throw error;
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
}
