// Page Management System
class PageManager {
    constructor() {
        this.currentPage = 'home';
        this.pageCache = new Map();
        this.loadingStates = new Map();
        this.init();
    }

    init() {
        try {
            this.setupEventListeners();
            this.loadInitialPage();
        } catch (error) {
            console.error('PageManager initialization failed:', error);
        }
    }

    setupEventListeners() {
        // Listen for custom page load events
        document.addEventListener('pageLoad', (e) => {
            if (e.detail && e.detail.page) {
                this.loadPage(e.detail.page);
            }
        });

        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.loadPage(e.state.page, false);
            }
        });
    }

    loadInitialPage() {
        // Check URL hash for initial page
        const hash = window.location.hash.substring(1);
        if (hash && this.isValidPage(hash)) {
            this.loadPage(hash, false);
        }
    }

    isValidPage(page) {
        const validPages = [
            'home', 'administration', 'elibrary', 'physics-sim', 
            'ewriters', 'parents', 'archive', 'mosa'
        ];
        return validPages.includes(page);
    }

    async loadPage(pageName, updateHistory = true) {
        if (!pageName || !this.isValidPage(pageName)) {
            console.error('Invalid page name:', pageName);
            return;
        }

        // Prevent loading the same page multiple times
        if (this.currentPage === pageName && !this.loadingStates.get(pageName)) {
            return;
        }

        try {
            this.showLoadingState(pageName);
            
            // Check cache first
            let pageContent = this.pageCache.get(pageName);
            
            if (!pageContent) {
                pageContent = await this.fetchPageContent(pageName);
                this.pageCache.set(pageName, pageContent);
            }

            this.renderPage(pageContent, pageName);
            this.currentPage = pageName;

            // Update browser history
            if (updateHistory) {
                this.updateHistory(pageName);
            }

            // Update page title
            this.updatePageTitle(pageName);

            // Trigger page loaded event
            document.dispatchEvent(new CustomEvent('pageLoaded', {
                detail: { page: pageName }
            }));

        } catch (error) {
            console.error('Failed to load page:', pageName, error);
            this.showErrorPage(pageName, error);
        } finally {
            this.hideLoadingState(pageName);
        }
    }

    async fetchPageContent(pageName) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const pageTemplates = {
            administration: this.getAdministrationPage(),
            elibrary: this.getELibraryPage(),
            'physics-sim': this.getPhysicsSimPage(),
            ewriters: this.getEWritersPage(),
            parents: this.getParentsPage(),
            archive: this.getArchivePage(),
            mosa: this.getMOSAPage()
        };

        return pageTemplates[pageName] || this.getNotFoundPage();
    }

    renderPage(content, pageName) {
        const pageContent = document.getElementById('page-content');
        if (!pageContent) {
            console.error('Page content container not found');
            return;
        }

        // Fade out current content
        pageContent.style.opacity = '0';
        
        setTimeout(() => {
            pageContent.innerHTML = content;
            
            // Initialize any dynamic content
            this.initializePageContent(pageName);
            
            // Fade in new content
            pageContent.style.opacity = '1';
        }, 150);
    }

    initializePageContent(pageName) {
        // Initialize Lucide icons
        if (window.lucide) {
            lucide.createIcons();
        }

        // Initialize page-specific functionality
        switch (pageName) {
            case 'physics-sim':
                this.initializePhysicsSimulations();
                break;
            case 'elibrary':
                this.initializeELibrary();
                break;
            case 'administration':
                this.initializeAdministration();
                break;
            // Add more page-specific initializations as needed
        }
    }

    initializePhysicsSimulations() {
        // Initialize physics simulation controls
        const simControls = document.querySelectorAll('.sim-control');
        simControls.forEach(control => {
            control.addEventListener('click', (e) => {
                const simType = e.target.getAttribute('data-sim');
                this.loadSimulation(simType);
            });
        });
    }

    initializeELibrary() {
        // Initialize e-library search and filters
        const searchInput = document.getElementById('library-search');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.searchLibrary(e.target.value);
            }, 300));
        }
    }

    initializeAdministration() {
        // Initialize administration dashboard
        const adminTabs = document.querySelectorAll('.admin-tab');
        adminTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('data-tab');
                this.switchAdminTab(tabName);
            });
        });
    }

    showLoadingState(pageName) {
        this.loadingStates.set(pageName, true);
        
        const pageContent = document.getElementById('page-content');
        if (pageContent) {
            const loadingHTML = `
                <div class="loading-container">
                    <div class="loading-spinner">
                        <i data-lucide="loader-2"></i>
                    </div>
                    <p>Loading ${this.getPageTitle(pageName)}...</p>
                </div>
            `;
            pageContent.innerHTML = loadingHTML;
            
            if (window.lucide) {
                lucide.createIcons();
            }
        }
    }

    hideLoadingState(pageName) {
        this.loadingStates.set(pageName, false);
    }

    showErrorPage(pageName, error) {
        const pageContent = document.getElementById('page-content');
        if (pageContent) {
            const errorHTML = `
                <div class="error-container">
                    <div class="error-icon">
                        <i data-lucide="alert-circle"></i>
                    </div>
                    <h2>Failed to Load Page</h2>
                    <p>We encountered an error while loading ${this.getPageTitle(pageName)}.</p>
                    <button class="btn btn-primary" onclick="window.pageManager.loadPage('${pageName}')">
                        <i data-lucide="refresh-cw"></i>
                        Try Again
                    </button>
                    <button class="btn btn-secondary" onclick="window.pageManager.loadPage('home')">
                        <i data-lucide="home"></i>
                        Go Home
                    </button>
                </div>
            `;
            pageContent.innerHTML = errorHTML;
            
            if (window.lucide) {
                lucide.createIcons();
            }
        }
    }

    updateHistory(pageName) {
        const url = pageName === 'home' ? '/' : `#${pageName}`;
        window.history.pushState({ page: pageName }, '', url);
    }

    updatePageTitle(pageName) {
        const baseTitle = 'Mengo Senior School';
        const pageTitle = this.getPageTitle(pageName);
        document.title = pageTitle === 'Home' ? baseTitle : `${pageTitle} - ${baseTitle}`;
    }

    getPageTitle(pageName) {
        const titles = {
            home: 'Home',
            administration: 'Administration',
            elibrary: 'E-Library',
            'physics-sim': 'Physics Simulations',
            ewriters: 'E-Writers',
            parents: 'Parents Platform',
            archive: 'Archive',
            mosa: 'MOSA - Alumni Association'
        };
        return titles[pageName] || 'Page';
    }

    // Page Templates
    getAdministrationPage() {
        return `
            <section class="administration-page">
                <div class="container">
                    <div class="page-header">
                        <h1><i data-lucide="users"></i> Administration Portal</h1>
                        <p>Teacher and staff portal for student management and academic administration.</p>
                    </div>
                    
                    <div class="admin-dashboard">
                        <div class="admin-tabs">
                            <button class="admin-tab active" data-tab="overview">
                                <i data-lucide="dashboard"></i> Overview
                            </button>
                            <button class="admin-tab" data-tab="students">
                                <i data-lucide="users"></i> Students
                            </button>
                            <button class="admin-tab" data-tab="grades">
                                <i data-lucide="book-open"></i> Grades
                            </button>
                            <button class="admin-tab" data-tab="attendance">
                                <i data-lucide="calendar-check"></i> Attendance
                            </button>
                        </div>
                        
                        <div class="admin-content">
                            <div class="stats-grid">
                                <div class="stat-card">
                                    <div class="stat-icon">
                                        <i data-lucide="users"></i>
                                    </div>
                                    <div class="stat-info">
                                        <h3>1,247</h3>
                                        <p>Total Students</p>
                                    </div>
                                </div>
                                
                                <div class="stat-card">
                                    <div class="stat-icon">
                                        <i data-lucide="user-check"></i>
                                    </div>
                                    <div class="stat-info">
                                        <h3>98.5%</h3>
                                        <p>Attendance Rate</p>
                                    </div>
                                </div>
                                
                                <div class="stat-card">
                                    <div class="stat-icon">
                                        <i data-lucide="award"></i>
                                    </div>
                                    <div class="stat-info">
                                        <h3>92%</h3>
                                        <p>Pass Rate</p>
                                    </div>
                                </div>
                                
                                <div class="stat-card">
                                    <div class="stat-icon">
                                        <i data-lucide="calendar"></i>
                                    </div>
                                    <div class="stat-info">
                                        <h3>Term 3</h3>
                                        <p>Current Term</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="admin-actions">
                                <h3>Quick Actions</h3>
                                <div class="action-grid">
                                    <button class="action-btn">
                                        <i data-lucide="user-plus"></i>
                                        Add Student
                                    </button>
                                    <button class="action-btn">
                                        <i data-lucide="file-text"></i>
                                        Generate Report
                                    </button>
                                    <button class="action-btn">
                                        <i data-lucide="calendar-plus"></i>
                                        Schedule Event
                                    </button>
                                    <button class="action-btn">
                                        <i data-lucide="bell"></i>
                                        Send Notice
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    getELibraryPage() {
        return `
            <section class="elibrary-page">
                <div class="container">
                    <div class="page-header">
                        <h1><i data-lucide="book-open"></i> E-Library</h1>
                        <p>Access our comprehensive digital library with thousands of books, journals, and resources.</p>
                    </div>
                    
                    <div class="library-search">
                        <div class="search-bar">
                            <input type="text" id="library-search" placeholder="Search books, authors, subjects...">
                            <button class="search-btn">
                                <i data-lucide="search"></i>
                            </button>
                        </div>
                        
                        <div class="search-filters">
                            <select class="filter-select">
                                <option value="">All Categories</option>
                                <option value="textbooks">Textbooks</option>
                                <option value="reference">Reference</option>
                                <option value="fiction">Fiction</option>
                                <option value="science">Science</option>
                                <option value="history">History</option>
                            </select>
                            
                            <select class="filter-select">
                                <option value="">All Subjects</option>
                                <option value="mathematics">Mathematics</option>
                                <option value="physics">Physics</option>
                                <option value="chemistry">Chemistry</option>
                                <option value="biology">Biology</option>
                                <option value="english">English</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="library-content">
                        <div class="featured-books">
                            <h3>Featured Resources</h3>
                            <div class="books-grid">
                                <div class="book-card">
                                    <div class="book-cover">
                                        <i data-lucide="book"></i>
                                    </div>
                                    <div class="book-info">
                                        <h4>Advanced Mathematics</h4>
                                        <p>Grade 12 Textbook</p>
                                        <button class="btn btn-primary">Read Now</button>
                                    </div>
                                </div>
                                
                                <div class="book-card">
                                    <div class="book-cover">
                                        <i data-lucide="book"></i>
                                    </div>
                                    <div class="book-info">
                                        <h4>Physics Principles</h4>
                                        <p>Comprehensive Guide</p>
                                        <button class="btn btn-primary">Read Now</button>
                                    </div>
                                </div>
                                
                                <div class="book-card">
                                    <div class="book-cover">
                                        <i data-lucide="book"></i>
                                    </div>
                                    <div class="book-info">
                                        <h4>Uganda History</h4>
                                        <p>Historical Reference</p>
                                        <button class="btn btn-primary">Read Now</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="library-stats">
                            <div class="stat-item">
                                <i data-lucide="book-open"></i>
                                <span>5,247 Books</span>
                            </div>
                            <div class="stat-item">
                                <i data-lucide="file-text"></i>
                                <span>1,832 Journals</span>
                            </div>
                            <div class="stat-item">
                                <i data-lucide="video"></i>
                                <span>456 Videos</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    getPhysicsSimPage() {
        return `
            <section class="physics-sim-page">
                <div class="container">
                    <div class="page-header">
                        <h1><i data-lucide="zap"></i> Physics Simulations</h1>
                        <p>Interactive physics simulations to enhance learning and understanding of physical concepts.</p>
                    </div>
                    
                    <div class="simulations-grid">
                        <div class="sim-card">
                            <div class="sim-preview">
                                <i data-lucide="activity"></i>
                            </div>
                            <div class="sim-info">
                                <h3>Wave Motion</h3>
                                <p>Explore wave properties, frequency, and amplitude through interactive simulations.</p>
                                <button class="sim-control btn btn-primary" data-sim="waves">
                                    Launch Simulation
                                </button>
                            </div>
                        </div>
                        
                        <div class="sim-card">
                            <div class="sim-preview">
                                <i data-lucide="zap"></i>
                            </div>
                            <div class="sim-info">
                                <h3>Electric Circuits</h3>
                                <p>Build and analyze electrical circuits with various components and measurements.</p>
                                <button class="sim-control btn btn-primary" data-sim="circuits">
                                    Launch Simulation
                                </button>
                            </div>
                        </div>
                        
                        <div class="sim-card">
                            <div class="sim-preview">
                                <i data-lucide="move"></i>
                            </div>
                            <div class="sim-info">
                                <h3>Projectile Motion</h3>
                                <p>Study projectile motion with adjustable parameters and trajectory visualization.</p>
                                <button class="sim-control btn btn-primary" data-sim="projectile">
                                    Launch Simulation
                                </button>
                            </div>
                        </div>
                        
                        <div class="sim-card">
                            <div class="sim-preview">
                                <i data-lucide="thermometer"></i>
                            </div>
                            <div class="sim-info">
                                <h3>Heat Transfer</h3>
                                <p>Visualize heat conduction, convection, and radiation processes.</p>
                                <button class="sim-control btn btn-primary" data-sim="heat">
                                    Launch Simulation
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="sim-instructions">
                        <h3>How to Use Simulations</h3>
                        <ol>
                            <li>Click "Launch Simulation" on any physics concept</li>
                            <li>Use the interactive controls to adjust parameters</li>
                            <li>Observe how changes affect the physical system</li>
                            <li>Take notes and screenshots for your studies</li>
                        </ol>
                    </div>
                </div>
            </section>
        `;
    }

    getEWritersPage() {
        return `
            <section class="ewriters-page">
                <div class="container">
                    <div class="page-header">
                        <h1><i data-lucide="pen-tool"></i> E-Writers</h1>
                        <p>Student publication platform for creative writing, journalism, and academic articles.</p>
                    </div>
                    
                    <div class="writers-dashboard">
                        <div class="dashboard-actions">
                            <button class="btn btn-primary">
                                <i data-lucide="plus"></i>
                                New Article
                            </button>
                            <button class="btn btn-secondary">
                                <i data-lucide="folder"></i>
                                My Drafts
                            </button>
                            <button class="btn btn-secondary">
                                <i data-lucide="eye"></i>
                                Published
                            </button>
                        </div>
                        
                        <div class="featured-articles">
                            <h3>Featured Articles</h3>
                            <div class="articles-grid">
                                <article class="article-card">
                                    <div class="article-meta">
                                        <span class="category">Science</span>
                                        <time>Dec 15, 2024</time>
                                    </div>
                                    <h4>The Future of Renewable Energy in Uganda</h4>
                                    <p>Exploring sustainable energy solutions for Uganda's growing power needs...</p>
                                    <div class="article-author">
                                        <span>By Sarah Nakato, S6</span>
                                        <div class="article-stats">
                                            <span><i data-lucide="eye"></i> 234</span>
                                            <span><i data-lucide="heart"></i> 18</span>
                                        </div>
                                    </div>
                                </article>
                                
                                <article class="article-card">
                                    <div class="article-meta">
                                        <span class="category">Literature</span>
                                        <time>Dec 12, 2024</time>
                                    </div>
                                    <h4>Poetry in Motion: Student Voices</h4>
                                    <p>A collection of original poems by Mengo students expressing their thoughts...</p>
                                    <div class="article-author">
                                        <span>By David Mukasa, S5</span>
                                        <div class="article-stats">
                                            <span><i data-lucide="eye"></i> 156</span>
                                            <span><i data-lucide="heart"></i> 24</span>
                                        </div>
                                    </div>
                                </article>
                                
                                <article class="article-card">
                                    <div class="article-meta">
                                        <span class="category">Sports</span>
                                        <time>Dec 10, 2024</time>
                                    </div>
                                    <h4>Inter-House Sports Competition Highlights</h4>
                                    <p>Recap of this year's exciting inter-house sports competition...</p>
                                    <div class="article-author">
                                        <span>By Grace Nambi, S4</span>
                                        <div class="article-stats">
                                            <span><i data-lucide="eye"></i> 189</span>
                                            <span><i data-lucide="heart"></i> 31</span>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </div>
                        
                        <div class="writing-tips">
                            <h3>Writing Guidelines</h3>
                            <ul>
                                <li>Articles should be original and well-researched</li>
                                <li>Maintain academic integrity and cite sources</li>
                                <li>Use clear, engaging language appropriate for your audience</li>
                                <li>Submit articles for review before publication</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    getParentsPage() {
        return `
            <section class="parents-page">
                <div class="container">
                    <div class="page-header">
                        <h1><i data-lucide="heart"></i> Parents Platform</h1>
                        <p>Monitor your child's progress, communicate with teachers, and stay connected with school activities.</p>
                    </div>
                    
                    <div class="parents-dashboard">
                        <div class="student-selector">
                            <label for="student-select">Select Student:</label>
                            <select id="student-select">
                                <option value="">Choose your child</option>
                                <option value="student1">John Doe - S4A</option>
                                <option value="student2">Jane Doe - S2B</option>
                            </select>
                        </div>
                        
                        <div class="dashboard-grid">
                            <div class="dashboard-card">
                                <div class="card-header">
                                    <h3><i data-lucide="book-open"></i> Academic Progress</h3>
                                </div>
                                <div class="card-content">
                                    <div class="progress-item">
                                        <span>Mathematics</span>
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: 85%"></div>
                                        </div>
                                        <span>85%</span>
                                    </div>
                                    <div class="progress-item">
                                        <span>Physics</span>
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: 78%"></div>
                                        </div>
                                        <span>78%</span>
                                    </div>
                                    <div class="progress-item">
                                        <span>Chemistry</span>
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: 92%"></div>
                                        </div>
                                        <span>92%</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="dashboard-card">
                                <div class="card-header">
                                    <h3><i data-lucide="calendar-check"></i> Attendance</h3>
                                </div>
                                <div class="card-content">
                                    <div class="attendance-summary">
                                        <div class="attendance-stat">
                                            <span class="stat-number">96%</span>
                                            <span class="stat-label">This Term</span>
                                        </div>
                                        <div class="attendance-stat">
                                            <span class="stat-number">18/19</span>
                                            <span class="stat-label">This Week</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="dashboard-card">
                                <div class="card-header">
                                    <h3><i data-lucide="bell"></i> Recent Notices</h3>
                                </div>
                                <div class="card-content">
                                    <div class="notice-item">
                                        <time>Dec 15</time>
                                        <p>Parent-Teacher Conference scheduled for Dec 20</p>
                                    </div>
                                    <div class="notice-item">
                                        <time>Dec 12</time>
                                        <p>School fees payment reminder</p>
                                    </div>
                                    <div class="notice-item">
                                        <time>Dec 10</time>
                                        <p>Sports day preparations underway</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="dashboard-card">
                                <div class="card-header">
                                    <h3><i data-lucide="message-circle"></i> Communication</h3>
                                </div>
                                <div class="card-content">
                                    <button class="btn btn-primary full-width">
                                        <i data-lucide="mail"></i>
                                        Message Teacher
                                    </button>
                                    <button class="btn btn-secondary full-width">
                                        <i data-lucide="calendar"></i>
                                        Schedule Meeting
                                    </button>
                                    <button class="btn btn-secondary full-width">
                                        <i data-lucide="phone"></i>
                                        Request Callback
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    getArchivePage() {
        return `
            <section class="archive-page">
                <div class="container">
                    <div class="page-header">
                        <h1><i data-lucide="archive"></i> School Archive</h1>
                        <p>Explore the rich history of Mengo Senior School through historical documents, photos, and records.</p>
                    </div>
                    
                    <div class="archive-navigation">
                        <div class="archive-filters">
                            <button class="filter-btn active" data-filter="all">All Items</button>
                            <button class="filter-btn" data-filter="documents">Documents</button>
                            <button class="filter-btn" data-filter="photos">Photos</button>
                            <button class="filter-btn" data-filter="records">Records</button>
                            <button class="filter-btn" data-filter="memorabilia">Memorabilia</button>
                        </div>
                        
                        <div class="archive-search">
                            <input type="text" placeholder="Search archive..." class="search-input">
                            <button class="search-btn">
                                <i data-lucide="search"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="archive-timeline">
                        <div class="timeline-item">
                            <div class="timeline-year">1895</div>
                            <div class="timeline-content">
                                <h3>School Foundation</h3>
                                <p>Mengo Senior School was established by the Church Missionary Society.</p>
                                <div class="timeline-media">
                                    <div class="media-item">
                                        <i data-lucide="file-text"></i>
                                        <span>Foundation Charter</span>
                                    </div>
                                    <div class="media-item">
                                        <i data-lucide="image"></i>
                                        <span>Original Building</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="timeline-item">
                            <div class="timeline-year">1920</div>
                            <div class="timeline-content">
                                <h3>First Graduation</h3>
                                <p>The first class of 12 students graduated from Mengo Senior School.</p>
                                <div class="timeline-media">
                                    <div class="media-item">
                                        <i data-lucide="image"></i>
                                        <span>Graduation Photo</span>
                                    </div>
                                    <div class="media-item">
                                        <i data-lucide="award"></i>
                                        <span>Certificates</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="timeline-item">
                            <div class="timeline-year">1962</div>
                            <div class="timeline-content">
                                <h3>Independence Era</h3>
                                <p>School played a significant role in Uganda's independence movement.</p>
                                <div class="timeline-media">
                                    <div class="media-item">
                                        <i data-lucide="file-text"></i>
                                        <span>Historical Documents</span>
                                    </div>
                                    <div class="media-item">
                                        <i data-lucide="users"></i>
                                        <span>Notable Alumni</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="timeline-item">
                            <div class="timeline-year">2000</div>
                            <div class="timeline-content">
                                <h3>Modern Era</h3>
                                <p>Introduction of modern facilities and technology-enhanced learning.</p>
                                <div class="timeline-media">
                                    <div class="media-item">
                                        <i data-lucide="image"></i>
                                        <span>New Campus</span>
                                    </div>
                                    <div class="media-item">
                                        <i data-lucide="monitor"></i>
                                        <span>Computer Lab</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="archive-stats">
                        <div class="stat-item">
                            <i data-lucide="file-text"></i>
                            <span>2,847 Documents</span>
                        </div>
                        <div class="stat-item">
                            <i data-lucide="image"></i>
                            <span>5,234 Photos</span>
                        </div>
                        <div class="stat-item">
                            <i data-lucide="users"></i>
                            <span>15,000+ Alumni</span>
                        </div>
                        <div class="stat-item">
                            <i data-lucide="calendar"></i>
                            <span>130 Years</span>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    getMOSAPage() {
        return `
            <section class="mosa-page">
                <div class="container">
                    <div class="page-header">
                        <h1><i data-lucide="graduation-cap"></i> MOSA</h1>
                        <h2>Mengo Old Students' Association</h2>
                        <p>Connecting generations of Mengo leaders worldwide through fellowship, mentorship, and support.</p>
                    </div>
                    
                    <div class="mosa-content">
                        <div class="mosa-mission">
                            <h3>Our Mission</h3>
                            <p>To foster lifelong connections among Mengo Senior School alumni, support current students, and contribute to the continued excellence of our alma mater.</p>
                        </div>
                        
                        <div class="mosa-features">
                            <div class="feature-grid">
                                <div class="feature-card">
                                    <div class="feature-icon">
                                        <i data-lucide="users"></i>
                                    </div>
                                    <h4>Alumni Network</h4>
                                    <p>Connect with fellow alumni across the globe through our comprehensive directory and networking events.</p>
                                </div>
                                
                                <div class="feature-card">
                                    <div class="feature-icon">
                                        <i data-lucide="heart"></i>
                                    </div>
                                    <h4>Mentorship Program</h4>
                                    <p>Experienced alumni mentor current students and recent graduates in career development.</p>
                                </div>
                                
                                <div class="feature-card">
                                    <div class="feature-icon">
                                        <i data-lucide="gift"></i>
                                    </div>
                                    <h4>Scholarship Fund</h4>
                                    <p>Support deserving students through our scholarship program funded by alumni contributions.</p>
                                </div>
                                
                                <div class="feature-card">
                                    <div class="feature-icon">
                                        <i data-lucide="calendar"></i>
                                    </div>
                                    <h4>Events & Reunions</h4>
                                    <p>Regular social events, professional networking sessions, and memorable class reunions.</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mosa-membership">
                            <h3>Membership Benefits</h3>
                            <div class="benefits-list">
                                <div class="benefit-item">
                                    <i data-lucide="check-circle"></i>
                                    <span>Access to global alumni directory</span>
                                </div>
                                <div class="benefit-item">
                                    <i data-lucide="check-circle"></i>
                                    <span>Exclusive networking events and reunions</span>
                                </div>
                                <div class="benefit-item">
                                    <i data-lucide="check-circle"></i>
                                    <span>Career development resources and job board</span>
                                </div>
                                <div class="benefit-item">
                                    <i data-lucide="check-circle"></i>
                                    <span>Mentorship opportunities</span>
                                </div>
                                <div class="benefit-item">
                                    <i data-lucide="check-circle"></i>
                                    <span>School news and updates</span>
                                </div>
                                <div class="benefit-item">
                                    <i data-lucide="check-circle"></i>
                                    <span>Voting rights in MOSA elections</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mosa-actions">
                            <div class="action-buttons">
                                <button class="btn btn-primary">
                                    <i data-lucide="user-plus"></i>
                                    Join MOSA
                                </button>
                                <button class="btn btn-secondary">
                                    <i data-lucide="calendar"></i>
                                    Upcoming Events
                                </button>
                                <button class="btn btn-secondary">
                                    <i data-lucide="heart"></i>
                                    Make a Donation
                                </button>
                                <button class="btn btn-secondary">
                                    <i data-lucide="users"></i>
                                    Alumni Directory
                                </button>
                            </div>
                        </div>
                        
                        <div class="mosa-leadership">
                            <h3>MOSA Leadership</h3>
                            <div class="leadership-grid">
                                <div class="leader-card">
                                    <div class="leader-avatar">
                                        <i data-lucide="user"></i>
                                    </div>
                                    <h4>Dr. James Mukasa</h4>
                                    <p>President</p>
                                    <span>Class of 1985</span>
                                </div>
                                
                                <div class="leader-card">
                                    <div class="leader-avatar">
                                        <i data-lucide="user"></i>
                                    </div>
                                    <h4>Sarah Nambi</h4>
                                    <p>Vice President</p>
                                    <span>Class of 1992</span>
                                </div>
                                
                                <div class="leader-card">
                                    <div class="leader-avatar">
                                        <i data-lucide="user"></i>
                                    </div>
                                    <h4>David Ssemakula</h4>
                                    <p>Secretary General</p>
                                    <span>Class of 1988</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    getNotFoundPage() {
        return `
            <section class="not-found-page">
                <div class="container">
                    <div class="not-found-content">
                        <div class="not-found-icon">
                            <i data-lucide="alert-circle"></i>
                        </div>
                        <h1>Page Not Found</h1>
                        <p>The page you're looking for doesn't exist or has been moved.</p>
                        <button class="btn btn-primary" onclick="window.pageManager.loadPage('home')">
                            <i data-lucide="home"></i>
                            Go Home
                        </button>
                    </div>
                </div>
            </section>
        `;
    }

    // Utility methods
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

    // Simulation methods (placeholders)
    loadSimulation(simType) {
        console.log('Loading simulation:', simType);
        // Implement simulation loading logic
    }

    searchLibrary(query) {
        console.log('Searching library:', query);
        // Implement library search logic
    }

    switchAdminTab(tabName) {
        console.log('Switching admin tab:', tabName);
        // Implement admin tab switching logic
    }

    // Public methods
    getCurrentPage() {
        return this.currentPage;
    }

    clearCache() {
        this.pageCache.clear();
    }

    // Cleanup
    destroy() {
        this.pageCache.clear();
        this.loadingStates.clear();
    }
}

// Initialize page manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.pageManager = new PageManager();
    } catch (error) {
        console.error('Failed to initialize page manager:', error);
    }
});

// Export for use in other modules
window.PageManager = PageManager;