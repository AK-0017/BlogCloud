// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add active class to current navigation item
const currentLocation = location.pathname;
const navItems = document.querySelectorAll('.nav-links a');

navItems.forEach(item => {
    if (item.getAttribute('href') === currentLocation) {
        item.classList.add('active');
    }
});

// Add animation to elements when they come into view
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.post-card, .cta-section');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Initial check for elements in view
window.addEventListener('load', animateOnScroll);
window.addEventListener('scroll', animateOnScroll);

// Add hover effect to post cards
const postCards = document.querySelectorAll('.post-card');

postCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Navigation scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Form handling
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Add your form submission logic here
            console.log('Form submitted');
        });
    });
});

// Smooth loading overlay for navigation (dynamic)
function setupLoadingOverlay() {
    const overlay = document.getElementById('loading-overlay');
    const loadingMessage = document.getElementById('loading-message');
    if (!overlay) return;
    let isLoading = false;
    const messages = [
        'Loading your inspiration…',
        'Fetching awesomeness…',
        'Preparing something great…',
        'Hang tight, magic is happening…',
        'Bringing you fresh content…',
        'Just a moment, making things awesome…',
        'Good things take time…',
        'Almost there…',
        'Loading BlogCloud…',
    ];
    document.querySelectorAll('.nav-links a, .logo h1, .login-btn').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href !== '#' && !this.classList.contains('active') && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && !isLoading) {
                e.preventDefault();
                isLoading = true;
                if (loadingMessage) {
                    const msg = messages[Math.floor(Math.random() * messages.length)];
                    loadingMessage.textContent = msg;
                }
                overlay.classList.add('active');
                setTimeout(() => {
                    window.location.href = href;
                }, 900); // 900ms for smooth transition
            }
        });
    });
    // Fade out overlay on page load
    window.addEventListener('pageshow', () => {
        overlay.classList.remove('active');
        isLoading = false;
    });
    window.addEventListener('DOMContentLoaded', () => {
        overlay.classList.remove('active');
        isLoading = false;
    });
}

document.addEventListener('DOMContentLoaded', setupLoadingOverlay); 