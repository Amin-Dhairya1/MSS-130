// Enhanced Authentication System with 2FA and Security
class EnhancedAuthSystem {
    constructor() {
        this.security = new SecurityManager();
        this.currentUser = null;
        this.isAuthenticated = false;
        this.pendingVerification = null;
        this.registeredUsers = this.loadRegisteredUsers();
        this.currentDemoCode = null; // For demo purposes
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuthStatus();
        this.setupSecurityMonitoring();
    }

    loadRegisteredUsers() {
        const users = localStorage.getItem('mengo_registered_users');
        return users ? JSON.parse(users) : {};
    }

    saveRegisteredUsers() {
        localStorage.setItem('mengo_registered_users', JSON.stringify(this.registeredUsers));
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

        // Enhanced password strength checking
        const registerPassword = document.getElementById('register-password');
        if (registerPassword) {
            registerPassword.addEventListener('input', (e) => this.checkPasswordStrength(e.target.value));
        }

        // Confirm password validation
        const confirmPassword = document.getElementById('confirm-password');
        if (confirmPassword) {
            confirmPassword.addEventListener('input', (e) => this.validatePasswordMatch());
        }

        // Resend verification with rate limiting
        const resendCode = document.getElementById('resend-code');
        if (resendCode) {
            resendCode.addEventListener('click', () => this.resendVerificationCode());
        }

        // Secure logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.secureLogout());
        }

