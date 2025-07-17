// Authentication System
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuthStatus();
    }

    bindEvents() {
        // Modal controls
        const authModal = document.getElementById('auth-modal');
        const closeAuthModal = document.getElementById('close-auth-modal');
        const showRegister = document.getElementById('show-register');
        const showLogin = document.getElementById('show-login');

        if (closeAuthModal) {
            closeAuthModal.addEventListener('click', () => this.hideAuthModal());
        }

        if (showRegister) {
            showRegister.addEventListener('click', () => this.showRegisterForm());
        }

        if (showLogin) {
            showLogin.addEventListener('click', () => this.showLoginForm());
        }

        // Form submissions
        const loginForm = document.getElementById('login-form-element');
        const registerForm = document.getElementById('register-form-element');
        const verificationForm = document.getElementById('verification-form-element');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        if (verificationForm) {
            verificationForm.addEventListener('submit', (e) => this.handleVerification(e));
        }

        // Password toggles
        const passwordToggles = document.querySelectorAll('.password-toggle');
        passwordToggles.forEach(toggle => {
            toggle.addEventListener('click', () => this.togglePassword(toggle));
        });

        // Password strength
        const registerPassword = document.getElementById('register-password');
        if (registerPassword) {
            registerPassword.addEventListener('input', (e) => this.checkPasswordStrength(e.target.value));
        }

        // Resend verification
        const resendCode = document.getElementById('resend-code');
        if (resendCode) {
            resendCode.addEventListener('click', () => this.resendVerificationCode());
        }

        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    checkAuthStatus() {
        const savedUser = localStorage.getItem('mengo_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.isAuthenticated = true;
            this.hideAuthModal();
            this.updateUserInterface();
        } else {
            this.showAuthModal();
        }
    }

    showAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    hideAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    showRegisterForm() {
        document.getElementById('login-form').classList.remove('active');
        document.getElementById('register-form').classList.add('active');
        document.getElementById('verification-form').classList.remove('active');
    }

    showLoginForm() {
        document.getElementById('register-form').classList.remove('active');
        document.getElementById('login-form').classList.add('active');
        document.getElementById('verification-form').classList.remove('active');
    }

    showVerificationForm(email) {
        document.getElementById('login-form').classList.remove('active');
        document.getElementById('register-form').classList.remove('active');
        document.getElementById('verification-form').classList.add('active');
        
        const emailSpan = document.getElementById('verification-email');
        if (emailSpan) {
            emailSpan.textContent = email;
        }
    }

    togglePassword(toggle) {
        const targetId = toggle.getAttribute('data-target');
        const input = document.getElementById(targetId);
        const icon = toggle.querySelector('i');

        if (input.type === 'password') {
            input.type = 'text';
            icon.setAttribute('data-lucide', 'eye-off');
        } else {
            input.type = 'password';
            icon.setAttribute('data-lucide', 'eye');
        }

        // Reinitialize Lucide icons
        lucide.createIcons();
    }

    checkPasswordStrength(password) {
        const strengthBar = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');

        if (!strengthBar || !strengthText) return;

        let strength = 0;
        let strengthLabel = 'Very Weak';

        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        strengthBar.className = 'strength-fill';
        
        switch (strength) {
            case 0:
            case 1:
                strengthBar.classList.add('weak');
                strengthLabel = 'Weak';
                break;
            case 2:
                strengthBar.classList.add('fair');
                strengthLabel = 'Fair';
                break;
            case 3:
            case 4:
                strengthBar.classList.add('good');
                strengthLabel = 'Good';
                break;
            case 5:
                strengthBar.classList.add('strong');
                strengthLabel = 'Strong';
                break;
        }

        strengthText.textContent = `Password strength: ${strengthLabel}`;
    }

    async handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        // Simulate API call
        try {
            await this.simulateApiCall();
            
            // Mock successful login
            this.currentUser = {
                id: 'user_' + Date.now(),
                email: email,
                name: 'Sarah Johnson',
                role: 'teacher',
                verified: true
            };

            this.isAuthenticated = true;
            localStorage.setItem('mengo_user', JSON.stringify(this.currentUser));
            
            this.hideAuthModal();
            this.updateUserInterface();
            this.showNotification('Welcome back! Successfully signed in.', 'success');
        } catch (error) {
            this.showNotification('Invalid credentials. Please try again.', 'error');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match.', 'error');
            return;
        }

        try {
            await this.simulateApiCall();
            
            // Show verification form
            this.showVerificationForm(email);
            this.showNotification('Verification code sent to your email.', 'success');
        } catch (error) {
            this.showNotification('Registration failed. Please try again.', 'error');
        }
    }

    async handleVerification(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const code = formData.get('code');

        if (code.length !== 6) {
            this.showNotification('Please enter a valid 6-digit code.', 'error');
            return;
        }

        try {
            await this.simulateApiCall();
            
            // Mock successful verification
            this.currentUser = {
                id: 'user_' + Date.now(),
                email: document.getElementById('verification-email').textContent,
                name: 'New User',
                role: 'student',
                verified: true
            };

            this.isAuthenticated = true;
            localStorage.setItem('mengo_user', JSON.stringify(this.currentUser));
            
            this.hideAuthModal();
            this.updateUserInterface();
            this.showNotification('Email verified successfully! Welcome to Mengo Senior School.', 'success');
        } catch (error) {
            this.showNotification('Invalid verification code.', 'error');
        }
    }

    async resendVerificationCode() {
        try {
            await this.simulateApiCall();
            this.showNotification('Verification code resent successfully.', 'success');
        } catch (error) {
            this.showNotification('Failed to resend code. Please try again.', 'error');
        }
    }

    logout() {
        this.currentUser = null;
        this.isAuthenticated = false;
        localStorage.removeItem('mengo_user');
        this.showAuthModal();
        this.showNotification('Successfully signed out.', 'success');
    }

    updateUserInterface() {
        if (this.currentUser) {
            const userName = document.querySelector('.user-name');
            const userRole = document.querySelector('.user-role');

            if (userName) userName.textContent = this.currentUser.name;
            if (userRole) userRole.textContent = this.currentUser.role.charAt(0).toUpperCase() + this.currentUser.role.slice(1);
        }
    }

    simulateApiCall() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 90% success rate for demo
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('API Error'));
                }
            }, 1000);
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'info'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i data-lucide="x"></i>
            </button>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 1rem;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 0.5rem;
            padding: 1rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            max-width: 24rem;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        if (type === 'success') {
            notification.style.borderColor = '#10b981';
            notification.style.backgroundColor = '#f0fdf4';
        } else if (type === 'error') {
            notification.style.borderColor = '#ef4444';
            notification.style.backgroundColor = '#fef2f2';
        }

        document.body.appendChild(notification);

        // Initialize Lucide icons
        lucide.createIcons();

        // Show notification
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);

        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.removeNotification(notification));
    }

    removeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// Tab Management
