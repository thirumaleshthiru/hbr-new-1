/* ===================== GLOBAL SCRIPTS ===================== */

document.addEventListener('DOMContentLoaded', () => {

    // ===================== 1. SCROLL REVEAL =====================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.reveal-on-scroll');
    if (hiddenElements.length > 0) {
        hiddenElements.forEach(section => {
            observer.observe(section);
        });
    }

    // ===================== 2. HEADER SCROLL EFFECT =====================
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // ===================== 3. MOBILE MENU TOGGLE (Hamburger) =====================
    const toggle = document.querySelector('.mobile-toggle');
    const drawer = document.querySelector('.mobile-menu-drawer');
    const backdrop = document.querySelector('.mobile-backdrop');
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    const navLinks = document.querySelectorAll('.mobile-nav-link');

    function toggleMenu() {
        if (!drawer) return;
        const isOpen = drawer.classList.contains('open');

        if (isOpen) {
            // Close Menu
            drawer.classList.remove('open');
            if (backdrop) backdrop.classList.remove('open');
            if (toggle) toggle.classList.remove('active');
            if (header) header.classList.remove('menu-open');
            if (hamburgerIcon) {
                hamburgerIcon.classList.remove('fa-times');
                hamburgerIcon.classList.add('fa-bars');
            }
            document.body.classList.remove('no-scroll');
        } else {
            // Open Menu
            drawer.classList.add('open');
            if (backdrop) backdrop.classList.add('open');
            if (toggle) toggle.classList.add('active');
            if (header) header.classList.add('menu-open');
            if (hamburgerIcon) {
                hamburgerIcon.classList.remove('fa-bars');
                hamburgerIcon.classList.add('fa-times');
            }
            document.body.classList.add('no-scroll');
        }
    }

    if (toggle) toggle.addEventListener('click', toggleMenu);
    if (backdrop) backdrop.addEventListener('click', toggleMenu);
    // Close menu when a standard link is clicked
    navLinks.forEach(link => link.addEventListener('click', toggleMenu));


    // ===================== 4. MOBILE DROPDOWNS (CLICK LOGIC ONLY) =====================
    // Logic: Click to open/close, rotates arrow via CSS class 'open'
    const mobileDropdowns = document.querySelectorAll('.mobile-dropdown');

    mobileDropdowns.forEach(dropdown => {
        const toggleBtn = dropdown.querySelector('.mobile-dropdown-toggle');

        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const isOpen = dropdown.classList.contains('open');

                // 1. Close ALL other mobile dropdowns first (Accordion Behavior)
                mobileDropdowns.forEach(other => {
                    if (other !== dropdown) {
                        other.classList.remove('open');
                    }
                });

                // 2. Toggle the clicked one
                if (isOpen) {
                    dropdown.classList.remove('open');
                } else {
                    dropdown.classList.add('open');
                }
            });
        }
    });

    // ===================== 5. DESKTOP DROPDOWNS (REMOVED) =====================
    // Interaction is now handled purely by CSS Hover in style.css

    // ===================== 6. FAQ ACCORDION LOGIC =====================
    const accordions = document.querySelectorAll('.faq-accordion-item');

    accordions.forEach(acc => {
        const header = acc.querySelector('.faq-question');
        const content = acc.querySelector('.faq-content-inner');

        if (header && content) {
            header.addEventListener('click', () => {
                const isOpen = acc.classList.contains('active');

                // Close all others
                accordions.forEach(item => {
                    if (item !== acc && item.classList.contains('active')) {
                        item.classList.remove('active');
                        const innerContent = item.querySelector('.faq-content-inner');
                        if (innerContent) innerContent.style.height = '0px';
                    }
                });

                // Toggle current
                if (!isOpen) {
                    acc.classList.add('active');
                    content.style.height = content.scrollHeight + 'px';
                } else {
                    acc.classList.remove('active');
                    content.style.height = '0px';
                }
            });
        }
    });

    // ===================== 7. POPUP CHAT & FLOATING ICON LOGIC =====================
    const chatOverlay = document.getElementById('chat-overlay');
    const closeChatBtn = document.getElementById('close-chat');
    const openChatTriggers = document.querySelectorAll('.open-chat-trigger, #floating-chat-trigger');
    const floatingBtn = document.getElementById('floating-chat-trigger');

    function openChat() {
        if (chatOverlay) chatOverlay.classList.add('active');
        if (floatingBtn) floatingBtn.classList.add('hidden');
    }

    function closeChat() {
        if (chatOverlay) chatOverlay.classList.remove('active');
        if (floatingBtn) floatingBtn.classList.remove('hidden');
    }

    openChatTriggers.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openChat();
            });
        }
    });

    if (closeChatBtn) {
        closeChatBtn.addEventListener('click', closeChat);
    }

    if (chatOverlay) {
        chatOverlay.addEventListener('click', (e) => {
            if (e.target === chatOverlay) {
                closeChat();
            }
        });
    }

    // ===================== 8. GLOBAL MODAL LOGIC (Careers) =====================
    window.openModal = function (modalId, jobTitle = null) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        if (jobTitle && modalId === 'modal-apply') {
            const titleInput = document.getElementById('apply-position-title');
            if (titleInput) titleInput.value = jobTitle;
        }

        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        document.body.classList.add('no-scroll');
    }

    window.closeModal = function (modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        modal.classList.remove('active');
        setTimeout(() => {
            modal.classList.add('hidden');
            document.body.classList.remove('no-scroll');
        }, 300);
    }

    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(btn.dataset.target);
        });
    });

    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal.querySelector('.modal-backdrop')) {
                closeModal(modal.id);
            }
        });
    });

    // ===================== 9. DYNAMIC COPYRIGHT YEAR =====================
    const copyrightSpan = document.querySelector('.copyright-content span');
    if (copyrightSpan) {
        const currentYear = new Date().getFullYear();
        copyrightSpan.innerHTML = `&copy; ${currentYear} HBR Analytics. All rights reserved.`;
    }

});