// === Toggle Sidebar ===
const sidebarToggle = document.getElementById("vir-sidebar-toggle");
const closeSidebar = document.getElementById("vir-close-sidebar");
const sidebar = document.getElementById("vir-sidebar");

sidebarToggle.onclick = () => sidebar.classList.add("open");
closeSidebar.onclick = () => sidebar.classList.remove("open");

// === Toggle Tema (Dark/Light) ===
const themeToggle = document.getElementById("vir-theme-toggle");
const html = document.documentElement;

function setTheme(mode) {
  if (mode === "dark") {
    html.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
    themeToggle.innerHTML = `<span class="material-symbols-rounded">light_mode</span>`;
  } else {
    html.classList.remove("dark-mode");
    localStorage.setItem("theme", "light");
    themeToggle.innerHTML = `<span class="material-symbols-rounded">dark_mode</span>`;
  }
}

themeToggle.onclick = () => {
  const current = localStorage.getItem("theme");
  setTheme(current === "dark" ? "light" : "dark");
};

window.onload = () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  setTheme(savedTheme);

  // Jam realtime di footer
  setInterval(() => {
    const now = new Date();
    const jam = now.getHours().toString().padStart(2, "0");
    const menit = now.getMinutes().toString().padStart(2, "0");
    const detik = now.getSeconds().toString().padStart(2, "0");
    document.getElementById("vir-clock").textContent = `${jam}:${menit}:${detik}`;
  }, 1000);
};