function initTabs() {
    const navItems = document.querySelectorAll('.nav-item[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetTab = item.getAttribute('data-tab');
            
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked nav item
            item.classList.add('active');
            
            // Hide all tab contents
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Show target tab content
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Sidebar Management
function initSidebar() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    
    function openSidebar() {
        sidebar.classList.add('open');
        sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeSidebar() {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            if (sidebar.classList.contains('open')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    }
    
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }
    
    // Close sidebar when clicking nav items on mobile
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth < 1024) {
                closeSidebar();
            }
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024) {
            closeSidebar();
        }
    });
}

// Notification Panel
function initNotificationPanel() {
    const notificationBtn = document.getElementById('notifications-btn');
    const notificationPanel = document.getElementById('notification-panel');
    const markAllRead = document.getElementById('mark-all-read');
    
    if (notificationBtn && notificationPanel) {
        notificationBtn.addEventListener('click', () => {
            notificationPanel.classList.toggle('open');
        });
    }
    
    if (markAllRead) {
        markAllRead.addEventListener('click', () => {
            const unreadItems = document.querySelectorAll('.notification-item.unread');
            unreadItems.forEach(item => {
                item.classList.remove('unread');
            });
            
            // Update notification dot
            const notificationDot = document.querySelector('.notification-dot');
            if (notificationDot) {
                notificationDot.style.display = 'none';
            }
        });
    }
    
    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
        if (notificationPanel && 
            !notificationPanel.contains(e.target) && 
            !notificationBtn.contains(e.target)) {
            notificationPanel.classList.remove('open');
        }
    });
}