        // Real-time input sanitization
        const inputs = document.querySelectorAll('input[type="text"], input[type="email"]');
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                e.target.value = this.security.sanitizeInput(e.target.value);
            });
        });
    }

    setupSecurityMonitoring() {
        // Monitor for suspicious activity
        document.addEventListener('keydown', (e) => {
            // Detect potential keylogger attempts
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                this.security.logSecurityEvent('dev_tools_attempt');
            }
        });

        // Prevent right-click in production
        document.addEventListener('contextmenu', (e) => {
            if (window.location.hostname !== 'localhost') {
                e.preventDefault();
                this.security.logSecurityEvent('context_menu_blocked');
            }
        });

        // Monitor for tab visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.security.logSecurityEvent('tab_hidden');
            } else {
                this.security.updateActivity();
            }
        });
    }

    checkAuthStatus() {
        const savedUser = localStorage.getItem('mengo_user');
        const sessionToken = localStorage.getItem('session_token');
        
        if (savedUser && sessionToken) {
            try {
                this.currentUser = JSON.parse(savedUser);
                
                // Validate session
                if (this.security.validateSession()) {
                    this.isAuthenticated = true;
                    this.hideAuthModal();
                    this.updateUserInterface();
                    this.security.logSecurityEvent('session_restored', { userId: this.currentUser.id });
                } else {
                    this.secureLogout();
                }
            } catch (error) {
                this.security.logSecurityEvent('session_corruption', { error: error.message });
                this.secureLogout();
            }
        } else {
            this.showAuthModal();
        }
    }

    showAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            this.security.logSecurityEvent('auth_modal_shown');
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
        this.security.logSecurityEvent('register_form_shown');
    }

    showLoginForm() {
        document.getElementById('register-form').classList.remove('active');
        document.getElementById('login-form').classList.add('active');
        document.getElementById('verification-form').classList.remove('active');
        this.security.logSecurityEvent('login_form_shown');
    }

    showVerificationForm(email) {
        document.getElementById('login-form').classList.remove('active');
        document.getElementById('register-form').classList.remove('active');
        document.getElementById('verification-form').classList.add('active');
        
        const emailSpan = document.getElementById('verification-email');
        if (emailSpan) {
            emailSpan.textContent = email;
        }

        // Show the demo code in the UI
        this.showDemoCodeInUI();
        
        this.security.logSecurityEvent('verification_form_shown', { email });
    }

    showDemoCodeInUI() {
        // Create or update demo code display
        let demoCodeDisplay = document.getElementById('demo-code-display');
        if (!demoCodeDisplay) {
            demoCodeDisplay = document.createElement('div');
            demoCodeDisplay.id = 'demo-code-display';
            demoCodeDisplay.style.cssText = `
                background: #f0f9ff;
                border: 2px solid #0ea5e9;
                border-radius: 8px;
                padding: 1rem;
                margin: 1rem 0;
                text-align: center;
                font-family: monospace;
            `;
            
            const verificationForm = document.getElementById('verification-form');
            const codeInput = document.getElementById('verification-code');
            if (verificationForm && codeInput) {
                verificationForm.insertBefore(demoCodeDisplay, codeInput.parentElement);
            }
        }

        if (this.currentDemoCode) {
            demoCodeDisplay.innerHTML = `
                <div style="color: #0369a1; font-weight: bold; margin-bottom: 0.5rem;">
                    🔐 Demo Mode - Your Verification Code:
                </div>
                <div style="font-size: 1.5rem; font-weight: bold; color: #1e40af; letter-spacing: 0.2em;">
                    ${this.currentDemoCode}
                </div>
                <div style="font-size: 0.875rem; color: #64748b; margin-top: 0.5rem;">
                    Copy this code and paste it in the field below
                </div>
            `;
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
        if (window.lucide) {
            lucide.createIcons();
        }
    }

    checkPasswordStrength(password) {
        const validation = this.security.validatePassword(password);
        const strengthBar = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');
        const passwordErrors = document.getElementById('password-errors');

        if (!strengthBar || !strengthText) return;

        // Update strength bar
        strengthBar.className = 'strength-fill';
        strengthBar.style.width = validation.strength.percentage + '%';
        strengthBar.style.backgroundColor = validation.strength.color;
        
        strengthText.textContent = `Password strength: ${validation.strength.level}`;
        strengthText.style.color = validation.strength.color;

        // Show password requirements
        if (passwordErrors) {
            if (validation.errors.length > 0) {
                passwordErrors.innerHTML = validation.errors.map(error => 
                    `<div class="password-error">${error}</div>`
                ).join('');
                passwordErrors.style.display = 'block';
            } else {
                passwordErrors.style.display = 'none';
            }
        }

        return validation;
    }

    validatePasswordMatch() {
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const matchIndicator = document.getElementById('password-match');

        if (confirmPassword.length > 0) {
            if (password === confirmPassword) {
                if (matchIndicator) {
                    matchIndicator.textContent = '✓ Passwords match';
                    matchIndicator.style.color = '#059669';
                }
            } else {
                if (matchIndicator) {
                    matchIndicator.textContent = '✗ Passwords do not match';
                    matchIndicator.style.color = '#dc2626';
                }
            }
        } else {
            if (matchIndicator) {
                matchIndicator.textContent = '';
            }
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        // Validate CSRF token
        const csrfToken = formData.get('csrf_token');
        if (!this.security.validateCSRFToken(csrfToken)) {
            this.showNotification('Security error. Please refresh the page.', 'error');
            this.security.logSecurityEvent('csrf_validation_failed', { email });
            return;
        }

        // Check rate limiting
        const rateLimit = this.security.checkRateLimit(email, 'login');
        if (!rateLimit.allowed) {
            this.showNotification(`Too many login attempts. Try again in ${rateLimit.retryAfter} seconds.`, 'error');
            this.security.logSecurityEvent('rate_limit_exceeded', { email, type: 'login' });
            return;
        }

        // Validate email format
        const emailValidation = this.security.validateEmail(email);
        if (!emailValidation.isValid) {
            this.showNotification('Please enter a valid email address.', 'error');
            return;
        }

        try {
            this.showLoadingState(true);
            
            // Check if user exists and verify password
            const userExists = await this.verifyUserCredentials(emailValidation.sanitized, password);
            if (!userExists) {
                this.security.recordFailedAttempt(email);
                this.showNotification('Invalid email or password. Please try again.', 'error');
                this.security.logSecurityEvent('login_failed', { email: emailValidation.sanitized, error: 'Invalid credentials' });
                return;
            }
            
            // Generate 2FA code for existing user
            const twoFACode = await this.security.generateSecure2FACode();
            this.currentDemoCode = twoFACode.code; // Store for demo display
            
            // Store pending verification
            this.pendingVerification = {
                email: emailValidation.sanitized,
                password: password,
                twoFACode: twoFACode,
                type: 'login',
                userData: this.registeredUsers[emailValidation.sanitized]
            };

            // Send 2FA code (simulated)
            await this.send2FACode(emailValidation.sanitized, twoFACode.code);
            
            this.showVerificationForm(emailValidation.sanitized);
            this.showNotification('Verification code generated! Check the blue box above for your code.', 'success');
            this.security.logSecurityEvent('2fa_code_sent', { email: emailValidation.sanitized, type: 'login' });
            
        } catch (error) {
            this.security.recordFailedAttempt(email);
            this.showNotification('Login failed. Please try again.', 'error');
            this.security.logSecurityEvent('login_failed', { email: emailValidation.sanitized, error: error.message });
        } finally {
            this.showLoadingState(false);
        }
    }

    async verifyUserCredentials(email, password) {
        // Check if user exists in registered users
        if (!this.registeredUsers[email]) {
            return false;
        }

        const storedUser = this.registeredUsers[email];
        
        // Verify password hash
        const passwordMatch = await this.security.verifyPassword(password, storedUser.passwordHash, storedUser.salt);
        
        return passwordMatch;
    }

    async handleRegister(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const role = formData.get('role');

        // Validate CSRF token
        const csrfToken = formData.get('csrf_token');
        if (!this.security.validateCSRFToken(csrfToken)) {
            this.showNotification('Security error. Please refresh the page.', 'error');
            return;
        }

        // Validate email
        const emailValidation = this.security.validateEmail(email);
        if (!emailValidation.isValid) {
            this.showNotification('Please enter a valid email address.', 'error');
            return;
        }

        // Check if user already exists
        if (this.registeredUsers[emailValidation.sanitized]) {
            this.showNotification('An account with this email already exists. Please sign in instead.', 'error');
            return;
        }

        // Validate password
        const passwordValidation = this.security.validatePassword(password);
        if (!passwordValidation.isValid) {
            this.showNotification('Password does not meet security requirements.', 'error');
            return;
        }

        // Check password match
        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match.', 'error');
            return;
        }

        // Check rate limiting for email
        const rateLimit = this.security.checkRateLimit(emailValidation.sanitized, 'email');
        if (!rateLimit.allowed) {
            this.showNotification(`Please wait ${rateLimit.retryAfter} seconds before requesting another code.`, 'error');
            return;
        }

        try {
            this.showLoadingState(true);

            // Generate secure password hash
            const hashedPassword = await this.security.hashPassword(password);
            
            // Generate 2FA code
            const twoFACode = await this.security.generateSecure2FACode();
            this.currentDemoCode = twoFACode.code; // Store for demo display
            
            // Store pending verification
            this.pendingVerification = {
                email: emailValidation.sanitized,
                password: password,
                passwordHash: hashedPassword.hash,
                salt: hashedPassword.salt,
                firstName: this.security.sanitizeInput(firstName),
                lastName: this.security.sanitizeInput(lastName),
                role: role,
                twoFACode: twoFACode,
                type: 'register'
            };

            // Send 2FA code
            await this.send2FACode(emailValidation.sanitized, twoFACode.code);
            
            this.showVerificationForm(emailValidation.sanitized);
            this.showNotification('Verification code generated! Check the blue box above for your code.', 'success');
            this.security.logSecurityEvent('registration_initiated', { email: emailValidation.sanitized });
            
        } catch (error) {
            this.showNotification('Registration failed. Please try again.', 'error');
            this.security.logSecurityEvent('registration_failed', { email: emailValidation.sanitized, error: error.message });
        } finally {
            this.showLoadingState(false);
        }
    }

    async handleVerification(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const code = formData.get('code');

        if (!this.pendingVerification) {
            this.showNotification('No pending verification. Please try again.', 'error');
            return;
        }

        if (code.length !== 6 || !/^\d{6}$/.test(code)) {
            this.showNotification('Please enter a valid 6-digit code.', 'error');
            return;
        }

        try {
            this.showLoadingState(true);

            // Verify 2FA code - simplified for demo
            if (code === this.currentDemoCode) {
                // Complete authentication
                if (this.pendingVerification.type === 'login') {
                    await this.completeLogin();
                } else {
                    await this.completeRegistration();
                }
            } else {
                this.showNotification('Invalid verification code. Please check the code in the blue box above.', 'error');
                this.security.logSecurityEvent('2fa_verification_failed', { 
                    email: this.pendingVerification.email,
                    error: 'Invalid code' 
                });
                return;
            }

        } catch (error) {
            this.showNotification('Verification failed. Please try again.', 'error');
            this.security.logSecurityEvent('verification_error', { 
                email: this.pendingVerification?.email,
                error: error.message 
            });
        } finally {
            this.showLoadingState(false);
        }
    }

    async completeLogin() {
        // Create secure session
        const sessionToken = this.security.generateSecureToken();
        const userData = this.pendingVerification.userData;
        
        this.currentUser = {
            id: userData.id,
            email: this.pendingVerification.email,
            name: userData.name,
            role: userData.role,
            verified: true,
            loginTime: new Date().toISOString(),
            sessionToken: sessionToken
        };

        this.isAuthenticated = true;
        
        // Store encrypted user data
        localStorage.setItem('mengo_user', JSON.stringify(this.currentUser));
        localStorage.setItem('session_token', sessionToken);
        
        this.pendingVerification = null;
        this.currentDemoCode = null;
        this.hideAuthModal();
        this.updateUserInterface();
        
        this.showNotification(`Welcome back, ${this.currentUser.name}! Successfully signed in.`, 'success');
        this.security.logSecurityEvent('login_successful', { userId: this.currentUser.id });
    }

    async completeRegistration() {
        const sessionToken = this.security.generateSecureToken();
        const userId = 'user_' + Date.now();
        
        // Store user in registered users database
        this.registeredUsers[this.pendingVerification.email] = {
            id: userId,
            email: this.pendingVerification.email,
            name: `${this.pendingVerification.firstName} ${this.pendingVerification.lastName}`,
            role: this.pendingVerification.role,
            passwordHash: this.pendingVerification.passwordHash,
            salt: this.pendingVerification.salt,
            verified: true,
            registrationTime: new Date().toISOString()
        };
        
        this.saveRegisteredUsers();
        
        this.currentUser = {
            id: userId,
            email: this.pendingVerification.email,
            name: `${this.pendingVerification.firstName} ${this.pendingVerification.lastName}`,
            role: this.pendingVerification.role,
            verified: true,
            registrationTime: new Date().toISOString(),
            sessionToken: sessionToken
        };

        this.isAuthenticated = true;
        
        localStorage.setItem('mengo_user', JSON.stringify(this.currentUser));
        localStorage.setItem('session_token', sessionToken);
        
        this.pendingVerification = null;
        this.currentDemoCode = null;
        this.hideAuthModal();
        this.updateUserInterface();
        
        this.showNotification(`Welcome to Mengo Senior School, ${this.currentUser.name}! Your account has been created successfully.`, 'success');
        this.security.logSecurityEvent('registration_successful', { userId: this.currentUser.id });
    }

    async resendVerificationCode() {
        if (!this.pendingVerification) {
            this.showNotification('No pending verification.', 'error');
            return;
        }

        // Check rate limiting
        const rateLimit = this.security.checkRateLimit(this.pendingVerification.email, 'email');
        if (!rateLimit.allowed) {
            this.showNotification(`Please wait ${rateLimit.retryAfter} seconds before requesting another code.`, 'error');
            return;
        }

        try {
            // Generate new 2FA code
            const newTwoFACode = await this.security.generateSecure2FACode();
            this.pendingVerification.twoFACode = newTwoFACode;
            this.currentDemoCode = newTwoFACode.code; // Update demo code

            await this.send2FACode(this.pendingVerification.email, newTwoFACode.code);
            this.showDemoCodeInUI(); // Update the display
            this.showNotification('New verification code generated successfully.', 'success');
            this.security.logSecurityEvent('2fa_code_resent', { email: this.pendingVerification.email });
        } catch (error) {
            this.showNotification('Failed to resend code. Please try again.', 'error');
            this.security.logSecurityEvent('2fa_resend_failed', { 
                email: this.pendingVerification.email,
                error: error.message 
            });
        }
    }

    secureLogout() {
        if (this.currentUser) {
            this.security.logSecurityEvent('logout', { userId: this.currentUser.id });
        }

        this.currentUser = null;
        this.isAuthenticated = false;
        this.pendingVerification = null;
        this.currentDemoCode = null;
        
        // Clear session data only (keep registered users)
        localStorage.removeItem('mengo_user');
        localStorage.removeItem('session_token');
        sessionStorage.clear();
        
        // Clear cookies
        document.cookie.split(";").forEach(cookie => {
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        });

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

    async send2FACode(email, code) {
        // Simulate sending email with 2FA code
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`2FA Code for ${email}: ${code}`);
                resolve();
            }, 1000);
        });
    }

    showLoadingState(isLoading) {
        const submitButtons = document.querySelectorAll('button[type="submit"]');
        submitButtons.forEach(button => {
            if (isLoading) {
                button.disabled = true;
                const originalText = button.textContent;
                button.setAttribute('data-original-text', originalText);
                button.innerHTML = '<i data-lucide="loader-2"></i> Processing...';
            } else {
                button.disabled = false;
                const originalText = button.getAttribute('data-original-text');
                button.textContent = originalText || 'Submit';
            }
        });

        if (window.lucide) {
            lucide.createIcons();
        }
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
        if (window.lucide) {
            lucide.createIcons();
        }

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

// Initialize enhanced authentication system
window.EnhancedAuthSystem = EnhancedAuthSystem;