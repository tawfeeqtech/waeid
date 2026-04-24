/**
 * Salla Funnel Analytics System
 * Tracks user behavior for conversion optimization
 */

class FunnelAnalytics {
    constructor() {
        this.events = [];
        this.sessionStart = Date.now();
        this.scrollDepth = 0;
        this.ctaClicks = 0;
        this.formInteractions = 0;
        this.priceViewTime = 0;
        this.currentSection = 'hero';
        this.init();
    }

    init() {
        this.setupScrollTracking();
        this.setupCTATracking();
        this.setupFormTracking();
        this.setupPriceTracking();
        this.setupSessionTracking();
        this.setupABTesting();
    }

    // Track scroll depth for engagement analysis
    setupScrollTracking() {
        let maxScroll = 0;
        const scrollThresholds = [25, 50, 75, 90];

        window.addEventListener('scroll', () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const currentScroll = window.scrollY;
            const scrollPercent = Math.round((currentScroll / scrollHeight) * 100);

            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                this.scrollDepth = scrollPercent;

                // Track milestone scrolls
                scrollThresholds.forEach(threshold => {
                    if (scrollPercent >= threshold && !this.events.find(e => e.type === 'scroll' && e.data.threshold === threshold)) {
                        this.trackEvent('scroll', { 
                            threshold, 
                            section: this.getCurrentSection(),
                            timeSpent: Date.now() - this.sessionStart 
                        });
                    }
                });
            }

            // Track section viewing
            this.updateCurrentSection();
        });
    }

    // Track CTA button interactions
    setupCTATracking() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-cta], .btn--primary, .btn--outline-primary');
            if (target) {
                this.ctaClicks++;
                this.trackEvent('cta_click', {
                    buttonText: target.textContent.trim(),
                    buttonType: this.getButtonType(target),
                    section: this.getCurrentSection(),
                    scrollDepth: this.scrollDepth,
                    timeSpent: Date.now() - this.sessionStart
                });
            }
        });
    }

    // Track form interactions for pre-qualification analysis
    setupFormTracking() {
        const forms = document.querySelectorAll('form[data-funnel-form]');
        
        forms.forEach(form => {
            let formStartTime = null;
            let fieldInteractions = 0;

            // Track form start
            form.addEventListener('focusin', () => {
                if (!formStartTime) {
                    formStartTime = Date.now();
                    this.trackEvent('form_start', {
                        formType: form.dataset.funnelForm || 'unknown',
                        section: this.getCurrentSection()
                    });
                }
            });

            // Track field interactions
            form.addEventListener('input', () => {
                fieldInteractions++;
                this.formInteractions++;
            });

            // Track form submission
            form.addEventListener('submit', (e) => {
                const completionTime = formStartTime ? Date.now() - formStartTime : 0;
                this.trackEvent('form_submit', {
                    formType: form.dataset.funnelForm || 'unknown',
                    completionTime,
                    fieldInteractions,
                    section: this.getCurrentSection()
                });
            });

            // Track form abandonment
            window.addEventListener('beforeunload', () => {
                if (formStartTime && !form.dataset.submitted) {
                    this.trackEvent('form_abandon', {
                        formType: form.dataset.funnelForm || 'unknown',
                        timeSpent: Date.now() - formStartTime,
                        fieldInteractions,
                        section: this.getCurrentSection()
                    });
                }
            });
        });
    }

    // Track pricing section engagement
    setupPriceTracking() {
        const priceSections = document.querySelectorAll('[data-pricing-section]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!entry.target.dataset.viewStartTime) {
                        entry.target.dataset.viewStartTime = Date.now();
                        this.trackEvent('pricing_view_start', {
                            section: this.getCurrentSection()
                        });
                    }
                } else {
                    if (entry.target.dataset.viewStartTime) {
                        const viewTime = Date.now() - parseInt(entry.target.dataset.viewStartTime);
                        this.priceViewTime += viewTime;
                        this.trackEvent('pricing_view_end', {
                            viewTime,
                            section: this.getCurrentSection()
                        });
                        delete entry.target.dataset.viewStartTime;
                    }
                }
            });
        }, { threshold: 0.5 });

        priceSections.forEach(section => observer.observe(section));
    }

    // Track overall session metrics
    setupSessionTracking() {
        // Track page load
        window.addEventListener('load', () => {
            this.trackEvent('page_load', {
                loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
                userAgent: navigator.userAgent,
                isMobile: this.isMobile()
            });
        });

        // Track session end
        window.addEventListener('beforeunload', () => {
            this.trackEvent('session_end', {
                duration: Date.now() - this.sessionStart,
                scrollDepth: this.scrollDepth,
                ctaClicks: this.ctaClicks,
                formInteractions: this.formInteractions,
                priceViewTime: this.priceViewTime
            });
        });

        // Track visibility changes (user leaving/returning)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.trackEvent('session_pause', {
                    duration: Date.now() - this.sessionStart,
                    section: this.getCurrentSection()
                });
            } else {
                this.trackEvent('session_resume', {
                    section: this.getCurrentSection()
                });
            }
        });
    }

    // A/B Testing integration
    setupABTesting() {
        // Check for A/B test variants
        const variant = this.getABTestVariant();
        if (variant) {
            this.trackEvent('ab_test_start', {
                testName: variant.test,
                variant: variant.variant
            });
        }
    }

    // Utility methods
    getCurrentSection() {
        const sections = document.querySelectorAll('[data-section]');
        const scrollPosition = window.scrollY + window.innerHeight / 2;

        for (let section of sections) {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
                return section.dataset.section;
            }
        }

        return 'unknown';
    }

    getButtonType(button) {
        if (button.classList.contains('btn--primary')) return 'primary';
        if (button.classList.contains('btn--outline-primary')) return 'outline';
        if (button.classList.contains('btn--secondary')) return 'secondary';
        return 'unknown';
    }

    isMobile() {
        return window.innerWidth <= 768;
    }

    getABTestVariant() {
        // Check for A/B test cookies or URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const testParam = urlParams.get('ab_test');
        
        if (testParam) {
            const [testName, variant] = testParam.split(':');
            return { test: testName, variant };
        }

        // Check for stored variant
        try {
            const stored = localStorage.getItem('ab_test_variant');
            if (stored) {
                return JSON.parse(stored);
            }
        } catch {
            // Silently fail
        }

        return null;
    }

    trackEvent(type, data = {}) {
        const event = {
            type,
            data,
            timestamp: Date.now(),
            sessionId: this.getSessionId(),
            url: window.location.href
        };

        this.events.push(event);

        // Send to analytics (placeholder for actual implementation)
        this.sendToAnalytics(event);

        // Console log for development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('Funnel Event:', event);
        }
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('funnel_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('funnel_session_id', sessionId);
        }
        return sessionId;
    }

    sendToAnalytics(event) {
        // Placeholder for actual analytics integration
        // This would send to Google Analytics, Meta Pixel, etc.
        
        // Example Google Analytics 4 event
        if (typeof gtag !== 'undefined') {
            gtag('event', event.type, {
                custom_parameters: event.data
            });
        }

        // Example Meta Pixel event
        if (typeof fbq !== 'undefined') {
            fbq('trackCustom', event.type, event.data);
        }
    }

    // Public API for getting funnel metrics
    getMetrics() {
        return {
            sessionDuration: Date.now() - this.sessionStart,
            scrollDepth: this.scrollDepth,
            ctaClicks: this.ctaClicks,
            formInteractions: this.formInteractions,
            priceViewTime: this.priceViewTime,
            eventsCount: this.events.length,
            currentSection: this.getCurrentSection()
        };
    }
}

// Initialize analytics system
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new FunnelAnalytics());
} else {
    new FunnelAnalytics();
}

// Export for potential module usage
window.FunnelAnalytics = FunnelAnalytics;
