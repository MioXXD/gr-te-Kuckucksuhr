'use strict';

/* ══════════════════════════════════════════
   TAB NAVIGATION
══════════════════════════════════════════ */
function showSection(id) {
  document.querySelectorAll('.pg').forEach(function (s) { s.classList.remove('active'); });
  document.querySelectorAll('.nb').forEach(function (b) { b.classList.remove('active'); });

  var target = document.getElementById(id);
  if (target) target.classList.add('active');

  var activeBtn = document.querySelector('.nb[data-section="' + id + '"]');
  if (activeBtn) {
    activeBtn.classList.add('active');
    moveNavIndicator(activeBtn);
  }

  window.scrollTo({ top: 0, behavior: 'instant' });
  closeMenu();
  setTimeout(triggerAOS, 60);
}
window.showSection = showSection;

document.addEventListener('click', function (e) {
  var btn = e.target.closest('[data-section]');
  if (btn && !btn.classList.contains('nb')) {
    var sec = btn.getAttribute('data-section');
    if (sec) showSection(sec);
  }
});

document.querySelectorAll('.nb').forEach(function (btn) {
  btn.addEventListener('click', function () { showSection(btn.getAttribute('data-section')); });
});

/* ══════════════════════════════════════════
   NAV SLIDING INDICATOR
══════════════════════════════════════════ */
var indicator = document.createElement('div');
indicator.className = 'nav-indicator';
var nav = document.getElementById('main-nav');
if (nav) nav.appendChild(indicator);

function moveNavIndicator(btn) {
  if (!btn || !nav) return;
  var navRect = nav.getBoundingClientRect();
  var btnRect = btn.getBoundingClientRect();
  indicator.style.left  = (btnRect.left - navRect.left) + 'px';
  indicator.style.width = btnRect.width + 'px';
}

// Init indicator on first load
window.addEventListener('DOMContentLoaded', function () {
  var activeBtn = document.querySelector('.nb.active');
  if (activeBtn) setTimeout(function () { moveNavIndicator(activeBtn); }, 100);
});

/* ══════════════════════════════════════════
   HAMBURGER MENU
══════════════════════════════════════════ */
var hamburger = document.getElementById('hamburger');
var mainNav   = document.getElementById('main-nav');
var menuOpen  = false;

function openMenu()  { menuOpen = true;  mainNav.classList.add('open');    hamburger.classList.add('open');    hamburger.setAttribute('aria-expanded','true'); }
function closeMenu() { menuOpen = false; mainNav.classList.remove('open'); hamburger.classList.remove('open'); hamburger.setAttribute('aria-expanded','false'); }

if (hamburger) {
  hamburger.addEventListener('click', function (e) {
    e.stopPropagation();
    menuOpen ? closeMenu() : openMenu();
  });
}
document.addEventListener('click', function (e) {
  if (menuOpen && mainNav && !mainNav.contains(e.target) && e.target !== hamburger) closeMenu();
});
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

/* ══════════════════════════════════════════
   HEADER SCROLL
══════════════════════════════════════════ */
var header  = document.getElementById('site-header');
var backTop = document.getElementById('back-top');

window.addEventListener('scroll', function () {
  var y = window.scrollY;
  if (header) header.classList.toggle('scrolled', y > 20);
  if (backTop) backTop.classList.toggle('visible', y > 400);
  hideScrollInd();
  updateClockHands();
  updateHeroParallax();
}, { passive: true });

/* ══════════════════════════════════════════
   BACK TO TOP
══════════════════════════════════════════ */
if (backTop) {
  backTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ══════════════════════════════════════════
   HERO PARALLAX
══════════════════════════════════════════ */
var heroBg = document.querySelector('.hero-img-bg');
function updateHeroParallax() {
  /* Parallax deaktiviert – Bild bleibt fest verankert */
}

/* ══════════════════════════════════════════
   CURSOR GLOW
══════════════════════════════════════════ */
var cursorGlow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', function (e) {
  if (!cursorGlow) return;
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top  = e.clientY + 'px';
}, { passive: true });

/* ══════════════════════════════════════════
   RIPPLE ON BUTTONS
══════════════════════════════════════════ */
document.addEventListener('click', function (e) {
  var btn = e.target.closest('.btn-gold');
  if (!btn) return;
  var r = document.createElement('span');
  r.className = 'ripple';
  var size = Math.max(btn.offsetWidth, btn.offsetHeight);
  var rect = btn.getBoundingClientRect();
  r.style.cssText = 'width:' + size + 'px;height:' + size + 'px;left:' + (e.clientX - rect.left - size/2) + 'px;top:' + (e.clientY - rect.top - size/2) + 'px';
  btn.appendChild(r);
  setTimeout(function () { r.remove(); }, 600);
});

