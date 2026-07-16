/**
 * NAVIGATION MENU DEMO - INTERACTIVE JAVASCRIPT
 * Handles style switching, smooth scroll, active states, mobile toggles
 */

(function() {
    'use strict';

    // ========================================
    // DOM ELEMENTS
    // ========================================
    const els = {};
    function cacheElements() {
        els.navClassic = document.getElementById('navClassic');
        els.navGlass = document.getElementById('navGlass');
        els.navSidebar = document.getElementById('navSidebar');
        els.navBottom = document.getElementById('navBottom');
        els.navMega = document.getElementById('navMega');
        els.navOverlay = document.getElementById('navOverlay');
        els.sidebarOpen = document.getElementById('sidebarOpen');
        els.sidebarClose = document.getElementById('sidebarClose');
        els.styleSwitcher = document.getElementById('styleSwitcher');
        els.navToggle1 = document.getElementById('navToggle1');
        els.navToggle2 = document.getElementById('navToggle2');
        els.navToggle5 = document.getElementById('navToggle5');
        els.toast = document.getElementById('toast');
        els.toastMessage = document.getElementById('toastMessage');
        els.contactForm = document.getElementById('contactForm');
        els.codeCopy = document.getElementById('codeCopy');
    }

    // ========================================
    // STYLE SWITCHER - Switch between 5 nav styles
    // ========================================
    function initStyleSwitcher() {
        const styles = {
            classic: { nav: els.navClassic, show: ['navClassic'] },
            glass:   { nav: els.navGlass,   show: ['navGlass'] },
            sidebar: { nav: els.navSidebar, show: ['navSidebar'], openBtn: els.sidebarOpen },
            bottom:  { nav: els.navBottom,  show: ['navBottom'] },
            mega:    { nav: els.navMega,    show: ['navMega'] }
        };

        // Hide all navs first
        function hideAllNavs() {
            els.navClassic.style.display = 'none';
            els.navGlass.style.display = 'none';
            els.navSidebar.style.display = 'none';
            els.navBottom.style.display = 'none';
            els.navMega.style.display = 'none';
            els.sidebarOpen.style.display = 'none';
            els.navOverlay.classList.remove('show');
            document.body.style.overflow = '';
        }

        // Show specific nav
        function showNav(style) {
            hideAllNavs();
            const config = styles[style];
            if (!config) return;

            // Show the main nav element
            if (style === 'sidebar') {
                els.navSidebar.style.display = 'flex';
                els.sidebarOpen.style.display = 'flex';
                // On desktop, sidebar is always visible
                if (window.innerWidth > 768) {
                    els.navSidebar.style.transform = 'translateX(0)';
                    els.sidebarOpen.style.display = 'none';
                    document.body.style.paddingLeft = '260px';
                } else {
                    els.navSidebar.style.transform = 'translateX(-100%)';
                    document.body.style.paddingLeft = '0';
                }
            } else {
                config.nav.style.display = 'block';
                document.body.style.paddingLeft = '0';
            }

            // Update active button
            els.styleSwitcher.querySelectorAll('.switcher-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.style === style);
            });

            // Update all nav links to match current section
            updateActiveLinks(window.location.hash || '#home');
        }

        // Style switcher buttons
        els.styleSwitcher.querySelectorAll('.switcher-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                showNav(btn.dataset.style);
                showToast(`Switched to ${btn.textContent.trim()} style`);
            });
        });

        // Handle window resize for sidebar
        window.addEventListener('resize', () => {
            const activeBtn = els.styleSwitcher.querySelector('.switcher-btn.active');
            if (activeBtn && activeBtn.dataset.style === 'sidebar') {
                showNav('sidebar');
            }
        });

        // Default: show classic
        showNav('classic');
    }

    // ========================================
    // MOBILE TOGGLES
    // ========================================
    function initMobileToggles() {
        // Classic nav toggle
        els.navToggle1.addEventListener('click', () => {
            const menu = els.navClassic.querySelector('.nav-menu');
            menu.classList.toggle('show');
            const spans = els.navToggle1.querySelectorAll('span');
            if (menu.classList.contains('show')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });

        // Glass nav toggle
        els.navToggle2.addEventListener('click', () => {
            const menu = els.navGlass.querySelector('.nav-menu');
            menu.classList.toggle('show');
        });

        // Mega nav toggle
        els.navToggle5.addEventListener('click', () => {
            const menu = els.navMega.querySelector('.nav-menu');
            menu.classList.toggle('show');
        });

        // Mega menu items toggle on mobile (tap to expand submenu)
        els.navMega.querySelectorAll('.has-mega > a').forEach(link => {
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    link.parentElement.classList.toggle('show');
                }
            });
        });

        // Sidebar open/close
        els.sidebarOpen.addEventListener('click', () => {
            els.navSidebar.classList.add('show');
            els.navOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        });

        els.sidebarClose.addEventListener('click', closeSidebar);
        els.navOverlay.addEventListener('click', closeSidebar);

        function closeSidebar() {
            els.navSidebar.classList.remove('show');
            els.navOverlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    // ========================================
    // SMOOTH SCROLL & ACTIVE LINKS
    // ========================================
    function initSmoothScroll() {
        // Handle all nav link clicks
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    // Update URL without jump
                    history.pushState(null, null, href);
                    updateActiveLinks(href);
                }

                // Close mobile menus
                document.querySelectorAll('.nav-menu').forEach(m => m.classList.remove('show'));
                closeSidebarIfOpen();
            });
        });

        // Scroll spy - update active link on scroll
        const sections = document.querySelectorAll('section[id]');
        const observerOptions = { rootMargin: '-40% 0px -60% 0px' };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateActiveLinks('#' + entry.target.id);
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }

    function updateActiveLinks(activeHash) {
        // Update all nav menus
        document.querySelectorAll('.nav-menu a, .sidebar-menu a, .bottom-tab').forEach(link => {
            const href = link.getAttribute('href');
            if (href === activeHash) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    function closeSidebarIfOpen() {
        if (els.navSidebar.classList.contains('show')) {
            els.navSidebar.classList.remove('show');
            els.navOverlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    // ========================================
    // CONTACT FORM
    // ========================================
    function initContactForm() {
        els.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Message sent successfully!');
            els.contactForm.reset();
        });
    }

    // ========================================
    // CODE COPY
    // ========================================
    function initCodeCopy() {
        if (!els.codeCopy) return;
        els.codeCopy.addEventListener('click', () => {
            const code = document.querySelector('.code-content code').textContent;
            navigator.clipboard.writeText(code).then(() => {
                els.codeCopy.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    els.codeCopy.innerHTML = '<i class="fas fa-copy"></i> Copy';
                }, 2000);
            });
        });
    }

    // ========================================
    // TOAST
    // ========================================
    function showToast(message) {
        els.toastMessage.textContent = message;
        els.toast.classList.add('show');
        setTimeout(() => els.toast.classList.remove('show'), 3000);
    }

    // ========================================
    // KEYBOARD NAVIGATION
    // ========================================
    function initKeyboardNav() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeSidebarIfOpen();
                document.querySelectorAll('.nav-menu').forEach(m => m.classList.remove('show'));
            }
        });
    }

    // ========================================
    // INITIALIZATION
    // ========================================
    function init() {
        cacheElements();
        initStyleSwitcher();
        initMobileToggles();
        initSmoothScroll();
        initContactForm();
        initCodeCopy();
        initKeyboardNav();

        // Handle initial hash
        if (window.location.hash) {
            setTimeout(() => {
                const target = document.querySelector(window.location.hash);
                if (target) target.scrollIntoView();
                updateActiveLinks(window.location.hash);
            }, 100);
        }

        console.log('%c Navigation Menu Demo ', 'background: #4361ee; color: white; font-size: 16px; font-weight: bold; padding: 8px 16px; border-radius: 8px;');
        console.log('%c 5 styles loaded: Classic, Glass, Sidebar, Bottom, Mega ', 'color: #6c757d; font-size: 12px;');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
/**
 * NAVIGATION MENU DEMO - INTERACTIVE JAVASCRIPT
 * Handles style switching, smooth scroll, active states, mobile toggles
 */

(function() {
    'use strict';

    // ========================================
    // DOM ELEMENTS
    // ========================================
    const els = {};
    function cacheElements() {
        els.navClassic = document.getElementById('navClassic');
        els.navGlass = document.getElementById('navGlass');
        els.navSidebar = document.getElementById('navSidebar');
        els.navBottom = document.getElementById('navBottom');
        els.navMega = document.getElementById('navMega');
        els.navOverlay = document.getElementById('navOverlay');
        els.sidebarOpen = document.getElementById('sidebarOpen');
        els.sidebarClose = document.getElementById('sidebarClose');
        els.styleSwitcher = document.getElementById('styleSwitcher');
        els.navToggle1 = document.getElementById('navToggle1');
        els.navToggle2 = document.getElementById('navToggle2');
        els.navToggle5 = document.getElementById('navToggle5');
        els.toast = document.getElementById('toast');
        els.toastMessage = document.getElementById('toastMessage');
        els.contactForm = document.getElementById('contactForm');
        els.codeCopy = document.getElementById('codeCopy');
    }

    // ========================================
    // STYLE SWITCHER - Switch between 5 nav styles
    // ========================================
    function initStyleSwitcher() {
        const styles = {
            classic: { nav: els.navClassic, show: ['navClassic'] },
            glass:   { nav: els.navGlass,   show: ['navGlass'] },
            sidebar: { nav: els.navSidebar, show: ['navSidebar'], openBtn: els.sidebarOpen },
            bottom:  { nav: els.navBottom,  show: ['navBottom'] },
            mega:    { nav: els.navMega,    show: ['navMega'] }
        };

        // Hide all navs first
        function hideAllNavs() {
            els.navClassic.style.display = 'none';
            els.navGlass.style.display = 'none';
            els.navSidebar.style.display = 'none';
            els.navBottom.style.display = 'none';
            els.navMega.style.display = 'none';
            els.sidebarOpen.style.display = 'none';
            els.navOverlay.classList.remove('show');
            document.body.style.overflow = '';
        }

        // Show specific nav
        function showNav(style) {
            hideAllNavs();
            const config = styles[style];
            if (!config) return;

            // Show the main nav element
            if (style === 'sidebar') {
                els.navSidebar.style.display = 'flex';
                els.sidebarOpen.style.display = 'flex';
                // On desktop, sidebar is always visible
                if (window.innerWidth > 768) {
                    els.navSidebar.style.transform = 'translateX(0)';
                    els.sidebarOpen.style.display = 'none';
                    document.body.style.paddingLeft = '260px';
                } else {
                    els.navSidebar.style.transform = 'translateX(-100%)';
                    document.body.style.paddingLeft = '0';
                }
            } else {
                config.nav.style.display = 'block';
                document.body.style.paddingLeft = '0';
            }

            // Update active button
            els.styleSwitcher.querySelectorAll('.switcher-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.style === style);
            });

            // Update all nav links to match current section
            updateActiveLinks(window.location.hash || '#home');
        }

        // Style switcher buttons
        els.styleSwitcher.querySelectorAll('.switcher-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                showNav(btn.dataset.style);
                showToast(`Switched to ${btn.textContent.trim()} style`);
            });
        });

        // Handle window resize for sidebar
        window.addEventListener('resize', () => {
            const activeBtn = els.styleSwitcher.querySelector('.switcher-btn.active');
            if (activeBtn && activeBtn.dataset.style === 'sidebar') {
                showNav('sidebar');
            }
        });

        // Default: show classic
        showNav('classic');
    }

    // ========================================
    // MOBILE TOGGLES
    // ========================================
    function initMobileToggles() {
        // Classic nav toggle
        els.navToggle1.addEventListener('click', () => {
            const menu = els.navClassic.querySelector('.nav-menu');
            menu.classList.toggle('show');
            const spans = els.navToggle1.querySelectorAll('span');
            if (menu.classList.contains('show')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });

        // Glass nav toggle
        els.navToggle2.addEventListener('click', () => {
            const menu = els.navGlass.querySelector('.nav-menu');
            menu.classList.toggle('show');
        });

        // Mega nav toggle
        els.navToggle5.addEventListener('click', () => {
            const menu = els.navMega.querySelector('.nav-menu');
            menu.classList.toggle('show');
        });

        // Mega menu items toggle on mobile (tap to expand submenu)
        els.navMega.querySelectorAll('.has-mega > a').forEach(link => {
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    link.parentElement.classList.toggle('show');
                }
            });
        });

        // Sidebar open/close
        els.sidebarOpen.addEventListener('click', () => {
            els.navSidebar.classList.add('show');
            els.navOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        });

        els.sidebarClose.addEventListener('click', closeSidebar);
        els.navOverlay.addEventListener('click', closeSidebar);

        function closeSidebar() {
            els.navSidebar.classList.remove('show');
            els.navOverlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    // ========================================
    // SMOOTH SCROLL & ACTIVE LINKS
    // ========================================
    function initSmoothScroll() {
        // Handle all nav link clicks
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    // Update URL without jump
                    history.pushState(null, null, href);
                    updateActiveLinks(href);
                }

                // Close mobile menus
                document.querySelectorAll('.nav-menu').forEach(m => m.classList.remove('show'));
                closeSidebarIfOpen();
            });
        });

        // Scroll spy - update active link on scroll
        const sections = document.querySelectorAll('section[id]');
        const observerOptions = { rootMargin: '-40% 0px -60% 0px' };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateActiveLinks('#' + entry.target.id);
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }

    function updateActiveLinks(activeHash) {
        // Update all nav menus
        document.querySelectorAll('.nav-menu a, .sidebar-menu a, .bottom-tab').forEach(link => {
            const href = link.getAttribute('href');
            if (href === activeHash) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    function closeSidebarIfOpen() {
        if (els.navSidebar.classList.contains('show')) {
            els.navSidebar.classList.remove('show');
            els.navOverlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    // ========================================
    // CONTACT FORM
    // ========================================
    function initContactForm() {
        els.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Message sent successfully!');
            els.contactForm.reset();
        });
    }

    // ========================================
    // CODE COPY
    // ========================================
    function initCodeCopy() {
        if (!els.codeCopy) return;
        els.codeCopy.addEventListener('click', () => {
            const code = document.querySelector('.code-content code').textContent;
            navigator.clipboard.writeText(code).then(() => {
                els.codeCopy.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    els.codeCopy.innerHTML = '<i class="fas fa-copy"></i> Copy';
                }, 2000);
            });
        });
    }

    // ========================================
    // TOAST
    // ========================================
    function showToast(message) {
        els.toastMessage.textContent = message;
        els.toast.classList.add('show');
        setTimeout(() => els.toast.classList.remove('show'), 3000);
    }

    // ========================================
    // KEYBOARD NAVIGATION
    // ========================================
    function initKeyboardNav() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeSidebarIfOpen();
                document.querySelectorAll('.nav-menu').forEach(m => m.classList.remove('show'));
            }
        });
    }

    // ========================================
    // INITIALIZATION
    // ========================================
    function init() {
        cacheElements();
        initStyleSwitcher();
        initMobileToggles();
        initSmoothScroll();
        initContactForm();
        initCodeCopy();
        initKeyboardNav();

        // Handle initial hash
        if (window.location.hash) {
            setTimeout(() => {
                const target = document.querySelector(window.location.hash);
                if (target) target.scrollIntoView();
                updateActiveLinks(window.location.hash);
            }, 100);
        }

        console.log('%c Navigation Menu Demo ', 'background: #4361ee; color: white; font-size: 16px; font-weight: bold; padding: 8px 16px; border-radius: 8px;');
        console.log('%c 5 styles loaded: Classic, Glass, Sidebar, Bottom, Mega ', 'color: #6c757d; font-size: 12px;');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
/**
 * NAVIGATION MENU DEMO - INTERACTIVE JAVASCRIPT
 * Handles style switching, smooth scroll, active states, mobile toggles
 */

(function() {
    'use strict';

    // ========================================
    // DOM ELEMENTS
    // ========================================
    const els = {};
    function cacheElements() {
        els.navClassic = document.getElementById('navClassic');
        els.navGlass = document.getElementById('navGlass');
        els.navSidebar = document.getElementById('navSidebar');
        els.navBottom = document.getElementById('navBottom');
        els.navMega = document.getElementById('navMega');
        els.navOverlay = document.getElementById('navOverlay');
        els.sidebarOpen = document.getElementById('sidebarOpen');
        els.sidebarClose = document.getElementById('sidebarClose');
        els.styleSwitcher = document.getElementById('styleSwitcher');
        els.navToggle1 = document.getElementById('navToggle1');
        els.navToggle2 = document.getElementById('navToggle2');
        els.navToggle5 = document.getElementById('navToggle5');
        els.toast = document.getElementById('toast');
        els.toastMessage = document.getElementById('toastMessage');
        els.contactForm = document.getElementById('contactForm');
        els.codeCopy = document.getElementById('codeCopy');
    }

    // ========================================
    // STYLE SWITCHER - Switch between 5 nav styles
    // ========================================
    function initStyleSwitcher() {
        const styles = {
            classic: { nav: els.navClassic, show: ['navClassic'] },
            glass:   { nav: els.navGlass,   show: ['navGlass'] },
            sidebar: { nav: els.navSidebar, show: ['navSidebar'], openBtn: els.sidebarOpen },
            bottom:  { nav: els.navBottom,  show: ['navBottom'] },
            mega:    { nav: els.navMega,    show: ['navMega'] }
        };

        // Hide all navs first
        function hideAllNavs() {
            els.navClassic.style.display = 'none';
            els.navGlass.style.display = 'none';
            els.navSidebar.style.display = 'none';
            els.navBottom.style.display = 'none';
            els.navMega.style.display = 'none';
            els.sidebarOpen.style.display = 'none';
            els.navOverlay.classList.remove('show');
            document.body.style.overflow = '';
        }

        // Show specific nav
        function showNav(style) {
            hideAllNavs();
            const config = styles[style];
            if (!config) return;

            // Show the main nav element
            if (style === 'sidebar') {
                els.navSidebar.style.display = 'flex';
                els.sidebarOpen.style.display = 'flex';
                // On desktop, sidebar is always visible
                if (window.innerWidth > 768) {
                    els.navSidebar.style.transform = 'translateX(0)';
                    els.sidebarOpen.style.display = 'none';
                    document.body.style.paddingLeft = '260px';
                } else {
                    els.navSidebar.style.transform = 'translateX(-100%)';
                    document.body.style.paddingLeft = '0';
                }
            } else {
                config.nav.style.display = 'block';
                document.body.style.paddingLeft = '0';
            }

            // Update active button
            els.styleSwitcher.querySelectorAll('.switcher-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.style === style);
            });

            // Update all nav links to match current section
            updateActiveLinks(window.location.hash || '#home');
        }

        // Style switcher buttons
        els.styleSwitcher.querySelectorAll('.switcher-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                showNav(btn.dataset.style);
                showToast(`Switched to ${btn.textContent.trim()} style`);
            });
        });

        // Handle window resize for sidebar
        window.addEventListener('resize', () => {
            const activeBtn = els.styleSwitcher.querySelector('.switcher-btn.active');
            if (activeBtn && activeBtn.dataset.style === 'sidebar') {
                showNav('sidebar');
            }
        });

        // Default: show classic
        showNav('classic');
    }

    // ========================================
    // MOBILE TOGGLES
    // ========================================
    function initMobileToggles() {
        // Classic nav toggle
        els.navToggle1.addEventListener('click', () => {
            const menu = els.navClassic.querySelector('.nav-menu');
            menu.classList.toggle('show');
            const spans = els.navToggle1.querySelectorAll('span');
            if (menu.classList.contains('show')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });

        // Glass nav toggle
        els.navToggle2.addEventListener('click', () => {
            const menu = els.navGlass.querySelector('.nav-menu');
            menu.classList.toggle('show');
        });

        // Mega nav toggle
        els.navToggle5.addEventListener('click', () => {
            const menu = els.navMega.querySelector('.nav-menu');
            menu.classList.toggle('show');
        });

        // Mega menu items toggle on mobile (tap to expand submenu)
        els.navMega.querySelectorAll('.has-mega > a').forEach(link => {
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    link.parentElement.classList.toggle('show');
                }
            });
        });

        // Sidebar open/close
        els.sidebarOpen.addEventListener('click', () => {
            els.navSidebar.classList.add('show');
            els.navOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        });

        els.sidebarClose.addEventListener('click', closeSidebar);
        els.navOverlay.addEventListener('click', closeSidebar);

        function closeSidebar() {
            els.navSidebar.classList.remove('show');
            els.navOverlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    // ========================================
    // SMOOTH SCROLL & ACTIVE LINKS
    // ========================================
    function initSmoothScroll() {
        // Handle all nav link clicks
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    // Update URL without jump
                    history.pushState(null, null, href);
                    updateActiveLinks(href);
                }

                // Close mobile menus
                document.querySelectorAll('.nav-menu').forEach(m => m.classList.remove('show'));
                closeSidebarIfOpen();
            });
        });

        // Scroll spy - update active link on scroll
        const sections = document.querySelectorAll('section[id]');
        const observerOptions = { rootMargin: '-40% 0px -60% 0px' };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateActiveLinks('#' + entry.target.id);
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }

    function updateActiveLinks(activeHash) {
        // Update all nav menus
        document.querySelectorAll('.nav-menu a, .sidebar-menu a, .bottom-tab').forEach(link => {
            const href = link.getAttribute('href');
            if (href === activeHash) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    function closeSidebarIfOpen() {
        if (els.navSidebar.classList.contains('show')) {
            els.navSidebar.classList.remove('show');
            els.navOverlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    // ========================================
    // CONTACT FORM
    // ========================================
    function initContactForm() {
        els.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Message sent successfully!');
            els.contactForm.reset();
        });
    }

    // ========================================
    // CODE COPY
    // ========================================
    function initCodeCopy() {
        if (!els.codeCopy) return;
        els.codeCopy.addEventListener('click', () => {
            const code = document.querySelector('.code-content code').textContent;
            navigator.clipboard.writeText(code).then(() => {
                els.codeCopy.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    els.codeCopy.innerHTML = '<i class="fas fa-copy"></i> Copy';
                }, 2000);
            });
        });
    }

    // ========================================
    // TOAST
    // ========================================
    function showToast(message) {
        els.toastMessage.textContent = message;
        els.toast.classList.add('show');
        setTimeout(() => els.toast.classList.remove('show'), 3000);
    }

    // ========================================
    // KEYBOARD NAVIGATION
    // ========================================
    function initKeyboardNav() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeSidebarIfOpen();
                document.querySelectorAll('.nav-menu').forEach(m => m.classList.remove('show'));
            }
        });
    }

    // ========================================
    // INITIALIZATION
    // ========================================
    function init() {
        cacheElements();
        initStyleSwitcher();
        initMobileToggles();
        initSmoothScroll();
        initContactForm();
        initCodeCopy();
        initKeyboardNav();

        // Handle initial hash
        if (window.location.hash) {
            setTimeout(() => {
                const target = document.querySelector(window.location.hash);
                if (target) target.scrollIntoView();
                updateActiveLinks(window.location.hash);
            }, 100);
        }

        console.log('%c Navigation Menu Demo ', 'background: #4361ee; color: white; font-size: 16px; font-weight: bold; padding: 8px 16px; border-radius: 8px;');
        console.log('%c 5 styles loaded: Classic, Glass, Sidebar, Bottom, Mega ', 'color: #6c757d; font-size: 12px;');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
