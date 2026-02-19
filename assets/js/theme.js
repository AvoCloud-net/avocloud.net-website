(function () {
    var saved = localStorage.getItem('avo-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = saved !== null ? saved === 'dark' : prefersDark;
    if (isDark) {
        document.documentElement.classList.add('dark');
    }
})();

function toggleTheme() {
    var isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('avo-theme', isDark ? 'dark' : 'light');
    _syncThemeIcon(isDark);
}

function _syncThemeIcon(isDark) {
    var el = document.getElementById('theme-icon');
    if (!el) return;
    if (isDark) {
        el.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
    } else {
        el.innerHTML = '<circle cx="12" cy="12" r="5"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    _syncThemeIcon(document.documentElement.classList.contains('dark'));
});