/* ══════════════════════════════════════════
   KUCKUCK EASTER EGG (click logo)
══════════════════════════════════════════ */
var toast = document.getElementById('kuckuck-toast');
var logoBtns = document.querySelectorAll('.logo, .footer-logo');
var toastTimer;

function showKuckuck() {
  if (!toast) return;
  clearTimeout(toastTimer);
  toast.classList.add('show');
  toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 1800);
}

logoBtns.forEach(function (el) {
  el.addEventListener('click', function () { showKuckuck(); });
});

/* ══════════════════════════════════════════
   ANIMATED STAT COUNTERS
══════════════════════════════════════════ */
var countersRun = false;
function runCounters() {
  if (countersRun) return;
  var cards = document.querySelectorAll('.pg.active .stat-card');
  if (!cards.length) return;
  countersRun = true;

  var targets = [
    { el: cards[0] && cards[0].querySelector('.stat-n'), end: 50,  suffix: '+',  dur: 1200 },
    { el: cards[1] && cards[1].querySelector('.stat-n'), end: 4.2, suffix: '★', dur: 1000, dec: 1 },
    { el: cards[2] && cards[2].querySelector('.stat-n'), end: 510, suffix: '',   dur: 1400 },
    { el: cards[3] && cards[3].querySelector('.stat-n'), end: 100, suffix: '%',  dur: 1000 }
  ];

  targets.forEach(function (t) {
    if (!t.el) return;
    var start = 0; var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / t.dur, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var val = start + (t.end - start) * eased;
      t.el.textContent = (t.dec ? val.toFixed(t.dec) : Math.floor(val)) + t.suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

/* ══════════════════════════════════════════
   AOS
══════════════════════════════════════════ */
function triggerAOS() {
  countersRun = false; // reset so counters re-run on tab switch

  var els = document.querySelectorAll('.pg.active [data-aos]');
  if (!els.length) return;

  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var siblings = Array.from(el.parentElement.children).filter(function (c) { return c.hasAttribute('data-aos'); });
      var idx = siblings.indexOf(el);
      setTimeout(function () { el.classList.add('aos-in'); }, Math.min(idx * 70, 400));
      obs.unobserve(el);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  els.forEach(function (el) {
    if (!el.classList.contains('aos-in')) obs.observe(el);
  });

  // Run counters when stat cards enter view
  var statObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { runCounters(); statObs.disconnect(); } });
  }, { threshold: 0.3 });
  var firstStat = document.querySelector('.pg.active .stat-card');
  if (firstStat) statObs.observe(firstStat);
}

/* ══════════════════════════════════════════
   SCROLL INDICATOR
══════════════════════════════════════════ */
var scrollInd = document.querySelector('.scroll-ind');
var scrollHidden = false;
function hideScrollInd() {
  if (!scrollInd) return;
  if (window.scrollY > 80 && !scrollHidden) { scrollInd.style.opacity = '0'; scrollHidden = true; }
  else if (window.scrollY <= 80 && scrollHidden) { scrollInd.style.opacity = '1'; scrollHidden = false; }
}

/* ══════════════════════════════════════════
   CLOCK HAND (stub — no SVG clock visible)
══════════════════════════════════════════ */
var hourHand   = document.getElementById('hour-hand-group');
var minuteHand = document.getElementById('minute-hand-group');
function updateClockHands() {
  var wrapper = document.getElementById('clock-scroll-wrapper');
  if (!wrapper || !hourHand || !minuteHand) return;
  var wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;
  var scrolled   = window.scrollY - wrapperTop;
  var maxScroll  = wrapper.offsetHeight - window.innerHeight;
  var progress   = Math.max(0, Math.min(1, scrolled / maxScroll));
  hourHand.style.transform   = 'rotate(' + (progress * 60)  + 'deg)';
  minuteHand.style.transform = 'rotate(' + (progress * 720) + 'deg)';
}

/* ══════════════════════════════════════════
   INQUIRY BUTTONS
══════════════════════════════════════════ */
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('btn-inquire')) {
    window.location.href = 'tel:0611302112';
  }
});

/* ══════════════════════════════════════════
   KEYBOARD NAV
══════════════════════════════════════════ */
var navBtns = Array.from(document.querySelectorAll('.nb'));
navBtns.forEach(function (btn, i) {
  btn.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault(); navBtns[(i + 1) % navBtns.length].focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault(); navBtns[(i - 1 + navBtns.length) % navBtns.length].focus();
    }
  });
});

