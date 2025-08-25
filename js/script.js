/* =======================================
   ======== GABUNGAN AKHIR script.js =====
   ======================================= */
window.addEventListener("DOMContentLoaded", () => {
    // ====== Ikon SVG Offline (tanpa Lucide.js) ======
    const icons = {
        sun: `<svg xmlns="http://www.w3.org/2000/svg" class="vir-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
        moon: `<svg xmlns="http://www.w3.org/2000/svg" class="vir-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>`,
        menu: `<svg xmlns="http://www.w3.org/2000/svg" class="vir-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
        close: `<svg xmlns="http://www.w3.org/2000/svg" class="vir-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
        user: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-user-round-icon vir-icon lucide-circle-user-round"><path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/></svg>`,
        logout: `<svg xmlns="http://www.w3.org/2000/svg" class="vir-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`
    };

    // ====== Ambil Elemen DOM ======
    const virSidebar = document.getElementById("vir-sidebar");
    const virToggleMenu = document.getElementById("vir-toggle-menu");
    const virCloseSidebar = document.getElementById("vir-close-sidebar");
    const virThemeIcon = document.getElementById("vir-theme-icon");
    const virMenuIcon = document.getElementById("vir-menu-icon");
    const virCloseIcon = document.getElementById("vir-close-icon");
    const virToggleTheme = document.getElementById("vir-toggle-theme");
    const virNotificationBell = document.getElementById("vir-notification-bell");
    const virNotificationDropdown = document.getElementById("vir-notification-dropdown");
    const virNotificationList = document.getElementById("vir-notification-list");
    const virNotificationBadge = document.getElementById("vir-notification-badge");
    const virDropdownFooter = document.getElementById("vir-dropdown-footer");
    const virTime = document.getElementById("vir-time");
    const virDate = document.getElementById("vir-date");
    
    // ====== Elemen DOM Pop-up Profil Baru (Diperbarui) ======
    const virProfileBtn = document.getElementById("vir-profile-btn");
    const virProfileModal = document.getElementById("vir-jendela-profil"); // Diperbarui
    const virCloseModalBtn = document.getElementById("vir-tombol-tutup"); // Diperbarui
    const virGuestProfile = document.getElementById("vir-tamu-profil"); // Diperbarui
    const virUserProfile = document.getElementById("vir-pengguna-profil"); // Diperbarui
    const virLogoutBtn = document.getElementById("vir-tombol-keluar"); // Diperbarui
    const virProfileIcon = document.getElementById("vir-profile-icon");
    const htmlEl = document.documentElement; // Ambil elemen <html>

    // ====== Status awal ======
    let sidebarOpen = false;
    let isDark = false;
    let isUserLoggedIn = false; // Akan disinkronkan dengan Supabase

    // ====== Fungsi untuk update ikon ======
    function updateIcons() {
        if (virThemeIcon) virThemeIcon.innerHTML = isDark ? icons.moon : icons.sun;
        if (virMenuIcon) virMenuIcon.innerHTML = sidebarOpen ? icons.close : icons.menu;
        if (virCloseIcon) virCloseIcon.innerHTML = icons.close;
        
        // Perbarui ikon profil berdasarkan status login
        if (virProfileIcon) virProfileIcon.innerHTML = isUserLoggedIn ? icons.logout : icons.user;
    }

    // FUNGSI BARU UNTUK MENGELOLA TAMPILAN PROFIL
    function showUserProfile(isLoggedIn) {
        if (isLoggedIn) {
            virGuestProfile.style.display = 'none';
            virUserProfile.style.display = 'block';
            isUserLoggedIn = true;
            updateIcons();
            // TODO: Ambil data pengguna dari Supabase dan tampilkan
        } else {
            virGuestProfile.style.display = 'block';
            virUserProfile.style.display = 'none';
            isUserLoggedIn = false;
            updateIcons();
        }
    }


    /* =======================================
       ======== FUNGSI LONCENG NOTIFIKASI =====
       ======================================= */
    let notifications = [
        { title: "Informasi! Semuanya", message: "Saat ini website masih dalam tahap pengembangan." },
        { title: "Akses hanya untuk anggota!", message: "Untuk melihat dan mengunduh semua konfigurasi, Anda harus memiliki akun. Gabung sekarang juga dan jadilah bagian dari komunitas kami." },
        { title: "Selamat datang di Virnophas Official!", message: "Silakan masuk atau daftar untuk mengakses konten eksklusif." }
    ];

    function renderNotifications() {
        virNotificationList.innerHTML = '';
        if (notifications.length === 0) {
            virNotificationList.innerHTML = '<p class="vir-placeholder-text">Tidak ada notifikasi baru.</p>';
            virNotificationBadge.style.display = 'none';
        } else {
            notifications.forEach(notif => {
                const item = document.createElement('div');
                item.className = 'vir-notification-item';
                item.innerHTML = `
                    <h5>${notif.title}</h5>
                    <p>${notif.message}</p>
                `;
                virNotificationList.appendChild(item);
            });
            virNotificationBadge.textContent = notifications.length;
            virNotificationBadge.style.display = 'flex';
            
            virNotificationBell.classList.add('vir-notification-bell-animating');
            setTimeout(() => {
                virNotificationBell.classList.remove('vir-notification-bell-animating');
            }, 800);
        }
    }

    virNotificationBell?.addEventListener("click", (e) => {
        e.stopPropagation();
        virNotificationDropdown.classList.toggle("active");
        
        if (virNotificationDropdown.classList.contains('active')) {
            virNotificationBadge.style.display = 'none';
        }
    });

    virDropdownFooter?.addEventListener("click", (e) => {
        e.preventDefault();
        notifications = []; 
        renderNotifications();
        virNotificationDropdown.classList.remove("active");
    });

    document.addEventListener('click', (e) => {
        if (!virNotificationDropdown.contains(e.target) && !virNotificationBell.contains(e.target)) {
            virNotificationDropdown.classList.remove("active");
        }
    });

    renderNotifications();

    // --- FUNGSI BARU UNTUK JAM/TANGGAL ---
    function updateDateTime() {
        const now = new Date();
        const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const dateOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };

        if (virTime) {
            virTime.textContent = now.toLocaleTimeString('id-ID', timeOptions);
        }
        if (virDate) {
            virDate.textContent = now.toLocaleDateString('id-ID', dateOptions);
        }
    }

    // Perbaikan utama di sini:
    // ====== Fungsi set tema ======
    function setTheme(mode) {
        htmlEl.setAttribute("vir-theme", mode);
        localStorage.setItem("theme", mode);
        isDark = (mode === "dark");
        updateIcons();
        
        // PERBAIKAN: Sinkronkan tema modal dengan tema utama
        // Ganti nama class .vir-modal-overlay
        const modalOverlay = document.querySelector('.vir-lapis-modal');
        if (modalOverlay) {
             if (mode === "dark") {
                 modalOverlay.classList.add("vir-light-theme");
             } else {
                 modalOverlay.classList.remove("vir-light-theme");
             }
        }
    }

    // ====== Toggle Tema Light/Dark ======
    virToggleTheme?.addEventListener("click", (e) => {
        e.stopPropagation();
        const newTheme = isDark ? "light" : "dark";
        setTheme(newTheme);
    });

    // ====== Toggle Sidebar ======
    virToggleMenu?.addEventListener("click", (e) => {
        e.stopPropagation();
        sidebarOpen = !sidebarOpen;
        virSidebar.classList.toggle("active");
        updateIcons();
    });

    // ====== Tutup Sidebar ======
    virCloseSidebar?.addEventListener("click", (e) => {
        e.stopPropagation();
        sidebarOpen = false;
        virSidebar.classList.remove("active");
        updateIcons();
    });

    // ====== BARU: Tutup Sidebar saat klik di luar ======
    document.addEventListener('click', (e) => {
        if (sidebarOpen && !virSidebar.contains(e.target) && !virToggleMenu.contains(e.target)) {
            sidebarOpen = false;
            virSidebar.classList.remove("active");
            updateIcons();
        }
    });
    
    // ====== FUNGSI BARU UNTUK COLLAPSE DESKRIPSI ======
    const toggleBtn = document.querySelector('.toggle-description-btn');
    const description = document.querySelector('.vir-keterangan-profil'); // Diperbarui
    
    if (toggleBtn && description) {
        toggleBtn.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            description.classList.toggle('expanded', !isExpanded);
        });
    }

    // ====== FUNGSI BARU UNTUK POP-UP PROFIL ======
    virProfileBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        virProfileModal.classList.add("active");
        
        // PERBAIKAN: Sinkronkan tema modal saat dibuka
        const currentTheme = htmlEl.getAttribute("vir-theme");
        if (currentTheme === "dark") {
            virProfileModal.classList.add("vir-light-theme");
        } else {
            virProfileModal.classList.remove("vir-light-theme");
        }
        
        showUserProfile(isUserLoggedIn);
    });

    virCloseModalBtn?.addEventListener("click", () => {
        virProfileModal.classList.remove("active");
    });

    // Tutup modal jika mengklik di luar area modal
    virProfileModal?.addEventListener("click", (e) => {
        if (e.target.id === 'vir-jendela-profil') { // Diperbarui
            virProfileModal.classList.remove("active");
        }
    });

    // === Logika Contoh Logout ===
    virLogoutBtn?.addEventListener("click", () => {
        showUserProfile(false); 
        virProfileModal.classList.remove("active");
    });


    // ====== Inisialisasi Tema & Ikon Saat Load ======
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(savedTheme || (prefersDark ? "dark" : "light"));
    
    // --- PEMANGGILAN FUNGSI JAM/TANGGAL ---
    updateDateTime();
    setInterval(updateDateTime, 1000); 
});

