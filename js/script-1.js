// ========================================
// File: script-1.js
// Tema: Logika interaktif untuk halaman login & daftar dengan Supabase
// ========================================

// Impor fungsi autentikasi dari file auth.js
import { handleSignIn, handleSignUp } from './auth.js';
import { supabase } from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', () => {
    // === FUNGSI PEMBANTU ===
    const getEl = (id) => document.getElementById(id);
    const getEls = (selector) => document.querySelectorAll(selector);

    const showToast = (type, message) => {
        const toast = document.createElement('div');
        toast.classList.add('vir-toast', type);
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    };

    const showMessage = (box, message, type) => {
        box.innerHTML = message;
        box.className = `vir-message-box ${type}`;
        box.style.display = "block";
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
            input.classList.remove('valid');
        }
    };

    const showLoader = (show, formType) => {
        const btn = getEl(formType === 'login' ? 'login-submit-btn' : 'signup-submit-btn');
        if (show) {
            btn.disabled = true;
            btn.innerHTML = `<span class="vir-loader"></span> ${formType === 'login' ? 'Memeriksa...' : 'Mendaftar...'}`;
        } else {
            btn.disabled = false;
            btn.innerHTML = formType === 'login' ? 'Masuk' : 'Daftar';
        }
    };

    // PERBAIKAN: Fungsi togglePasswordVisibility yang sudah diperbaiki
    const togglePasswordVisibility = (btnEl) => {
        const inputEl = btnEl.closest('.vir-input-wrapper').querySelector('input');
        const iconEl = btnEl.querySelector('i');
        const isPassword = inputEl.type === 'password';
        
        inputEl.type = isPassword ? 'text' : 'password';
        const newIconName = isPassword ? 'eye-off' : 'eye';
        
        if (iconEl) {
            iconEl.setAttribute('data-lucide', newIconName);
            lucide.createIcons();
        }
    };

    // === ELEMEN UTAMA ===
    const loginTab = getEl('login-tab');
    const signupTab = getEl('signup-tab');
    const loginForm = getEl('vir-login-form');
    const signupForm = getEl('vir-signup-form');
    const formInstruction = getEl('form-instruction');
    const passwordStrengthIndicator = getEl('password-strength');
    const passwordRequirementsList = getEl('password-requirements');
    const passwordInput = getEl('password');
    const confirmPasswordInput = getEl('confirm-password');

    // PERBAIKAN: Fungsi switchTab yang sudah diperbaiki
    const switchTab = (tab) => {
        getEls('.vir-form-container').forEach(form => form.classList.remove('active'));
        getEls('.vir-tab-btn').forEach(btn => btn.classList.remove('active'));

        getEls('.vir-input').forEach(input => {
            input.value = '';
            hideError(input);
        });
        getEls('.vir-message-box').forEach(box => box.style.display = 'none');

        const passwordToggleBtns = getEls('.vir-toggle-password');
        passwordToggleBtns.forEach(btn => {
            const inputEl = btn.closest('.vir-input-wrapper').querySelector('input');
            const iconEl = btn.querySelector('i');
            inputEl.type = 'password';
            if(iconEl) iconEl.setAttribute('data-lucide', 'eye');
        });

        if (passwordStrengthIndicator) {
            passwordStrengthIndicator.className = 'vir-password-strength';
        }
        if (passwordRequirementsList) {
            passwordRequirementsList.style.display = 'none';
        }
        
        // Sembunyikan dan non-aktifkan tombol daftar jika tab beralih
        const signupSubmitBtn = getEl('signup-submit-btn');
        if (signupSubmitBtn) {
            signupSubmitBtn.disabled = true;
        }

        if (tab === 'login') {
            loginForm.classList.add('active');
            loginTab.classList.add('active');
            formInstruction.textContent = 'Belum punya akun? Daftar untuk bergabung.';
        } else {
            signupForm.classList.add('active');
            signupTab.classList.add('active');
            formInstruction.textContent = 'Sudah punya akun? Masuk untuk melanjutkan.';
        }
        
        lucide.createIcons();
    };

    const updatePasswordValidation = (password) => {
        if (!passwordStrengthIndicator || !passwordRequirementsList) return;
        passwordStrengthIndicator.className = 'vir-password-strength';
        
        if (password.length > 0) {
            passwordRequirementsList.style.display = 'block';
        } else {
            passwordStrengthIndicator.classList.add('kosong');
            passwordRequirementsList.style.display = 'none';
            return;
        }

        const hasMinMaxLen = password.length >= 5 && password.length <= 8;
        const startsWithUppercase = /^[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        
        const requirements = [
            { id: 'length', check: hasMinMaxLen },
            { id: 'start-uppercase', check: startsWithUppercase },
            { id: 'number', check: hasNumber }
        ];

        let metCriteriaCount = 0;
        requirements.forEach(req => {
            const el = passwordRequirementsList.querySelector(`[data-requirement="${req.id}"]`);
            if (req.check) {
                el.classList.add('valid');
                metCriteriaCount++;
            } else {
                el.classList.remove('valid');
            }
        });

        let strength = 'rendah';
        if (metCriteriaCount === 1) strength = 'rendah';
        else if (metCriteriaCount === 2) strength = 'sedang';
        else if (metCriteriaCount === 3) strength = 'kuat';
        
        passwordStrengthIndicator.classList.add(strength);
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

    // === LOGIKA AUTENTIKASI DENGAN SUPABASE ===

    // Menangani pengiriman formulir login
    const handleLoginForm = () => {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = getEl('login-email').value.trim();
            const password = getEl('login-password').value.trim();
            const messageBox = getEl('login-message-box');
            let isValid = true;
            hideError(getEl('login-email'));
            hideError(getEl('login-password'));

            if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
                showError(getEl('login-email'), 'Email tidak valid.');
                isValid = false;
            }
            if (!password) {
                showError(getEl('login-password'), 'Kata sandi tidak boleh kosong.');
                isValid = false;
            }

            if (isValid) {
                showLoader(true, 'login');
                showMessage(messageBox, 'Memeriksa kredensial...', 'success');

                const { error } = await handleSignIn(email, password);
                
                showLoader(false, 'login');
                if (error) {
                    console.error('Login gagal:', error.message);
                    showMessage(messageBox, 'Login gagal. Email atau kata sandi salah.', 'error');
                    showToast('error', 'Login gagal. Coba lagi.');
                } else {
                    console.log('Login berhasil');
                    showMessage(messageBox, 'Login berhasil. Mengalihkan...', 'success');
                    showToast('success', 'Selamat datang!');
                    setTimeout(() => window.location.href = 'dashboard.html', 1500);
                }
            }
        });
    };

    // Menangani pengiriman formulir pendaftaran
    const handleSignupForm = () => {
        const fullNameInput = getEl('full-name');
        const usernameInput = getEl('username');
        const emailInput = getEl('email');
        const termsCheckbox = getEl('terms-checkbox');
        const signupSubmitBtn = getEl('signup-submit-btn');

        const updateSignupButtonState = () => {
            const isTermsChecked = termsCheckbox.checked;
            const isFullNameValid = fullNameInput.value.trim() !== '';
            const isUsernameValid = /^[a-zA-Z0-9_]{5,}$/.test(usernameInput.value);
            const isEmailValid = /^\S+@\S+\.\S+$/.test(emailInput.value);
            const isPasswordValid = 
                passwordInput.value.length >= 5 && 
                passwordInput.value.length <= 8 && 
                /^[A-Z]/.test(passwordInput.value) && 
                /[0-9]/.test(passwordInput.value);
            const isPasswordMatch = passwordInput.value === confirmPasswordInput.value;

            const allValid = isTermsChecked && isFullNameValid && isUsernameValid && isEmailValid && isPasswordValid && isPasswordMatch;
            signupSubmitBtn.disabled = !allValid;
        };

        const signupInputs = [fullNameInput, usernameInput, emailInput, passwordInput, confirmPasswordInput, termsCheckbox];
        signupInputs.forEach(input => {
            input.addEventListener('input', updateSignupButtonState);
            input.addEventListener('change', updateSignupButtonState);
        });

        passwordInput.addEventListener('input', () => {
            hideError(passwordInput);
            updatePasswordValidation(passwordInput.value);
            updateSignupButtonState();
        });

        confirmPasswordInput.addEventListener('input', () => {
            hideError(confirmPasswordInput);
            updateSignupButtonState();
        });

        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fullName = fullNameInput.value.trim();
            const username = usernameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            const telegramUsername = getEl('telegram-username').value.trim();
            const messageBox = getEl('signup-message-box');
            let isValid = true;
            
            // Reset pesan kesalahan
            hideError(fullNameInput);
            hideError(usernameInput);
            hideError(emailInput);
            hideError(passwordInput);
            hideError(confirmPasswordInput);

            if (!fullName) { showError(fullNameInput, 'Nama lengkap tidak boleh kosong.'); isValid = false; }
            if (!username || !/^[a-zA-Z0-9_]{5,}$/.test(username)) { showError(usernameInput, 'Username tidak valid (min. 5 karakter, hanya huruf, angka, _).'); isValid = false; }
            if (!email || !/^\S+@\S+\.\S+$/.test(email)) { showError(emailInput, 'Email tidak valid.'); isValid = false; }
            
            const hasMinMaxLen = password.length >= 5 && password.length <= 8;
            const startsWithUppercase = /^[A-Z]/.test(password);
            const hasNumber = /[0-9]/.test(password);
            if (!hasMinMaxLen || !startsWithUppercase || !hasNumber) {
                showError(passwordInput, 'Kata sandi tidak memenuhi semua kriteria.');
                isValid = false;
            }

            if (password !== confirmPassword) {
                showError(confirmPasswordInput, 'Kata sandi tidak cocok.');
                isValid = false;
            }
            if (!termsCheckbox.checked) {
                showToast('error', 'Anda harus menyetujui Syarat & Ketentuan.');
                isValid = false;
            }

            if (isValid) {
                showLoader(true, 'signup');
                showMessage(messageBox, 'Mendaftar...', 'success');

                const { data, error } = await handleSignUp(email, password, { 
                    full_name: fullName, 
                    username: username, 
                    telegram_username: telegramUsername 
                });

                if (error) {
                    console.error('Pendaftaran gagal:', error.message);
                    showMessage(messageBox, 'Pendaftaran gagal. ' + error.message, 'error');
                    showToast('error', 'Pendaftaran gagal. Coba lagi.');
                    showLoader(false, 'signup');
                    return;
                }
                
                console.log('Pendaftaran berhasil:', data.user);
                showMessage(messageBox, 'Pendaftaran berhasil! Cek email untuk verifikasi.', 'success');
                showToast('success', 'Pendaftaran berhasil!');
                showLoader(false, 'signup');

                // Simpan profil ke tabel 'user_profiles'
                const { data: profileData, error: profileError } = await supabase
                    .from('user_profiles')
                    .insert([
                        {
                            id: data.user.id,
                            full_name: fullName,
                            username: username,
                            telegram_username: telegramUsername,
                        },
                    ]);

                if (profileError) {
                    console.error('Error saat menyimpan profil:', profileError);
                }
                
                // Redirect setelah 1.5 detik
                setTimeout(() => window.location.href = 'index.html', 1500);
            }
        });
    };

    // === PEMASANGAN EVENT LISTENER & INISIALISASI ===
    handleLoginForm();
    handleSignupForm();
    getEls('.vir-toggle-password').forEach(btn => btn.addEventListener('click', () => togglePasswordVisibility(btn)));
    handleThemeToggle();
    loginTab.addEventListener('click', () => switchTab('login'));
    signupTab.addEventListener('click', () => switchTab('signup'));
    switchTab('login'); // Inisialisasi awal
    lucide.createIcons(); // Jalankan sekali di akhir untuk memastikan semua ikon dibuat
});

