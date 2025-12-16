/* ===================== HOME PAGE SPECIFIC SCRIPTS ===================== */

document.addEventListener('DOMContentLoaded', () => {

    // ===================== 1. HERO CANVAS ANIMATION =====================
    const canvas = document.getElementById('heroCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const config = { nodeColor: 'rgba(37, 99, 235, 0.5)', lineColor: 'rgba(37, 99, 235, 0.15)', particleCount: 120, connectDist: 180, speed: 1, interaction: true };
        let mouse = { x: null, y: null, radius: 200 };
        const heroSection = document.querySelector('.hero-section');

        if (heroSection) {
            heroSection.addEventListener('mousemove', (event) => {
                const rect = heroSection.getBoundingClientRect();
                mouse.x = event.clientX - rect.left;
                mouse.y = event.clientY - rect.top;
            });
            heroSection.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

            function resizeCanvas() {
                if (heroSection.offsetWidth > 0) {
                    canvas.width = heroSection.offsetWidth;
                    canvas.height = heroSection.offsetHeight;
                    config.particleCount = window.innerWidth < 768 ? 60 : 120;
                    initParticles();
                }
            }
            window.addEventListener('resize', () => { setTimeout(resizeCanvas, 100); });

            class Particle {
                constructor() {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.vx = (Math.random() - 0.5) * config.speed;
                    this.vy = (Math.random() - 0.5) * config.speed;
                    this.size = Math.random() * 2 + 1;
                }
                update() {
                    this.x += this.vx; this.y += this.vy;
                    if (config.interaction && mouse.x != null) {
                        let dx = mouse.x - this.x; let dy = mouse.y - this.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < mouse.radius) {
                            const force = (mouse.radius - distance) / mouse.radius;
                            this.x -= (dx / distance) * force * 3;
                            this.y -= (dy / distance) * force * 3;
                        }
                    }
                    if (this.x < 0) this.x = canvas.width; if (this.x > canvas.width) this.x = 0;
                    if (this.y < 0) this.y = canvas.height; if (this.y > canvas.height) this.y = 0;
                }
                draw() {
                    ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fillStyle = config.nodeColor; ctx.fill();
                }
            }

            function initParticles() { particles = []; for (let i = 0; i < config.particleCount; i++) particles.push(new Particle()); }

            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                for (let a = 0; a < particles.length; a++) {
                    for (let b = a; b < particles.length; b++) {
                        let dx = particles[a].x - particles[b].x;
                        let dy = particles[a].y - particles[b].y;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < config.connectDist) {
                            ctx.strokeStyle = config.lineColor;
                            ctx.lineWidth = 1 - (distance / config.connectDist);
                            ctx.beginPath(); ctx.moveTo(particles[a].x, particles[a].y);
                            ctx.lineTo(particles[b].x, particles[b].y); ctx.stroke();
                        }
                    }
                }
                particles.forEach(p => { p.update(); p.draw(); });
                requestAnimationFrame(animate);
            }
            setTimeout(() => { resizeCanvas(); animate(); }, 100);
        }
    }

    // ===================== 2. SERVICES TABS & STACK CARDS LOGIC =====================
    // (Fixed: Removed nested DOMContentLoaded)

    const tabBtns = document.querySelectorAll('.tab-btn');
    const tracker = document.querySelector('.tab-tracker');
    const cards = document.querySelectorAll('.service-stack-card');

    if (tabBtns.length > 0 && cards.length > 0) {

        // 1. Move Tracker
        function moveTracker(btn) {
            if (!btn || !tracker) return;
            // Added offsetLeft/Top calculation to ensure it aligns relative to container
            tracker.style.width = `${btn.offsetWidth}px`;
            tracker.style.height = `${btn.offsetHeight}px`;
            tracker.style.transform = `translate(${btn.offsetLeft}px, ${btn.offsetTop}px)`;
        }

        // 2. Switch Card
        function switchCard(targetId) {
            cards.forEach(card => {
                card.classList.remove('active');
                card.style.display = 'none';
            });
            const target = document.querySelector(targetId);
            if (target) {
                target.style.display = ''; // Clear inline display to let CSS grid/flex work
                // Small timeout to allow display change to register before animating opacity
                setTimeout(() => target.classList.add('active'), 10);
            }
        }

        // 3. Init Tabs (Font-Safe Version)
        function initTabTracker() {
            const initialActive = document.querySelector('.tab-btn.active');

            // Safety Check
            if (!initialActive || !tracker) return;

            // 1. Disable animation instantly to prevent "sliding" effect on load
            tracker.style.transition = 'none';

            // 2. Calculate Position
            const width = initialActive.offsetWidth;
            const height = initialActive.offsetHeight;
            const left = initialActive.offsetLeft;
            const top = initialActive.offsetTop;

            // 3. Apply Position
            tracker.style.width = `${width}px`;
            tracker.style.height = `${height}px`;
            tracker.style.transform = `translate(${left}px, ${top}px)`;
            tracker.style.opacity = '1';

            // 4. Show Initial Card Content
            const targetId = initialActive.getAttribute('data-target');
            const target = document.querySelector(targetId);
            if (target) {
                target.style.display = '';
                target.classList.add('active');
            }

            // 5. Re-enable animation after a small delay
            setTimeout(() => {
                tracker.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            }, 100);
        }

        // Run Immediately (Visual ASAP)
        initTabTracker();

        // Run AGAIN when fonts are fully loaded (Fixes the overlap bug)
        document.fonts.ready.then(initTabTracker);

        // Run AGAIN on window load (Safety net)
        window.addEventListener('load', initTabTracker);

        // 4. Tab Click Events
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent jump
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                moveTracker(btn);
                const targetId = btn.getAttribute('data-target');
                switchCard(targetId);
            });
        });

        // 5. Resize Handler (Keep tracker aligned)
        window.addEventListener('resize', () => {
            const activeBtn = document.querySelector('.tab-btn.active');
            if (activeBtn) {
                if (tracker) {
                    tracker.style.transition = 'none';
                    moveTracker(activeBtn);
                    setTimeout(() => tracker.style.transition = 'all 0.5s ease', 100);
                }
            }
        });

        // --- STACK CARD VIEW MORE/LESS LOGIC ---
        const stackBtns = document.querySelectorAll('.stack-btn');

        stackBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const content = this.closest('.stack-content');
                const revealSection = content.querySelector('.stack-reveal');
                const btnText = this.querySelector('.btn-text');
                const icon = this.querySelector('i');

                const isOpen = revealSection.classList.contains('open');

                if (!isOpen) {
                    revealSection.classList.add('open');
                    this.classList.add('active');
                    btnText.textContent = "View Less";
                    if (icon) icon.className = 'fas fa-chevron-up';
                } else {
                    revealSection.classList.remove('open');
                    this.classList.remove('active');
                    btnText.textContent = "View More";
                    if (icon) icon.className = 'fas fa-chevron-down';
                }
            });
        });
    }

    // ===================== 3. OTHER SCRIPTS (Smooth Scroll, Solutions Tabs) =====================

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            // Only scroll if target exists
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                window.scrollTo({ top: target.offsetTop - 100, behavior: 'smooth' });
            }
        });
    });

    // Solutions Tabs Logic (The bottom section)
    const tabButtons = document.querySelectorAll('.tab-nav-item');
    const tabPanes = document.querySelectorAll('.tab-pane-custom');

    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function () {
                const tabId = this.getAttribute('data-tab');

                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));

                this.classList.add('active');

                const activePane = document.getElementById(tabId);
                if (activePane) {
                    activePane.classList.add('active');
                    const serviceCards = activePane.querySelectorAll('.service-card');
                    serviceCards.forEach((card, index) => {
                        if (index === 0) card.classList.add('active');
                        else card.classList.remove('active');
                    });
                }
            });
        });
    }

    // Interactive Service Cards inside Solutions Tabs
    const allTabPanes = document.querySelectorAll('.tab-pane-custom');
    allTabPanes.forEach(pane => {
        const serviceCards = pane.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.addEventListener('click', function () {
                serviceCards.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
            });
        });
    });
});