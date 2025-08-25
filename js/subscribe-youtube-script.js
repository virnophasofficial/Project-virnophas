/**
 * ========================================
 * File: subscribe-youtube-script.js
 * Tema: Logika untuk halaman verifikasi YouTube setelah pendaftaran
 * Proyek: Virnophas Official
 * ========================================
 */

document.addEventListener('DOMContentLoaded', () => {
    const youtubeBtn = document.getElementById('youtube-btn');
    const continueBtn = document.getElementById('continue-btn');

    // Aktifkan tombol Lanjutkan setelah tombol YouTube diklik
    youtubeBtn.addEventListener('click', () => {
        continueBtn.disabled = false;
        continueBtn.textContent = 'Verifikasi Selesai, Lanjutkan';
    });

    // Tambahkan event listener untuk tombol Lanjutkan
    continueBtn.addEventListener('click', () => {
        // Ganti dengan halaman tujuan akhir, misalnya halaman dashboard atau beranda
        window.location.href = 'index.html';
    });

    // Memastikan ikon Lucide dibuat
    lucide.createIcons();
});

