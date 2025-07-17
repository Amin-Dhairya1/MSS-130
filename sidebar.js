// Sidebar Management
class SidebarManager {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupAccessibility();
    }

    bindEvents() {
        // Quick access button
        const quickAccessBtn = document.getElementById('quick-access-btn');
        if (quickAccessBtn) {
            quickAccessBtn.addEventListener('click', () => this.toggleSidebar());
        }

        // Close button
        const closeSidebarBtn = document.getElementById('close-sidebar');
        if (closeSidebarBtn) {
            closeSidebarBtn.addEventListener('click', () => this.closeSidebar());
        }

        // Overlay click
        const overlay = document.getElementById('sidebar-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.closeSidebar());
        }

        // Expandable menu items
        const expandableItems = document.querySelectorAll('.menu-link.expandable');
        expandableItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleSubmenu(item);
            });
        });

        // Menu item clicks
        const menuLinks = document.querySelectorAll('.menu-link[data-page]');
        menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.handleMenuClick(page);
            });
        });

        // Submenu item clicks
        const submenuLinks = document.querySelectorAll('.submenu a[data-page]');
        submenuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.handleMenuClick(page);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeSidebar();
            }
        });

        // Window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024 && this.isOpen) {
                this.closeSidebar();
            }
        });
    }

    setupAccessibility() {
        const sidebar = document.getElementById('quick-access-sidebar');
        if (sidebar) {
            sidebar.setAttribute('role', 'navigation');
            sidebar.setAttribute('aria-label', 'Quick Access Menu');
        }

        // Set up focus trap when sidebar is open
        this.setupFocusTrap();
    }

    setupFocusTrap() {
        const sidebar = document.getElementById('quick-access-sidebar');
        if (!sidebar) return;

        // Recalculate focusable elements each time
        const focusableElements = sidebar.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        sidebar.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;

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
            // Arrow key navigation between menu items
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                const items = Array.from(sidebar.querySelectorAll('.menu-link, .submenu a'));
                const currentIndex = items.indexOf(document.activeElement);
                if (currentIndex !== -1) {
                    let nextIndex = e.key === 'ArrowDown' ? currentIndex + 1 : currentIndex - 1;
                    if (nextIndex < 0) nextIndex = items.length - 1;
                    if (nextIndex >= items.length) nextIndex = 0;
                    items[nextIndex].focus();
                    e.preventDefault();
                }
            }
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

        if (sidebar && overlay) {
            sidebar.classList.add('open');
            overlay.classList.add('active');
            overlay.style.zIndex = '1001'; // Ensure overlay is above other content
            document.body.style.overflow = 'hidden';
            this.isOpen = true;

            // Focus the close button for accessibility
            const closeBtn = document.getElementById('close-sidebar');
            if (closeBtn) {
                setTimeout(() => closeBtn.focus(), 100);
            }

            // Update ARIA attributes
            sidebar.setAttribute('aria-hidden', 'false');

            // Re-setup focus trap (in case DOM changed)
            this.setupFocusTrap();
        }
    }

    closeSidebar() {
        const sidebar = document.getElementById('quick-access-sidebar');
        const overlay = document.getElementById('sidebar-overlay');

        if (sidebar && overlay) {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            this.isOpen = false;

            // Return focus to the quick access button
            const quickAccessBtn = document.getElementById('quick-access-btn');
            if (quickAccessBtn) {
                quickAccessBtn.focus();
            }

            // Update ARIA attributes
            sidebar.setAttribute('aria-hidden', 'true');
        }
    }

    toggleSubmenu(menuItem) {
        const submenuId = menuItem.getAttribute('data-submenu');
        const submenu = document.getElementById(submenuId + '-submenu');
        const expandIcon = menuItem.querySelector('.expand-icon');

        if (submenu && expandIcon) {
            const isExpanded = submenu.classList.contains('expanded');

            if (isExpanded) {
                submenu.classList.remove('expanded');
                submenu.setAttribute('aria-hidden', 'true');
                menuItem.classList.remove('expanded');
                menuItem.setAttribute('aria-expanded', 'false');
            } else {
                // Close other open submenus
                this.closeAllSubmenus();
                
                submenu.classList.add('expanded');
                submenu.setAttribute('aria-hidden', 'false');
                menuItem.classList.add('expanded');
                menuItem.setAttribute('aria-expanded', 'true');
                menuItem.setAttribute('aria-controls', submenuId + '-submenu');
            }
        }
    }

    closeAllSubmenus() {
        const expandedMenus = document.querySelectorAll('.menu-link.expanded');
        const expandedSubmenus = document.querySelectorAll('.submenu.expanded');

        expandedMenus.forEach(menu => {
            menu.classList.remove('expanded');
            menu.setAttribute('aria-expanded', 'false');
        });

        expandedSubmenus.forEach(submenu => {
            submenu.classList.remove('expanded');
        });
    }

    handleMenuClick(page) {
        console.log('Navigating to page:', page);
        
        // Handle home navigation
        if (page === 'home') {
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
        } else {
            // Load other pages
            if (window.pageManager) {
                window.pageManager.loadPage(page);
            } else {
                // Fallback: trigger page load event
                document.dispatchEvent(new CustomEvent('pageLoad', {
                    detail: { page: page }
                }));
            }
        }
        
        // Close sidebar on mobile after navigation
        if (window.innerWidth < 1024) {
            this.closeSidebar();
        }
        
        // Update active menu item
        this.updateActiveMenuItem(page);
    }

    loadHomePage() {
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
        window.history.pushState({}, '', window.location.pathname);
    }

    updateActiveMenuItem(page) {
        // Remove active class from all menu items
        const menuItems = document.querySelectorAll('.menu-link');
        menuItems.forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to current menu item
        const activeItem = document.querySelector(`.menu-link[data-page="${page}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    // Public methods
    isOpen() {
        return this.isOpen;
    }

    close() {
        this.closeSidebar();
    }

    open() {
        this.openSidebar();
    }
}

// Initialize sidebar manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.sidebarManager = new SidebarManager();
    // Accessibility: Add role and tabindex to expandable menu items
    document.querySelectorAll('.menu-link.expandable').forEach(item => {
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-expanded', 'false');
        const submenuId = item.getAttribute('data-submenu');
        if (submenuId) {
            item.setAttribute('aria-controls', submenuId + '-submenu');
            const submenu = document.getElementById(submenuId + '-submenu');
            if (submenu) {
                submenu.setAttribute('aria-hidden', 'true');
            }
        }
    });
});

// Export for use in other modules
window.SidebarManager = SidebarManager;