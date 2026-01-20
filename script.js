// Language toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const langToggle = document.getElementById('langToggle');
    const contentET = document.getElementById('content-et');
    const contentEN = document.getElementById('content-en');
    const siteTitle = document.querySelector('.site-title');
    const langActive = document.querySelector('.lang-active');
    const langInactive = document.querySelector('.lang-inactive');

    // Check for saved language preference or default to Estonian
    let currentLang = localStorage.getItem('language') || 'et';
    
    function setLanguage(lang) {
        if (lang === 'en') {
            contentET.classList.add('hidden');
            contentEN.classList.remove('hidden');
            siteTitle.textContent = 'Iran: a Fight for Freedom';
            langActive.textContent = 'EN';
            langInactive.textContent = 'ET';
            document.documentElement.lang = 'en';
            currentLang = 'en';
        } else {
            contentEN.classList.add('hidden');
            contentET.classList.remove('hidden');
            siteTitle.textContent = 'Iran: Vabaduse võitlus';
            langActive.textContent = 'ET';
            langInactive.textContent = 'EN';
            document.documentElement.lang = 'et';
            currentLang = 'et';
        }
        localStorage.setItem('language', currentLang);
    }

    // Initialize language on page load
    setLanguage(currentLang);

    // Toggle language on button click
    langToggle.addEventListener('click', function() {
        const newLang = currentLang === 'et' ? 'en' : 'et';
        setLanguage(newLang);
    });
});