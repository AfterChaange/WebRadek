document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Nastavení aktuálního roku v patičce
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // 2. Mobilní navigace (burger menu)
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

        // Zavřít menu při kliknutí mimo navigaci
        document.addEventListener('click', function(e) {
            if (mainNav.classList.contains('open') && !mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('open');
                mainNav.classList.remove('open');
                body.classList.remove('menu-active');
            }
        });
    }

    // 3. Plynulé rolování (Smooth Scroll) s offsetem pro fixní hlavičku
    const header = document.querySelector('.header-main');
    const headerHeight = header ? header.offsetHeight : 80;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Zavření mobilního menu před scrollováním
                if (mainNav && mainNav.classList.contains('open')) {
                    menuToggle.classList.remove('open');
                    mainNav.classList.remove('open');
                    body.classList.remove('menu-active');
                }
                
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerHeight - 10; // Extra 10px pro odstup

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Scroll Reveal Animace (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const revealCallback = function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Jakmile prvek jednou animujeme, přestaneme ho sledovat
                    observer.unobserve(entry.target);
                }
            });
        };

        const revealObserver = new IntersectionObserver(revealCallback, {
            root: null, // viewport
            threshold: 0.15, // spustí se při zobrazení 15 % prvku
            rootMargin: '0px 0px -50px 0px' // posunutí spodní hranice o 50px pro lepší zážitek
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        // Fallback: okamžité zviditelnění prvků na starších prohlížečích
        revealElements.forEach(element => {
            element.classList.add('visible');
        });
    }

    // 5. Klikací akordeon témat (pro mobilní telefony a dotykové obrazovky)
    const topicRows = document.querySelectorAll('.topic-row');
    topicRows.forEach(row => {
        row.addEventListener('click', function() {
            // Zavřít ostatní otevřené řádky
            topicRows.forEach(otherRow => {
                if (otherRow !== row) {
                    otherRow.classList.remove('active');
                }
            });
            // Přepnout aktivní třídu u aktuálního řádku
            this.classList.toggle('active');
        });
    });
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll("#mainNav a");

    const observerOptions = {
        root: null,
        rootMargin: "-30% 0px -60% 0px" // Aktivuje se, když je sekce v hlavní části viewportu
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute("id");

                navLinks.forEach((link) => {
                    // Pokud href odkazu končí #id aktuální sekce, přidá třídu active
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
