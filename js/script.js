/* =======================================
   ======== GABUNGAN AKHIR script.js =====
   ======================================= */
window.addEventListener("DOMContentLoaded", () => {
    // ====== Ikon SVG Offline (tanpa Lucide.js) ======
    const icons = {
        sun: `<svg xmlns="http://www.w3.org/2000/svg" class="vir-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
        moon: `<svg xmlns="http://www.w3.org/2000/svg" class="vir-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>`,
        menu: `<svg xmlns="http://www.w3.org/2000/svg" class="vir-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
        close: `<svg xmlns="http://www.w3.org/2000/svg" class="vir-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
    };

    // ====== Ambil Elemen DOM (sudah digabungkan) ======
    const virSidebar = document.getElementById("vir-sidebar");
    const virToggleMenu = document.getElementById("vir-toggle-menu");
    const virCloseSidebar = document.getElementById("vir-close-sidebar");
    const virThemeIcon = document.getElementById("vir-theme-icon");
    const virMenuIcon = document.getElementById("vir-menu-icon");
    const virCloseIcon = document.getElementById("vir-close-icon");
    const virToggleTheme = document.getElementById("vir-toggle-theme");
    const virTime = document.getElementById("vir-time");
    const virDate = document.getElementById("vir-date");

    // ====== Status awal ======
    let sidebarOpen = false;
    let isDark = false;

    // ====== Fungsi untuk update ikon ======
    function updateIcons() {
        if (virThemeIcon) virThemeIcon.innerHTML = isDark ? icons.moon : icons.sun;
        if (virMenuIcon) virMenuIcon.innerHTML = sidebarOpen ? icons.close : icons.menu;
        if (virCloseIcon) virCloseIcon.innerHTML = icons.close;
    }

    // ====== Fungsi set tema ======
    function setTheme(mode) {
        document.documentElement.setAttribute("vir-theme", mode);
        localStorage.setItem("theme", mode);
        isDark = (mode === "dark");
        updateIcons();
    }

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

    // ====== Toggle Tema Light/Dark ======
    virToggleTheme?.addEventListener("click", () => {
        setTheme(isDark ? "light" : "dark");
    });

    // ====== Toggle Sidebar ======
    virToggleMenu?.addEventListener("click", () => {
        sidebarOpen = !sidebarOpen;
        virSidebar.classList.toggle("active");
        updateIcons();
    });

    // ====== Tutup Sidebar ======
    virCloseSidebar?.addEventListener("click", () => {
        sidebarOpen = false;
        virSidebar.classList.remove("active");
        updateIcons();
    });

    // ====== FUNGSI BARU UNTUK COLLAPSE DESKRIPSI ======
    // Kode ini sudah digabungkan ke dalam event listener utama
    const toggleBtn = document.querySelector('.toggle-description-btn');
    const description = document.querySelector('.profile-description');
    
    if (toggleBtn && description) {
        toggleBtn.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            description.classList.toggle('expanded', !isExpanded);
        });
    }

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



    






  






