// main-ui.js
// UI, thème, mobile menu, formulaire et autres interactions

feather.replace();

// Mobile menu — version moderne avec X
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const overlay = document.getElementById('menuOverlay');
const mobileLinks = document.querySelectorAll('.mobile-link');
const menuClose = document.getElementById('menuClose');

function openMenu() {
    mobileMenu.classList.add('active');
    overlay.classList.add('active');
    hamburger.classList.add('active'); // transforme le hamburger en X (optionnel)
    document.body.style.overflow = 'hidden';

    // Animation GSAP supplémentaire pour les liens (optionnel)
    gsap.fromTo('.mobile-menu li',
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" }
    );
}

function closeMenu() {
    mobileMenu.classList.remove('active');
    overlay.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
}

// Écouteurs
hamburger.addEventListener('click', openMenu);
overlay.addEventListener('click', closeMenu);
if (menuClose) menuClose.addEventListener('click', closeMenu);
mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

// Fermeture avec la touche Échap
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMenu();
    }
});

// Theme Toggle (Light/Dark)
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Vérifier le thème sauvegardé
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
} else {
    htmlElement.setAttribute('data-theme', 'light');
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

document.getElementById('contactForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Merci — Nous reviendrons vers vous sous 24h.');
    this.reset();
});