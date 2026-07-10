document.addEventListener('DOMContentLoaded', function() {

    const linkedinProfileUrl = 'https://cz.linkedin.com/in/radovan-bista-76410614b';
    document.querySelectorAll('[data-social-link="linkedin"]').forEach(link => {
        link.setAttribute('href', linkedinProfileUrl);
    });

    /* ==========================================================================
       Sekce: Nastavení aktuálního roku v patičce
       ========================================================================== */
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    /* ==========================================================================
       Sekce: Mobilní navigace (burger menu)
       ========================================================================== */
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    const body = document.body;

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            menuToggle.classList.toggle('open');
            mainNav.classList.toggle('open');
            body.classList.toggle('menu-active');
        });

        document.addEventListener('click', function(e) {
            if (mainNav.classList.contains('open') && !mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('open');
                mainNav.classList.remove('open');
                body.classList.remove('menu-active');
            }
        });
    }

    /* ==========================================================================
       Sekce: Plynulé rolování (Smooth Scroll)
       ========================================================================== */
    const header = document.querySelector('.header-main');
    const headerHeight = header ? header.offsetHeight : 80;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();

                if (mainNav && mainNav.classList.contains('open')) {
                    menuToggle.classList.remove('open');
                    mainNav.classList.remove('open');
                    body.classList.remove('menu-active');
                }
                
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerHeight - 10;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ==========================================================================
       Sekce: Scroll Reveal Animace
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');
    
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const revealCallback = function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        };

        const revealObserver = new IntersectionObserver(revealCallback, {
            root: null,
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach(element => {
            element.classList.add('visible');
        });
    }

    /* ==========================================================================
       Sekce: Klikací akordeon témat
       ========================================================================== */
    const topicRows = document.querySelectorAll('.topic-row');
    topicRows.forEach(row => {
        row.addEventListener('click', function() {
            topicRows.forEach(otherRow => {
                if (otherRow !== row) {
                    otherRow.classList.remove('active');
                }
            });
            this.classList.toggle('active');
        });
    });
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll("#mainNav a");

    const observerOptions = {
        root: null,
        rootMargin: "-30% 0px -60% 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute("id");

                navLinks.forEach((link) => {
                    if (link.getAttribute("href") === `#${currentId}`) {
                        link.classList.add("active");
                    } else {
                        link.classList.remove("active");
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));
});
