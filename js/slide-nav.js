/**
 * Slide Navigation - Keyboard shortcuts and touch gestures
 * "Fundamentos Técnicos de IA para Abogados"
 *
 * (c) 2025 Trifolia (trifolia.cl)
 * Licensed under CC BY-NC-SA 4.0
 * https://creativecommons.org/licenses/by-nc-sa/4.0/
 *
 * Supports:
 * - Arrow keys (left/right)
 * - PageUp/PageDown (for presentation clickers)
 * - Space/Enter (with slide interaction support)
 */
(function() {
    'use strict';

    // Slide interaction API - allows interactive slides to register handlers
    // When Space/Enter is pressed, if a handler is registered, it's called first.
    // The handler should return true to navigate to next slide, false to stay.
    window.slideInteraction = {
        handler: null,
        register: function(fn) { this.handler = fn; },
        clear: function() { this.handler = null; }
    };

    // Get navigation element
    var nav = document.querySelector('.slide-nav');
    if (!nav) return;

    // Get navigation links
    var prevLink = nav.querySelector('.slide-nav-prev a');
    var nextLink = nav.querySelector('.slide-nav-next a');

    // ===========================================
    // FULLSCREEN PRESENTATION MODE
    // ===========================================

    // Reference design resolution (16:9)
    var REF_WIDTH = 1280;
    var REF_HEIGHT = 720;

    var activityTimeout = null;
    var manualPresentationMode = false;

    // Check localStorage for persisted presentation mode
    try {
        manualPresentationMode = localStorage.getItem('slidePresentationMode') === 'true';
    } catch (e) {
        // localStorage not available
    }

    function isInFullscreen() {
        // Check Fullscreen API first
        if (document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement) {
            return true;
        }

        // Check if window covers most of the screen (F11 mode)
        // Use 95% threshold to account for menu bars, notches, etc.
        var heightRatio = window.innerHeight / screen.height;
        var widthRatio = window.innerWidth / screen.width;

        return heightRatio >= 0.95 && widthRatio >= 0.95;
    }

    function updateSlideScale() {
        if (!document.body.classList.contains('fullscreen-mode')) {
            document.documentElement.style.removeProperty('--slide-scale');
            return;
        }

        var scaleX = window.innerWidth / REF_WIDTH;
        var scaleY = window.innerHeight / REF_HEIGHT;
        var scale = Math.min(scaleX, scaleY);

        document.documentElement.style.setProperty('--slide-scale', scale);
    }

    function updateFullscreenMode() {
        var isFullscreen = manualPresentationMode || isInFullscreen();
        document.body.classList.toggle('fullscreen-mode', isFullscreen);
        updateSlideScale();
    }

    function togglePresentationMode() {
        manualPresentationMode = !manualPresentationMode;
        // Persist across page navigations
        try {
            localStorage.setItem('slidePresentationMode', manualPresentationMode);
        } catch (e) {
            // localStorage not available
        }
        updateFullscreenMode();
    }

    // Expose toggle function for external use
    window.togglePresentationMode = togglePresentationMode;

    // Listen for fullscreen changes (API-triggered fullscreen)
    document.addEventListener('fullscreenchange', updateFullscreenMode);
    document.addEventListener('webkitfullscreenchange', updateFullscreenMode);
    document.addEventListener('mozfullscreenchange', updateFullscreenMode);

    // Also check on resize (for F11 which doesn't fire fullscreenchange)
    window.addEventListener('resize', updateFullscreenMode);

    // Check initial state on page load
    updateFullscreenMode();

    // Auto-hide nav after inactivity in fullscreen mode
    function showNavBriefly() {
        if (!document.body.classList.contains('fullscreen-mode')) return;

        document.body.classList.add('nav-active');
        clearTimeout(activityTimeout);
        activityTimeout = setTimeout(function() {
            document.body.classList.remove('nav-active');
        }, 2000);
    }

    // Show nav on mouse movement in fullscreen
    document.addEventListener('mousemove', showNavBriefly);

    // Navigate to next slide
    function goNext() {
        if (nextLink) {
            window.location.href = nextLink.href;
        }
    }

    // Navigate to previous slide
    function goPrev() {
        if (prevLink) {
            window.location.href = prevLink.href;
        }
    }

    // Handle Space/Enter - check for slide interaction first
    function handleAdvance() {
        if (window.slideInteraction.handler) {
            var shouldNavigate = window.slideInteraction.handler();
            if (shouldNavigate) {
                goNext();
            }
        } else {
            goNext();
        }
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Ignore if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        // Toggle presentation mode: P key
        if (e.key === 'p' || e.key === 'P') {
            e.preventDefault();
            togglePresentationMode();
            return;
        }

        // Previous slide: ArrowLeft, PageUp
        if ((e.key === 'ArrowLeft' || e.key === 'PageUp') && prevLink) {
            e.preventDefault();
            goPrev();
        }
        // Next slide: ArrowRight, PageDown
        else if ((e.key === 'ArrowRight' || e.key === 'PageDown') && nextLink) {
            e.preventDefault();
            goNext();
        }
        // Advance (with interaction support): Space, Enter, Tab
        else if (e.key === ' ' || e.key === 'Enter' || e.key === 'Tab') {
            e.preventDefault();
            handleAdvance();
        }
    });

    // Show keyboard hint briefly on load
    var hint = document.getElementById('slideNavHint');
    if (hint) {
        setTimeout(function() {
            hint.classList.add('visible');
        }, 1500);

        setTimeout(function() {
            hint.classList.remove('visible');
        }, 5000);
    }

    // Touch swipe support for mobile
    var touchStartX = 0;
    var touchEndX = 0;
    var minSwipeDistance = 60;

    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        var swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) < minSwipeDistance) return;

        if (swipeDistance > 0 && prevLink) {
            // Swipe right - go to previous
            window.location.href = prevLink.href;
        } else if (swipeDistance < 0 && nextLink) {
            // Swipe left - go to next
            window.location.href = nextLink.href;
        }
    }

    // Add body class for padding
    document.body.classList.add('has-slide-nav');
})();
