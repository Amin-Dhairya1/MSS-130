// Slideshow Management
class SlideshowManager {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 5;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 6000; // 6 seconds
        this.isPlaying = true;
        this.isTransitioning = false;
        this.init();
    }

    init() {
        try {
            // Wait for DOM elements to be available
            if (!this.checkRequiredElements()) {
                console.warn('Slideshow elements not found, retrying...');
                setTimeout(() => this.init(), 100);
                return;
            }
            
            this.bindEvents();
            this.startAutoPlay();
            this.preloadImages();
            this.setupAccessibility();
        } catch (error) {
            console.error('Slideshow initialization failed:', error);
        }
    }

    checkRequiredElements() {
        const slideshowContainer = document.querySelector('.hero-slideshow');
        const slides = document.querySelectorAll('.slide');
        const indicators = document.querySelectorAll('.indicator');
        
        return slideshowContainer && slides.length > 0 && indicators.length > 0;
    }

    bindEvents() {
        // Navigation buttons
        const prevBtn = document.getElementById('prev-slide');
        const nextBtn = document.getElementById('next-slide');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousSlide());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Indicators
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index + 1));
        });

        // Pause on hover
        const slideshowContainer = document.querySelector('.hero-slideshow');
        if (slideshowContainer) {
            slideshowContainer.addEventListener('mouseenter', () => this.pauseAutoPlay());
            slideshowContainer.addEventListener('mouseleave', () => this.resumeAutoPlay());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            // Only handle keyboard navigation when slideshow is focused
            const slideshowContainer = document.querySelector('.hero-slideshow');
            if (!slideshowContainer || !slideshowContainer.contains(document.activeElement)) {
                return;
            }

            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.previousSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextSlide();
            }
        });

        // Touch/swipe support
        this.setupTouchEvents();
    }

    setupTouchEvents() {
        const slideshowContainer = document.querySelector('.slideshow-container');
        if (!slideshowContainer) return;

        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        slideshowContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        slideshowContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            this.handleSwipe();
        }, { passive: true });

        const handleSwipe = () => {
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const minSwipeDistance = 50;

            // Only handle horizontal swipes
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    this.previousSlide();
                } else {
                    this.nextSlide();
                }
            }
        };

        this.handleSwipe = handleSwipe;
    }

    setupAccessibility() {
        // Add ARIA labels and roles
        const slideshowContainer = document.querySelector('.hero-slideshow');
        if (slideshowContainer) {
            slideshowContainer.setAttribute('role', 'region');
            slideshowContainer.setAttribute('aria-label', 'Image slideshow');
        }

        // Update slide accessibility
        this.updateSlideAccessibility();

        // Add keyboard focus to navigation buttons
        const navButtons = document.querySelectorAll('.slide-nav');
        navButtons.forEach(button => {
            button.setAttribute('tabindex', '0');
        });

        // Add keyboard focus to indicators
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.setAttribute('tabindex', '0');
            indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
            indicator.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.goToSlide(index + 1);
                }
            });
        });
    }

    updateSlideAccessibility() {
        const slides = document.querySelectorAll('.slide');
        slides.forEach((slide, index) => {
            const slideNumber = index + 1;
            slide.setAttribute('aria-hidden', slideNumber !== this.currentSlide ? 'true' : 'false');
            slide.setAttribute('aria-label', `Slide ${slideNumber} of ${this.totalSlides}`);
        });
    }

    goToSlide(slideNumber) {
        if (slideNumber < 1 || slideNumber > this.totalSlides || this.isTransitioning) return;
        if (slideNumber === this.currentSlide) return;

        this.isTransitioning = true;

        try {
            // Remove active class from current slide and indicator
            const currentSlideElement = document.querySelector(`.slide[data-slide="${this.currentSlide}"]`);
            const currentIndicator = document.querySelector(`.indicator[data-slide="${this.currentSlide}"]`);

            if (currentSlideElement) {
                currentSlideElement.classList.remove('active');
            }
            if (currentIndicator) {
                currentIndicator.classList.remove('active');
            }

            // Update current slide
            this.currentSlide = slideNumber;

            // Add active class to new slide and indicator
            const newSlideElement = document.querySelector(`.slide[data-slide="${this.currentSlide}"]`);
            const newIndicator = document.querySelector(`.indicator[data-slide="${this.currentSlide}"]`);

            if (newSlideElement) {
                newSlideElement.classList.add('active');
            }
            if (newIndicator) {
                newIndicator.classList.add('active');
            }

            // Update accessibility
            this.updateSlideAccessibility();

            // Restart auto-play timer
            this.restartAutoPlay();

            // Reset transition flag after animation completes
            setTimeout(() => {
                this.isTransitioning = false;
            }, 500);

        } catch (error) {
            console.error('Slide transition error:', error);
            this.isTransitioning = false;
        }
    }

    nextSlide() {
        const nextSlideNumber = this.currentSlide >= this.totalSlides ? 1 : this.currentSlide + 1;
        this.goToSlide(nextSlideNumber);
    }

    previousSlide() {
        const prevSlideNumber = this.currentSlide <= 1 ? this.totalSlides : this.currentSlide - 1;
        this.goToSlide(prevSlideNumber);
    }

    startAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }

        this.autoPlayInterval = setInterval(() => {
            if (this.isPlaying && !this.isTransitioning) {
                this.nextSlide();
            }
        }, this.autoPlayDelay);
    }

    pauseAutoPlay() {
        this.isPlaying = false;
    }

    resumeAutoPlay() {
        this.isPlaying = true;
    }

    restartAutoPlay() {
        this.startAutoPlay();
    }

    preloadImages() {
        try {
            // Preload slide background images for smoother transitions
            const slides = document.querySelectorAll('.slide-background');
            slides.forEach(slide => {
                const bgImage = slide.style.backgroundImage;
                if (bgImage) {
                    const imageUrl = bgImage.slice(4, -1).replace(/"/g, "");
                    const img = new Image();
                    img.onload = () => {
                        console.log('Preloaded image:', imageUrl);
                    };
                    img.onerror = () => {
                        console.warn('Failed to preload image:', imageUrl);
                    };
                    img.src = imageUrl;
                }
            });
        } catch (error) {
            console.error('Image preloading error:', error);
        }
    }

    // Public methods for external control
    pause() {
        this.pauseAutoPlay();
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }

    resume() {
        this.resumeAutoPlay();
        this.startAutoPlay();
    }

    getCurrentSlide() {
        return this.currentSlide;
    }

    getTotalSlides() {
        return this.totalSlides;
    }

    destroy() {
        // Clean up intervals and event listeners
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
        this.isPlaying = false;
    }
}

// Initialize slideshow when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.slideshowManager = new SlideshowManager();
    } catch (error) {
        console.error('Failed to initialize slideshow:', error);
    }
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (window.slideshowManager) {
        window.slideshowManager.destroy();
    }
});

// Export for use in other modules
window.SlideshowManager = SlideshowManager;