// Search Functionality
function initSearch() {
    const searchInputs = document.querySelectorAll('input[type="text"]');
    
    searchInputs.forEach(input => {
        if (input.placeholder.includes('Search') || input.placeholder.includes('search')) {
            input.addEventListener('input', debounce((e) => {
                const searchTerm = e.target.value.toLowerCase();
                console.log('Searching for:', searchTerm);
                // Add search logic here
                performSearch(searchTerm, input);
            }, 300));
        }
    });
}

function performSearch(term, input) {
    // Determine search context based on current tab
    const activeTab = document.querySelector('.tab-content.active');
    if (!activeTab) return;
    
    const tabId = activeTab.id;
    
    switch (tabId) {
        case 'students':
            searchStudents(term);
            break;
        case 'resources':
            searchResources(term);
            break;
        case 'communications':
            searchMessages(term);
            break;
        default:
            console.log(`Search in ${tabId}:`, term);
    }
}

function searchStudents(term) {
    const studentRows = document.querySelectorAll('.student-row');
    studentRows.forEach(row => {
        const studentName = row.querySelector('.student-details h4').textContent.toLowerCase();
        const studentId = row.querySelector('.student-id').textContent.toLowerCase();
        
        if (studentName.includes(term) || studentId.includes(term)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function searchResources(term) {
    const resourceItems = document.querySelectorAll('.resource-item');
    resourceItems.forEach(item => {
        const title = item.querySelector('h3').textContent.toLowerCase();
        const description = item.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(term) || description.includes(term)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

function searchMessages(term) {
    const messageItems = document.querySelectorAll('.message-item');
    messageItems.forEach(item => {
        const name = item.querySelector('h4').textContent.toLowerCase();
        const preview = item.querySelector('.message-preview').textContent.toLowerCase();
        
        if (name.includes(term) || preview.includes(term)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// View Toggle
function initViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const viewType = btn.getAttribute('data-view');
            const container = btn.closest('.card');
            
            // Remove active class from all view buttons in this container
            container.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Apply view changes
            toggleView(viewType, container);
        });
    });
}

function toggleView(viewType, container) {
    const grid = container.querySelector('.courses-grid, .resources-grid');
    if (!grid) return;
    
    if (viewType === 'list') {
        grid.style.display = 'flex';
        grid.style.flexDirection = 'column';
        grid.style.gap = '0';
        
        // Update items for list view
        const items = grid.children;
        Array.from(items).forEach(item => {
            item.style.display = 'flex';
            item.style.alignItems = 'center';
            item.style.padding = '1rem';
            item.style.borderBottom = '1px solid #f1f5f9';
        });
    } else {
        grid.style.display = 'grid';
        grid.style.flexDirection = '';
        grid.style.gap = '1.5rem';
        
        // Reset items for grid view
        const items = grid.children;
        Array.from(items).forEach(item => {
            item.style.display = '';
            item.style.alignItems = '';
            item.style.padding = '';
            item.style.borderBottom = '';
        });
    }
}

// Filter Management
function initFilters() {
    // Category filters
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from siblings
            btn.parentNode.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            const category = btn.textContent.split('(')[0].trim();
            console.log('Filter by category:', category);
            // Add filtering logic here
        });
    });
    
    // Message filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from siblings
            btn.parentNode.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.textContent.toLowerCase();
            filterMessages(filter);
        });
    });
    
    // Chart controls
    const chartBtns = document.querySelectorAll('.chart-btn');
    chartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from siblings
            btn.parentNode.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            const period = btn.textContent.toLowerCase();
            console.log('Chart period:', period);
            // Add chart update logic here
        });
    });
}

