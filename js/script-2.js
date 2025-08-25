// ========================================
// File: script-2.js
// Tema: Logika interaktif untuk halaman Lupa Kata Sandi
// ========================================

// Impor fungsi autentikasi dari file auth.js
import { handlePasswordReset } from './auth.js';

const getEl = (id) => document.getElementById(id);
const getEls = (selector) => document.querySelectorAll(selector);

// === FUNGSI PEMBANTU (Sama seperti di script-1.js untuk konsistensi) ===
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
        btn.innerHTML = `<span class="vir-loader"></span> Mengirim...`;
    } else {
        btn.disabled = false;
        btn.innerHTML = `Kirim Tautan`;
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

const validateEmail = (email) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
};

// === LOGIKA FORM UTAMA ===
let cooldownInterval;
const COOLDOWN_SECONDS = 60;
const lastRequestKey = 'last-reset-request';

const startCooldown = () => {
    const lastRequest = localStorage.getItem(lastRequestKey);
    const btn = getEl('reset-submit-btn');
    if (!btn) return;
    
    if (!lastRequest || (Date.now() - lastRequest) > (COOLDOWN_SECONDS * 1000)) {
        btn.disabled = false;
        btn.innerHTML = `Kirim Tautan`;
        localStorage.removeItem(lastRequestKey);
        clearInterval(cooldownInterval);
        return;
    }
    
    btn.disabled = true;
    clearInterval(cooldownInterval);
    
    cooldownInterval = setInterval(() => {
        const remaining = Math.ceil(COOLDOWN_SECONDS - ((Date.now() - localStorage.getItem(lastRequestKey)) / 1000));
        if (remaining > 0) {
            btn.innerHTML = `Tunggu (${remaining}s)`;
        } else {
            clearInterval(cooldownInterval);
            btn.disabled = false;
            btn.innerHTML = `Kirim Tautan`;
            localStorage.removeItem(lastRequestKey);
        }
    }, 1000);
};

document.addEventListener('DOMContentLoaded', () => {
    startCooldown();

    const forgotPasswordForm = getEl('forgot-password-form');
    const emailInput = getEl('forgot-email');
    const successMessageBox = getEl('success-message-box');

    if (forgotPasswordForm) {
        emailInput.addEventListener('input', () => {
            const emailValue = emailInput.value.trim();
            if (emailValue === '') {
                hideError(emailInput);
            } else if (!validateEmail(emailValue)) {
                showError(emailInput, 'Format email tidak valid.');
                emailInput.classList.remove('valid');
            } else {
                hideError(emailInput);
                emailInput.classList.add('valid');
            }
        });

        forgotPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const emailValue = emailInput.value.trim();
            if (!validateEmail(emailValue)) {
                showError(emailInput, 'Mohon masukkan email yang valid.');
                return;
            }

            localStorage.setItem(lastRequestKey, Date.now());
            startCooldown();

            showLoader(true);
            
            // PERUBAHAN: Gunakan fungsi handlePasswordReset dari auth.js
            const redirectToUrl = `${window.location.origin}/update-sandi.html`;
            const { error } = await handlePasswordReset(emailValue, redirectToUrl);

            showLoader(false);

            if (error) {
                console.error('Reset kata sandi gagal:', error.message);
                showToast('error', error.message);
            } else {
                forgotPasswordForm.style.display = 'none';
                if (successMessageBox) successMessageBox.style.display = 'flex';
                const goBackLink = document.querySelector('.vir-go-back a');
                if (goBackLink) goBackLink.style.display = 'none';
            }
        });
    }

    const themeToggleBtn = getEl('vir-theme-toggle');
    const savedTheme = localStorage.getItem('vir-theme');
    const currentTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('vir-theme', currentTheme);

    const updateIcon = () => {
        const theme = document.documentElement.getAttribute('vir-theme');
        themeToggleBtn.innerHTML = theme === 'dark' ? `<i data-lucide="sun"></i>` : `<i data-lucide="moon"></i>`;
        lucide.createIcons();
    };
    updateIcon();

    themeToggleBtn.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('vir-theme');
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('vir-theme', newTheme);
        localStorage.setItem('vir-theme', newTheme);
        updateIcon();
    });
});
