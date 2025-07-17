// Sidebar Management
class SidebarManager {
    constructor() {
        this.isOpen = false;
        this.activeSubmenu = null;
        this.focusableElements = [];
        this.lastFocusedElement = null;
        this.init();
    }

    init() {
        try {
            this.bindEvents();
            this.setupAccessibility();
            this.initializeMenuState();
        } catch (error) {
            console.error('Sidebar initialization failed:', error);
        }
    }

    initializeMenuState() {
        // Ensure all submenus start closed
        const submenus = document.querySelectorAll('.submenu');
        submenus.forEach(submenu => {
            submenu.classList.remove('expanded');
            submenu.setAttribute('aria-hidden', 'true');
        });

        // Ensure all expandable items start collapsed
        const expandableItems = document.querySelectorAll('.menu-link.expandable');
        expandableItems.forEach(item => {
            item.classList.remove('expanded');
            item.setAttribute('aria-expanded', 'false');
        });
    }

    bindEvents() {
        // Quick access button
        const quickAccessBtn = document.getElementById('quick-access-btn');
        if (quickAccessBtn) {
            quickAccessBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleSidebar();
            });
        }

        // Close button
        const closeSidebarBtn = document.getElementById('close-sidebar');
        if (closeSidebarBtn) {
            closeSidebarBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeSidebar();
            });
        }

        // Overlay click
        const overlay = document.getElementById('sidebar-overlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeSidebar();
            });
        }

        // Expandable menu items
        const expandableItems = document.querySelectorAll('.menu-link.expandable');
        expandableItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleSubmenu(item);
            });

            // Keyboard support for expandable items
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleSubmenu(item);
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.openSubmenu(item);
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.closeSubmenu(item);
                }
            });
        });

        // Regular menu item clicks
        const menuLinks = document.querySelectorAll('.menu-link[data-page]:not(.expandable)');
        menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const page = link.getAttribute('data-page');
                this.handleMenuClick(page, link);
            });

            // Keyboard support
            link.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    const page = link.getAttribute('data-page');
                    this.handleMenuClick(page, link);
                }
            });
        });

        // Submenu item clicks
        const submenuLinks = document.querySelectorAll('.submenu a[data-page]');
        submenuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const page = link.getAttribute('data-page');
                this.handleMenuClick(page, link);
            });

            // Keyboard support
            link.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    const page = link.getAttribute('data-page');
                    this.handleMenuClick(page, link);
                }
            });
        });

        // Global keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                e.preventDefault();
                this.closeSidebar();
            }
        });

        // Window resize handling
        window.addEventListener('resize', this.debounce(() => {
            if (window.innerWidth >= 1024 && this.isOpen) {
                this.closeSidebar();
            }
        }, 250));

        // Prevent sidebar from closing when clicking inside it
        const sidebar = document.getElementById('quick-access-sidebar');
        if (sidebar) {
            sidebar.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    setupAccessibility() {
        const sidebar = document.getElementById('quick-access-sidebar');
        if (sidebar) {
            sidebar.setAttribute('role', 'navigation');
            sidebar.setAttribute('aria-label', 'Quick Access Menu');
            sidebar.setAttribute('aria-hidden', 'true');
        }

        // Setup expandable menu items
        const expandableItems = document.querySelectorAll('.menu-link.expandable');
        expandableItems.forEach(item => {
            item.setAttribute('role', 'button');
            item.setAttribute('tabindex', '0');
            item.setAttribute('aria-expanded', 'false');
            
            const submenuId = item.getAttribute('data-submenu');
            if (submenuId) {
                const submenuElement = document.getElementById(submenuId + '-submenu');
                if (submenuElement) {
                    item.setAttribute('aria-controls', submenuId + '-submenu');
                    submenuElement.setAttribute('role', 'menu');
                    submenuElement.setAttribute('aria-hidden', 'true');
                    
                    // Setup submenu items
                    const submenuItems = submenuElement.querySelectorAll('a');
                    submenuItems.forEach(submenuItem => {
                        submenuItem.setAttribute('role', 'menuitem');
                        submenuItem.setAttribute('tabindex', '-1');
                    });
                }
            }
        });

        // Setup regular menu items
        const regularMenuItems = document.querySelectorAll('.menu-link[data-page]:not(.expandable)');
        regularMenuItems.forEach(item => {
            item.setAttribute('role', 'menuitem');
            item.setAttribute('tabindex', '0');
        });
    }

    toggleSidebar() {
        if (this.isOpen) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }

    openSidebar() {
        const sidebar = document.getElementById('quick-access-sidebar');
        const overlay = document.getElementById('sidebar-overlay');

        if (!sidebar || !overlay) {
            console.error('Sidebar elements not found');
            return;
        }

        try {
            // Store the currently focused element
            this.lastFocusedElement = document.activeElement;

            // Show sidebar and overlay
            sidebar.classList.add('open');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.isOpen = true;

            // Update ARIA attributes
            sidebar.setAttribute('aria-hidden', 'false');

            // Update focusable elements
            this.updateFocusableElements();

            // Focus the first focusable element
            setTimeout(() => {
                const firstFocusable = this.focusableElements[0];
                if (firstFocusable) {
                    firstFocusable.focus();
                }
            }, 100);

            // Setup focus trap
            this.setupFocusTrap();

        } catch (error) {
            console.error('Error opening sidebar:', error);
            this.isOpen = false;
        }
    }

    closeSidebar() {
        const sidebar = document.getElementById('quick-access-sidebar');
        const overlay = document.getElementById('sidebar-overlay');

        if (!sidebar || !overlay) return;

        try {
            // Hide sidebar and overlay
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            this.isOpen = false;

            // Update ARIA attributes
            sidebar.setAttribute('aria-hidden', 'true');

            // Close all submenus
            this.closeAllSubmenus();

            // Return focus to the element that opened the sidebar
            if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function') {
                setTimeout(() => {
                    this.lastFocusedElement.focus();
                }, 100);
            }

            // Clear focus trap
            this.clearFocusTrap();

        } catch (error) {
            console.error('Error closing sidebar:', error);
        }
    }

    updateFocusableElements() {
        const sidebar = document.getElementById('quick-access-sidebar');
        if (!sidebar) return;

        this.focusableElements = Array.from(sidebar.querySelectorAll(
            'button:not([disabled]), [href]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
        )).filter(el => {
            // Only include visible elements
            return el.offsetParent !== null && !el.hasAttribute('aria-hidden');
        });
    }

    setupFocusTrap() {
        const sidebar = document.getElementById('quick-access-sidebar');
        if (!sidebar) return;

        this.focusTrapHandler = (e) => {
            if (!this.isOpen) return;

            this.updateFocusableElements(); // Update in case DOM changed

            if (this.focusableElements.length === 0) return;

            const firstFocusable = this.focusableElements[0];
            const lastFocusable = this.focusableElements[this.focusableElements.length - 1];

            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }

            // Arrow key navigation
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                const currentIndex = this.focusableElements.indexOf(document.activeElement);
                if (currentIndex !== -1) {
                    e.preventDefault();
                    let nextIndex = e.key === 'ArrowDown' ? currentIndex + 1 : currentIndex - 1;
                    if (nextIndex < 0) nextIndex = this.focusableElements.length - 1;
                    if (nextIndex >= this.focusableElements.length) nextIndex = 0;
                    this.focusableElements[nextIndex].focus();
                }
            }
        };

        sidebar.addEventListener('keydown', this.focusTrapHandler);
    }

    clearFocusTrap() {
        const sidebar = document.getElementById('quick-access-sidebar');
        if (sidebar && this.focusTrapHandler) {
            sidebar.removeEventListener('keydown', this.focusTrapHandler);
            this.focusTrapHandler = null;
        }
    }

    toggleSubmenu(menuItem) {
        const submenuId = menuItem.getAttribute('data-submenu');
        if (!submenuId) return;

        const submenu = document.getElementById(submenuId + '-submenu');
        if (!submenu) return;

        const isExpanded = submenu.classList.contains('expanded');

        if (isExpanded) {
            this.closeSubmenu(menuItem);
        } else {
            this.openSubmenu(menuItem);
        }
    }

    openSubmenu(menuItem) {
        const submenuId = menuItem.getAttribute('data-submenu');
        if (!submenuId) return;

        const submenu = document.getElementById(submenuId + '-submenu');
        if (!submenu) return;

        try {
            // Close other submenus first
            this.closeAllSubmenus();

            // Open this submenu
            submenu.classList.add('expanded');
            submenu.setAttribute('aria-hidden', 'false');
            menuItem.classList.add('expanded');
            menuItem.setAttribute('aria-expanded', 'true');

            // Update active submenu
            this.activeSubmenu = submenuId;

            // Update focusable elements
            this.updateFocusableElements();

            // Make submenu items focusable
            const submenuItems = submenu.querySelectorAll('a');
            submenuItems.forEach(item => {
                item.setAttribute('tabindex', '0');
            });

        } catch (error) {
            console.error('Error opening submenu:', error);
        }
    }

    closeSubmenu(menuItem) {
        const submenuId = menuItem.getAttribute('data-submenu');
        if (!submenuId) return;

        const submenu = document.getElementById(submenuId + '-submenu');
        if (!submenu) return;

        try {
            submenu.classList.remove('expanded');
            submenu.setAttribute('aria-hidden', 'true');
            menuItem.classList.remove('expanded');
            menuItem.setAttribute('aria-expanded', 'false');

            // Make submenu items non-focusable
            const submenuItems = submenu.querySelectorAll('a');
            submenuItems.forEach(item => {
                item.setAttribute('tabindex', '-1');
            });

            // Clear active submenu if this was it
            if (this.activeSubmenu === submenuId) {
                this.activeSubmenu = null;
            }

            // Update focusable elements
            this.updateFocusableElements();

        } catch (error) {
            console.error('Error closing submenu:', error);
        }
    }

    closeAllSubmenus() {
        try {
            const expandedMenus = document.querySelectorAll('.menu-link.expanded');
            const expandedSubmenus = document.querySelectorAll('.submenu.expanded');

            expandedMenus.forEach(menu => {
                menu.classList.remove('expanded');
                menu.setAttribute('aria-expanded', 'false');
            });

            expandedSubmenus.forEach(submenu => {
                submenu.classList.remove('expanded');
                submenu.setAttribute('aria-hidden', 'true');

                // Make submenu items non-focusable
                const submenuItems = submenu.querySelectorAll('a');
                submenuItems.forEach(item => {
                    item.setAttribute('tabindex', '-1');
                });
            });

            this.activeSubmenu = null;
            this.updateFocusableElements();

        } catch (error) {
            console.error('Error closing all submenus:', error);
        }
    }

    handleMenuClick(page, clickedElement) {
        if (!page) return;

        try {
            console.log('Navigating to page:', page);
            
            // Update active menu item
            this.updateActiveMenuItem(page, clickedElement);
            
            // Handle home navigation
            if (page === 'home') {
                this.loadHomePage();
            } else {
                // Load other pages
                if (window.pageManager) {
                    window.pageManager.loadPage(page);
                } else if (window.mengoApp && window.mengoApp.getComponent('pageManager')) {
                    window.mengoApp.getComponent('pageManager').loadPage(page);
                } else {
                    // Fallback: trigger page load event
                    document.dispatchEvent(new CustomEvent('pageLoad', {
                        detail: { page: page }
                    }));
                }
            }
            
            // Close sidebar on mobile after navigation
            if (window.innerWidth < 1024) {
                setTimeout(() => {
                    this.closeSidebar();
                }, 150);
            }
            
        } catch (error) {
            console.error('Menu click handling error:', error);
        }
    }

    loadHomePage() {
        try {
            // Show default home content
            const pageContent = document.getElementById('page-content');
            if (pageContent) {
                pageContent.innerHTML = `
                    <section class="home-content">
                        <div class="container">
                            <div class="content-grid">
                                <div class="main-content-area">
                                    <article class="welcome-section">
                                        <h2>Welcome to Mengo Senior School</h2>
                                        <p class="lead">For over 130 years, Mengo Senior School has stood as a pillar of educational excellence in Uganda, nurturing young minds and shaping future leaders.</p>
                                        
                                        <div class="highlights-grid">
                                            <div class="highlight-card">
                                                <div class="highlight-icon">
                                                    <i data-lucide="award"></i>
                                                </div>
                                                <h3>Academic Excellence</h3>
                                                <p>Consistently ranked among Uganda's top secondary schools with outstanding national examination results.</p>
                                            </div>
                                            
                                            <div class="highlight-card">
                                                <div class="highlight-icon">
                                                    <i data-lucide="users"></i>
                                                </div>
                                                <h3>Holistic Development</h3>
                                                <p>Comprehensive programs in academics, sports, arts, and leadership development.</p>
                                            </div>
                                            
                                            <div class="highlight-card">
                                                <div class="highlight-icon">
                                                    <i data-lucide="globe"></i>
                                                </div>
                                                <h3>Global Network</h3>
                                                <p>Alumni network spanning across continents, creating opportunities for current students.</p>
                                            </div>
                                        </div>
                                    </article>
                                </div>
                                
                                <aside class="sidebar-content">
                                    <div class="news-widget">
                                        <h3>Latest News</h3>
                                        <div class="news-item">
                                            <time>Dec 15, 2024</time>
                                            <h4>UNEB Results Excellence</h4>
                                            <p>Mengo SS achieves 98% pass rate in national examinations.</p>
                                        </div>
                                        <div class="news-item">
                                            <time>Dec 10, 2024</time>
                                            <h4>New Science Laboratory</h4>
                                            <p>State-of-the-art physics lab officially opened.</p>
                                        </div>
                                        <div class="news-item">
                                            <time>Dec 5, 2024</time>
                                            <h4>Alumni Achievement</h4>
                                            <p>Former student appointed as Minister of Education.</p>
                                        </div>
                                    </div>
                                    
                                    <div class="quick-links-widget">
                                        <h3>Quick Links</h3>
                                        <ul>
                                            <li><a href="#admissions">Admissions</a></li>
                                            <li><a href="#calendar">Academic Calendar</a></li>
                                            <li><a href="#fees">Fee Structure</a></li>
                                            <li><a href="#transport">Transport</a></li>
                                            <li><a href="#uniform">School Uniform</a></li>
                                        </ul>
                                    </div>
                                </aside>
                            </div>
                        </div>
                    </section>
                `;
                
                // Initialize Lucide icons
                if (window.lucide) {
                    lucide.createIcons();
                }
            }
            
            // Update page title
            document.title = 'Mengo Senior School - Excellence in Education Since 1895';
            
            // Clear URL hash
            if (window.history && window.history.pushState) {
                window.history.pushState({}, '', window.location.pathname);
            }
        } catch (error) {
            console.error('Home page loading error:', error);
        }
    }

    updateActiveMenuItem(page, clickedElement) {
        try {
            // Remove active class from all menu items
            const menuItems = document.querySelectorAll('.menu-link, .submenu a');
            menuItems.forEach(item => {
                item.classList.remove('active');
            });

            // Add active class to clicked element or find by page
            if (clickedElement) {
                clickedElement.classList.add('active');
            } else {
                const activeItem = document.querySelector(`.menu-link[data-page="${page}"], .submenu a[data-page="${page}"]`);
                if (activeItem) {
                    activeItem.classList.add('active');
                }
            }
        } catch (error) {
            console.error('Active menu item update error:', error);
        }
    }

    // Utility function
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

    // Public methods
    getIsOpen() {
        return this.isOpen;
    }

    close() {
        this.closeSidebar();
    }

    open() {
        this.openSidebar();
    }

    getActiveSubmenu() {
        return this.activeSubmenu;
    }

    // Cleanup method
    destroy() {
        try {
            this.clearFocusTrap();
            this.closeSidebar();
            this.isOpen = false;
            this.activeSubmenu = null;
            this.focusableElements = [];
            this.lastFocusedElement = null;
        } catch (error) {
            console.error('Sidebar cleanup error:', error);
        }
    }
}

// Initialize sidebar manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.sidebarManager = new SidebarManager();
    } catch (error) {
        console.error('Failed to initialize sidebar manager:', error);
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.sidebarManager) {
        window.sidebarManager.destroy();
    }
});

// Export for use in other modules
window.SidebarManager = SidebarManager;