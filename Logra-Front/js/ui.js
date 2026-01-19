
export function showConfirmModal(message, onConfirm) {
    const modalElement = document.getElementById('confirmModal');
    const messageElement = document.getElementById('confirmMessage');
    const confirmBtn = document.getElementById('btnConfirmAction');
    
    // Set message
    if (message) {
        messageElement.textContent = message;
    }

    // Initialize bootstrap modal
    const modal = new bootstrap.Modal(modalElement);
    
    // Clean up previous event listeners
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    
    // Add new event listener
    newConfirmBtn.addEventListener('click', () => {
        onConfirm();
        modal.hide();
    });

    modal.show();
}

export function showValidationSuccess(formId, message) {
    const form = document.getElementById(formId);
    let successMsg = form.parentNode.querySelector('.validation-success');
    
    if (!successMsg) {
        successMsg = document.createElement('div');
        successMsg.className = 'validation-success';
        form.parentNode.appendChild(successMsg);
    }
    
    successMsg.textContent = message;
    successMsg.style.display = 'block';
    
    // Hide after 3 seconds
    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 3000);
}

export function showValidationError(inputElement, message) {
    let referenceElement = inputElement;

    // If input is inside an input-group (like password fields), we want to place the error after the group
    if (inputElement.parentNode.classList.contains('input-group')) {
        referenceElement = inputElement.parentNode;
    }

    // Check if error already exists
    let errorMsg = referenceElement.nextElementSibling;
    if (!errorMsg || !errorMsg.classList.contains('validation-error')) {
        errorMsg = document.createElement('small');
        errorMsg.className = 'validation-error';
        referenceElement.parentNode.insertBefore(errorMsg, referenceElement.nextSibling);
    }
    errorMsg.textContent = message;
}

export function clearValidationErrors(form) {
    const errors = form.querySelectorAll('.validation-error');
    errors.forEach(error => error.remove());
}

export function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const bgClass = type === 'error' ? 'text-bg-danger' : 
                   type === 'success' ? 'text-bg-success' : 
                   'text-bg-primary';

    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center ${bgClass} border-0`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');

    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

    toastContainer.appendChild(toastEl);
    const toast = new bootstrap.Toast(toastEl);
    toast.show();

    toastEl.addEventListener('hidden.bs.toast', () => {
        toastEl.remove();
    });
}

export function darkenColor(color, percent) {
    if (!color) return '#000000';
    // Ensure 6 digit hex
    if (color.length === 4) {
        color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }
    
    let r = parseInt(color.substring(1, 3), 16);
    let g = parseInt(color.substring(3, 5), 16);
    let b = parseInt(color.substring(5, 7), 16);

    r = Math.floor(r * (100 - percent) / 100);
    g = Math.floor(g * (100 - percent) / 100);
    b = Math.floor(b * (100 - percent) / 100);

    return "#" + 
        (r.toString(16).padStart(2, '0')) + 
        (g.toString(16).padStart(2, '0')) + 
        (b.toString(16).padStart(2, '0'));
}
