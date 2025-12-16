/* ===================== QUANT RISK PAGE SCRIPTS ===================== */

document.addEventListener('DOMContentLoaded', () => {

    // Parallax Effect for "Why Choose Us" Cards (If added in future)
    window.addEventListener('scroll', () => {
        if (window.innerWidth > 1024) {
            const section = document.getElementById('why-choose-us');
            if (!section) return;

            const cards = section.querySelectorAll('.parallax-card');
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            // Check if section is in view
            if (sectionTop < windowHeight && sectionTop > -section.offsetHeight) {
                cards.forEach(card => {
                    const speed = parseFloat(card.getAttribute('data-speed'));
                    if (speed !== 0) {
                        // Calculate movement relative to center of viewport
                        const yPos = (windowHeight - sectionTop) * speed * -1;
                        card.style.transform = `translateY(${yPos}px)`;
                    }
                });
            }
        }
    });

});