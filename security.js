// Enhanced Security Module for Mengo Senior School
class SecurityManager {
    constructor() {
        this.passwordRequirements = {
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: true,
            maxAttempts: 5,
            lockoutDuration: 15 * 60 * 1000 // 15 minutes
        };
        
        this.sessionConfig = {
            timeout: 30 * 60 * 1000, // 30 minutes
            maxConcurrentSessions: 3,
            requireReauth: 24 * 60 * 60 * 1000 // 24 hours
        };
        
        this.rateLimiting = {
            loginAttempts: new Map(),
            emailRequests: new Map(),
            maxEmailRequests: 3,
            emailCooldown: 5 * 60 * 1000 // 5 minutes
        };
        
        this.init();
    }

    init() {
        this.setupCSRFProtection();
        this.setupSessionMonitoring();
        this.setupSecurityHeaders();
        this.initializeEncryption();
    }

    // Password Security
    validatePassword(password) {
        const errors = [];
        const requirements = this.passwordRequirements;

        if (password.length < requirements.minLength) {
            errors.push(`Password must be at least ${requirements.minLength} characters long`);
        }

        if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }

        if (requirements.requireLowercase && !/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }

        if (requirements.requireNumbers && !/\d/.test(password)) {
            errors.push('Password must contain at least one number');
        }

        if (requirements.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            errors.push('Password must contain at least one special character');
        }

        // Check for common patterns
        if (this.isCommonPassword(password)) {
            errors.push('Password is too common. Please choose a more unique password');
        }

        // Check for sequential characters
        if (this.hasSequentialChars(password)) {
            errors.push('Password should not contain sequential characters');
        }

