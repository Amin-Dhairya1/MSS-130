// Slideshow Management
class SlideshowManager {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 5;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 6000; // 6 seconds
        this.isPlaying = true;
        this.init();
    }

    init() {
        this.bindEvents();
        this.startAutoPlay();
        this.preloadImages();
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
            if (e.key === 'ArrowLeft') {
                this.previousSlide();
            } else if (e.key === 'ArrowRight') {
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
        });

        slideshowContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            this.handleSwipe();
        });

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

    goToSlide(slideNumber) {
        if (slideNumber < 1 || slideNumber > this.totalSlides) return;

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

        // Restart auto-play timer
        this.restartAutoPlay();
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
            if (this.isPlaying) {
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
        // Preload slide background images for smoother transitions
        const slides = document.querySelectorAll('.slide-background');
        slides.forEach(slide => {
            const bgImage = slide.style.backgroundImage;
            if (bgImage) {
                const imageUrl = bgImage.slice(4, -1).replace(/"/g, "");
                const img = new Image();
                img.src = imageUrl;
            }
        });
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
}

// Initialize slideshow when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.slideshowManager = new SlideshowManager();
});

// Export for use in other modules
window.SlideshowManager = SlideshowManager;