const API_BASE = 'https://localhost:7271/api';

let authToken = localStorage.getItem('logra_token');

function setToken(token) {
    authToken = token;
    localStorage.setItem('logra_token', token);
}

function clearToken() {
    authToken = null;
    localStorage.removeItem('logra_token');
}

async function apiFetch(url, options = {}) {
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
        throw new Error(msg);
    }

    return response.status === 204 ? null : response.json();
}