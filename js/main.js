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
            this.showErrorMessage('Failed to initialize application. Please refresh the page.');
        }
    }

    async initializeComponents() {
        try {
            // Initialize security manager
            if (window.SecurityManager) {
                this.components.security = new SecurityManager();
            }

            // Initialize page manager (needs to be before sidebar)
            if (window.PageManager) {
                this.components.pageManager = new PageManager();
                window.pageManager = this.components.pageManager;
            }

            // Initialize sidebar manager (depends on pageManager)
            if (window.SidebarManager) {
                this.components.sidebar = new SidebarManager();
            }

            // Initialize slideshow manager
            if (window.SlideshowManager) {
                this.components.slideshow = new SlideshowManager();
            }
        } catch (error) {
            console.error('Component initialization failed:', error);
        }
    }

    initializeAuth() {
        try {
            // Initialize enhanced authentication system
            if (window.EnhancedAuthSystem) {
                this.components.auth = new EnhancedAuthSystem();
                window.enhancedAuthSystem = this.components.auth;
            }
        } catch (error) {
            console.error('Authentication system initialization failed:', error);
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

        // Handle unhandled errors
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            this.logError(e.error);
        });

        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            this.logError(e.reason);
        });
    }

    handleNavigation(target) {
        try {
            // Check if it's a page navigation
            const pages = ['home', 'administration', 'elibrary', 'physics-sim', 'ewriters', 'parents', 'archive', 'mosa'];
            
            if (pages.includes(target)) {
                if (this.components.pageManager) {
                    this.components.pageManager.loadPage(target);
                } else {
                    console.warn('PageManager not available for navigation to:', target);
                }
            } else {
                // Handle anchor navigation
                const element = document.getElementById(target);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                } else {
                    console.warn('Navigation target not found:', target);
                }
            }
        } catch (error) {
            console.error('Navigation error:', error);
        }
    }

    handleResize() {
        try {
            // Close sidebar on desktop
            if (window.innerWidth >= 1024 && this.components.sidebar) {
                this.components.sidebar.close();
            }

            // Update slideshow dimensions if needed
            if (this.components.slideshow) {
                // Slideshow handles its own responsive behavior
            }
        } catch (error) {
            console.error('Resize handling error:', error);
        }
    }

    handleScroll() {
        try {
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
        } catch (error) {
            console.error('Scroll handling error:', error);
        }
    }

    handleKeyboardShortcuts(e) {
        try {
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
        } catch (error) {
            console.error('Keyboard shortcut error:', error);
        }
    }

    handleVisibilityChange() {
        try {
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
        } catch (error) {
            console.error('Visibility change error:', error);
        }
    }

    handleConnectionChange(isOnline) {
        try {
            // Show connection status
            this.showNotification(
                isOnline ? 'Connection restored' : 'You are offline',
                isOnline ? 'success' : 'warning'
            );

            // Update UI based on connection status
            document.body.classList.toggle('offline', !isOnline);
        } catch (error) {
            console.error('Connection change error:', error);
        }
    }

    focusSearch() {
        try {
            // Focus the first search input found
            const searchInput = document.querySelector('input[type="text"][placeholder*="search" i], input[type="search"]');
            if (searchInput) {
                searchInput.focus();
            } else {
                // No search input found, silently return without error
                console.log('No search input found to focus');
            }
        } catch (error) {
            console.error('Search focus error:', error);
        }
    }

    showNotification(message, type = 'info') {
        try {
            // Use the auth system's notification method if available
            if (this.components.auth && this.components.auth.showNotification) {
                this.components.auth.showNotification(message, type);
            } else {
                // Fallback notification
                console.log(`${type.toUpperCase()}: ${message}`);
            }
        } catch (error) {
            console.error('Notification error:', error);
        }
    }

    showErrorMessage(message) {
        try {
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: #dc2626;
                color: white;
                padding: 1rem;
                text-align: center;
                z-index: 9999;
                font-weight: bold;
            `;
            errorDiv.textContent = message;
            document.body.appendChild(errorDiv);

            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.parentNode.removeChild(errorDiv);
                }
            }, 5000);
        } catch (error) {
            console.error('Error message display failed:', error);
        }
    }

    logError(error) {
        try {
            const errorLog = {
                timestamp: new Date().toISOString(),
                message: error.message || 'Unknown error',
                stack: error.stack || 'No stack trace',
                url: window.location.href,
                userAgent: navigator.userAgent
            };

            // Store error log
            const logs = JSON.parse(localStorage.getItem('error_logs') || '[]');
            logs.push(errorLog);
            
            // Keep only last 50 entries
            if (logs.length > 50) {
                logs.splice(0, logs.length - 50);
            }
            
            localStorage.setItem('error_logs', JSON.stringify(logs));
        } catch (logError) {
            console.error('Failed to log error:', logError);
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
        try {
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
        } catch (error) {
            console.error('Performance measurement error:', error);
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