// Menu Tabs Legal //
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.vir-tab-button');
    const tabContents = document.querySelectorAll('.vir-tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(targetId).classList.add('active');
        });
    });
});

// Memastikan skrip berjalan setelah dokumen dimuat
document.addEventListener('DOMContentLoaded', function() {
    // Memilih semua elemen tombol pertanyaan FAQ
    const faqQuestions = document.querySelectorAll('.vir-faq-question');

    // Mengulang (loop) setiap tombol pertanyaan
    faqQuestions.forEach(question => {
        // Menambahkan event listener 'click' ke setiap tombol
        question.addEventListener('click', () => {
            // Memilih elemen jawaban yang tepat setelah tombol yang diklik
            const answer = question.nextElementSibling;
            
            // Menutup semua item FAQ lain yang mungkin sedang terbuka
            document.querySelectorAll('.vir-faq-question.active').forEach(item => {
                // Memastikan tidak menutup item yang baru saja diklik
                if (item !== question) {
                    item.classList.remove('active');
                    item.nextElementSibling.classList.remove('active');
                }
            });

            // Mengganti kelas 'active' pada tombol pertanyaan
            const isActive = question.classList.toggle('active');
            // Mengganti kelas 'active' pada elemen jawaban
            answer.classList.toggle('active');
        });
    });
});

