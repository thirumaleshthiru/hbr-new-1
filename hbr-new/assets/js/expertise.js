/* ===================== EXPERTISE PAGE SCRIPTS ===================== */

document.addEventListener('DOMContentLoaded', () => {
    // Specific Scroll Reveal for Cinematic Rows
    const rows = document.querySelectorAll('.service-row');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.2 });

    rows.forEach(row => observer.observe(row));
});