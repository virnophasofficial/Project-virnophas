/* =======================================
   ======== dashboard-script.js - FINAL FIX =====
   ======================================= */
import { supabase } from './supabaseClient.js';
import { getCurrentUser, onAuthStateChange, handleSignOut } from './auth.js';

window.addEventListener("DOMContentLoaded", async () => {
    
    // --- Penanganan Otentikasi ---
    const user = await getCurrentUser();
    if (!user) {
        window.location.href = 'login-signup.html';
        return;
    }
    
    // =======================================
    // ====== 1. DOM SELECTORS (PILIHAN ELEMEN) ======
    // =======================================
    const virSidebar = document.getElementById("vir-sidebar");
    const virMenuIcon = document.getElementById("vir-menu-icon");
    const virThemeIcon = document.getElementById("vir-theme-icon");
    const virNotificationDropdown = document.getElementById("vir-notification-dropdown");
    const virNotificationList = document.getElementById("vir-notification-list");
    const virNotificationBadge = document.getElementById("vir-notification-badge");
    const virTime = document.getElementById("vir-time");
    const virDate = document.getElementById("vir-date");
    const virProfileModal = document.getElementById("vir-jendela-profil");
    const virGuestProfile = document.getElementById("vir-tamu-profil");
    const virUserProfile = document.getElementById("vir-pengguna-profil");
    const virProfileIcon = document.getElementById("vir-profile-icon");
    const virUsernameEl = document.getElementById("vir-nama-pengguna");
    const virUserEmailEl = document.getElementById("vir-email-pengguna");
    const virUserAvatarEl = document.getElementById("vir-avatar-pengguna");
    const htmlEl = document.documentElement;
    const chartSelector = document.getElementById('chart-selector');
    
    // Elemen Profil yang TIDAK bisa diedit
    const virUserFullNameEl = document.getElementById("vir-nama-lengkap-pengguna");
    const virUserUsernameEl = document.getElementById("vir-username-pengguna");
    const virUserTelegramEl = document.getElementById("vir-telegram-pengguna");
    
    // Elemen yang BOLEH diedit
    const avatarInput = document.getElementById("avatar-input");
    
    // =======================================
    // ====== 2. KODE AWAL, DATA, & STATUS ======
    // =======================================
    let sidebarOpen = false;
    let isDark = false;
    let userProfile = null; 
    let isUserLoggedIn = true;
    let summaryData = {};
    let notificationsData = [];
    let downloadHistoryData = [];
    let favoriteTutorials = [];
    let allTutorials = [];

    const icons = {
        sun: `<svg xmlns="http://www.w3.org/2000/svg" class="vir-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
        moon: `<svg xmlns="http://www.w3.org/2000/svg" class="vir-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 9 0 0 0 9.79 9.79z"/></svg>`,
        menu: `<svg xmlns="http://www.w3.org/2000/svg" class="vir-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
        close: `<svg xmlns="http://www.w3.org/2000/svg" class="vir-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
        user: `<svg xmlns="http://www.w3.org/2000/svg" class="vir-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
        logout: `<svg xmlns="http://www.w3.org/2000/svg" class="vir-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
        bell: `<svg xmlns="http://www.w3.org/2000/svg" class="vir-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7-3 9-3 9H9s-3-2-3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`,
        'bell-ring': `<svg xmlns="http://www.w3.org/2000/svg" class="vir-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7-3 9-3 9H9s-3-2-3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="M4 2c2.7.7 4.9 2.1 6 4"/><path d="M20 2c-2.7.7-4.9 2.1-6 4"/></svg>`
    };
    
    // =======================================
    // ====== 3. FUNGSI-FUNGSI UTAMA ======
    // =======================================
    
    function setTheme(mode) {
        htmlEl.setAttribute("vir-theme", mode);
        localStorage.setItem("theme", mode);
        isDark = (mode === "dark");
        if (virThemeIcon) virThemeIcon.innerHTML = isDark ? icons.moon : icons.sun;
        lucide.createIcons();
    }
    
    function updateDateTime() {
        const now = new Date();
        const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const dateOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };

        if (virTime) virTime.textContent = now.toLocaleTimeString('id-ID', timeOptions);
        if (virDate) virDate.textContent = now.toLocaleDateString('id-ID', dateOptions);
    }
    
    function renderSummaryCards() {
        if (!summaryData) return;
        document.getElementById("total-accounts-value").textContent = summaryData.total_accounts;
        document.getElementById("active-users-value").textContent = summaryData.active_users;
        document.getElementById("total-downloads-value").textContent = summaryData.total_downloads;
        document.getElementById("popular-tutorial-value").textContent = summaryData.popular_tutorial;
    }
    
    function renderDownloadHistory(history) {
        const downloadList = document.getElementById('vir-download-history');
        if (!downloadList) return;
        downloadList.innerHTML = '';
        if (history.length === 0) {
            downloadList.innerHTML = '<li class="vir-subtext">Tidak ada riwayat unduhan.</li>';
        } else {
            history.forEach(item => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<span class="vir-download-item-title">${item.title}</span><span class="vir-download-item-date">${item.date}</span>`;
                downloadList.appendChild(listItem);
            });
        }
    }
    
    function renderFavorites() {
        const favoriteList = document.getElementById('vir-favorite-list');
        if (!favoriteList) return;
        favoriteList.innerHTML = '';
        if (favoriteTutorials.length === 0) {
            favoriteList.innerHTML = '<li class="vir-subtext" style="text-align: center;">Tidak ada tutorial favorit.</li>';
        } else {
            favoriteTutorials.forEach(id => {
                const tutorial = allTutorials.find(t => t.id === id);
                if (tutorial) {
                    const listItem = document.createElement('li');
                    listItem.className = 'vir-favorite-item';
                    listItem.textContent = tutorial.title;
                    favoriteList.appendChild(listItem);
                }
            });
        }
    }

    function renderNotifications() {
        if (!virNotificationList) return;
        virNotificationList.innerHTML = '';
        let unreadCount = 0;
        if (notificationsData.length === 0) {
            virNotificationList.innerHTML = '<p class="vir-placeholder-text">Tidak ada notifikasi baru.</p>';
            virNotificationBadge.style.display = 'none';
        } else {
            notificationsData.forEach(notif => {
                const item = document.createElement('div');
                item.className = 'vir-notification-item';
                item.innerHTML = `<h5>${notif.title}</h5><p>${notif.message || notif.time}</p>`;
                virNotificationList.appendChild(item);
                if (!notif.read) unreadCount++;
            });
            virNotificationBadge.textContent = unreadCount;
            virNotificationBadge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
        lucide.createIcons();
    }
    
    function showUserProfile(userData, isLoggedIn) {
        if (isLoggedIn && userData) {
            if (virGuestProfile) virGuestProfile.style.display = 'none';
            if (virUserProfile) virUserProfile.style.display = 'block';
            isUserLoggedIn = true;
            if (virProfileIcon) virProfileIcon.innerHTML = icons.logout;
            
            if (virUserFullNameEl) virUserFullNameEl.textContent = userData.full_name || 'Nama Lengkap';
            if (virUserUsernameEl) virUserUsernameEl.textContent = `@${userData.username || 'username'}`;
            if (virUserEmailEl) virUserEmailEl.textContent = user.email || 'email@example.com';
            if (virUserTelegramEl) virUserTelegramEl.textContent = `@${userData.telegram_username || 'telegram_username'}`;
            
            if (virUserAvatarEl) virUserAvatarEl.src = userData.avatar_url || 'assets/images/user-default.jpg';
            
            renderDownloadHistory(downloadHistoryData);
            renderFavorites();
        } else {
            if (virGuestProfile) virGuestProfile.style.display = 'block';
            if (virUserProfile) virUserProfile.style.display = 'none';
            isUserLoggedIn = false;
            if (virProfileIcon) virProfileIcon.innerHTML = icons.user;
        }
        lucide.createIcons();
    }
    
    const uploadUserAvatar = async (file) => {
        if (!userProfile) return console.error('No user profile found.');
        const fileExt = file.name.split('.').pop();
        const fileName = `${userProfile.id}.${fileExt}`;
        const filePath = `avatars/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, { upsert: true });

        if (uploadError) {
            console.error('Avatar upload error:', uploadError.message);
            return;
        }

        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

        const { error: updateError } = await supabase
            .from('user_profiles')
            .update({ avatar_url: publicUrl })
            .eq('id', userProfile.id);

        if (updateError) {
            console.error('Profile update error:', updateError.message);
        } else {
            userProfile.avatar_url = publicUrl;
            showUserProfile(userProfile, true);
            alert('Foto profil berhasil diubah!');
        }
    };
    
    let myChart;
    const chartData = {
        daily: { labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'], data: [200, 250, 210, 300, 280, 350, 320], color: '#6c63ff', title: 'Pengunjung Harian' },
        weekly: { labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'], data: [1200, 1500, 1350, 1800], color: '#ffc107', title: 'Pengunjung Mingguan' },
        monthly: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'], data: [5000, 6500, 7200, 5800, 8000, 7500, 8200, 9000, 8800, 9500, 10000, 11000], color: '#00bcd4', title: 'Pengunjung Bulanan' },
        yearly: { labels: ['2022', '2023', '2024', '2025'], data: [20000, 30000, 45000, 60000], color: '#ff5722', title: 'Pengunjung Tahunan' }
    };
    function updateChart(chartType) {
        const dataObj = chartData[chartType];
        const ctx = document.getElementById('main-chart').getContext('2d');
        const chartTitleEl = document.getElementById('chart-title');
        if (myChart) myChart.destroy();
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, dataObj.color + '80');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        chartTitleEl.textContent = dataObj.title;
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dataObj.labels,
                datasets: [{
                    label: 'Jumlah Pengunjung',
                    data: dataObj.data,
                    borderColor: dataObj.color,
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 6,
                    pointBackgroundColor: dataObj.color,
                    pointBorderColor: '#fff',
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: dataObj.color
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, animations: { y: { easing: 'easeInOutQuad', from: 0 } },
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(200, 200, 200, 0.1)', drawBorder: false }, ticks: { color: 'var(--vir-text)' } },
                    x: { grid: { color: 'rgba(200, 200, 200, 0.1)', drawBorder: false }, ticks: { color: 'var(--vir-text)' } }
                },
                plugins: { legend: { display: false },
                    tooltip: { mode: 'index', intersect: false, backgroundColor: 'var(--vir-card-bg)', titleColor: 'var(--vir-text)', bodyColor: 'var(--vir-text)', borderWidth: 1, borderColor: 'var(--vir-border-color)' }
                }
            }
        });
    }

    // =======================================
    // ====== 4. EVENT LISTENERS ======
    // =======================================
    document.addEventListener('click', async (e) => {
        // Tombol Sidebar Menu & Close
        if (e.target.closest('#vir-toggle-menu')) {
            e.stopPropagation();
            sidebarOpen = !sidebarOpen;
            virSidebar.classList.toggle("active");
            if (virMenuIcon) virMenuIcon.innerHTML = sidebarOpen ? icons.close : icons.menu;
        } else if (e.target.closest('#vir-close-sidebar')) {
            e.stopPropagation();
            sidebarOpen = false;
            virSidebar.classList.remove("active");
            if (virMenuIcon) virMenuIcon.innerHTML = icons.menu;
        }
        
        // Tombol Tema
        if (e.target.closest('#vir-toggle-theme')) {
            e.stopPropagation();
            const newTheme = isDark ? "light" : "dark";
            setTheme(newTheme);
        }

        // Tombol Notifikasi & Dropdown
        if (e.target.closest('#vir-notification-bell')) {
            e.stopPropagation();
            virNotificationDropdown.classList.toggle("active");
            if (virNotificationDropdown.classList.contains('active')) {
                virNotificationBadge.style.display = 'none';
            }
        } else if (e.target.closest('#vir-dropdown-footer')) {
            e.preventDefault();
            notificationsData = []; 
            renderNotifications();
            virNotificationDropdown.classList.remove("active");
        } else if (!virNotificationDropdown.contains(e.target) && !e.target.closest('#vir-notification-bell')) {
            virNotificationDropdown.classList.remove("active");
        }

        // Tombol Modal & Profil
        if (e.target.closest('#vir-profile-btn')) {
            e.stopPropagation();
            virProfileModal.classList.add("active");
            showUserProfile(userProfile, isUserLoggedIn);
        } else if (e.target.closest('#vir-tombol-tutup') || e.target.id === 'vir-jendela-profil') {
            virProfileModal.classList.remove("active");
        } else if (e.target.closest('#vir-tombol-keluar')) {
            const { error } = await handleSignOut();
            if (error) console.error('Logout error:', error.message);
            else {
                showUserProfile(null, false);
                virProfileModal.classList.remove("active");
                window.location.href = '/login-signup.html';
            }
        }
        
        // Tombol Modal Close lainnya
        if (e.target.closest('.vir-modal-close-btn')) {
            const modalId = e.target.closest('.vir-modal-close-btn').getAttribute('data-modal-target');
            const modal = document.getElementById(modalId);
            if (modal) modal.classList.add('vir-hidden');
        }

        // Tombol Collapse
        if (e.target.closest('.vir-collapse-btn')) {
            const button = e.target.closest('.vir-collapse-btn');
            const content = button.previousElementSibling;
            content.classList.toggle('expanded');
            button.classList.toggle('active');
            button.innerHTML = content.classList.contains('expanded') 
                               ? 'Sembunyikan <i data-lucide="chevron-up" class="vir-collapse-icon"></i>' 
                               : 'Lihat Panduan <i data-lucide="chevron-down" class="vir-collapse-icon"></i>';
            lucide.createIcons();
        }

        // Tombol Favorit
        if (e.target.closest('.vir-favorite-btn')) {
            const button = e.target.closest('.vir-favorite-btn');
            const card = button.closest('.vir-article-card');
            const tutorialId = card.getAttribute('data-tutorial-id');
            const isFavorited = favoriteTutorials.includes(tutorialId);
            
            if (isUserLoggedIn && userProfile) {
                if (isFavorited) {
                    favoriteTutorials = favoriteTutorials.filter(id => id !== tutorialId);
                    button.classList.remove('favorited');
                } else {
                    favoriteTutorials.push(tutorialId);
                    button.classList.add('favorited');
                }

                const { data, error } = await supabase
                    .from('user_profiles')
                    .update({ favorite_tutorials: favoriteTutorials })
                    .eq('id', userProfile.id);

                if (error) {
                    console.error('Error saving favorite:', error.message);
                } else {
                    console.log('Favorite saved successfully:', favoriteTutorials);
                }

                renderFavorites();
                lucide.createIcons();
            } else {
                alert('Silakan login untuk menambahkan tutorial ke favorit.');
            }
        }
    });

    if (avatarInput) {
        avatarInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                uploadUserAvatar(file);
            }
        });
    }

    if (chartSelector) {
        chartSelector.addEventListener('change', (event) => {
            updateChart(event.target.value);
        });
    }

    // =======================================
    // ====== 5. INISIALISASI SAAT HALAMAN MUAT ======
    // =======================================
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(savedTheme || (prefersDark ? "dark" : "light"));
    
    updateDateTime();
    setInterval(updateDateTime, 1000); 
    
    const loadAllData = async (user) => {
        try {
            const { data: summary, error: summaryError } = await supabase
                .from('virnophas_official_summary')
                .select('*')
                .single();
            if (!summaryError) {
                summaryData = summary;
            }

            const { data: notifications, error: notifError } = await supabase
                .from('notifications')
                .select('*');
            if (!notifError) {
                notificationsData = notifications;
            }
            
            const { data: tutorials, error: tutorialError } = await supabase
                .from('tutorials')
                .select('*');
            if (!tutorialError) {
                allTutorials = tutorials;
            }

            const { data: userData, error: userDataError } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', user.id)
                .maybeSingle();
            
            if (userDataError) {
                console.error("Error fetching user data:", userDataError.message);
            }
            
            if (!userData) {
                const { data: newProfile, error: newProfileError } = await supabase
                    .from('user_profiles')
                    .insert({
                        id: user.id,
                        username: user.email.split('@')[0],
                        full_name: user.email.split('@')[0],
                    })
                    .select()
                    .single();
                
                if (newProfileError) {
                    console.error("Error creating new profile:", newProfileError.message);
                } else {
                    userProfile = newProfile;
                }
            } else {
                userProfile = userData;
                downloadHistoryData = userData.download_history || [];
                favoriteTutorials = userData.favorite_tutorials || [];
            }
        } catch (error) {
            console.error('Error loading data from Supabase:', error.message);
        } finally {
            renderSummaryCards();
            renderNotifications();
            renderDownloadHistory(downloadHistoryData);
            renderFavorites();
            updateChart('daily');
            showUserProfile(userProfile, true);
        }
    };
    
    const setupRealtimeChartUpdates = () => {
        supabase
          .channel('chart-data-channel')
          .on(
            'postgres_changes',
            { 
              event: 'UPDATE', 
              schema: 'public', 
              table: 'virnophas_official_summary'
            },
            (payload) => {
              const updatedData = payload.new;
              summaryData = updatedData;
              renderSummaryCards();
              if(updatedData.chart_data) {
                  Object.assign(chartData, updatedData.chart_data);
                  updateChart(chartSelector.value);
              }
            }
          )
          .subscribe();
    };

    await loadAllData(user);
    setupRealtimeChartUpdates();

    onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
            window.location.href = 'login-signup.html';
        }
    });

    lucide.createIcons();
});