function filterMessages(filter) {
    const messageItems = document.querySelectorAll('.message-item');
    
    messageItems.forEach(item => {
        const isUnread = item.classList.contains('unread');
        const messageType = item.querySelector('.message-type').textContent.toLowerCase();
        
        let shouldShow = true;
        
        switch (filter) {
            case 'unread':
                shouldShow = isUnread;
                break;
            case 'students':
                shouldShow = messageType === 'student';
                break;
            case 'parents':
                shouldShow = messageType === 'parent';
                break;
            case 'all':
            default:
                shouldShow = true;
                break;
        }
        
        item.style.display = shouldShow ? '' : 'none';
    });
}

// Interactive Elements
function initInteractiveElements() {
    // Quick action buttons
    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action') || btn.querySelector('span').textContent;
            console.log('Quick action:', action);
            handleQuickAction(action);
        });
    });
    
    // Message items
    const messageItems = document.querySelectorAll('.message-item');
    messageItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            messageItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Mark as read
            item.classList.remove('unread');
            
            console.log('Message selected');
        });
    });
    
    // Student rows
    const studentRows = document.querySelectorAll('.student-row');
    studentRows.forEach(row => {
        row.addEventListener('click', () => {
            const studentName = row.querySelector('.student-details h4').textContent;
            console.log('Student selected:', studentName);
        });
    });
    
    // Assessment items
    const assessmentItems = document.querySelectorAll('.assessment-item');
    assessmentItems.forEach(item => {
        item.addEventListener('click', () => {
            const assessmentTitle = item.querySelector('h4').textContent;
            console.log('Assessment selected:', assessmentTitle);
        });
    });
}

function handleQuickAction(action) {
    switch (action) {
        case 'create-assignment':
        case 'Create Assignment':
            console.log('Opening assignment creation form...');
            break;
        case 'upload-resource':
        case 'Upload Resource':
            console.log('Opening file upload dialog...');
            break;
        case 'send-message':
        case 'Send Message':
            console.log('Opening message composer...');
            break;
        case 'grade-papers':
        case 'Grade Papers':
            console.log('Opening grading interface...');
            break;
        default:
            console.log('Unknown action:', action);
    }
}

// Form Handling
function initForms() {
    // Message compose
    const composeTextarea = document.querySelector('.compose-input textarea');
    const sendBtn = document.querySelector('.compose-actions .btn-primary');
    
    if (composeTextarea && sendBtn) {
        sendBtn.addEventListener('click', () => {
            const message = composeTextarea.value.trim();
            if (message) {
                console.log('Sending message:', message);
                composeTextarea.value = '';
                // Add message to conversation
                addMessageToConversation(message, true);
            }
        });
        
        composeTextarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                sendBtn.click();
            }
        });
    }
}

function addMessageToConversation(message, isSent = false) {
    const messagesContainer = document.querySelector('.conversation-messages');
    if (!messagesContainer) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${isSent ? 'sent' : 'received'}`;
    messageElement.innerHTML = `
        <div class="message-bubble">
            <p>${message}</p>
            <span class="message-timestamp">Just now</span>
        </div>
    `;
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Skip to main content
function initSkipLink() {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.focus();
                mainContent.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// Utility Functions
function debounce(func, wait) {
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

function formatDate(date) {
    return new Intl.DateTimeFormat('en-UG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

function generateId() {
    return 'id_' + Math.random().toString(36).substr(2, 9);
}

// Initialize Application
function initApp() {
    // Initialize authentication system
    const authSystem = new AuthSystem();
    
    // Initialize other components
    initTabs();
    initSidebar();
    initNotificationPanel();
    initSearch();
    initViewToggle();
    initFilters();
    initInteractiveElements();
    initForms();
    initSkipLink();
    
    console.log('Mengo Senior School @130years platform initialized');
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Handle window resize for responsive behavior
window.addEventListener('resize', debounce(() => {
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    
    if (window.innerWidth >= 1024) {
        if (sidebar) sidebar.classList.remove('open');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}, 250));