        return {
            isValid: errors.length === 0,
            errors: errors,
            strength: this.calculatePasswordStrength(password)
        };
    }

    calculatePasswordStrength(password) {
        let score = 0;
        let feedback = [];

        // Length scoring
        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;
        if (password.length >= 16) score += 1;

        // Character variety
        if (/[a-z]/.test(password)) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/\d/.test(password)) score += 1;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;

        // Bonus points
        if (password.length >= 20) score += 1;
        if (/[^\w\s]/.test(password)) score += 1;

        const strength = {
            0: { level: 'Very Weak', color: '#dc2626', percentage: 10 },
            1: { level: 'Very Weak', color: '#dc2626', percentage: 20 },
            2: { level: 'Weak', color: '#ea580c', percentage: 30 },
            3: { level: 'Fair', color: '#d97706', percentage: 50 },
            4: { level: 'Good', color: '#059669', percentage: 70 },
            5: { level: 'Strong', color: '#059669', percentage: 85 },
            6: { level: 'Very Strong', color: '#047857', percentage: 95 },
            7: { level: 'Excellent', color: '#047857', percentage: 100 }
        };

        return strength[Math.min(score, 7)];
    }

    isCommonPassword(password) {
        const commonPasswords = [
            'password', '123456', '123456789', 'qwerty', 'abc123',
            'password123', 'admin', 'letmein', 'welcome', 'monkey',
            'dragon', 'master', 'shadow', 'football', 'baseball'
        ];
        return commonPasswords.includes(password.toLowerCase());
    }

    hasSequentialChars(password) {
        const sequences = ['123', 'abc', 'qwe', 'asd', 'zxc'];
        return sequences.some(seq => password.toLowerCase().includes(seq));
    }

    // Password Hashing and Verification
    async hashPassword(password, providedSalt = null) {
        // Generate salt if not provided
        const salt = providedSalt || crypto.getRandomValues(new Uint8Array(16));
        
        const encoder = new TextEncoder();
        const passwordData = encoder.encode(password);
        const saltedPassword = new Uint8Array(passwordData.length + salt.length);
        saltedPassword.set(passwordData);
        saltedPassword.set(salt, passwordData.length);
        
        const hashBuffer = await crypto.subtle.digest('SHA-256', saltedPassword);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
        
        return { hash: hashHex, salt: saltHex };
    }

    async verifyPassword(password, storedHash, storedSalt) {
        try {
            // Convert stored salt from hex string back to Uint8Array
            const saltArray = new Uint8Array(storedSalt.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
            
            // Hash the provided password with the stored salt
            const hashedResult = await this.hashPassword(password, saltArray);
            
            // Compare the hashes
            return hashedResult.hash === storedHash;
        } catch (error) {
            console.error('Password verification error:', error);
            return false;
        }
    }

    // 2FA Email Verification
    async generateSecure2FACode() {
        // Generate cryptographically secure 6-digit code
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        const code = (array[0] % 900000 + 100000).toString();
        
        // Add timestamp and hash for verification
        const timestamp = Date.now();
        const codeData = {
            code: code,
            timestamp: timestamp,
            hash: await this.hashData(code + timestamp),
            attempts: 0,
            maxAttempts: 3,
            expiresAt: timestamp + (10 * 60 * 1000) // 10 minutes
        };

        return codeData;
    }

    async verify2FACode(inputCode, storedCodeData) {
        if (!storedCodeData || Date.now() > storedCodeData.expiresAt) {
            return { success: false, error: 'Verification code has expired' };
        }

        if (storedCodeData.attempts >= storedCodeData.maxAttempts) {
            return { success: false, error: 'Maximum verification attempts exceeded' };
        }

        storedCodeData.attempts++;

        const expectedHash = await this.hashData(inputCode + storedCodeData.timestamp);
        const actualHash = await this.hashData(storedCodeData.code + storedCodeData.timestamp);

        if (expectedHash === actualHash) {
            return { success: true };
        }

        return { 
            success: false, 
            error: `Invalid code. ${storedCodeData.maxAttempts - storedCodeData.attempts} attempts remaining` 
        };
    }

    // Rate Limiting
    checkRateLimit(identifier, type = 'login') {
        const now = Date.now();
        const limits = this.rateLimiting;
        
        if (type === 'email') {
            if (!limits.emailRequests.has(identifier)) {
                limits.emailRequests.set(identifier, []);
            }
            
            const requests = limits.emailRequests.get(identifier);
            const recentRequests = requests.filter(time => now - time < limits.emailCooldown);
            
            if (recentRequests.length >= limits.maxEmailRequests) {
                return {
                    allowed: false,
                    retryAfter: Math.ceil((limits.emailCooldown - (now - recentRequests[0])) / 1000)
                };
            }
            
            recentRequests.push(now);
            limits.emailRequests.set(identifier, recentRequests);
            return { allowed: true };
        }

        // Login rate limiting
        if (!limits.loginAttempts.has(identifier)) {
            limits.loginAttempts.set(identifier, { count: 0, lastAttempt: now, lockedUntil: 0 });
        }

        const attempts = limits.loginAttempts.get(identifier);
        
        if (attempts.lockedUntil > now) {
            return {
                allowed: false,
                lockedUntil: attempts.lockedUntil,
                retryAfter: Math.ceil((attempts.lockedUntil - now) / 1000)
            };
        }

        return { allowed: true };
    }

    recordFailedAttempt(identifier) {
        const now = Date.now();
        const attempts = this.rateLimiting.loginAttempts.get(identifier) || { count: 0, lastAttempt: now, lockedUntil: 0 };
        
        attempts.count++;
        attempts.lastAttempt = now;

        if (attempts.count >= this.passwordRequirements.maxAttempts) {
            attempts.lockedUntil = now + this.passwordRequirements.lockoutDuration;
            attempts.count = 0; // Reset for next cycle
        }

        this.rateLimiting.loginAttempts.set(identifier, attempts);
    }

    // Encryption and Hashing
    async hashData(data) {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // CSRF Protection
    setupCSRFProtection() {
        this.csrfToken = this.generateCSRFToken();
        
        // Add CSRF token to all forms
        document.addEventListener('DOMContentLoaded', () => {
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                const csrfInput = document.createElement('input');
                csrfInput.type = 'hidden';
                csrfInput.name = 'csrf_token';
                csrfInput.value = this.csrfToken;
                form.appendChild(csrfInput);
            });
        });
    }

    generateCSRFToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    validateCSRFToken(token) {
        return token === this.csrfToken;
    }

    // Session Security
    setupSessionMonitoring() {
        this.sessionData = {
            startTime: Date.now(),
            lastActivity: Date.now(),
            fingerprint: this.generateFingerprint(),
            ipAddress: this.getClientIP()
        };

        // Monitor for session hijacking
        setInterval(() => {
            this.validateSession();
        }, 60000); // Check every minute

        // Auto-logout on inactivity
        this.setupInactivityTimer();
    }

    generateFingerprint() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Mengo School Security Check', 2, 2);
        
        const fingerprint = {
            canvas: canvas.toDataURL(),
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            screen: `${screen.width}x${screen.height}`,
            colorDepth: screen.colorDepth
        };

        return btoa(JSON.stringify(fingerprint));
    }

    getClientIP() {
        // In a real implementation, this would be handled server-side
        return 'client-side-placeholder';
    }

    validateSession() {
        const now = Date.now();
        const sessionAge = now - this.sessionData.startTime;
        const inactiveTime = now - this.sessionData.lastActivity;

        // Check session timeout
        if (inactiveTime > this.sessionConfig.timeout) {
            this.terminateSession('Session expired due to inactivity');
            return false;
        }

        // Check maximum session age
        if (sessionAge > this.sessionConfig.requireReauth) {
            this.terminateSession('Session expired. Please re-authenticate');
            return false;
        }

        // Validate fingerprint
        const currentFingerprint = this.generateFingerprint();
        if (currentFingerprint !== this.sessionData.fingerprint) {
            this.terminateSession('Session security violation detected');
            return false;
        }

        return true;
    }

    updateActivity() {
        this.sessionData.lastActivity = Date.now();
    }

    setupInactivityTimer() {
        let inactivityTimer;
        
        const resetTimer = () => {
            clearTimeout(inactivityTimer);
            this.updateActivity();
            
            inactivityTimer = setTimeout(() => {
                this.terminateSession('Session expired due to inactivity');
            }, this.sessionConfig.timeout);
        };

        // Monitor user activity
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
            document.addEventListener(event, resetTimer, true);
        });

        resetTimer();
    }

    terminateSession(reason) {
        // Clear session data only (keep registered users)
        localStorage.removeItem('mengo_user');
        localStorage.removeItem('session_token');
        sessionStorage.clear();
        
        // Clear all cookies
        document.cookie.split(";").forEach(cookie => {
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        });

        alert(`Security Notice: ${reason}`);
        window.location.reload();
    }

    // Security Headers (for client-side enforcement)
    setupSecurityHeaders() {
        // Content Security Policy
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        meta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self';";
        document.head.appendChild(meta);

        // Note: Clickjacking prevention removed to avoid SecurityError in WebContainer environment
    }

    initializeEncryption() {
        // Initialize client-side encryption for sensitive data
        this.encryptionKey = null;
        this.generateEncryptionKey();
    }

    async generateEncryptionKey() {
        this.encryptionKey = await crypto.subtle.generateKey(
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
    }

    async encryptSensitiveData(data) {
        if (!this.encryptionKey) {
            await this.generateEncryptionKey();
        }

        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(JSON.stringify(data));
        const iv = crypto.getRandomValues(new Uint8Array(12));
        
        const encryptedBuffer = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: iv },
            this.encryptionKey,
            dataBuffer
        );

        return {
            encrypted: Array.from(new Uint8Array(encryptedBuffer)),
            iv: Array.from(iv)
        };
    }

    // Input Sanitization
    sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        return input
            .replace(/[<>]/g, '') // Remove potential HTML tags
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .replace(/on\w+=/gi, '') // Remove event handlers
            .trim();
    }

    validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isValid = emailRegex.test(email);
        
        // Additional checks
        const domain = email.split('@')[1];
        const hasValidDomain = domain && domain.includes('.') && domain.length > 3;
        
        return {
            isValid: isValid && hasValidDomain,
            sanitized: this.sanitizeInput(email.toLowerCase())
        };
    }

    // Security Event Logging
    logSecurityEvent(event, details = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            event: event,
            details: details,
            userAgent: navigator.userAgent,
            url: window.location.href,
            sessionId: this.sessionData?.fingerprint?.substring(0, 8) || 'unknown'
        };

        // Store in local storage for now (in production, send to server)
        const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
        logs.push(logEntry);
        
        // Keep only last 100 entries
        if (logs.length > 100) {
            logs.splice(0, logs.length - 100);
        }
        
        localStorage.setItem('security_logs', JSON.stringify(logs));
        console.warn('Security Event:', logEntry);
    }

    // Secure random string generation
    generateSecureToken(length = 32) {
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
    }
}

// Export for use in other modules
window.SecurityManager = SecurityManager;