/* ══════════════════════════════════════════
   INIT
══════════════════════════════════════════ */
(function init() {
  var welcome = document.getElementById('willkommen');
  if (welcome && !document.querySelector('.pg.active')) {
    welcome.classList.add('active');
    var firstBtn = document.querySelector('.nb[data-section="willkommen"]');
    if (firstBtn) firstBtn.classList.add('active');
  }
  updateClockHands();
  setTimeout(triggerAOS, 200);
  updateHeroParallax();
  init3DTilt();
})();

/* ══════════════════════════════════════════
   3D CARD TILT
══════════════════════════════════════════ */
function init3DTilt() {
  function attachTilt(card) {
    var img = card.querySelector('.prod-img img');
    if (!img) return;

    card.addEventListener('mousemove', function(e) {
      var r = card.querySelector('.prod-img').getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width  - 0.5;
      var y = (e.clientY - r.top)  / r.height - 0.5;
      img.style.transform = 'perspective(600px) rotateY(' + (x * 22) + 'deg) rotateX(' + (-y * 18) + 'deg) scale3d(1.10,1.10,1.10)';
      img.style.transition = 'transform 0.08s ease';
      img.style.filter = 'drop-shadow(0 24px 44px rgba(0,0,0,0.75)) drop-shadow(0 6px 18px rgba(200,168,75,0.3))';
    });
    card.addEventListener('mouseleave', function() {
      img.style.transform = '';
      img.style.transition = 'transform 0.55s ease, filter 0.4s ease';
      img.style.filter = '';
    });
  }

  document.querySelectorAll('.prod-card').forEach(attachTilt);

  /* Re-attach for dynamically visible cards */
  var observer = new MutationObserver(function() {
    document.querySelectorAll('.prod-card:not([data-tilt])').forEach(function(c) {
      c.setAttribute('data-tilt', '1');
      attachTilt(c);
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
  document.querySelectorAll('.prod-card').forEach(function(c){ c.setAttribute('data-tilt','1'); });
}

/* ══════════════════════════════════════════
   IMPRESSIONEN SLIDESHOW
══════════════════════════════════════════ */
(function () {
  var viewport = document.getElementById('slideshowViewport');
  var track    = document.getElementById('slideshowTrack');
  var prevBtn  = document.getElementById('slidePrev');
  var nextBtn  = document.getElementById('slideNext');
  var dotsWrap = document.getElementById('slideDots');
  if (!viewport || !track) return;

  var items = Array.from(track.querySelectorAll('.slide-item'));
  var dots  = dotsWrap ? Array.from(dotsWrap.querySelectorAll('.dot')) : [];
  var total = items.length;
  var current = 0;

  function goTo(n) {
    current = (n + total) % total;

    /* Center the active item inside the viewport via scrollLeft */
    var item = items[current];
    var scrollTarget = item.offsetLeft - (viewport.offsetWidth / 2) + (item.offsetWidth / 2);
    viewport.scrollTo({ left: scrollTarget, behavior: 'smooth' });

    items.forEach(function (el, i) { el.classList.toggle('active', i === current); });
    dots.forEach(function (dot, i) { dot.classList.toggle('active', i === current); });
  }

  /* Buttons */
  prevBtn.addEventListener('click', function () { goTo(current - 1); });
  nextBtn.addEventListener('click', function () { goTo(current + 1); });

  /* Dot clicks */
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { goTo(i); });
  });

  /* Keyboard */
  document.addEventListener('keydown', function (e) {
    var sec = document.getElementById('impressionen');
    if (!sec || !sec.classList.contains('active')) return;
    if (e.key === 'ArrowLeft')  goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  /* Touch / swipe */
  var touchStartX = 0;
  var touchStartY = 0;
  viewport.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  viewport.addEventListener('touchend', function (e) {
    var dx = touchStartX - e.changedTouches[0].clientX;
    var dy = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      goTo(dx > 0 ? current + 1 : current - 1);
    }
  }, { passive: true });

  /* Whenever impressionen becomes visible, jump to current slide */
  var sec = document.getElementById('impressionen');
  if (sec) {
    new MutationObserver(function () {
      if (sec.classList.contains('active')) {
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { goTo(current); });
        });
      }
    }).observe(sec, { attributes: true, attributeFilter: ['class'] });
  }

  window.addEventListener('resize', function () { goTo(current); });
}());
