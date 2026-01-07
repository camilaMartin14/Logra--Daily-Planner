import { apiFetch, setToken } from './api.js';

async function login(email, password) {
    const result = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password
        })
    });

    setToken(result.token);
    return result.user;
}

async function register(data) {
    await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async e => {
        e.preventDefault();
        console.log('Login form submitted');

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            console.log('Attempting login for:', email);
            const usuario = await login(email, password);
            console.log('Login success:', usuario);

            if (usuario && usuario.firstName) {
                localStorage.setItem('logra_user_name', usuario.firstName);
            } else {
                 localStorage.setItem('logra_user_name', 'Usuario');
            }
            location.reload();
        } catch (err) {
            console.error('Login error:', err);
            alert(err.message);
        }
    });
}


window.togglePassword = function(inputId) {
    const input = document.getElementById(inputId);
    const icon = document.querySelector(`button[onclick="togglePassword('${inputId}')"] i`);
    
    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("bi-eye");
        icon.classList.add("bi-eye-slash");
    } else {
        input.type = "password";
        icon.classList.remove("bi-eye-slash");
        icon.classList.add("bi-eye");
    }
};


const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async e => {
        e.preventDefault();
        console.log('Register form submitted');

        const firstName = document.getElementById('regName').value;
        const lastName = document.getElementById('regSurname').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        const data = {
            firstName,
            lastName,
            email,
            password
        };

        try {
            await register(data);
            alert('Registro exitoso. Por favor inicia sesión.');
            location.reload();
        } catch (err) {
            console.error('Register error:', err);
            alert(err.message);
        }
    });
}