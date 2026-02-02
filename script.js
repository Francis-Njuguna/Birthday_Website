/**
 * Birthday site — minimal interactions
 * - Background music: starts on page load, play/pause button
 * - When a video plays, music pauses; when video ends/pauses, music resumes
 * - Scroll-triggered fade-in for sections
 * - Subtle hover handled in CSS
 */

(function () {
  'use strict';

  // ---------- Music control (starts on visit, then play/pause) ----------
  var musicToggle = document.getElementById('music-toggle');
  var bgMusic = document.getElementById('bg-music');
  var musicWasPlayingBeforeVideo = false;

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

  // ---------- Pause music when video plays; resume when video ends or is paused ----------
  (function () {
    var videos = document.querySelectorAll('video');
    function anyVideoPlaying() {
      for (var i = 0; i < videos.length; i++) {
        if (!videos[i].paused) return true;
      }
      return false;
    }
    function tryResumeMusic() {
      if (!anyVideoPlaying() && musicWasPlayingBeforeVideo && bgMusic) {
        musicWasPlayingBeforeVideo = false;
        bgMusic.play().catch(function () {});
        setPlayingState(true);
      }
    }
    for (var j = 0; j < videos.length; j++) {
      (function (video) {
        video.addEventListener('play', function () {
          if (bgMusic && !bgMusic.paused) {
            musicWasPlayingBeforeVideo = true;
            bgMusic.pause();
            setPlayingState(false);
          }
        });
        video.addEventListener('pause', tryResumeMusic);
        video.addEventListener('ended', tryResumeMusic);
      })(videos[j]);
    }
  })();

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
