
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
