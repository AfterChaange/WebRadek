document.addEventListener("DOMContentLoaded", () => {
    const banner = document.getElementById("cookie-banner");
    const btnAcceptAll = document.getElementById("cookie-accept-all");
    const btnSaveCustom = document.getElementById("cookie-save-custom");
    const btnRejectAll = document.getElementById("cookie-reject-all");
    
    const chkAnalytics = document.getElementById("cookie-ana");
    const chkMarketing = document.getElementById("cookie-mkt");

    // Načtení uloženého nastavení
    const savedConsent = JSON.parse(localStorage.getItem("cookieConsent"));

    if (!savedConsent) {
        // Pokud nemáme souhlas, zobrazíme banner
        banner.classList.remove("cookie-hidden");
    } else {
        // Pokud souhlas máme, rovnou aktivujeme povolené skripty
        runApprovedScripts(savedConsent);
    }

    // Pomocná funkce pro uložení a skrytí
    function saveConsent(consentObj) {
        localStorage.setItem("cookieConsent", JSON.stringify(consentObj));
        banner.classList.add("cookie-hidden");
        runApprovedScripts(consentObj);
    }

    // 1. Přijmout vše
    btnAcceptAll.addEventListener("click", () => {
        saveConsent({ essential: true, analytics: true, marketing: true });
    });

    // 2. Odmítnout vše (kromě nezbytných)
    btnRejectAll.addEventListener("click", () => {
        saveConsent({ essential: true, analytics: false, marketing: false });
    });

    // 3. Uložit vlastní výběr
    btnSaveCustom.addEventListener("click", () => {
        saveConsent({
            essential: true,
            analytics: chkAnalytics.checked,
            marketing: chkMarketing.checked
        });
    });

    // Zde se spouští vaše měřící kódy podle toho, co uživatel povolil
    function runApprovedScripts(consent) {
        if (consent.analytics) {
            console.log("Spouštím Analytické cookies (např. Google Analytics)...");
            // SEM VLOŽTE KÓD PRO GOOGLE ANALYTICS
            // Příklad: (function(w,d,s,l,i){...})(window,document,'script','dataLayer','G-XXXXX');
        }
        
        if (consent.marketing) {
            console.log("Spouštím Marketingové cookies (např. Facebook Pixel)...");
            // SEM VLOŽTE KÓD PRO FACEBOOK PIXEL, SKLIK ATD.
        }
    }
});