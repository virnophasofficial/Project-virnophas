// ======================================================
// === INISIALISASI ELEMEN ===
// ======================================================
const sidebar        = document.getElementById('vir-sidebar');
const toggleBtn      = document.getElementById('vir-menuToggle');
const closeBtn       = document.getElementById('vir-closeSidebar');
const openMainBtn    = document.getElementById('vir-openBtn');
const mainContent    = document.getElementById('vir-mainContent');
const dateTimeOutput = document.getElementById('vir-dateTime');
const sponsorAd      = document.querySelector('.vir-ad-section');


// ======================================================
// === SIDEBAR TOGGLE ===
// ======================================================

// Tampilkan/ Sembunyikan sidebar ketika ikon menu diklik
toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('show');
});

// Tutup sidebar saat tombol close "×" diklik
closeBtn.addEventListener('click', () => {
  sidebar.classList.remove('show');
});


// ======================================================
// === TOMBOL "MASUK" KE KONTEN UTAMA ===
// ======================================================

openMainBtn.addEventListener('click', () => {
  // Tampilkan konten utama jika belum terlihat
  if (!mainContent.classList.contains('vir-show')) {
    mainContent.classList.add('vir-show');
  }

  // Tutup sidebar jika sedang terbuka
  sidebar.classList.remove('show');

  // Scroll halus ke bagian konten
  setTimeout(() => {
    mainContent.scrollIntoView({ behavior: 'smooth' });
  }, 300);
});


// ======================================================
// === KLIK IKLAN SPONSOR ===
// ======================================================

if (sponsorAd) {
  sponsorAd.addEventListener('click', () => {
    alert("Anda mengklik iklan sponsor!");
  });
}


// ======================================================
// === TAMPILKAN TANGGAL & JAM SAAT INI DI SIDEBAR ===
// ======================================================

function updateDateTime() {
  const now     = new Date();
  const options = {
    weekday: 'long', year: 'numeric', month: 'long',
    day: 'numeric', hour: '2-digit', minute: '2-digit'
  };
  const formatted = now.toLocaleString('id-ID', options);

  if (dateTimeOutput) {
    dateTimeOutput.textContent = formatted;
  }
}

// Update setiap detik
setInterval(updateDateTime, 1000);
updateDateTime();