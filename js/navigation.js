const navItems = [
    { name: 'HOME', url: 'index.html' },
    { name: 'BROWSE RECIPES', url: 'browse-recipes.html' },
    { name: 'SURPRISE ME', url: 'surprise-me.html' },
    { name: 'ABOUT', url: 'about.html' }
];

function createNavigation() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    let navHTML = `
        <div class="nav-container">
            <div class="nav-left">
                <a href="index.html" class="nav-logo">
                    <img src="assets/iwe-logo.png" alt="Incy Wincy Eats" onerror="this.style.display='none'">
                </a>
            </div>
            <button class="mobile-toggle" id="mobile-toggle">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <ul class="nav-links" id="nav-links">
    `;

    navItems.forEach(item => {
        const isActive = currentPage === item.url ? 'active' : '';
        navHTML += `<li><a href="${item.url}" class="${isActive}">${item.name}</a></li>`;
    });

    navHTML += `
            </ul>
            <div class="nav-profile" onclick="window.location.href='dashboard.html'">
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0iI2Y5NDY4MCIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNDAiIHI9IjE1IiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTIwLDcwIFEzNSw1NSA1MCw1NSBUODAsNzAiIGZpbGw9IiNmZmYiLz48L3N2Zz4=" alt="Profile">
            </div>
        </div>
    `;

    nav.innerHTML = navHTML;

    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');

    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileToggle.classList.toggle('active');
    });
}

function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    createNavigation();
    initBackToTop();
});