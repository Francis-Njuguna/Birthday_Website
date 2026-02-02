/**
 * Birthday site — minimal interactions
 * - Background music: play/pause (no autoplay)
 * - Scroll-triggered fade-in for sections
 * - Subtle hover handled in CSS
 */

(function () {
  'use strict';

  // ---------- Music control (no autoplay) ----------
  var musicToggle = document.getElementById('music-toggle');
  var bgMusic = document.getElementById('bg-music');

  if (musicToggle && bgMusic) {
    musicToggle.addEventListener('click', function () {
      var isPlaying = !bgMusic.paused;

      if (isPlaying) {
        bgMusic.pause();
        musicToggle.setAttribute('aria-pressed', 'false');
      } else {
        bgMusic.play().catch(function () {
          // Ignore autoplay policy errors; user must click to play
        });
        musicToggle.setAttribute('aria-pressed', 'true');
      }
    });
  }

  // ---------- Scroll-triggered section visibility ----------
  var sections = document.querySelectorAll('.section');

  function checkVisibility() {
    var viewportHeight = window.innerHeight;
    var trigger = viewportHeight * 0.75;

    sections.forEach(function (section) {
      var rect = section.getBoundingClientRect();
      var top = rect.top;

      if (top < trigger && !section.classList.contains('visible')) {
        section.classList.add('visible');
      }
    });
  }

  // Run on load and on scroll (throttled)
  var scrollTimeout;
  function onScroll() {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(function () {
      checkVisibility();
      scrollTimeout = null;
    });
  }

  window.addEventListener('load', checkVisibility);
  window.addEventListener('scroll', onScroll, { passive: true });
})();