// JavaScript Functionality (Fungsi JavaScript)
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.vir-testimonial-slider');
    const prevBtn = document.querySelector('.vir-slider-prev');
    const nextBtn = document.querySelector('.vir-slider-next');
    const dots = document.querySelectorAll('.vir-dot');
    const cards = document.querySelectorAll('.vir-testimonial-card');

    let currentIndex = 0;
    const totalCards = cards.length;

    // Fungsi untuk memperbarui tampilan slider
    const updateSlider = () => {
        const cardWidth = cards[0].offsetWidth; // Dapatkan lebar satu kartu
        slider.style.transform = `translateX(${-currentIndex * cardWidth}px)`;

        // Perbarui dot aktif
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === currentIndex) {
                dot.classList.add('active');
            }
        });
    };

    // Event listener untuk tombol 'Next'
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalCards;
        updateSlider();
    });

    // Event listener untuk tombol 'Previous'
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        updateSlider();
    });

    // Event listener untuk dot pagination
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateSlider();
        });
    });

    // Fitur Otomatis Geser Setiap 5 Detik
    setInterval(() => {
        currentIndex = (currentIndex + 1) % totalCards;
        updateSlider();
    }, 5000); // Geser setiap 5000 milidetik (5 detik)
});

// Skrip untuk fungsionalitas tombol 'Lihat Detail' di Changelog
document.addEventListener('DOMContentLoaded', function() {
    const toggleButtons = document.querySelectorAll('.vir-toggle-details-btn');

    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const detailsList = this.nextElementSibling;
            
            // Menggunakan kelas 'expanded' dan 'collapsed'
            detailsList.classList.toggle('expanded');
            detailsList.classList.toggle('collapsed');

            const icon = this.querySelector('i');
            if (detailsList.classList.contains('expanded')) {
                icon.setAttribute('data-lucide', 'minus');
                this.innerHTML = `<i data-lucide="minus"></i> Sembunyikan Detail`;
            } else {
                icon.setAttribute('data-lucide', 'plus');
                this.innerHTML = `<i data-lucide="plus"></i> Lihat Detail`;
            }
            lucide.createIcons();
        });
    });
});
