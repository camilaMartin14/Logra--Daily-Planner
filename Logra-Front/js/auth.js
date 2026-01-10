import { apiFetch, setToken } from './api.js';
import { showValidationError, clearValidationErrors, showValidationSuccess } from './ui.js';

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
        clearValidationErrors(loginForm);

        const emailInput = document.getElementById('loginEmail');
        const passwordInput = document.getElementById('loginPassword');
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        let isValid = true;
        if (!email) {
            showValidationError(emailInput, 'El email es obligatorio');
            isValid = false;
        }
        if (!password) {
            showValidationError(passwordInput, 'La contraseña es obligatoria');
            isValid = false;
        }

        if (!isValid) return;

        try {
            console.log('Attempting login for:', email);
            const usuario = await login(email, password);
            console.log('Login success:', usuario);

            if (usuario && usuario.firstName) {
                localStorage.setItem('logra_user_name', usuario.firstName);
            } else {
                 localStorage.setItem('logra_user_name', 'Usuario');
            }
            
            showValidationSuccess('loginForm', 'Inicio de sesión exitoso');
            setTimeout(() => {
                location.reload();
            }, 1500);
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
        clearValidationErrors(registerForm);

        const nameInput = document.getElementById('regName');
        const surnameInput = document.getElementById('regSurname');
        const emailInput = document.getElementById('regEmail');
        const passwordInput = document.getElementById('regPassword');
        const confirmPasswordInput = document.getElementById('regConfirmPassword');

        const firstName = nameInput.value.trim();
        const lastName = surnameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        let isValid = true;

        if (!firstName) {
            showValidationError(nameInput, 'El nombre es obligatorio');
            isValid = false;
        }
        if (!lastName) {
            showValidationError(surnameInput, 'El apellido es obligatorio');
            isValid = false;
        }
        if (!email) {
            showValidationError(emailInput, 'El email es obligatorio');
            isValid = false;
        }
        if (!password) {
            showValidationError(passwordInput, 'La contraseña es obligatoria');
            isValid = false;
        }
        if (!confirmPassword) {
            showValidationError(confirmPasswordInput, 'Confirmar la contraseña es obligatorio');
            isValid = false;
        }

        if (password && confirmPassword && password !== confirmPassword) {
            showValidationError(confirmPasswordInput, 'Las contraseñas no coinciden');
            isValid = false;
        }

        if (!isValid) return;

        const data = {
            firstName,
            lastName,
            email,
            password
        };

        try {
            await register(data);
            showValidationSuccess('registerForm', 'Registro exitoso. Por favor inicia sesión.');
            setTimeout(() => {
                location.reload();
            }, 2000);
        } catch (err) {
            console.error('Register error:', err);
            alert(err.message);
        }
    });
}