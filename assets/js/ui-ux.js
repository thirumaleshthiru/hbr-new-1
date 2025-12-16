/* ===================== UI/UX PAGE SCRIPTS ===================== */

document.addEventListener('DOMContentLoaded', () => {
    // Optional: Interactive cursor effect on hero
    const heroSection = document.querySelector('.design-hero-wrapper');
    const cursor = document.querySelector('.cursor-pointer');

    if (heroSection && cursor && window.innerWidth > 1024) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Subtle parallax for cursor
            cursor.style.transform = `translate(${x * 0.05}px, ${y * 0.05}px)`;
        });
    }
});