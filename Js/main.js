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
       Sekce: Akordeon témat (Hover)
       ========================================================================== */
    const topicRows = document.querySelectorAll('.topic-row');
    topicRows.forEach(row => {
        const activateRow = () => {
            topicRows.forEach(otherRow => {
                const isTarget = otherRow === row;
                otherRow.classList.toggle('active', isTarget);
                otherRow.setAttribute('aria-expanded', String(isTarget));
            });
        };

        const deactivateRows = () => {
            topicRows.forEach(otherRow => {
                otherRow.classList.remove('active');
                otherRow.setAttribute('aria-expanded', 'false');
            });
        };

        row.addEventListener('mouseenter', activateRow);
        row.addEventListener('mouseleave', deactivateRows);
        row.addEventListener('focusin', activateRow);
        row.addEventListener('focusout', deactivateRows);

        row.addEventListener('click', () => {
            if (window.matchMedia('(hover: none)').matches) {
                const isActive = row.classList.contains('active');
                if (isActive) {
                    deactivateRows();
                } else {
                    activateRow();
                }
            }
        });
    });

    /* ==========================================================================
       Sekce: Rozbalovací pilíře
       ========================================================================== */
    const pillarCards = document.querySelectorAll('.pillar-card');

    const togglePillarCard = (card) => {
        const isActive = card.classList.contains('active');

        pillarCards.forEach(otherCard => {
            if (otherCard !== card) {
                otherCard.classList.remove('active');
                otherCard.setAttribute('aria-expanded', 'false');
            }
        });

        card.classList.toggle('active', !isActive);
        card.setAttribute('aria-expanded', String(!isActive));
    };

    pillarCards.forEach(card => {
        card.addEventListener('click', () => togglePillarCard(card));
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                togglePillarCard(card);
            }
        });
    });

    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll("#mainNav a");
    const getLinkHash = (link) => {
        try {
            return new URL(link.href, window.location.href).hash;
        } catch (error) {
            const href = link.getAttribute('href') || '';
            const hashIndex = href.indexOf('#');
            return hashIndex >= 0 ? href.slice(hashIndex) : '';
        }
    };

    const setActiveNavLink = (currentId) => {
        navLinks.forEach((link) => {
            if (getLinkHash(link) === `#${currentId}`) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    };

    const observerOptions = {
        root: null,
        rootMargin: "-30% 0px -60% 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute("id");
                setActiveNavLink(currentId);
            }
        });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));

    const detailPageActiveSection = window.location.pathname.toLowerCase().endsWith('detail.html') ? 'o-mne' : null;
    if (detailPageActiveSection) {
        setActiveNavLink(detailPageActiveSection);
    }

    /* ==========================================================================
       Sekce: Carousel terapeutovny
       ========================================================================== */
    const carousel = document.getElementById('therapyCarousel');

    if (carousel) {
        const slides = carousel.querySelectorAll('.space-image');
        const dots = carousel.querySelectorAll('.space-dot');
        const prevBtn = carousel.querySelector('.space-carousel-btn.prev');
        const nextBtn = carousel.querySelector('.space-carousel-btn.next');
        const autoplayDelay = 7000;
        let currentSlide = 0;
        let autoplayId = null;

        const showSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });

            currentSlide = index;
        };

        const goToNext = () => {
            const nextIndex = (currentSlide + 1) % slides.length;
            showSlide(nextIndex);
        };

        const goToPrev = () => {
            const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(prevIndex);
        };

        const startAutoplay = () => {
            if (autoplayId) {
                clearInterval(autoplayId);
            }

            autoplayId = setInterval(goToNext, autoplayDelay);
        };

        const stopAutoplay = () => {
            if (autoplayId) {
                clearInterval(autoplayId);
                autoplayId = null;
            }
        };

        const resetAutoplay = () => {
            stopAutoplay();
            startAutoplay();
        };

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                goToNext();
                resetAutoplay();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                goToPrev();
                resetAutoplay();
            });
        }

        dots.forEach((dot) => {
            dot.addEventListener('click', () => {
                const target = Number(dot.dataset.slide);
                if (!Number.isNaN(target)) {
                    showSlide(target);
                    resetAutoplay();
                }
            });
        });

        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);

        showSlide(0);
        startAutoplay();
    }


    // import { config } from '@fortawesome/fontawesome-svg-core';
    // import '@fortawesome/fontawesome-svg-core/styles.css';

    // // Zamezí obřímu probliknutí/vykreslení ikon bez CSS
    // config.autoAddCss = false;
});