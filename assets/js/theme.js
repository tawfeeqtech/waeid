// Coach Theme JavaScript for Salla Platform

// Dark Mode Toggle
function initDarkMode() {
    const toggle = document.querySelector('.dark-mode-toggle');
    if (!toggle) return;
    
    // Check saved preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
        document.body.classList.add('dark-mode');
        toggle.innerHTML = '☀️';
    }
    
    // Toggle functionality
    toggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        toggle.innerHTML = isDark ? '☀️' : '🌙';
        localStorage.setItem('darkMode', isDark);
    });
}

// Booking Form Validation
function initBookingForm() {
    const form = document.querySelector('.booking-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!data.name || !data.email || !data.date) {
            alert('يرجى ملء جميع الحقول المطلوبة');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert('يرجى إدخال بريد إلكتروني صحيح');
            return;
        }
        
        // Simulate form submission
        const submitBtn = form.querySelector('.btn');
        submitBtn.textContent = 'جاري الإرسال...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('تم إرسال طلب الحجز بنجاح! سنتواصل معك قريباً.');
            form.reset();
            submitBtn.textContent = 'إرسال الطلب';
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Testimonials Carousel
function initTestimonials() {
    const testimonials = document.querySelector('.testimonials-container');
    if (!testimonials) return;
    
    let currentIndex = 0;
    const items = testimonials.querySelectorAll('.testimonial-item');
    if (items.length <= 1) return;
    
    // Create navigation buttons
    const nav = document.createElement('div');
    nav.className = 'testimonials-nav';
    nav.innerHTML = `
        <button class="nav-btn prev" onclick="showTestimonial(${currentIndex - 1})">‹</button>
        <button class="nav-btn next" onclick="showTestimonial(${currentIndex + 1})">›</button>
    `;
    testimonials.appendChild(nav);
    
    // Show testimonial function
    window.showTestimonial = (index) => {
        if (index < 0) index = items.length - 1;
        if (index >= items.length) index = 0;
        
        items.forEach(item => item.style.display = 'none');
        items[index].style.display = 'block';
        currentIndex = index;
    };
    
    // Auto-rotate testimonials
    setInterval(() => {
        showTestimonial(currentIndex + 1);
    }, 5000);
    
    // Show first testimonial
    showTestimonial(0);
}

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileToggle = document.createElement('button');
    mobileToggle.innerHTML = '☰';
    mobileToggle.className = 'mobile-menu-toggle';
    mobileToggle.style.cssText = `
        display: none;
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 0.5rem;
        border-radius: 4px;
        cursor: pointer;
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 9999;
    `;
    
    const nav = document.querySelector('.nav-menu');
    if (!nav) return;
    
    mobileToggle.addEventListener('click', () => {
        nav.classList.toggle('mobile-open');
    });
    
    document.body.appendChild(mobileToggle);
    
    // Show mobile toggle on small screens
    const checkScreenSize = () => {
        mobileToggle.style.display = window.innerWidth <= 768 ? 'block' : 'none';
        if (window.innerWidth > 768) {
            nav.classList.remove('mobile-open');
        }
    };
    
    window.addEventListener('resize', checkScreenSize);
    checkScreenSize();
}

// Smooth Scroll
function initSmoothScroll() {
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
}

// Initialize all features
document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    initBookingForm();
    initTestimonials();
    initMobileMenu();
    initSmoothScroll();
    initSmartSurvey();
});

// Smart Survey System
function initSmartSurvey() {
    const surveyForm = document.getElementById('smartSurvey');
    if (!surveyForm) return;
    
    surveyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(surveyForm);
        const data = Object.fromEntries(formData);
        
        // Save survey responses
        Object.keys(data).forEach(key => {
            if (key.startsWith('question_')) {
                localStorage.setItem(key, data[key]);
            }
        });
        
        // Show success message
        alert("{{ survey_completed }}");
        
        // Redirect to cart or show cart button
        setTimeout(() => {
            const cartButton = document.createElement('button');
            cartButton.textContent = '{{ settings.cart_button_text | default("احجز باقتك الآن") }}';
            cartButton.className = 'btn btn-large';
            cartButton.onclick = () => {
                // Add to cart logic here
                alert('{{ added_to_cart }}');
            };
            
            // Replace form with cart button
            surveyForm.parentNode.replaceChild(cartButton);
        }, 2000);
    });
}

// Add mobile menu styles
const mobileMenuStyles = `
    .mobile-menu-toggle {
        display: none;
    }
    
    .nav-menu.mobile-open {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: var(--bg-primary);
        box-shadow: var(--shadow);
        z-index: 9998;
        flex-direction: column;
        padding: 2rem;
        gap: 1rem;
    }
    
    .testimonials-nav {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .nav-btn {
        background: var(--primary-color);
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        transition: all 0.3s ease;
    }
    
    .nav-btn:hover {
        background: var(--secondary-color);
        transform: scale(1.1);
    }
    
    @media (max-width: 768px) {
        .mobile-menu-toggle {
            display: block !important;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = mobileMenuStyles;
document.head.appendChild(styleSheet);
