// Language and navigation state
let currentLang = localStorage.getItem('language') || 'et';
let currentSection = 'home';

// Translations
const translations = {
    et: {
        title: 'Iran: Vabaduse võitlus',
        nav: {
            home: 'Avaleht',
            about: 'Meist',
            tweets: 'Poliitikute sõnavõtud',
            gallery: 'Galerii',
            timeline: 'Ajajoon',
            help: 'Kuidas aidata',
            contact: 'Kontakt'
        },
        tweets: {
            title: 'Eesti poliitikute sõnavõtud',
            loading: 'Laadimine...',
            noTweets: 'Tweete ei leitud.'
        }
    },
    en: {
        title: 'Iran: a Fight for Freedom',
        nav: {
            home: 'Home',
            about: 'About Us',
            tweets: 'Politicians\' Statements',
            gallery: 'Gallery',
            timeline: 'Timeline',
            help: 'How to Help',
            contact: 'Contact'
        },
        tweets: {
            title: 'Estonian Politicians\' Statements',
            loading: 'Loading...',
            noTweets: 'No tweets found.'
        }
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeLanguage();
    initializeMobileMenu();
    loadTweets();
    
    // Handle hash navigation
    if (window.location.hash) {
        const section = window.location.hash.substring(1);
        showSection(section);
    }
    
    window.addEventListener('hashchange', function() {
        const section = window.location.hash.substring(1) || 'home';
        showSection(section);
    });
});

// Navigation functions
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
            window.location.hash = section;
        });
    });
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
            }
        });
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Reload tweets if on tweets section
        if (sectionId === 'tweets') {
            loadTweets();
        }
    }
}

// Mobile menu toggle
function initializeMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && navMenu && navToggle) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });
}

// Language functions
function initializeLanguage() {
    const langToggle = document.getElementById('langToggle');
    setLanguage(currentLang);
    
    if (langToggle) {
        langToggle.addEventListener('click', function() {
            const newLang = currentLang === 'et' ? 'en' : 'et';
            setLanguage(newLang);
        });
    }
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    
    // Update title
    const siteTitle = document.querySelector('.site-title');
    if (siteTitle) {
        siteTitle.textContent = translations[lang].title;
    }
    
    // Update language toggle button
    const langActive = document.querySelector('.lang-active');
    const langInactive = document.querySelector('.lang-inactive');
    if (langActive && langInactive) {
        langActive.textContent = lang.toUpperCase();
        langInactive.textContent = (lang === 'et' ? 'EN' : 'ET');
    }
    
    // Show/hide content sections
    const sections = ['home', 'about', 'tweets', 'gallery', 'timeline', 'help', 'contact'];
    sections.forEach(section => {
        const etContent = document.getElementById(`${section}-et`) || document.getElementById(`content-et`);
        const enContent = document.getElementById(`${section}-en`) || document.getElementById(`content-en`);
        
        if (etContent && enContent) {
            if (lang === 'et') {
                etContent.classList.remove('hidden');
                enContent.classList.add('hidden');
            } else {
                etContent.classList.add('hidden');
                enContent.classList.remove('hidden');
            }
        }
    });
    
    // Update navigation labels
    updateNavigationLabels(lang);
    
    // Reload tweets if on tweets section
    if (currentSection === 'tweets') {
        loadTweets();
    }
}

function updateNavigationLabels(lang) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const section = link.getAttribute('data-section');
        if (translations[lang].nav[section]) {
            link.textContent = translations[lang].nav[section];
        }
    });
}

// Load tweets from JSON
async function loadTweets() {
    const containerET = document.getElementById('tweets-container');
    const containerEN = document.getElementById('tweets-container-en');
    
    if (!containerET || !containerEN) return;
    
    // Show loading message
    containerET.innerHTML = `<p class="placeholder-text">${translations[currentLang].tweets.loading}</p>`;
    containerEN.innerHTML = `<p class="placeholder-text">${translations['en'].tweets.loading}</p>`;
    
    try {
        const response = await fetch('tweets.json');
        if (!response.ok) {
            throw new Error('Failed to load tweets');
        }
        
        const data = await response.json();
        const tweets = data.tweets || [];
        
        if (tweets.length === 0) {
            containerET.innerHTML = `<p class="placeholder-text">${translations['et'].tweets.noTweets}</p>`;
            containerEN.innerHTML = `<p class="placeholder-text">${translations['en'].tweets.noTweets}</p>`;
            return;
        }
        
        // Render tweets for Estonian
        containerET.innerHTML = tweets.map(tweet => {
            return createTweetHTML(tweet);
        }).join('');
        
        // Render tweets for English
        containerEN.innerHTML = tweets.map(tweet => {
            return createTweetHTML(tweet);
        }).join('');
        
        // Load Twitter widgets
        if (window.twttr && window.twttr.widgets) {
            window.twttr.widgets.load();
        }
    } catch (error) {
        console.error('Error loading tweets:', error);
        containerET.innerHTML = `<p class="placeholder-text">Viga tweetide laadimisel.</p>`;
        containerEN.innerHTML = `<p class="placeholder-text">Error loading tweets.</p>`;
    }
}

function createTweetHTML(tweet) {
    // Extract tweet ID from URL
    const tweetId = extractTweetId(tweet.url);
    
    if (!tweetId) {
        return `
            <div class="tweet-item">
                <p class="placeholder-text">Vigane tweet URL</p>
                <a href="${tweet.url}" target="_blank" rel="noopener noreferrer" class="tweet-link">Vaata Twitteris</a>
            </div>
        `;
    }
    
    return `
        <div class="tweet-item">
            <blockquote class="twitter-tweet tweet-embed" data-theme="light">
                <a href="${tweet.url}"></a>
            </blockquote>
        </div>
    `;
}

function extractTweetId(url) {
    // Extract tweet ID from various Twitter URL formats
    const patterns = [
        /twitter\.com\/\w+\/status\/(\d+)/,
        /x\.com\/\w+\/status\/(\d+)/,
        /status\/(\d+)/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    
    return null;
}