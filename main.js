// Main Application Controller
class MengoApp {
    constructor() {
        this.isInitialized = false;
        this.components = {};
        this.init();
    }

    async init() {
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            // Initialize core components
            await this.initializeComponents();
            
            // Set up global event listeners
            this.setupGlobalEvents();
            
            // Initialize authentication system
            this.initializeAuth();
            
            // Mark as initialized
            this.isInitialized = true;
            
            console.log('Mengo Senior School platform initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize Mengo app:', error);
        }
    }

    async initializeComponents() {
        // Initialize slideshow manager
        if (window.SlideshowManager) {
            this.components.slideshow = new SlideshowManager();
        }

        // Initialize sidebar manager
        if (window.SidebarManager) {
            this.components.sidebar = new SidebarManager();
        }

        // Initialize page manager
        if (window.PageManager) {
            this.components.pageManager = new PageManager();
        }

        // Initialize security manager
        if (window.SecurityManager) {
            this.components.security = new SecurityManager();
        }
    }

    initializeAuth() {
        // Initialize enhanced authentication system
        if (window.EnhancedAuthSystem) {
            this.components.auth = new EnhancedAuthSystem();
            window.enhancedAuthSystem = this.components.auth;
        }
    }

    setupGlobalEvents() {
        // Handle navigation clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const target = link.getAttribute('href').substring(1);
                this.handleNavigation(target);
            }
        });

        // Handle window resize
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Handle scroll events
        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
        }, 16));

        // Handle keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Handle online/offline status
        window.addEventListener('online', () => this.handleConnectionChange(true));
        window.addEventListener('offline', () => this.handleConnectionChange(false));
    }

    handleNavigation(target) {
        // Check if it's a page navigation
        const pages = ['administration', 'elibrary', 'physics-sim', 'ewriters', 'parents', 'archive', 'mosa'];
        
        if (pages.includes(target)) {
            if (this.components.pageManager) {
                this.components.pageManager.loadPage(target);
            }
        } else {
            // Handle anchor navigation
            const element = document.getElementById(target);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    handleResize() {
        // Close sidebar on desktop
        if (window.innerWidth >= 1024 && this.components.sidebar) {
            this.components.sidebar.close();
        }

        // Update slideshow dimensions if needed
        if (this.components.slideshow) {
            // Slideshow handles its own responsive behavior
        }
    }

    handleScroll() {
        // Add scroll-based effects here if needed
        const scrollY = window.scrollY;
        
        // Example: Add shadow to header on scroll
        const header = document.querySelector('.header');
        if (header) {
            if (scrollY > 10) {
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
            }
        }
    }

    handleKeyboardShortcuts(e) {
        // Global keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'k':
                    e.preventDefault();
                    this.focusSearch();
                    break;
                case 'm':
                    e.preventDefault();
                    if (this.components.sidebar) {
                        this.components.sidebar.toggleSidebar();
                    }
                    break;
            }
        }

        // Escape key handling
        if (e.key === 'Escape') {
            // Close any open modals or sidebars
            if (this.components.sidebar && this.components.sidebar.isOpen) {
                this.components.sidebar.close();
            }
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden - pause any animations or timers
            if (this.components.slideshow) {
                this.components.slideshow.pause();
            }
        } else {
            // Page is visible - resume animations
            if (this.components.slideshow) {
                this.components.slideshow.resume();
            }
        }
    }

    handleConnectionChange(isOnline) {
        // Show connection status
        this.showNotification(
            isOnline ? 'Connection restored' : 'You are offline',
            isOnline ? 'success' : 'warning'
        );

        // Update UI based on connection status
        document.body.classList.toggle('offline', !isOnline);
    }

    focusSearch() {
        // Focus the first search input found
        const searchInput = document.querySelector('input[type="text"][placeholder*="search" i], input[type="search"]');
        if (searchInput) {
            searchInput.focus();
        }
    }

    showNotification(message, type = 'info') {
        // Use the auth system's notification method if available
        if (this.components.auth && this.components.auth.showNotification) {
            this.components.auth.showNotification(message, type);
        } else {
            // Fallback notification
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    // Utility functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Public API methods
    getComponent(name) {
        return this.components[name];
    }

    isReady() {
        return this.isInitialized;
    }

    // Performance monitoring
    measurePerformance() {
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
            
            console.log('Performance Metrics:', {
                loadTime: `${loadTime}ms`,
                domReady: `${domReady}ms`,
                ready: this.isInitialized
            });
        }
    }
}

// Initialize the application
const mengoApp = new MengoApp();

// Make it globally available
window.mengoApp = mengoApp;

// Performance monitoring
window.addEventListener('load', () => {
    setTimeout(() => {
        mengoApp.measurePerformance();
    }, 100);
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MengoApp;
}