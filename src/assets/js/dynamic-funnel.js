/**
 * Dynamic Funnel Logic System
 * Adapts user experience based on behavior and context
 */

class DynamicFunnel {
    constructor() {
        this.userProfile = this.loadUserProfile();
        this.behavioralData = {
            scrollDepth: 0,
            timeOnPage: 0,
            ctaClicks: 0,
            formInteractions: 0,
            pricingViews: 0,
            returningUser: this.isReturningUser(),
            deviceType: this.getDeviceType(),
            language: this.getLanguage(),
            timeOfDay: this.getTimeOfDay(),
            urgencyLevel: 'normal'
        };
        this.adaptiveElements = new Map();
        this.init();
    }

    init() {
        this.setupBehaviorTracking();
        this.setupAdaptiveContent();
        this.setupUrgencyLogic();
        this.setupPersonalizationEngine();
        this.setupExitIntent();
        this.startBehaviorAnalysis();
    }

    // Track user behavior for personalization
    setupBehaviorTracking() {
        let startTime = Date.now();
        let lastScrollPosition = 0;
        let pricingViewStart = null;

        // Scroll tracking
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = Math.round((currentScroll / scrollHeight) * 100);
            
            this.behavioralData.scrollDepth = Math.max(this.behavioralData.scrollDepth, scrollPercent);
            
            // Trigger adaptive content based on scroll depth
            if (scrollPercent >= 70 && !this.behavioralData.triggeredDeepScroll) {
                this.behavioralData.triggeredDeepScroll = true;
                this.triggerDeepScrollResponse();
            }
        });

        // Time tracking
        setInterval(() => {
            this.behavioralData.timeOnPage = Date.now() - startTime;
            
            // Trigger time-based adaptations
            if (this.behavioralData.timeOnPage > 60000 && !this.behavioralData.triggeredMinuteMark) {
                this.behavioralData.triggeredMinuteMark = true;
                this.triggerMinuteMarkResponse();
            }
        }, 5000);

        // Pricing section tracking
        const pricingSection = document.querySelector('[data-pricing-section]');
        if (pricingSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !pricingViewStart) {
                        pricingViewStart = Date.now();
                        this.behavioralData.pricingViews++;
                    } else if (!entry.isIntersecting && pricingViewStart) {
                        const viewDuration = Date.now() - pricingViewStart;
                        this.analyzePricingBehavior(viewDuration);
                        pricingViewStart = null;
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(pricingSection);
        }
    }

    // Setup adaptive content system
    setupAdaptiveContent() {
        // User intent-based content adaptation
        this.adaptToUserIntent();
        
        // Device-specific optimizations
        this.adaptToDevice();
        
        // Language-specific tone adjustment
        this.adaptToLanguage();
        
        // Time-based urgency
        this.adaptToTime();
    }

    adaptToUserIntent() {
        if (this.behavioralData.returningUser) {
            // Returning user - show testimonials and reduce educational content
            this.showElement('[data-returning-user]');
            this.hideElement('[data-new-user]');
            this.updateCTAText('احجز الآن', 'Book Now');
        } else {
            // New user - show educational content and gentle CTA
            this.showElement('[data-new-user]');
            this.hideElement('[data-returning-user]');
            this.updateCTAText('اكتشف كيف يعمل', 'Discover How It Works');
        }
    }

    adaptToDevice() {
        if (this.behavioralData.deviceType === 'mobile') {
            // Mobile optimizations
            this.addStickyCTA();
            this.enableMultiStepForms();
            this.optimizeImagesForMobile();
        } else {
            // Desktop optimizations
            this.showHorizontalPricing();
            this.enableAdvancedAnimations();
        }
    }

    adaptToLanguage() {
        if (this.behavioralData.language === 'ar') {
            // Arabic tone - more emotional and motivational
            this.adjustTone('emotional');
            this.updateHeadline('حوّل حياتك اليوم', 'Transform Your Life Today');
        } else {
            // English tone - more direct and practical
            this.adjustTone('practical');
            this.updateHeadline('Start Your Transformation', 'Start Your Transformation');
        }
    }

    adaptToTime() {
        const hour = new Date().getHours();
        
        if (hour >= 18 || hour <= 6) {
            // Evening/Night - add urgency
            this.behavioralData.urgencyLevel = 'high';
            this.showUrgencyMessage('العرض ينتهي خلال 24 ساعة', 'Offer ends in 24 hours');
        } else if (hour >= 12 && hour <= 17) {
            // Afternoon - moderate urgency
            this.behavioralData.urgencyLevel = 'medium';
            this.showUrgencyMessage('باقي 48 ساعة', '48 hours left');
        }
    }

    // Urgency logic system
    setupUrgencyLogic() {
        this.startCountdown();
        this.setupStockUrgency();
        this.setupSocialProofUrgency();
    }

    startCountdown() {
        const countdownElements = document.querySelectorAll('[data-countdown]');
        
        countdownElements.forEach(element => {
            const endTime = this.getEndTime();
            this.updateCountdown(element, endTime);
            
            setInterval(() => {
                this.updateCountdown(element, endTime);
            }, 1000);
        });
    }

    getEndTime() {
        // Set countdown to 48 hours from now
        const now = new Date();
        const endTime = new Date(now.getTime() + (48 * 60 * 60 * 1000));
        return endTime;
    }

    updateCountdown(element, endTime) {
        const now = new Date();
        const timeLeft = endTime - now;
        
        if (timeLeft <= 0) {
            element.textContent = this.behavioralData.language === 'ar' ? 'انتهى العرض' : 'Offer Ended';
            return;
        }
        
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        
        const timeText = this.behavioralData.language === 'ar' 
            ? `باقي ${hours} ساعة و ${minutes} دقيقة`
            : `${hours}h ${minutes}m left`;
            
        element.textContent = timeText;
    }

    // Personalization engine
    setupPersonalizationEngine() {
        this.analyzeUserPattern();
        this.setupDynamicPricing();
        this.setupSmartRecommendations();
    }

    analyzeUserPattern() {
        // Analyze user behavior pattern every 10 seconds
        setInterval(() => {
            const pattern = this.detectUserPattern();
            this.applyPersonalization(pattern);
        }, 10000);
    }

    detectUserPattern() {
        const { scrollDepth, timeOnPage, ctaClicks, formInteractions } = this.behavioralData;
        
        if (scrollDepth > 80 && timeOnPage > 120000) {
            return 'highly_interested';
        } else if (scrollDepth > 50 || formInteractions > 3) {
            return 'interested';
        } else if (timeOnPage > 60000) {
            return 'curious';
        } else {
            return 'browsing';
        }
    }

    applyPersonalization(pattern) {
        switch (pattern) {
            case 'highly_interested':
                this.showFinalCTA();
                this.displayTestimonial('powerful');
                this.showUrgencyMessage('آخر 6 ساعات', 'Last 6 hours');
                break;
            case 'interested':
                this.showComparisonTable();
                this.displayTestimonial('relevant');
                break;
            case 'curious':
                this.showFAQ();
                this.displayTestimonial('educational');
                break;
            case 'browsing':
                this.showHeroVideo();
                this.displayTestimonial('inspirational');
                break;
        }
    }

    // Exit intent detection
    setupExitIntent() {
        let mouseLeaveTimer;
        
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0) {
                // Mouse is leaving from top
                mouseLeaveTimer = setTimeout(() => {
                    this.showExitIntentPopup();
                }, 500);
            }
        });

        document.addEventListener('mouseenter', () => {
            clearTimeout(mouseLeaveTimer);
        });
    }

    showExitIntentPopup() {
        if (this.behavioralData.exitIntentShown) return;
        
        this.behavioralData.exitIntentShown = true;
        
        const popup = document.createElement('div');
        popup.className = 'exit-intent-popup';
        popup.innerHTML = `
            <div class="popup-content">
                <h3>${this.behavioralData.language === 'ar' ? 'هل تحتاج مساعدة؟' : 'Need Help?'}</h3>
                <p>${this.behavioralData.language === 'ar' ? 'يمكننا مساعدتك في اختيار الباقة المناسبة' : 'We can help you choose the right package'}</p>
                <button class="btn--primary" onclick="this.closest('.exit-intent-popup').remove()">
                    ${this.behavioralData.language === 'ar' ? 'تحدث مع خبير' : 'Talk to Expert'}
                </button>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Track exit intent
        this.trackEvent('exit_intent', {
            scrollDepth: this.behavioralData.scrollDepth,
            timeOnPage: this.behavioralData.timeOnPage
        });
    }

    // Package selection adaptation
    setupDynamicPricing() {
        const packageButtons = document.querySelectorAll('[data-package]');
        
        packageButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const packageType = button.dataset.package;
                this.adaptToPackageSelection(packageType);
            });
        });
    }

    adaptToPackageSelection(packageType) {
        switch (packageType) {
            case 'basic':
                this.simplifyForm();
                this.showQuickCheckout();
                break;
            case 'pro':
                this.showStandardForm();
                this.displayPersonalizedMessage('سيتم التواصل معك خلال 24 ساعة', 'We will contact you within 24 hours');
                break;
            case 'premium':
                this.showPremiumForm();
                this.displayPersonalizedMessage('سيقوم خبير بالتواصل معك شخصياً', 'An expert will personally contact you');
                break;
        }
        
        this.trackEvent('package_selected', { packageType });
    }

    // Utility methods
    isReturningUser() {
        try {
            return localStorage.getItem('waeid_returning_user') === 'true';
        } catch {
            return false;
        }
    }

    getDeviceType() {
        return window.innerWidth <= 768 ? 'mobile' : 'desktop';
    }

    getLanguage() {
        return document.documentElement.getAttribute('lang') || 'ar';
    }

    getTimeOfDay() {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 18) return 'afternoon';
        return 'evening';
    }

    loadUserProfile() {
        try {
            const stored = localStorage.getItem('waeid_user_profile');
            return stored ? JSON.parse(stored) : {};
        } catch {
            return {};
        }
    }

    showElement(selector) {
        const element = document.querySelector(selector);
        if (element) element.style.display = '';
    }

    hideElement(selector) {
        const element = document.querySelector(selector);
        if (element) element.style.display = 'none';
    }

    updateCTAText(arText, enText) {
        const ctaElements = document.querySelectorAll('[data-cta]');
        ctaElements.forEach(element => {
            element.textContent = this.behavioralData.language === 'ar' ? arText : enText;
        });
    }

    updateHeadline(arText, enText) {
        const headline = document.querySelector('[data-headline]');
        if (headline) {
            headline.textContent = this.behavioralData.language === 'ar' ? arText : enText;
        }
    }

    trackEvent(type, data) {
        // Send to analytics system
        if (window.FunnelAnalytics) {
            window.FunnelAnalytics.trackEvent(type, data);
        }
    }

    startBehaviorAnalysis() {
        // Continuous analysis of user behavior
        setInterval(() => {
            this.optimizeForConversion();
        }, 5000);
    }

    optimizeForConversion() {
        const conversionScore = this.calculateConversionScore();
        
        if (conversionScore > 80) {
            this.showFinalCTA();
        } else if (conversionScore > 60) {
            this.showSocialProof();
        } else if (conversionScore > 40) {
            this.showTestimonials();
        }
    }

    calculateConversionScore() {
        let score = 0;
        
        // Time on page (max 30 points)
        score += Math.min(30, this.behavioralData.timeOnPage / 4000);
        
        // Scroll depth (max 25 points)
        score += Math.min(25, this.behavioralData.scrollDepth / 4);
        
        // Form interactions (max 25 points)
        score += Math.min(25, this.behavioralData.formInteractions * 5);
        
        // Pricing views (max 20 points)
        score += Math.min(20, this.behavioralData.pricingViews * 10);
        
        return Math.round(score);
    }
}

// Initialize dynamic funnel system
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new DynamicFunnel());
} else {
    new DynamicFunnel();
}

// Export for potential module usage
window.DynamicFunnel = DynamicFunnel;
