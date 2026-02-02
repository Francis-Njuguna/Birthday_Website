/**
 * Birthday site — minimal interactions
 * - Background music: starts on page load, play/pause button
 * - Scroll-triggered fade-in for sections
 * - Subtle hover handled in CSS
 */

(function () {
  'use strict';

  // ---------- Music control (starts on visit, then play/pause) ----------
  var musicToggle = document.getElementById('music-toggle');
  var bgMusic = document.getElementById('bg-music');

  function setPlayingState(playing) {
    if (musicToggle) {
      musicToggle.setAttribute('aria-pressed', playing ? 'true' : 'false');
    }
  }

  if (musicToggle && bgMusic) {
    // Start playing when the page loads (browsers may block; then user can click play)
    window.addEventListener('load', function () {
      bgMusic.play()
        .then(function () {
          setPlayingState(true);
        })
        .catch(function () {
          setPlayingState(false);
        });
    });

    musicToggle.addEventListener('click', function () {
      var isPlaying = !bgMusic.paused;

      if (isPlaying) {
        bgMusic.pause();
        setPlayingState(false);
      } else {
        bgMusic.play().catch(function () {});
        setPlayingState(true);
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
