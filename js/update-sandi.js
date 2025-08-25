// ========================================
// File: update-sandi.js (Nama baru)
// Tema: Logika interaktif untuk halaman Atur Ulang Kata Sandi
// ========================================

// Impor fungsi autentikasi dari file auth.js
import { handleUpdatePassword } from './auth.js';

const getEl = (id) => document.getElementById(id);
const getEls = (selector) => document.querySelectorAll(selector);

// === FUNGSI PEMBANTU ===
const showToast = (type, message) => {
    const toast = getEl('vir-toast');
    if (toast) {
        toast.innerText = message;
        toast.className = `vir-toast show ${type}`;
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
};

const showLoader = (show) => {
    const btn = getEl('reset-submit-btn');
    if (show) {
        btn.disabled = true;
        btn.innerHTML = `<span class="vir-loader"></span> Memproses...`;
    } else {
        btn.disabled = false;
        btn.innerHTML = `Atur Ulang`;
    }
};

const showError = (input, message) => {
    const errorMsg = getEl(`${input.id}-error`);
    if (errorMsg) {
        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
        input.classList.add('error');
    }
};

const hideError = (input) => {
    const errorMsg = getEl(`${input.id}-error`);
    if (errorMsg) {
        errorMsg.textContent = '';
        errorMsg.style.display = 'none';
        input.classList.remove('error');
    }
};

const togglePasswordVisibility = (btnEl) => {
    const inputEl = btnEl.closest('.vir-input-wrapper').querySelector('input');
    const isPassword = inputEl.type === 'password';
    inputEl.type = isPassword ? 'text' : 'password';
    
    const iconContainer = btnEl;
    iconContainer.innerHTML = isPassword ? 
        `<i data-lucide="eye-off"></i>` :
        `<i data-lucide="eye"></i>`;
    lucide.createIcons();
};

const handleThemeToggle = () => {
    const themeToggleBtn = getEl('vir-theme-toggle');
    const savedTheme = localStorage.getItem('vir-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    document.documentElement.setAttribute('vir-theme', currentTheme);
    themeToggleBtn.innerHTML = currentTheme === 'dark' ? `<i data-lucide="sun"></i>` : `<i data-lucide="moon"></i>`;
    lucide.createIcons();

    themeToggleBtn.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('vir-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('vir-theme', theme);
        localStorage.setItem('vir-theme', theme);
        themeToggleBtn.innerHTML = theme === 'dark' ? `<i data-lucide="sun"></i>` : `<i data-lucide="moon"></i>`;
        lucide.createIcons();
    });
};

// === LOGIKA UTAMA FORM ===
const passwordRules = [
    { name: 'length', regex: /^.{5,12}$/, message: '5-12 karakter' },
    { name: 'uppercase', regex: /[A-Z]/, message: 'Satu huruf besar' },
    { name: 'lowercase', regex: /[a-z]/, message: 'Satu huruf kecil' },
    { name: 'number', regex: /[0-9]/, message: 'Satu angka' },
];

const validatePassword = () => {
    const password = getEl('new-password').value;
    let isValid = true;
    
    passwordRules.forEach(rule => {
        const requirementEl = getEl('password-requirements').querySelector(`[data-requirement="${rule.name}"]`);
        const ruleValid = rule.regex.test(password);
        
        if (requirementEl) {
            requirementEl.classList.toggle('valid', ruleValid);
        }

        if (!ruleValid) {
            isValid = false;
        }
    });
    return isValid;
};

const updatePasswordStrength = (password) => {
    const strengthBar = getEl('password-strength-bar');
    const strengthText = getEl('password-strength-text');
    let score = 0;

    if (password.length === 0) {
        strengthClass = 'none';
        strengthLabel = '';
    } else {
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;

        let strengthClass = '';
        let strengthLabel = '';

        if (score === 3) {
            strengthClass = 'kuat';
            strengthLabel = 'Kuat';
        } else if (score >= 1) {
            strengthClass = 'sedang';
            strengthLabel = 'Sedang';
        } else {
            strengthClass = 'rendah';
            strengthLabel = 'Rendah';
        }
    }
    
    strengthBar.className = `vir-password-strength-bar ${strengthClass}`;
    strengthText.className = `vir-password-strength-text ${strengthClass}`;
    strengthText.innerText = strengthLabel;
};

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    handleThemeToggle();

    const resetPasswordForm = getEl('reset-password-form');
    const newPasswordInput = getEl('new-password');
    const confirmNewPasswordInput = getEl('confirm-new-password');
    const successMessageBox = getEl('success-message-box');
    const passwordRequirements = getEl('password-requirements');
    const passwordStrengthBar = getEl('password-strength-bar');
    const passwordStrengthText = getEl('password-strength-text');
    
    const hideAllPasswordIndicators = () => {
        if (passwordRequirements) passwordRequirements.style.display = 'none';
        if (passwordStrengthBar) passwordStrengthBar.style.display = 'none';
        if (passwordStrengthText) passwordStrengthText.style.display = 'none';
    };
    hideAllPasswordIndicators();

    newPasswordInput.addEventListener('input', () => {
        hideError(newPasswordInput);
        const passwordValue = newPasswordInput.value;
        
        if (passwordValue.length > 0) {
            passwordRequirements.style.display = 'block';
            passwordStrengthBar.style.display = 'block';
            passwordStrengthText.style.display = 'block';
            validatePassword();
            updatePasswordStrength(passwordValue);
        } else {
            hideAllPasswordIndicators();
        }
    });

    confirmNewPasswordInput.addEventListener('input', () => {
        hideError(confirmNewPasswordInput);
    });

    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            hideError(newPasswordInput);
            hideError(confirmNewPasswordInput);

            let isValid = true;
            const newPasswordValue = newPasswordInput.value;
            const confirmNewPasswordValue = confirmNewPasswordInput.value;

            if (!validatePassword()) {
                showError(newPasswordInput, 'Kata sandi tidak memenuhi persyaratan.');
                isValid = false;
            }
            if (newPasswordValue !== confirmNewPasswordValue) {
                showError(confirmNewPasswordInput, 'Kata sandi tidak cocok.');
                isValid = false;
            }
            if (!newPasswordValue) {
                showError(newPasswordInput, 'Kata sandi tidak boleh kosong.');
                isValid = false;
            }
            if (!confirmNewPasswordValue) {
                showError(confirmNewPasswordInput, 'Konfirmasi kata sandi tidak boleh kosong.');
                isValid = false;
            }

            if (isValid) {
                showLoader(true);
                const { error } = await handleUpdatePassword(newPasswordValue);
                showLoader(false);

                if (error) {
                    showToast('error', error);
                } else {
                    resetPasswordForm.style.display = 'none';
                    if (successMessageBox) successMessageBox.style.display = 'flex';
                    const goBackP = document.querySelector('.vir-go-back');
                    if (goBackP) goBackP.style.display = 'block';

                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                }
            }
        });
    }

    const togglePasswordButtons = getEls('.vir-toggle-password');
    togglePasswordButtons.forEach(btn => btn.addEventListener('click', () => togglePasswordVisibility(btn)));
});
