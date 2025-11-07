class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.username = document.getElementById('username');
        this.email = document.getElementById('email');
        this.password = document.getElementById('password');
        this.confirmPassword = document.getElementById('confirm-password');
        this.category = document.getElementById('favorite-category');
        
        this.initValidation();
    }

    initValidation() {
        this.username.addEventListener('input', () => {
            this.validateUsername();
        });

        this.email.addEventListener('input', () => {
            this.validateEmail();
        });

        this.password.addEventListener('input', () => {
            this.validatePassword();
        });

        this.confirmPassword.addEventListener('input', () => {
            this.validateConfirmPassword();
        });

        this.category.addEventListener('change', () => {
            this.validateCategory();
        });

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    validateUsername() {
        const value = this.username.value.trim();
        const errorElement = document.getElementById('username-error');
        
        if (value.length < 2) {
            this.showError(this.username, errorElement, 'Username must be at least 2 characters');
            return false;
        }
        
        if (!/^[a-zA-Z0-9]+$/.test(value)) {
            this.showError(this.username, errorElement, 'Username must contain only letters and numbers');
            return false;
        }
        
        this.showSuccess(this.username, errorElement);
        return true;
    }

    validateEmail() {
        const value = this.email.value.trim();
        const errorElement = document.getElementById('email-error');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(value)) {
            this.showError(this.email, errorElement, 'Please enter a valid email address');
            return false;
        }
        
        this.showSuccess(this.email, errorElement);
        return true;
    }

    validatePassword() {
        const value = this.password.value;
        const errorElement = document.getElementById('password-error');
        
        if (value.length < 8) {
            this.showError(this.password, errorElement, 'Password must be at least 8 characters');
            return false;
        }
        
        if (!/[A-Z]/.test(value)) {
            this.showError(this.password, errorElement, 'Password must contain at least 1 uppercase letter');
            return false;
        }
        
        if (!/[a-z]/.test(value)) {
            this.showError(this.password, errorElement, 'Password must contain at least 1 lowercase letter');
            return false;
        }
        
        if (!/[0-9]/.test(value)) {
            this.showError(this.password, errorElement, 'Password must contain at least 1 number');
            return false;
        }
        
        this.showSuccess(this.password, errorElement);
        return true;
    }

    validateConfirmPassword() {
        const value = this.confirmPassword.value;
        const errorElement = document.getElementById('confirm-error');
        
        if (value !== this.password.value) {
            this.showError(this.confirmPassword, errorElement, 'Passwords do not match');
            return false;
        }
        
        this.showSuccess(this.confirmPassword, errorElement);
        return true;
    }

    validateCategory() {
        const value = this.category.value;
        const errorElement = document.getElementById('category-error');
        
        if (!value) {
            this.showError(this.category, errorElement, 'Please select a favorite category');
            return false;
        }
        
        this.showSuccess(this.category, errorElement);
        return true;
    }

    showError(input, errorElement, message) {
        input.classList.add('error');
        input.classList.remove('success');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    showSuccess(input, errorElement) {
        input.classList.remove('error');
        input.classList.add('success');
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }

    handleSubmit() {
        const isUsernameValid = this.validateUsername();
        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();
        const isConfirmValid = this.validateConfirmPassword();
        const isCategoryValid = this.validateCategory();
        
        if (isUsernameValid && isEmailValid && isPasswordValid && isConfirmValid && isCategoryValid) {
            const userData = {
                username: this.username.value.trim(),
                email: this.email.value.trim(),
                favoriteCategory: this.category.value
            };
            
            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('isLoggedIn', 'true');
            
            window.location.reload();
        }
    }
}