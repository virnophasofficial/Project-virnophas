import { getCurrentUser, onAuthStateChange, handleSignOut } from './auth.js';

window.addEventListener('DOMContentLoaded', async () => {
    
    // --- Penanganan Otentikasi ---
    const user = await getCurrentUser();
    if (!user) {
        window.location.href = 'login-signup.html';
        return;
    }

    // =======================================
    // ====== 1. DOM SELECTORS (PILIHAN ELEMEN) ======
    // =======================================
    const getEl = (id) => document.getElementById(id);
    
    const configsContainer = getEl('configs-container');
    const profileBtn = getEl('vir-profile-btn');
    const profileModal = getEl('vir-profile-modal');
    const modalCloseBtn = getEl('vir-modal-close');
    const logoutBtn = getEl('vir-logout-btn');
    const themeToggleBtn = getEl('vir-theme-toggle');
    const modalDisplayName = getEl('modal-display-name');
    const modalEmail = getEl('modal-email');
    const htmlEl = document.documentElement;
    
    // === DATA KONFIGURASI STATIS ===
    const downloadConfigs = [
        { 
            name: "Config Stabil 60 FPS", 
            description: "Keseimbangan terbaik antara grafik dan performa.", 
            shortlink: "https://shortlink-url-1.com",
            mediafire: "https://mediafire-url-1.com"
        },
        { 
            name: "Config Ultra HD 90 FPS", 
            description: "Grafik super tajam dan FPS tinggi untuk perangkat flagship.", 
            shortlink: "https://shortlink-url-2.com",
            mediafire: "https://mediafire-url-2.com"
        },
        { 
            name: "Config Pro Player (No Recoil)", 
            description: "Setting sensitivitas yang cocok untuk pro player.", 
            shortlink: "https://shortlink-url-3.com",
            mediafire: "https://mediafire-url-3.com"
        },
        { 
            name: "Config Anti-Lag (Smooth)", 
            description: "Meminimalkan lag untuk pengalaman bermain yang lebih lancar.", 
            shortlink: "https://shortlink-url-4.com",
            mediafire: "https://mediafire-url-4.com"
        },
    ];

    // =======================================
    // ====== 2. FUNGSI-FUNGSI UTAMA ======
    // =======================================

    const renderDownloadConfigs = () => {
        configsContainer.innerHTML = '';
        downloadConfigs.forEach(config => {
            const item = document.createElement('div');
            item.className = 'vir-config-item';
            item.innerHTML = `
                <h4>${config.name}</h4>
                <p>${config.description}</p>
                <div class="vir-download-links">
                    <a href="${config.shortlink}" target="_blank" class="vir-btn vir-btn-download">
                        <i data-lucide="link"></i> Shortlink
                    </a>
                    <a href="${config.mediafire}" target="_blank" class="vir-btn vir-btn-download">
                        <i data-lucide="download"></i> Mediafire
                    </a>
                </div>
            `;
            configsContainer.appendChild(item);
        });
        lucide.createIcons();
    };

    const updateProfileModal = (user) => {
        if (user) {
            modalDisplayName.textContent = user.user_metadata?.full_name || user.email.split('@')[0];
            modalEmail.textContent = user.email;
        }
    };
    
    function setTheme(mode) {
        htmlEl.setAttribute("vir-theme", mode);
        localStorage.setItem("theme", mode);
        const icon = mode === 'dark' ? 'moon' : 'sun';
        if (themeToggleBtn) themeToggleBtn.innerHTML = `<i data-lucide="${icon}"></i>`;
        lucide.createIcons();
    }
    
    function initializeTheme() {
        const savedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setTheme(savedTheme || (prefersDark ? "dark" : "light"));
    }

    // =======================================
    // ====== 3. EVENT LISTENERS ======
    // =======================================
    
    profileBtn.addEventListener('click', () => {
        profileModal.classList.add('active');
        updateProfileModal(user);
    });

    modalCloseBtn.addEventListener('click', () => {
        profileModal.classList.remove('active');
    });

    logoutBtn.addEventListener('click', async () => {
        const { error } = await handleSignOut();
        if (error) {
            console.error('Gagal logout:', error.message);
        }
    });

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('vir-theme');
        setTheme(currentTheme === 'light' ? 'dark' : 'light');
    });
    
    // =======================================
    // ====== 4. INISIALISASI SAAT HALAMAN MUAT ======
    // =======================================
    
    initializeTheme();
    renderDownloadConfigs();
    
    onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
            window.location.href = 'login-signup.html';
        }
    });
});
