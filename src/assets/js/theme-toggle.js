/**
 * Dark Mode Toggle System
 * Supports user preference persistence and system theme detection
 */

class ThemeToggle {
    constructor() {
        this.storageKey = 'waeid-theme-preference';
        this.darkClass = 'data-theme';
        this.init();
    }

    init() {
        // Load saved theme or detect system preference
        const savedTheme = this.getSavedTheme();
        const systemTheme = this.getSystemTheme();
        const theme = savedTheme || systemTheme;
        
        this.setTheme(theme);
        this.createToggleButton();
        this.setupEventListeners();
    }

    getSavedTheme() {
        try {
            return localStorage.getItem(this.storageKey);
        } catch {
            return null;
        }
    }

    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    setTheme(theme) {
        const root = document.documentElement;
        
        if (theme === 'dark') {
            root.setAttribute(this.darkClass, 'dark');
        } else {
            root.removeAttribute(this.darkClass);
        }

        // Save preference
        try {
            localStorage.setItem(this.storageKey, theme);
        } catch {
            // Silently fail if localStorage is not available
        }

        // Update toggle button text
        this.updateToggleButton(theme);
        
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme } 
        }));
    }

    createToggleButton() {
        // Check if button already exists
        if (document.querySelector('.theme-toggle')) {
            return;
        }

        const button = document.createElement('button');
        button.className = 'theme-toggle';
        button.setAttribute('aria-label', 'Toggle dark mode');
        button.setAttribute('type', 'button');
        
        this.updateToggleButton(this.getCurrentTheme());
        
        // Insert at the beginning of body to ensure it's on top
        document.body.insertBefore(button, document.body.firstChild);
        
        // Add click handler
        button.addEventListener('click', () => this.toggleTheme());
    }

    getCurrentTheme() {
        return document.documentElement.hasAttribute(this.darkClass) ? 'dark' : 'light';
    }

    updateToggleButton(theme) {
        const button = document.querySelector('.theme-toggle');
        if (!button) return;

        const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
        const sunIcon = '☀️';
        const moonIcon = '🌙';
        
        if (theme === 'dark') {
            button.textContent = isRTL ? `${sunIcon} الوضع الفاتح` : `${sunIcon} Light Mode`;
        } else {
            button.textContent = isRTL ? `${moonIcon} الوضع الداكن` : `${moonIcon} Dark Mode`;
        }
    }

    toggleTheme() {
        const currentTheme = this.getCurrentTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    setupEventListeners() {
        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                // Only change if user hasn't set a preference
                if (!this.getSavedTheme()) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }

        // Listen for RTL changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && 
                    mutation.attributeName === 'dir') {
                    this.updateToggleButton(this.getCurrentTheme());
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['dir']
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ThemeToggle());
} else {
    new ThemeToggle();
}

// Export for potential module usage
window.ThemeToggle = ThemeToggle;
