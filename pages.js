// Enhanced Page Management System
class PageManager {
    constructor() {
        this.currentPage = 'home';
        this.pages = {
            home: {
                title: 'Welcome to Mengo Senior School',
                content: this.getHomeContent()
            },
            administration: {
                title: 'Administration Portal',
                content: this.getAdministrationContent()
            },
            elibrary: {
                title: 'E-Library',
                content: this.getELibraryContent()
            },
            'physics-sim': {
                title: 'Physics Simulations',
                content: this.getPhysicsSimContent()
            },
            ewriters: {
                title: 'E-Writers Platform',
                content: this.getEWritersContent()
            },
            parents: {
                title: 'Parents Platform',
                content: this.getParentsContent()
            },
            archive: {
                title: 'School Archive',
                content: this.getArchiveContent()
            },
            mosa: {
                title: 'MOSA - Mengo Old Students Association',
                content: this.getMOSAContent()
            }
        };
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadPage('home');
    }

    bindEvents() {
        // Listen for page load events
        document.addEventListener('pageLoad', (e) => {
            this.loadPage(e.detail.page);
        });

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.loadPage(e.state.page, false);
            }
        });
    }

    loadPage(pageName, updateHistory = true) {
        if (!this.pages[pageName]) {
            console.error('Page not found:', pageName);
            return;
        }

        this.currentPage = pageName;
        const page = this.pages[pageName];
        
        // Update page content
        const pageContent = document.getElementById('page-content');
        if (pageContent) {
            pageContent.innerHTML = page.content;
            
            // Add fade-in animation
            pageContent.style.opacity = '0';
            setTimeout(() => {
                pageContent.style.opacity = '1';
                pageContent.style.transition = 'opacity 0.3s ease';
            }, 50);
        }

        // Update document title
        document.title = `${page.title} - Mengo Senior School`;

        // Update browser history
        if (updateHistory) {
            history.pushState({ page: pageName }, page.title, `#${pageName}`);
        }

        // Initialize page-specific functionality
        this.initializePageFeatures(pageName);

        // Update active menu item
        this.updateActiveMenuItem(pageName);
    }

    initializePageFeatures(pageName) {
        // Initialize Lucide icons
        if (window.lucide) {
            lucide.createIcons();
        }

        // Page-specific initializations
        switch (pageName) {
            case 'administration':
                this.initializeAdministration();
                break;
            case 'elibrary':
                this.initializeELibrary();
                break;
            case 'physics-sim':
                this.initializePhysicsSim();
                break;
            case 'ewriters':
                this.initializeEWriters();
                break;
            case 'parents':
                this.initializeParents();
                break;
            case 'archive':
                this.initializeArchive();
                break;
            case 'mosa':
                this.initializeMOSA();
                break;
        }
    }

    updateActiveMenuItem(pageName) {
        // Remove active class from all menu items
        const menuItems = document.querySelectorAll('.menu-link');
        menuItems.forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to current menu item
        const activeItem = document.querySelector(`.menu-link[data-page="${pageName}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    // Page Content Generators
    getHomeContent() {
        return `
            <section class="home-content">
                <div class="container">
                    <div class="content-grid">
                        <div class="main-content-area">
                            <article class="welcome-section">
                                <h2>Welcome to Mengo Senior School</h2>
                                <p class="lead">For over 130 years, Mengo Senior School has stood as a pillar of educational excellence in Uganda, nurturing young minds and shaping future leaders with unwavering commitment to academic excellence, character development, and service to humanity.</p>
                                
                                <div class="highlights-grid">
                                    <div class="highlight-card">
                                        <div class="highlight-icon">
                                            <i data-lucide="award"></i>
                                        </div>
                                        <h3>Academic Excellence</h3>
                                        <p>Consistently ranked among Uganda's top secondary schools with outstanding national examination results and university placement rates exceeding 95%.</p>
                                    </div>
                                    
                                    <div class="highlight-card">
                                        <div class="highlight-icon">
                                            <i data-lucide="users"></i>
                                        </div>
                                        <h3>Holistic Development</h3>
                                        <p>Comprehensive programs in academics, sports, arts, and leadership development that nurture well-rounded individuals prepared for global citizenship.</p>
                                    </div>
                                    
                                    <div class="highlight-card">
                                        <div class="highlight-icon">
                                            <i data-lucide="globe"></i>
                                        </div>
                                        <h3>Global Network</h3>
                                        <p>Alumni network spanning across continents, creating opportunities for current students and fostering lifelong connections in business, academia, and public service.</p>
                                    </div>
                                </div>

                                <div class="page-section">
                                    <h3 class="section-title">Our Legacy of Excellence</h3>
                                    <div class="card-grid">
                                        <div class="card">
                                            <div class="card-header">
                                                <div class="card-icon">
                                                    <i data-lucide="book-open"></i>
                                                </div>
                                                <h4 class="card-title">Rich History</h4>
                                            </div>
                                            <div class="card-content">
                                                <p>Founded in 1895, our institution has weathered the storms of history while maintaining its commitment to educational excellence and moral development.</p>
                                            </div>
                                        </div>

                                        <div class="card">
                                            <div class="card-header">
                                                <div class="card-icon">
                                                    <i data-lucide="graduation-cap"></i>
                                                </div>
                                                <h4 class="card-title">Distinguished Alumni</h4>
                                            </div>
                                            <div class="card-content">
                                                <p>Our graduates have become leaders in government, business, academia, and civil society, making significant contributions to Uganda and beyond.</p>
                                            </div>
                                        </div>

                                        <div class="card">
                                            <div class="card-header">
                                                <div class="card-icon">
                                                    <i data-lucide="target"></i>
                                                </div>
                                                <h4 class="card-title">Future Vision</h4>
                                            </div>
                                            <div class="card-content">
                                                <p>We continue to evolve and adapt, embracing technology and innovation while preserving the timeless values that define our character.</p>
                                            </div>
                                        </div>
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
                                    <p>Mengo SS achieves 98% pass rate in national examinations, with 85% of students earning first-grade results.</p>
                                </div>
                                <div class="news-item">
                                    <time>Dec 10, 2024</time>
                                    <h4>New Science Laboratory</h4>
                                    <p>State-of-the-art physics and chemistry laboratories officially opened, enhancing our STEM education capabilities.</p>
                                </div>
                                <div class="news-item">
                                    <time>Dec 5, 2024</time>
                                    <h4>Alumni Achievement</h4>
                                    <p>Former student Dr. Sarah Nakamya appointed as Minister of Education, continuing our tradition of public service.</p>
                                </div>
                                <div class="news-item">
                                    <time>Nov 28, 2024</time>
                                    <h4>Sports Championship</h4>
                                    <p>Our football team wins the Inter-School Championship for the third consecutive year.</p>
                                </div>
                            </div>
                            
                            <div class="quick-links-widget">
                                <h3>Quick Links</h3>
                                <ul>
                                    <li><a href="#admissions">Admissions Process</a></li>
                                    <li><a href="#calendar">Academic Calendar</a></li>
                                    <li><a href="#fees">Fee Structure</a></li>
                                    <li><a href="#transport">School Transport</a></li>
                                    <li><a href="#uniform">School Uniform</a></li>
                                    <li><a href="#handbook">Student Handbook</a></li>
                                </ul>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        `;
    }

    getAdministrationContent() {
        return `
            <div class="page-header">
                <div class="container">
                    <h1>Administration Portal</h1>
                    <p>Comprehensive student management system for teachers and administrative staff</p>
                </div>
            </div>

            <div class="container">
                <div class="page-section">
                    <h2 class="section-title">Student Management Dashboard</h2>
                    
                    <div class="card-grid">
                        <div class="card">
                            <div class="card-header">
                                <div class="card-icon">
                                    <i data-lucide="users"></i>
                                </div>
                                <h3 class="card-title">Student Profiles</h3>
                            </div>
                            <div class="card-content">
                                <p>Manage comprehensive student profiles including academic records, achievements, and personal development tracking.</p>
                                <button class="btn btn-primary" onclick="this.showStudentProfiles()">
                                    <i data-lucide="eye"></i>
                                    View Students
                                </button>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <div class="card-icon">
                                    <i data-lucide="bar-chart"></i>
                                </div>
                                <h3 class="card-title">Academic Records</h3>
                            </div>
                            <div class="card-content">
                                <p>Track and update student academic performance, term averages, and examination results.</p>
                                <button class="btn btn-primary" onclick="this.showAcademicRecords()">
                                    <i data-lucide="trending-up"></i>
                                    View Records
                                </button>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <div class="card-icon">
                                    <i data-lucide="trophy"></i>
                                </div>
                                <h3 class="card-title">Achievements</h3>
                            </div>
                            <div class="card-content">
                                <p>Document and celebrate student achievements in academics, sports, arts, and leadership.</p>
                                <button class="btn btn-primary" onclick="this.showAchievements()">
                                    <i data-lucide="star"></i>
                                    Manage Awards
                                </button>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <div class="card-icon">
                                    <i data-lucide="calendar"></i>
                                </div>
                                <h3 class="card-title">Class Schedules</h3>
                            </div>
                            <div class="card-content">
                                <p>Manage class timetables, examination schedules, and academic calendar events.</p>
                                <button class="btn btn-primary" onclick="this.showSchedules()">
                                    <i data-lucide="clock"></i>
                                    View Schedule
                                </button>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <div class="card-icon">
                                    <i data-lucide="message-circle"></i>
                                </div>
                                <h3 class="card-title">Communication</h3>
                            </div>
                            <div class="card-content">
                                <p>Send announcements, progress reports, and communicate with parents and students.</p>
                                <button class="btn btn-primary" onclick="this.showCommunication()">
                                    <i data-lucide="send"></i>
                                    Send Message
                                </button>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <div class="card-icon">
                                    <i data-lucide="file-text"></i>
                                </div>
                                <h3 class="card-title">Reports</h3>
                            </div>
                            <div class="card-content">
                                <p>Generate comprehensive reports on student performance, attendance, and school statistics.</p>
                                <button class="btn btn-primary" onclick="this.generateReports()">
                                    <i data-lucide="download"></i>
                                    Generate Report
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="page-section">
                    <h2 class="section-title">Quick Actions</h2>
                    <div class="card">
                        <div class="card-content">
                            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                                <button class="btn btn-secondary">
                                    <i data-lucide="plus"></i>
                                    Add New Student
                                </button>
                                <button class="btn btn-secondary">
                                    <i data-lucide="upload"></i>
                                    Import Results
                                </button>
                                <button class="btn btn-secondary">
                                    <i data-lucide="bell"></i>
                                    Send Notification
                                </button>
                                <button class="btn btn-secondary">
                                    <i data-lucide="settings"></i>
                                    System Settings
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getELibraryContent() {
        return `
            <div class="page-header">
                <div class="container">
                    <h1>E-Library</h1>
                    <p>Digital repository of academic resources, books, and research materials</p>
                </div>
            </div>

            <div class="container">
                <div class="page-section">
                    <h2 class="section-title">Digital Collections</h2>
                    
                    <div class="card-grid">
                        <div class="card">
                            <div class="card-header">
                                <div class="card-icon">
                                    <i data-lucide="book"></i>
                                </div>
                                <h3 class="card-title">Academic Textbooks</h3>
                            </div>
                            <div class="card-content">
                                <p>Comprehensive collection of curriculum-aligned textbooks for all subjects and levels.</p>
                                <div style="margin-top: 1rem;">
                                    <span style="background: #e3f2fd; color: #1976d2; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.875rem;">2,450 Books</span>
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <div class="card-icon">
                                    <i data-lucide="search"></i>
                                </div>
                                <h3 class="card-title">Research Papers</h3>
                            </div>
                            <div class="card-content">
                                <p>Access to academic journals, research papers, and scholarly articles from global databases.</p>
                                <div style="margin-top: 1rem;">
                                    <span style="background: #e8f5e8; color: #2e7d32; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.875rem;">15,000+ Papers</span>
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <div class="card-icon">
                                    <i data-lucide="video"></i>
                                </div>
                                <h3 class="card-title">Educational Videos</h3>
                            </div>
                            <div class="card-content">
                                <p>Curated collection of educational videos, documentaries, and interactive learning materials.</p>
                                <div style="margin-top: 1rem;">
                                    <span style="background: #fff3e0; color: #f57c00; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.875rem;">1,200 Videos</span>
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <div class="card-icon">
                                    <i data-lucide="globe"></i>
                                </div>
                                <h3 class="card-title">Digital Archives</h3>
                            </div>
                            <div class="card-content">
                                <p>Historical documents, school publications, and archived materials from our 130-year history.</p>
                                <div style="margin-top: 1rem;">
                                    <span style="background: #fce4ec; color: #c2185b; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.875rem;">5,000 Documents</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="page-section">
                    <h2 class="section-title">Featured Resources</h2>
                    <div class="card">
                        <div class="card-content">
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                                <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 1.5rem;">
                                    <h4 style="color: var(--harvard-crimson); margin-bottom: 1rem;">Mathematics Resources</h4>
                                    <ul style="list-style: none; padding: 0;">
                                        <li style="margin-bottom: 0.5rem;">📚 Advanced Mathematics Textbook</li>
                                        <li style="margin-bottom: 0.5rem;">📊 Statistics and Probability Guide</li>
                                        <li style="margin-bottom: 0.5rem;">🧮 Calculus Problem Sets</li>
                                        <li style="margin-bottom: 0.5rem;">📐 Geometry Interactive Tools</li>
                                    </ul>
                                </div>
                                
                                <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 1.5rem;">
                                    <h4 style="color: var(--harvard-crimson); margin-bottom: 1rem;">Science Collection</h4>
                                    <ul style="list-style: none; padding: 0;">
                                        <li style="margin-bottom: 0.5rem;">🔬 Biology Laboratory Manual</li>
                                        <li style="margin-bottom: 0.5rem;">⚗️ Chemistry Experiments Guide</li>
                                        <li style="margin-bottom: 0.5rem;">🌍 Environmental Science Journal</li>
                                        <li style="margin-bottom: 0.5rem;">🔭 Astronomy Reference Materials</li>
                                    </ul>
                                </div>
                                
                                <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 1.5rem;">
                                    <h4 style="color: var(--harvard-crimson); margin-bottom: 1rem;">Literature & Languages</h4>
                                    <ul style="list-style: none; padding: 0;">
                                        <li style="margin-bottom: 0.5rem;">📖 English Literature Classics</li>
                                        <li style="margin-bottom: 0.5rem;">🗣️ Language Learning Resources</li>
                                        <li style="margin-bottom: 0.5rem;">✍️ Creative Writing Guides</li>
                                        <li style="margin-bottom: 0.5rem;">🎭 Drama and Poetry Collections</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getPhysicsSimContent() {
        return `
            <div class="page-header">
                <div class="container">
                    <h1>Physics Simulations</h1>
                    <p>Interactive physics simulations and virtual laboratory experiments</p>
                </div>
            </div>

            <div class="container">
                <div class="page-section">
                    <h2 class="section-title">Interactive Simulations</h2>
                    
                    <div class="card-grid">
                        <div class="card">
                            <div class="card-header">
                                <div class="card-icon">
                                    <i data-lucide="zap"></i>
                                </div>
                                <h3 class="card-title">Electricity & Magnetism</h3>
                            </div>
                            <div class="card-content">
                                <p>Explore electric fields, magnetic forces, and electromagnetic induction through interactive simulations.</p>
                                <button class="btn btn-primary" style="margin-top: 1rem;">
                                    <i data-lucide="play"></i>
                                    Launch Simulation
                                </button>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <div class="card-icon">
                                    <i data-lucide="activity"></i>
                                </div>
                                <h3 class="card-title">Wave Motion</h3>
                            </div>
                            <div class="card-content">
                                <p>Visualize wave properties, interference patterns, and sound wave propagation in various media.</p>
                                <button class="btn btn-primary" style="margin-top: 1rem;">
                                    <i data-lucide="play"></i>
                                    Launch Simulation
                                </button>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <div class="card-icon">
                                    <i data-lucide="atom"></i>
                                </div>
                                <h3 class="card-title">Atomic Physics</h3>
                            </div>
                            <div class="card-content">
                                <p>Investigate atomic structure, electron behavior, and quantum mechanical principles.</p>
                                <button class="btn btn-primary" style="margin-top: 1rem;">
                                    <i data-lucide="play"></i>
                                    Launch Simulation
                                </button>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <div class="card-icon">
                                    <i data-lucide="thermometer"></i>
                                </div>
                                <h3 class="card-title">Thermodynamics</h3>
                            </div>
                            <div class="card-content">
                                <p>Study heat transfer, gas laws, and thermodynamic processes through virtual experiments.</p>
                                <button class="btn btn-primary" style="margin-top: 1rem;">
                                    <i data-lucide="play"></i>
                                    Launch Simulation
                                </button>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <div class="card-icon">
                                    <i data-lucide="move"></i>
                                </div>
                                <h3 class="card-title">Mechanics</h3>
                            </div>
                            <div class="card-content">
                                <p>Analyze motion, forces, and energy through projectile motion and collision simulations.</p>
                                <button class="btn btn-primary" style="margin-top: 1rem;">
                                    <i data-lucide="play"></i>
                                    Launch Simulation
                                </button>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <div class="card-icon">
                                    <i data-lucide="eye"></i>
                                </div>
                                <h3 class="card-title">Optics</h3>
                            </div>
                            <div class="card-content">
                                <p>Explore light behavior, lens systems, and optical phenomena through ray tracing simulations.</p>
                                <button class="btn btn-primary" style="margin-top: 1rem;">
                                    <i data-lucide="play"></i>
                                    Launch Simulation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="page-section">
                    <h2 class="section-title">Virtual Laboratory</h2>
                    <div class="card">
                        <div class="card-content">
                            <div style="background: linear-gradient(135deg, #f8f9fa, #e9ecef); padding: 2rem; border-radius: 12px; text-align: center;">
                                <div style="width: 80px; height: 80px; background: var(--harvard-crimson); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
                                    <i data-lucide="flask-conical" style="width: 40px; height: 40px; color: white;"></i>
                                </div>
                                <h3 style="color: var(--harvard-black); margin-bottom: 1rem;">Advanced Physics Laboratory</h3>
                                <p style="color: var(--harvard-medium-gray); margin-bottom: 2rem; max-width: 600px; margin-left: auto; margin-right: auto;">
                                    Access our comprehensive virtual physics laboratory with over 50 interactive experiments covering all major physics topics. Conduct experiments safely and repeatedly to master complex concepts.
                                </p>
                                <button class="btn btn-primary" style="font-size: 1.125rem; padding: 1rem 2rem;">
                                    <i data-lucide="microscope"></i>
                                    Enter Virtual Lab
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getEWritersContent() {
        return `
            <div class="page-header">
                <div class="container">
                    <h1>E-Writers Platform</h1>
                    <p>Student publication platform for creative writing, journalism, and academic articles</p>
                </div>
            </div>

            <div class="container">
                <div class="page-section">
                    <h2 class="section-title">Featured Publications</h2>
                    
                    <div class="card-grid">
                        <div class="card">
                            <div class="card-header">
                                <div class="card-icon">
                                    <i data-lucide="newspaper"></i>
                                </div>
                                <h3 class="card-title">The Mengo Chronicle</h3>
                            </div>
                            <div class="card-content">
                                <p>Our monthly school newspaper featuring news, events, and student perspectives on current affairs.</p>
                                <div style="margin-top: 1rem;">
                                    <span style="background: #e3f2fd; color: #1976d2; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.875rem;">Latest Issue: Dec 2024</span>
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <div class="card-icon">
                                    <i data-lucide="book-open"></i>
                                </div>
                                <h3 class="card-title">Literary Magazine</h3>
                            </div>
                            <div class="card-content">
                                <p>Quarterly publication showcasing student poetry, short stories, and creative writing pieces.</p>
                                <div style="margin-top: 1rem;">
                                    <span style="background: #e8f5e8; color: #2e7d32; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.875rem;">Issue 4, 2024</span>
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <div class="card-icon">
                                    <i data-lucide="microscope"></i>
                                </div>
                                <h3 class="card-title">Science Journal</h3>
                            </div>
                            <div class="card-content">
                                <p>Student research papers, science fair projects, and STEM-related articles and discoveries.</p>
                                <div style="margin-top: 1rem;">
                                    <span style="background: #fff3e0; color: #f57c00; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.875rem;">Vol. 12, 2024</span>
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <div class="card-icon">
                                    <i data-lucide="camera"></i>
                                </div>
                                <h3 class="card-title">Photo Essays</h3>
                            </div>
                            <div class="card-content">
                                <p>Visual storytelling through photography, documenting school life and community events.</p>
                                <div style="margin-top: 1rem;">
                                    <span style="background: #fce4ec; color: #c2185b; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.875rem;">Monthly Feature</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="page-section">
                    <h2 class="section-title">Writing Opportunities</h2>
                    <div class="card">
                        <div class="card-content">
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                                <div>
                                    <h4 style="color: var(--harvard-crimson); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                                        <i data-lucide="pen-tool" style="width: 20px; height: 20px;"></i>
                                        Submit Your Work
                                    </h4>
                                    <p style="margin-bottom: 1rem;">Share your creative writing, journalism, or academic articles with the school community.</p>
                                    <button class="btn btn-primary">
                                        <i data-lucide="upload"></i>
                                        Submit Article
                                    </button>
                                </div>
                                
                                <div>
                                    <h4 style="color: var(--harvard-crimson); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                                        <i data-lucide="users" style="width: 20px; height: 20px;"></i>
                                        Join Editorial Team
                                    </h4>
                                    <p style="margin-bottom: 1rem;">Become part of our editorial team and help shape school publications.</p>
                                    <button class="btn btn-secondary">
                                        <i data-lucide="user-plus"></i>
                                        Apply Now
                                    </button>
                                </div>
                                
                                <div>
                                    <h4 style="color: var(--harvard-crimson); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                                        <i data-lucide="award" style="width: 20px; height: 20px;"></i>
                                        Writing Contests
                                    </h4>
                                    <p style="margin-bottom: 1rem;">Participate in monthly writing competitions with exciting prizes and recognition.</p>
                                    <button class="btn btn-secondary">
                                        <i data-lucide="trophy"></i>
                                        View Contests
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="page-section">
                    <h2 class="section-title">Recent Articles</h2>
                    <div style="display: grid; gap: 1.5rem;">
                        <article style="border: 1px solid #e0e0e0; border-radius: 12px; padding: 1.5rem; background: white;">
                            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                                <div style="width: 40px; height: 40px; background: var(--harvard-crimson); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                    <span style="color: white; font-weight: bold;">JM</span>
                                </div>
                                <div>
                                    <h4 style="margin: 0; color: var(--harvard-black);">The Future of Education Technology</h4>
                                    <p style="margin: 0; color: var(--harvard-medium-gray); font-size: 0.875rem;">By John Mukasa • Dec 12, 2024</p>
                                </div>
                            </div>
                            <p style="color: var(--harvard-dark-gray); line-height: 1.6;">
                                Exploring how artificial intelligence and virtual reality are transforming the educational landscape at Mengo Senior School and beyond...
                            </p>
                        </article>

                        <article style="border: 1px solid #e0e0e0; border-radius: 12px; padding: 1.5rem; background: white;">
                            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                                <div style="width: 40px; height: 40px; background: var(--harvard-crimson); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                    <span style="color: white; font-weight: bold;">AN</span>
                                </div>
                                <div>
                                    <h4 style="margin: 0; color: var(--harvard-black);">Climate Change: A Student's Perspective</h4>
                                    <p style="margin: 0; color: var(--harvard-medium-gray); font-size: 0.875rem;">By Alice Nambi • Dec 10, 2024</p>
                                </div>
                            </div>
                            <p style="color: var(--harvard-dark-gray); line-height: 1.6;">
                                A thoughtful analysis of environmental challenges facing Uganda and the role young people can play in creating sustainable solutions...
                            </p>
                        </article>
                    </div>
                </div>
            </div>
        `;
    }

    getParentsContent() {
        return `
            <div class="page-header">
                <div class="container">
                    <h1>Parents Platform</h1>
                    <p>Monitor your child's progress and connect with the school community</p>
                </div>
            </div>

            <div class="container">
                <div class="page-section">
                    <h2 class="section-title">Student Progress Dashboard</h2>
                    
                    <div class="card-grid">
                        <div class="card">
                            <div class="card-header">
                                <div class="card-icon">
                                    <i data-lucide="bar-chart-3"></i>
                                </div>
                                <h3 class="card-title">Academic Performance</h3>
                            </div>
                            <div class="card-content">
                                <p>View detailed academic reports, term averages, and subject-wise performance analysis.</p>
                                <div style="margin-top: 1rem;">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                        <span>Overall Average</span>
                                        <span style="font-weight: bold; color: var(--harvard-green);">87%</span>
                                    </div>
                                    <div style="background: #e0e0e0; height: 8px; border-radius: 4px;">
                                        <div style="background: var(--harvard-green); height: 100%; width: 87%; border-radius: 4px;"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <div class="card-icon">
                                    <i data-lucide="calendar-check"></i>
                                </div>
                                <h3 class="card-title">Attendance Record</h3>
                            </div>
                            <div class="card-content">
                                <p>Track daily attendance, punctuality, and participation in school activities.</p>
                                <div style="margin-top: 1rem;">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                        <span>Attendance Rate</span>
                                        <span style="font-weight: bold; color: var(--harvard-blue);">96%</span>
                                    </div>
                                    <div style="background: #e0e0e0; height: 8px; border-radius: 4px;">
                                        <div style="background: var(--harvard-blue); height: 100%; width: 96%; border-radius: 4px;"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <div class="card-icon">
                                    <i data-lucide="trophy"></i>
                                </div>
                                <h3 class="card-title">Achievements</h3>
                            </div>
                            <div class="card-content">
                                <p>Celebrate your child's accomplishments in academics, sports, and extracurricular activities.</p>
                                <div style="margin-top: 1rem;">
                                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                        <i data-lucide="medal" style="width: 16px; height: 16px; color: var(--harvard-gold);"></i>
                                        <span style="font-size: 0.875rem;">Mathematics Competition - 1st Place</span>
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                                        <i data-lucide="star" style="width: 16px; height: 16px; color: var(--harvard-gold);"></i>
                                        <span style="font-size: 0.875rem;">Perfect Attendance Award</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <div class="card-icon">
                                    <i data-lucide="message-square"></i>
                                </div>
                                <h3 class="card-title">Communication</h3>
                            </div>
                            <div class="card-content">
                                <p>Stay connected with teachers and receive important announcements and updates.</p>
                                <div style="margin-top: 1rem;">
                                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                        <div style="width: 8px; height: 8px; background: var(--harvard-crimson); border-radius: 50%;"></div>
                                        <span style="font-size: 0.875rem;">3 new messages</span>
                                    </div>
                                    <button class="btn btn-secondary" style="width: 100%; margin-top: 0.5rem;">
                                        <i data-lucide="mail"></i>
                                        View Messages
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="page-section">
                    <h2 class="section-title">School Information</h2>
                    <div class="card">
                        <div class="card-content">
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                                <div>
                                    <h4 style="color: var(--harvard-crimson); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                                        <i data-lucide="calendar" style="width: 20px; height: 20px;"></i>
                                        Academic Calendar
                                    </h4>
                                    <ul style="list-style: none; padding: 0;">
                                        <li style="margin-bottom: 0.5rem; padding: 0.5rem; background: #f8f9fa; border-radius: 4px;">
                                            <strong>Dec 16-20:</strong> End of Term Examinations
                                        </li>
                                        <li style="margin-bottom: 0.5rem; padding: 0.5rem; background: #f8f9fa; border-radius: 4px;">
                                            <strong>Dec 21:</strong> Term Closing Ceremony
                                        </li>
                                        <li style="margin-bottom: 0.5rem; padding: 0.5rem; background: #f8f9fa; border-radius: 4px;">
                                            <strong>Jan 15:</strong> New Term Begins
                                        </li>
                                    </ul>
                                </div>
                                
                                <div>
                                    <h4 style="color: var(--harvard-crimson); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                                        <i data-lucide="credit-card" style="width: 20px; height: 20px;"></i>
                                        Fee Information
                                    </h4>
                                    <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 1rem;">
                                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                            <span>Term Fee Status:</span>
                                            <span style="color: var(--harvard-green); font-weight: bold;">Paid</span>
                                        </div>
                                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                            <span>Next Payment Due:</span>
                                            <span>Jan 10, 2025</span>
                                        </div>
                                        <button class="btn btn-primary" style="width: 100%; margin-top: 1rem;">
                                            <i data-lucide="download"></i>
                                            Download Receipt
                                        </button>
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 style="color: var(--harvard-crimson); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                                        <i data-lucide="bus" style="width: 20px; height: 20px;"></i>
                                        Transport Information
                                    </h4>
                                    <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 1rem;">
                                        <div style="margin-bottom: 0.5rem;">
                                            <strong>Route:</strong> Kampala - Mengo Hill
                                        </div>
                                        <div style="margin-bottom: 0.5rem;">
                                            <strong>Pick-up Time:</strong> 6:30 AM
                                        </div>
                                        <div style="margin-bottom: 0.5rem;">
                                            <strong>Drop-off Time:</strong> 5:00 PM
                                        </div>
                                        <div style="margin-bottom: 1rem;">
                                            <strong>Driver:</strong> Mr. Joseph Kato
                                        </div>
                                        <button class="btn btn-secondary" style="width: 100%;">
                                            <i data-lucide="phone"></i>
                                            Contact Driver
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="page-section">
                    <h2 class="section-title">Parent Resources</h2>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                        <div class="card">
                            <div class="card-content">
                                <h4 style="color: var(--harvard-crimson); margin-bottom: 1rem;">Parent Handbook</h4>
                                <p style="margin-bottom: 1rem;">Comprehensive guide to school policies, procedures, and expectations.</p>
                                <button class="btn btn-secondary">
                                    <i data-lucide="book"></i>
                                    Download PDF
                                </button>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-content">
                                <h4 style="color: var(--harvard-crimson); margin-bottom: 1rem;">Parent-Teacher Meetings</h4>
                                <p style="margin-bottom: 1rem;">Schedule and attend virtual or in-person meetings with teachers.</p>
                                <button class="btn btn-secondary">
                                    <i data-lucide="calendar-plus"></i>
                                    Schedule Meeting
                                </button>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-content">
                                <h4 style="color: var(--harvard-crimson); margin-bottom: 1rem;">Support Resources</h4>
                                <p style="margin-bottom: 1rem;">Access counseling services and academic support resources.</p>
                                <button class="btn btn-secondary">
                                    <i data-lucide="help-circle"></i>
                                    Get Support
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getArchiveContent() {
        return `
            <div class="page-header">
                <div class="container">
                    <h1>School Archive</h1>
                    <p>Preserving 130 years of Mengo Senior School history and heritage</p>
                </div>
            </div>

            <div class="container">
                <div class="page-section">
                    <h2 class="section-title">Historical Collections</h2>
                    
                    <div class="card-grid">
                        <div class="card">
                            <div class="card-header">
                                <div class="card-icon">
                                    <i data-lucide="scroll"></i>
                                </div>
                                <h3 class="card-title">Founding Documents</h3>
                            </div>
                            <div class="card-content">
                                <p>Original charter, founding documents, and early administrative records from 1895.</p>
                                <div style="margin-top: 1rem;">
                                    <span style="background: #e3f2fd; color: #1976d2; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.875rem;">1895-1920</span>
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <div class="card-icon">
                                    <i data-lucide="camera"></i>
                                </div>
                                <h3 class="card-title">Photo Archives</h3>
                            </div>
                            <div class="card-content">
                                <p>Extensive collection of photographs documenting school life, events, and notable visitors.</p>
                                <div style="margin-top: 1rem;">
                                    <span style="background: #e8f5e8; color: #2e7d32; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.875rem;">10,000+ Photos</span>
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <div class="card-icon">
                                    <i data-lucide="newspaper"></i>
                                </div>
                                <h3 class="card-title">School Publications</h3>
                            </div>
                            <div class="card-content">
                                <p>Complete collection of school magazines, newsletters, and student publications.</p>
                                <div style="margin-top: 1rem;">
                                    <span style="background: #fff3e0; color: #f57c00; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.875rem;">500+ Issues</span>
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <div class="card-icon">
                                    <i data-lucide="graduation-cap"></i>
                                </div>
                                <h3 class="card-title">Alumni Records</h3>
                            </div>
                            <div class="card-content">
                                <p>Comprehensive database of alumni achievements, career paths, and contributions.</p>
                                <div style="margin-top: 1rem;">
                                    <span style="background: #fce4ec; color: #c2185b; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.875rem;">25,000+ Records</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="page-section">
                    <h2 class="section-title">Timeline of Excellence</h2>
                    <div class="card">
                        <div class="card-content">
                            <div style="position: relative; padding-left: 2rem;">
                                <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: var(--harvard-crimson);"></div>
                                
                                <div style="position: relative; margin-bottom: 2rem;">
                                    <div style="position: absolute; left: -1.5rem; top: 0.5rem; width: 12px; height: 12px; background: var(--harvard-crimson); border-radius: 50%;"></div>
                                    <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--harvard-crimson);">
                                        <h4 style="color: var(--harvard-crimson); margin-bottom: 0.5rem;">1895 - Foundation</h4>
                                        <p style="margin: 0;">Mengo Senior School established by the Church Missionary Society as a center for education and character development.</p>
                                    </div>
                                </div>

                                <div style="position: relative; margin-bottom: 2rem;">
                                    <div style="position: absolute; left: -1.5rem; top: 0.5rem; width: 12px; height: 12px; background: var(--harvard-crimson); border-radius: 50%;"></div>
                                    <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--harvard-crimson);">
                                        <h4 style="color: var(--harvard-crimson); margin-bottom: 0.5rem;">1920s - Expansion Era</h4>
                                        <p style="margin: 0;">Major infrastructure development including new dormitories, classrooms, and the iconic school chapel.</p>
                                    </div>
                                </div>

                                <div style="position: relative; margin-bottom: 2rem;">
                                    <div style="position: absolute; left: -1.5rem; top: 0.5rem; width: 12px; height: 12px; background: var(--harvard-crimson); border-radius: 50%;"></div>
                                    <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--harvard-crimson);">
                                        <h4 style="color: var(--harvard-crimson); margin-bottom: 0.5rem;">1962 - Independence</h4>
                                        <p style="margin: 0;">School plays crucial role in Uganda's independence, with many alumni becoming national leaders.</p>
                                    </div>
                                </div>

                                <div style="position: relative; margin-bottom: 2rem;">
                                    <div style="position: absolute; left: -1.5rem; top: 0.5rem; width: 12px; height: 12px; background: var(--harvard-crimson); border-radius: 50%;"></div>
                                    <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--harvard-crimson);">
                                        <h4 style="color: var(--harvard-crimson); margin-bottom: 0.5rem;">1990s - Modernization</h4>
                                        <p style="margin: 0;">Introduction of computer laboratories, modern science facilities, and expanded curriculum offerings.</p>
                                    </div>
                                </div>

                                <div style="position: relative;">
                                    <div style="position: absolute; left: -1.5rem; top: 0.5rem; width: 12px; height: 12px; background: var(--harvard-crimson); border-radius: 50%;"></div>
                                    <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--harvard-crimson);">
                                        <h4 style="color: var(--harvard-crimson); margin-bottom: 0.5rem;">2020s - Digital Transformation</h4>
                                        <p style="margin: 0;">Launch of comprehensive digital learning platform and enhanced online resources for students and alumni.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="page-section">
                    <h2 class="section-title">Notable Alumni</h2>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                        <div class="card">
                            <div style="text-align: center; padding: 1rem;">
                                <div style="width: 80px; height: 80px; background: var(--harvard-crimson); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
                                    <span style="color: white; font-size: 1.5rem; font-weight: bold;">JK</span>
                                </div>
                                <h4 style="color: var(--harvard-black); margin-bottom: 0.5rem;">Dr. John Kiggundu</h4>
                                <p style="color: var(--harvard-medium-gray); font-size: 0.9rem; margin-bottom: 0.5rem;">Class of 1975</p>
                                <p style="color: var(--harvard-dark-gray); font-size: 0.875rem;">Former Minister of Health, renowned surgeon and medical researcher.</p>
                            </div>
                        </div>

                        <div class="card">
                            <div style="text-align: center; padding: 1rem;">
                                <div style="width: 80px; height: 80px; background: var(--harvard-crimson); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
                                    <span style="color: white; font-size: 1.5rem; font-weight: bold;">MN</span>
                                </div>
                                <h4 style="color: var(--harvard-black); margin-bottom: 0.5rem;">Prof. Mary Namusoke</h4>
                                <p style="color: var(--harvard-medium-gray); font-size: 0.9rem; margin-bottom: 0.5rem;">Class of 1982</p>
                                <p style="color: var(--harvard-dark-gray); font-size: 0.875rem;">Vice-Chancellor, Makerere University, leading educator and researcher.</p>
                            </div>
                        </div>

                        <div class="card">
                            <div style="text-align: center; padding: 1rem;">
                                <div style="width: 80px; height: 80px; background: var(--harvard-crimson); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
                                    <span style="color: white; font-size: 1.5rem; font-weight: bold;">DM</span>
                                </div>
                                <h4 style="color: var(--harvard-black); margin-bottom: 0.5rem;">David Mukasa</h4>
                                <p style="color: var(--harvard-medium-gray); font-size: 0.9rem; margin-bottom: 0.5rem;">Class of 1990</p>
                                <p style="color: var(--harvard-dark-gray); font-size: 0.875rem;">CEO of East Africa's largest telecommunications company.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getMOSAContent() {
        return `
            <div class="page-header">
                <div class="container">
                    <h1>MOSA - Mengo Old Students Association</h1>
                    <p>Connecting generations of Mengo leaders worldwide through professional networking and lifelong bonds</p>
                </div>
            </div>

            <div class="container">
                <div class="page-section">
                    <h2 class="section-title">Alumni Network</h2>
                    
                    <div class="card-grid">
                        <div class="card">
                            <div class="card-header">
                                <div class="card-icon">
                                    <i data-lucide="users"></i>
                                </div>
                                <h3 class="card-title">Professional Network</h3>
                            </div>
                            <div class="card-content">
                                <p>Connect with fellow alumni across industries, share opportunities, and build meaningful professional relationships.</p>
                                <div style="margin-top: 1rem;">
                                    <span style="background: #e3f2fd; color: #1976d2; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.875rem;">25,000+ Members</span>
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <div class="card-icon">
                                    <i data-lucide="briefcase"></i>
                                </div>
                                <h3 class="card-title">Career Opportunities</h3>
                            </div>
                            <div class="card-content">
                                <p>Access exclusive job postings, mentorship programs, and career development resources.</p>
                                <div style="margin-top: 1rem;">
                                    <span style="background: #e8f5e8; color: #2e7d32; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.875rem;">500+ Active Jobs</span>
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <div class="card-icon">
                                    <i data-lucide="heart"></i>
                                </div>
                                <h3 class="card-title">Give Back</h3>
                            </div>
                            <div class="card-content">
                                <p>Support current students through scholarships, mentorship, and school development projects.</p>
                                <div style="margin-top: 1rem;">
                                    <span style="background: #fff3e0; color: #f57c00; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.875rem;">$2M+ Donated</span>
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <div class="card-icon">
                                    <i data-lucide="calendar"></i>
                                </div>
                                <h3 class="card-title">Events & Reunions</h3>
                            </div>
                            <div class="card-content">
                                <p>Join alumni gatherings, professional seminars, and annual reunions worldwide.</p>
                                <div style="margin-top: 1rem;">
                                    <span style="background: #fce4ec; color: #c2185b; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.875rem;">50+ Events/Year</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="page-section">
                    <h2 class="section-title">Alumni Directory</h2>
                    <div class="card">
                        <div class="card-content">
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                                <div>
                                    <h4 style="color: var(--harvard-crimson); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                                        <i data-lucide="search" style="width: 20px; height: 20px;"></i>
                                        Find Alumni
                                    </h4>
                                    <div style="margin-bottom: 1rem;">
                                        <input type="text" placeholder="Search by name, class year, or profession" style="width: 100%; padding: 0.75rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem;">
                                    </div>
                                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                                        <button class="btn btn-secondary" style="font-size: 0.875rem; padding: 0.5rem 1rem;">By Industry</button>
                                        <button class="btn btn-secondary" style="font-size: 0.875rem; padding: 0.5rem 1rem;">By Location</button>
                                        <button class="btn btn-secondary" style="font-size: 0.875rem; padding: 0.5rem 1rem;">By Class Year</button>
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 style="color: var(--harvard-crimson); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                                        <i data-lucide="trending-up" style="width: 20px; height: 20px;"></i>
                                        Popular Industries
                                    </h4>
                                    <div style="display: grid; gap: 0.5rem;">
                                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background: #f8f9fa; border-radius: 4px;">
                                            <span>Healthcare & Medicine</span>
                                            <span style="font-weight: bold; color: var(--harvard-crimson);">2,450</span>
                                        </div>
                                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background: #f8f9fa; border-radius: 4px;">
                                            <span>Education & Academia</span>
                                            <span style="font-weight: bold; color: var(--harvard-crimson);">1,890</span>
                                        </div>
                                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background: #f8f9fa; border-radius: 4px;">
                                            <span>Business & Finance</span>
                                            <span style="font-weight: bold; color: var(--harvard-crimson);">1,650</span>
                                        </div>
                                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background: #f8f9fa; border-radius: 4px;">
                                            <span>Government & Public Service</span>
                                            <span style="font-weight: bold; color: var(--harvard-crimson);">1,200</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 style="color: var(--harvard-crimson); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                                        <i data-lucide="user-plus" style="width: 20px; height: 20px;"></i>
                                        Join MOSA
                                    </h4>
                                    <p style="margin-bottom: 1rem; font-size: 0.9rem;">Create your alumni profile and connect with the global Mengo community.</p>
                                    <div style="margin-bottom: 1rem;">
                                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                            <i data-lucide="check" style="width: 16px; height: 16px; color: var(--harvard-green);"></i>
                                            <span style="font-size: 0.875rem;">Professional networking</span>
                                        </div>
                                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                            <i data-lucide="check" style="width: 16px; height: 16px; color: var(--harvard-green);"></i>
                                            <span style="font-size: 0.875rem;">Career opportunities</span>
                                        </div>
                                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                            <i data-lucide="check" style="width: 16px; height: 16px; color: var(--harvard-green);"></i>
                                            <span style="font-size: 0.875rem;">Exclusive events</span>
                                        </div>
                                    </div>
                                    <button class="btn btn-primary btn-large" onclick="window.mengoApp.getComponent('pageManager').showAlumniProfileCreation()" style="width: 100%;">
                                        <i data-lucide="user-plus"></i>
                                        Create Your Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="page-section">
                    <h2 class="section-title">Featured Alumni</h2>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 1.5rem;">
                        <div class="card">
                            <div style="display: flex; gap: 1rem; padding: 1rem;">
                                <div style="width: 80px; height: 80px; background: var(--harvard-crimson); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                    <span style="color: white; font-size: 1.5rem; font-weight: bold;">SK</span>
                                </div>
                                <div style="flex: 1;">
                                    <h4 style="color: var(--harvard-black); margin-bottom: 0.25rem;">Dr. Sarah Kigozi</h4>
                                    <p style="color: var(--harvard-medium-gray); font-size: 0.9rem; margin-bottom: 0.5rem;">Class of 1985 • Cardiologist</p>
                                    <p style="color: var(--harvard-dark-gray); font-size: 0.875rem; margin-bottom: 1rem;">Leading heart surgeon at Mulago Hospital, pioneering cardiac procedures in East Africa.</p>
                                    <div style="display: flex; gap: 0.5rem;">
                                        <span style="background: #e3f2fd; color: #1976d2; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">Healthcare</span>
                                        <span style="background: #e8f5e8; color: #2e7d32; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">Kampala</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <div style="display: flex; gap: 1rem; padding: 1rem;">
                                <div style="width: 80px; height: 80px; background: var(--harvard-crimson); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                    <span style="color: white; font-size: 1.5rem; font-weight: bold;">JM</span>
                                </div>
                                <div style="flex: 1;">
                                    <h4 style="color: var(--harvard-black); margin-bottom: 0.25rem;">James Muwanga</h4>
                                    <p style="color: var(--harvard-medium-gray); font-size: 0.9rem; margin-bottom: 0.5rem;">Class of 1992 • Tech Entrepreneur</p>
                                    <p style="color: var(--harvard-dark-gray); font-size: 0.875rem; margin-bottom: 1rem;">Founder & CEO of TechAfrica, leading fintech innovation across the continent.</p>
                                    <div style="display: flex; gap: 0.5rem;">
                                        <span style="background: #fff3e0; color: #f57c00; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">Technology</span>
                                        <span style="background: #fce4ec; color: #c2185b; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">Nairobi</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <div style="display: flex; gap: 1rem; padding: 1rem;">
                                <div style="width: 80px; height: 80px; background: var(--harvard-crimson); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                    <span style="color: white; font-size: 1.5rem; font-weight: bold;">AN</span>
                                </div>
                                <div style="flex: 1;">
                                    <h4 style="color: var(--harvard-black); margin-bottom: 0.25rem;">Prof. Alice Namukasa</h4>
                                    <p style="color: var(--harvard-medium-gray); font-size: 0.9rem; margin-bottom: 0.5rem;">Class of 1978 • Academic Leader</p>
                                    <p style="color: var(--harvard-dark-gray); font-size: 0.875rem; margin-bottom: 1rem;">Dean of Engineering at MIT, renowned researcher in sustainable energy systems.</p>
                                    <div style="display: flex; gap: 0.5rem;">
                                        <span style="background: #e8f5e8; color: #2e7d32; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">Academia</span>
                                        <span style="background: #e3f2fd; color: #1976d2; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">Boston</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="page-section">
                    <h2 class="section-title">Upcoming Events</h2>
                    <div style="display: grid; gap: 1rem;">
                        <div class="card">
                            <div style="display: flex; gap: 1.5rem; padding: 1.5rem;">
                                <div style="text-align: center; min-width: 80px;">
                                    <div style="background: var(--harvard-crimson); color: white; padding: 0.5rem; border-radius: 8px 8px 0 0; font-weight: bold;">JAN</div>
                                    <div style="background: #f8f9fa; color: var(--harvard-black); padding: 0.5rem; border-radius: 0 0 8px 8px; font-size: 1.5rem; font-weight: bold;">15</div>
                                </div>
                                <div style="flex: 1;">
                                    <h4 style="color: var(--harvard-black); margin-bottom: 0.5rem;">Annual Alumni Gala</h4>
                                    <p style="color: var(--harvard-medium-gray); margin-bottom: 0.5rem;">Kampala Serena Hotel • 7:00 PM</p>
                                    <p style="color: var(--harvard-dark-gray); font-size: 0.9rem;">Join us for an evening of networking, awards, and celebration of alumni achievements.</p>
                                </div>
                                <div style="display: flex; align-items: center;">
                                    <button class="btn btn-primary">Register</button>
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <div style="display: flex; gap: 1.5rem; padding: 1.5rem;">
                                <div style="text-align: center; min-width: 80px;">
                                    <div style="background: var(--harvard-crimson); color: white; padding: 0.5rem; border-radius: 8px 8px 0 0; font-weight: bold;">FEB</div>
                                    <div style="background: #f8f9fa; color: var(--harvard-black); padding: 0.5rem; border-radius: 0 0 8px 8px; font-size: 1.5rem; font-weight: bold;">22</div>
                                </div>
                                <div style="flex: 1;">
                                    <h4 style="color: var(--harvard-black); margin-bottom: 0.5rem;">Career Mentorship Workshop</h4>
                                    <p style="color: var(--harvard-medium-gray); margin-bottom: 0.5rem;">Virtual Event • 2:00 PM EAT</p>
                                    <p style="color: var(--harvard-dark-gray); font-size: 0.9rem;">Professional development session connecting experienced alumni with recent graduates.</p>
                                </div>
                                <div style="display: flex; align-items: center;">
                                    <button class="btn btn-secondary">Join Online</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getAlumniProfileCreationHTML() {
        return `
            <div class="alumni-profile-creation">
                <div class="profile-header">
                    <div class="profile-icon">
                        <i data-lucide="user-plus"></i>
                    </div>
                    <h2>Create Your Alumni Profile</h2>
                    <p>Join the Mengo Old Students' Association and connect with fellow alumni worldwide.</p>
                </div>

                <div class="profile-progress">
                    <div class="progress-steps">
                        <div class="step active" data-step="1">
                            <div class="step-number">1</div>
                            <div class="step-label">Verification</div>
                        </div>
                        <div class="step" data-step="2">
                            <div class="step-number">2</div>
                            <div class="step-label">Bio Data</div>
                        </div>
                        <div class="step" data-step="3">
                            <div class="step-number">3</div>
                            <div class="step-label">Achievements</div>
                        </div>
                        <div class="step" data-step="4">
                            <div class="step-number">4</div>
                            <div class="step-label">Professional</div>
                        </div>
                        <div class="step" data-step="5">
                            <div class="step-number">5</div>
                            <div class="step-label">Documents</div>
                        </div>
                    </div>
                </div>

                <div class="profile-form-container">
                    <div class="form-step active" id="step-1">
                        <h3>Alumni Verification</h3>
                        <p>Please provide your school details for verification.</p>
                        
                        <form class="verification-form" id="alumni-verification-form">
                            <div class="form-group">
                                <label for="index-number">Index Number</label>
                                <input type="text" id="index-number" placeholder="MSS/2020/001" required>
                                <small>Format: MSS/YEAR/NUMBER</small>
                            </div>
                            
                            <div class="form-group">
                                <label for="graduation-year">Graduation Year</label>
                                <select id="graduation-year" required>
                                    <option value="">Select Year</option>
                                    ${this.generateYearOptions()}
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="alumni-password">Create Password</label>
                                <div class="password-input">
                                    <input type="password" id="alumni-password" required>
                                    <button type="button" class="password-toggle" data-target="alumni-password">
                                        <i data-lucide="eye"></i>
                                    </button>
                                </div>
                                <div class="password-strength">
                                    <div class="strength-bar">
                                        <div class="strength-fill"></div>
                                    </div>
                                    <div class="strength-text">Password strength: Very Weak</div>
                                </div>
                            </div>
                            
                            <button type="submit" class="btn btn-primary next-step-btn" data-next="2" type="button">
                                Continue to Bio Data
                                <i data-lucide="arrow-right"></i>
                            </button>
                        </form>
                    </div>
                    
                    <div class="form-step" id="step-2">
                        <h3>Bio Data Confirmation</h3>
                        <p>Confirm your personal information (can only be edited once).</p>
                        
                        <div class="bio-data-form">
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Full Name</label>
                                    <input type="text" value="John Doe Mukasa" readonly>
                                    <button type="button" class="edit-btn edit-field-btn" data-field="full-name">Edit</button>
                                </div>
                                <div class="form-group">
                                    <label>Date of Birth</label>
                                    <input type="date" value="1995-03-15" readonly>
                                    <button type="button" class="edit-btn edit-field-btn" data-field="dob">Edit</button>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Gender</label>
                                    <select disabled>
                                        <option selected>Male</option>
                                    </select>
                                    <button type="button" class="edit-btn edit-field-btn" data-field="gender">Edit</button>
                                </div>
                                <div class="form-group">
                                    <label>Nationality</label>
                                    <input type="text" value="Ugandan" readonly>
                                    <button type="button" class="edit-btn edit-field-btn" data-field="nationality">Edit</button>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label>Current Location</label>
                                <input type="text" placeholder="City, Country">
                            </div>
                            
                            <div class="form-actions">
                                <button type="button" class="btn btn-secondary prev-step-btn" data-prev="1">
                                    <i data-lucide="arrow-left"></i>
                                    Back
                                </button>
                                <button type="button" class="btn btn-primary next-step-btn" data-next="3">
                                    Continue to Achievements
                                    <i data-lucide="arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-step" id="step-3">
                        <h3>School Achievements Display</h3>
                        <p>Choose which achievements to display on your profile.</p>
                        
                        <div class="achievements-control">
                            <div class="achievement-category">
                                <div class="category-header">
                                    <h4>Academic Achievements</h4>
                                    <label class="toggle-switch">
                                        <input type="checkbox" class="achievement-toggle" checked>
                                        <span class="slider"></span>
                                    </label>
                                </div>
                                <div class="achievement-items">
                                    <div class="achievement-item">
                                        <span>Best in Mathematics (2019)</span>
                                        <label class="toggle-switch">
                                            <input type="checkbox" class="achievement-toggle" checked>
                                            <span class="slider"></span>
                                        </label>
                                    </div>
                                    <div class="achievement-item">
                                        <span>Science Fair Winner (2018)</span>
                                        <label class="toggle-switch">
                                            <input type="checkbox" class="achievement-toggle" checked>
                                            <span class="slider"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="achievement-category">
                                <div class="category-header">
                                    <h4>Leadership & Sports</h4>
                                    <label class="toggle-switch">
                                        <input type="checkbox" class="achievement-toggle" checked>
                                        <span class="slider"></span>
                                    </label>
                                </div>
                                <div class="achievement-items">
                                    <div class="achievement-item">
                                        <span>Head Prefect (2019-2020)</span>
                                        <label class="toggle-switch">
                                            <input type="checkbox" class="achievement-toggle" checked>
                                            <span class="slider"></span>
                                        </label>
                                    </div>
                                    <div class="achievement-item">
                                        <span>Football Captain (2018-2020)</span>
                                        <label class="toggle-switch">
                                            <input type="checkbox" class="achievement-toggle">
                                            <span class="slider"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="privacy-settings">
                                <h4>Privacy Settings</h4>
                                <div class="privacy-options">
                                    <label class="radio-option">
                                        <input type="radio" name="privacy" value="public" checked>
                                        <span>Public - Visible to everyone</span>
                                    </label>
                                    <label class="radio-option">
                                        <input type="radio" name="privacy" value="mosa">
                                        <span>MOSA Members Only</span>
                                    </label>
                                    <label class="radio-option">
                                        <input type="radio" name="privacy" value="private">
                                        <span>Private - Hidden from profile</span>
                                    </label>
                                </div>
                            </div>
                            
                            <div class="form-actions">
                                <button type="button" class="btn btn-secondary prev-step-btn" data-prev="2">
                                    <i data-lucide="arrow-left"></i>
                                    Back
                                </button>
                                <button type="button" class="btn btn-primary next-step-btn" data-next="4">
                                    Continue to Professional Info
                                    <i data-lucide="arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-step" id="step-4">
                        <h3>Professional Information</h3>
                        <p>Share your career and professional achievements.</p>
                        
                        <div class="professional-form">
                            <div class="form-group">
                                <label>Current Position</label>
                                <input type="text" placeholder="Software Engineer">
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Company</label>
                                    <input type="text" placeholder="Tech Solutions Ltd">
                                </div>
                                <div class="form-group">
                                    <label>Industry</label>
                                    <select>
                                        <option value="">Select Industry</option>
                                        <option value="technology">Technology</option>
                                        <option value="healthcare">Healthcare</option>
                                        <option value="education">Education</option>
                                        <option value="finance">Finance</option>
                                        <option value="government">Government</option>
                                        <option value="business">Business</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label>Skills</label>
                                <div class="skills-input">
                                    <input type="text" placeholder="Add a skill and press Enter">
                                    <button type="button" id="add-skill-btn">Add Skill</button>
                                    <div class="skills-tags">
                                        <span class="skill-tag">JavaScript <button type="button">×</button></span>
                                        <span class="skill-tag">Project Management <button type="button">×</button></span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="business-ad-section">
                                <h4>Business Advertisement (Optional)</h4>
                                <p class="ad-notice">
                                    <i data-lucide="info"></i>
                                    All advertisements require admin approval before being displayed.
                                </p>
                                <textarea placeholder="Describe your business or services..."></textarea>
                            </div>
                            
                            <div class="form-actions">
                                <button type="button" class="btn btn-secondary prev-step-btn" data-prev="3">
                                    <i data-lucide="arrow-left"></i>
                                    Back
                                </button>
                                <button type="button" class="btn btn-primary next-step-btn" data-next="5">
                                    Continue to Documents
                                    <i data-lucide="arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-step" id="step-5">
                        <h3>Document Verification</h3>
                        <p>Upload your certificates and awards for AI verification.</p>
                        
                        <div class="document-upload-section">
                            <div class="upload-category">
                                <h4>Academic Certificates</h4>
                                <div class="upload-area" data-category="academic">
                                    <div class="upload-placeholder">
                                        <i data-lucide="upload"></i>
                                        <p>Drag & drop files here or click to browse</p>
                                        <small>PDF, JPG, PNG (Max 5MB each)</small>
                                    </div>
                                    <input type="file" class="file-upload-input" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                                </div>
                                <div class="uploaded-files">
                                    <div class="file-item verified">
                                        <i data-lucide="file-text"></i>
                                        <span>UCE_Certificate.pdf</span>
                                        <div class="verification-status">
                                            <i data-lucide="check-circle"></i>
                                            <span>Verified (97%)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="upload-category">
                                <h4>Professional Certifications</h4>
                                <div class="upload-area" data-category="professional">
                                    <div class="upload-placeholder">
                                        <i data-lucide="upload"></i>
                                        <p>Drag & drop files here or click to browse</p>
                                        <small>PDF, JPG, PNG (Max 5MB each)</small>
                                    </div>
                                    <input type="file" class="file-upload-input" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                                </div>
                            </div>
                            
                            <div class="upload-category">
                                <h4>Awards & Recognition</h4>
                                <div class="upload-area" data-category="awards">
                                    <div class="upload-placeholder">
                                        <i data-lucide="upload"></i>
                                        <p>Drag & drop files here or click to browse</p>
                                        <small>PDF, JPG, PNG (Max 5MB each)</small>
                                    </div>
                                    <input type="file" class="file-upload-input" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                                </div>
                                <div class="uploaded-files">
                                    <div class="file-item pending">
                                        <i data-lucide="file-text"></i>
                                        <span>Leadership_Award.jpg</span>
                                        <div class="verification-status">
                                            <i data-lucide="clock"></i>
                                            <span>Admin Review (92%)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="ai-verification-info">
                                <div class="info-card">
                                    <i data-lucide="brain"></i>
                                    <div>
                                        <h5>AI Verification Process</h5>
                                        <p>Our AI model verifies documents with 95%+ accuracy. Documents below this threshold are forwarded to admin for manual review.</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="form-actions">
                                <button type="button" class="btn btn-secondary prev-step-btn" data-prev="4">
                                    <i data-lucide="arrow-left"></i>
                                    Back
                                </button>
                                <button type="button" class="btn btn-primary" onclick="this.completeProfile()">
                                    Complete Profile
                                    <i data-lucide="check"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateYearOptions() {
        const currentYear = new Date().getFullYear();
        let options = '';
        for (let year = currentYear; year >= 1950; year--) {
            options += `<option value="${year}">${year}</option>`;
        }
        return options;
    }

    showAlumniProfileCreation() {
        const pageContent = document.getElementById('page-content');
        if (!pageContent) return;

        // Show the alumni profile creation form
        pageContent.innerHTML = this.getAlumniProfileCreationHTML();
        
        // Initialize the profile creation functionality
        this.initializeAlumniProfileCreation();
        
        // Update page title
        document.title = 'Create Alumni Profile - MOSA - Mengo Senior School';
        
        // Initialize Lucide icons
        if (window.lucide) {
            lucide.createIcons();
        }
        
        // Initialize the alumni profile creation functionality
        this.initializeAlumniProfileCreation();
    }

    initializeAlumniProfileCreation() {
        // Step navigation
        const nextBtns = document.querySelectorAll('.next-step-btn');
        const prevBtns = document.querySelectorAll('.prev-step-btn');
        
        nextBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const currentStep = parseInt(btn.getAttribute('data-next'));
                this.goToStep(currentStep);
            });
        });
        
        prevBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const currentStep = parseInt(btn.getAttribute('data-prev'));
                this.goToStep(currentStep);
            });
        });
        
        // Form submissions
        const verificationForm = document.getElementById('alumni-verification-form');
        if (verificationForm) {
            verificationForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAlumniVerification(e);
            });
        }
        
        // Bio data editing
        const editBtns = document.querySelectorAll('.edit-field-btn');
        editBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const fieldId = btn.getAttribute('data-field');
                this.toggleFieldEdit(fieldId);
            });
        });
        
        // Achievement toggles
        const achievementToggles = document.querySelectorAll('.achievement-toggle');
        achievementToggles.forEach(toggle => {
            toggle.addEventListener('change', () => {
                this.updateAchievementVisibility();
            });
        });
        
        // File uploads
        const fileInputs = document.querySelectorAll('.file-upload-input');
        fileInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                this.handleFileUpload(e);
            });
        });
        
        // Skills management
        const addSkillBtn = document.getElementById('add-skill-btn');
        if (addSkillBtn) {
            addSkillBtn.addEventListener('click', () => {
                this.addSkill();
            });
        }
        
        // Education management
        const addEducationBtn = document.getElementById('add-education-btn');
        if (addEducationBtn) {
            addEducationBtn.addEventListener('click', () => {
                this.addEducation();
            });
        }
    }

    showParentsPage() {
        const pageContent = document.getElementById('page-content');
        if (!pageContent) return;

        // Check if parent has already authenticated a student
        const authenticatedStudent = localStorage.getItem('parent_authenticated_student');
        
        if (!authenticatedStudent) {
            // Show student authentication interface
            pageContent.innerHTML = this.getParentAuthenticationHTML();
            this.initializeParentAuthentication();
        } else {
            // Show parent dashboard with authenticated student
            pageContent.innerHTML = this.getParentDashboardHTML(JSON.parse(authenticatedStudent));
            this.initializeParentDashboard();
        }
        
        document.title = 'Parents Platform - Mengo Senior School';
        
        if (window.lucide) {
            lucide.createIcons();
        }
    }

    getParentAuthenticationHTML() {
        return `
            <div class="page-header">
                <div class="container">
                    <h1>Parents Platform</h1>
                    <p>Authenticate your child to access their academic progress and school information</p>
                </div>
            </div>

            <div class="container">
                <div class="auth-container">
                    <div class="auth-card">
                        <div class="auth-header">
                            <div class="auth-icon">
                                <i data-lucide="shield-check"></i>
                            </div>
                            <h2>Student Authentication</h2>
                            <p>Please provide your child's information to access their academic records. This can only be done once for security purposes.</p>
                        </div>

                        <form id="student-auth-form" class="auth-form">
                            <div class="form-group">
                                <label for="student-name">Student Full Name</label>
                                <input type="text" id="student-name" name="studentName" required 
                                       placeholder="Enter your child's full name as registered">
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="student-index">Index Number</label>
                                    <input type="text" id="student-index" name="studentIndex" required 
                                           placeholder="e.g., MSS/2024/001">
                                </div>
                                <div class="form-group">
                                    <label for="student-class">Current Class</label>
                                    <select id="student-class" name="studentClass" required>
                                        <option value="">Select Class</option>
                                        <option value="S1">Senior 1</option>
                                        <option value="S2">Senior 2</option>
                                        <option value="S3">Senior 3</option>
                                        <option value="S4">Senior 4</option>
                                        <option value="S5">Senior 5</option>
                                        <option value="S6">Senior 6</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="parent-relationship">Relationship to Student</label>
                                <select id="parent-relationship" name="relationship" required>
                                    <option value="">Select Relationship</option>
                                    <option value="father">Father</option>
                                    <option value="mother">Mother</option>
                                    <option value="guardian">Guardian</option>
                                    <option value="relative">Relative</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label for="verification-code">School Verification Code</label>
                                <input type="text" id="verification-code" name="verificationCode" required 
                                       placeholder="Enter the code provided by the school">
                                <small class="form-help">Contact the school administration if you don't have this code</small>
                            </div>

                            <div class="security-notice">
                                <div class="notice-icon">
                                    <i data-lucide="info"></i>
                                </div>
                                <div class="notice-content">
                                    <h4>Important Security Notice</h4>
                                    <p>This authentication can only be completed once. After successful verification, you will have permanent access to your child's academic information. Please ensure all details are correct.</p>
                                </div>
                            </div>

                            <button type="submit" class="btn btn-primary btn-large">
                                <i data-lucide="shield-check"></i>
                                Authenticate Student
                            </button>
                        </form>
                    </div>

                    <div class="help-section">
                        <h3>Need Help?</h3>
                        <div class="help-grid">
                            <div class="help-item">
                                <i data-lucide="phone"></i>
                                <h4>Call School Office</h4>
                                <p>+256 414 270 251</p>
                            </div>
                            <div class="help-item">
                                <i data-lucide="mail"></i>
                                <h4>Email Administration</h4>
                                <p>parents@mengoseniorschool.ac.ug</p>
                            </div>
                            <div class="help-item">
                                <i data-lucide="clock"></i>
                                <h4>Office Hours</h4>
                                <p>Mon-Fri: 8:00 AM - 5:00 PM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getParentDashboardHTML(studentInfo) {
        return `
            <div class="page-header">
                <div class="container">
                    <h1>Parents Platform</h1>
                    <p>Welcome! You are viewing ${studentInfo.name}'s academic information</p>
                </div>
            </div>

            <div class="container">
                <div class="student-info-banner">
                    <div class="student-avatar">
                        <i data-lucide="user"></i>
                    </div>
                    <div class="student-details">
                        <h2>${studentInfo.name}</h2>
                        <p>Index: ${studentInfo.index} | Class: ${studentInfo.class} | ${studentInfo.relationship}</p>
                    </div>
                    <div class="auth-status">
                        <span class="status-badge verified">
                            <i data-lucide="shield-check"></i>
                            Verified Access
                        </span>
                    </div>
                </div>

                <div class="dashboard-grid">
                    <div class="dashboard-card">
                        <div class="card-header">
                            <i data-lucide="trending-up"></i>
                            <h3>Academic Progress</h3>
                        </div>
                        <div class="progress-overview">
                            ${this.generateSubjectProgress()}
                        </div>
                        <button class="btn btn-secondary">View Detailed Report</button>
                    </div>

                    <div class="dashboard-card">
                        <div class="card-header">
                            <i data-lucide="calendar"></i>
                            <h3>Attendance</h3>
                        </div>
                        <div class="attendance-stats">
                            <div class="stat-item">
                                <span class="stat-value">96%</span>
                                <span class="stat-label">Overall Attendance</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value">2</span>
                                <span class="stat-label">Days Absent This Term</span>
                            </div>
                        </div>
                        <button class="btn btn-secondary">View Attendance Details</button>
                    </div>

                    <div class="dashboard-card">
                        <div class="card-header">
                            <i data-lucide="message-circle"></i>
                            <h3>Messages</h3>
                        </div>
                        <div class="message-preview">
                            <div class="message-item">
                                <strong>Math Teacher:</strong> Excellent performance in recent test
                            </div>
                            <div class="message-item">
                                <strong>Class Teacher:</strong> Parent-teacher meeting scheduled
                            </div>
                        </div>
                        <button class="btn btn-secondary">View All Messages</button>
                    </div>

                    <div class="dashboard-card">
                        <div class="card-header">
                            <i data-lucide="trophy"></i>
                            <h3>Recent Achievements</h3>
                        </div>
                        <div class="achievements-list">
                            <div class="achievement-item">
                                <i data-lucide="medal"></i>
                                <span>Mathematics Competition - 1st Place</span>
                            </div>
                            <div class="achievement-item">
                                <i data-lucide="star"></i>
                                <span>Perfect Attendance Award</span>
                            </div>
                        </div>
                        <button class="btn btn-secondary">View All Achievements</button>
                    </div>
                </div>
            </div>
        `;
    }

    initializeParentAuthentication() {
        const authForm = document.getElementById('student-auth-form');
        if (authForm) {
            authForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleStudentAuthentication(e);
            });
        }
    }

    handleStudentAuthentication(e) {
        const formData = new FormData(e.target);
        const studentData = {
            name: formData.get('studentName'),
            index: formData.get('studentIndex'),
            class: formData.get('studentClass'),
            relationship: formData.get('relationship'),
            verificationCode: formData.get('verificationCode'),
            authenticatedAt: new Date().toISOString()
        };

        // Simulate verification (in real app, this would be server-side)
        if (this.verifyStudentCredentials(studentData)) {
            // Store authenticated student (one-time only)
            localStorage.setItem('parent_authenticated_student', JSON.stringify(studentData));
            
            // Show success message and reload parent dashboard
            this.showNotification('Student authenticated successfully! You now have access to their academic information.', 'success');
            
            setTimeout(() => {
                this.showParentsPage();
            }, 1500);
        } else {
            this.showNotification('Authentication failed. Please check your information and try again.', 'error');
        }
    }

    verifyStudentCredentials(studentData) {
        // Simulate verification logic
        const validIndexPattern = /^MSS\/\d{4}\/\d{3}$/;
        const validVerificationCode = studentData.verificationCode === 'MENGO2024' || studentData.verificationCode === 'DEMO123';
        
        return validIndexPattern.test(studentData.index) && 
               studentData.name.length > 2 && 
               studentData.class && 
               studentData.relationship && 
               validVerificationCode;
    }

    initializeParentDashboard() {
        // Initialize parent dashboard functionality
        console.log('Parent dashboard initialized');
    }

    generateSubjectProgress() {
        const subjects = [
            { name: 'Mathematics', grade: 'A', percentage: 85 },
            { name: 'English', grade: 'B+', percentage: 78 },
            { name: 'Physics', grade: 'A', percentage: 92 },
            { name: 'Chemistry', grade: 'B', percentage: 74 },
            { name: 'Biology', grade: 'A-', percentage: 88 }
        ];

        return subjects.map(subject => `
            <div class="subject-progress">
                <span>${subject.name}</span>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${subject.percentage}%"></div>
                </div>
                <span class="grade">${subject.grade}</span>
            </div>
        `).join('');
    }

    showNotification(message, type = 'info') {
        // Use the main app's notification system
        if (window.mengoApp && window.mengoApp.getComponent('auth')) {
            window.mengoApp.getComponent('auth').showNotification(message, type);
        }
    }

    // Page-specific initialization methods
    initializeAdministration() {
        // Add administration-specific functionality
        console.log('Administration page initialized');
    }

    initializeELibrary() {
        // Add e-library specific functionality
        console.log('E-Library page initialized');
    }

    initializePhysicsSim() {
        // Add physics simulation specific functionality
        console.log('Physics Simulations page initialized');
    }

    initializeEWriters() {
        // Add e-writers specific functionality
        console.log('E-Writers page initialized');
    }

    initializeParents() {
        // Add parents platform specific functionality
        console.log('Parents Platform page initialized');
    }

    initializeArchive() {
        // Add archive specific functionality
        console.log('Archive page initialized');
    }

    initializeMOSA() {
        // Add MOSA specific functionality
        console.log('MOSA page initialized');
    }

    // Public API
    getCurrentPage() {
        return this.currentPage;
    }

    getPageTitle(pageName) {
        return this.pages[pageName]?.title || 'Page Not Found';
    }
}

// Initialize page manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.pageManager = new PageManager();
});

// Export for use in other modules
window.PageManager = PageManager;