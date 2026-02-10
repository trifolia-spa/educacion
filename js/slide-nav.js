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

    function updateSlideScale() {
        var scaleX = window.innerWidth / REF_WIDTH;
        var scaleY = window.innerHeight / REF_HEIGHT;
        var scale = Math.min(scaleX, scaleY);

        document.documentElement.style.setProperty('--slide-scale', scale);
    }

    // Always-on presentation mode
    document.body.classList.add('fullscreen-mode');
    updateSlideScale();
    window.addEventListener('resize', updateSlideScale);

    // Clean up stale localStorage from old toggle mode
    try { localStorage.removeItem('slidePresentationMode'); } catch (e) {}

    // Auto-hide nav after inactivity
    function showNavBriefly() {
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
