(function(){
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Critical styles (self-sufficient for pages without style.css) ── */
  var css = document.createElement('style');
  css.textContent =
    '#scroll-progress{position:fixed;top:0;left:0;right:0;height:2px;background:#A8834B;transform:scaleX(0);transform-origin:left;z-index:300;pointer-events:none;}' +
    'body.page-enter{opacity:0;}body.page-enter-active{opacity:1;transition:opacity .45s ease;}body.page-exit{opacity:0;transition:opacity .26s ease;}' +
    '#lightbox{position:fixed;inset:0;background:rgba(20,18,14,.94);display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .3s ease;z-index:400;cursor:zoom-out;}' +
    '#lightbox.open{opacity:1;pointer-events:auto;}' +
    '#lightbox img{max-width:min(92vw,1100px);max-height:88vh;border:1px solid rgba(168,131,75,.5);padding:10px;background:#F7F4EC;transform:scale(.96);transition:transform .3s cubic-bezier(.2,.6,.2,1);}' +
    '#lightbox.open img{transform:scale(1);}' +
    '#lb-close{position:absolute;top:20px;right:28px;font-weight:300;font-size:34px;color:#F7F4EC;cursor:pointer;line-height:1;font-family:sans-serif;}' +
    '::-webkit-scrollbar{width:10px;height:10px;}' +
    '::-webkit-scrollbar-track{background:#F7F4EC;}' +
    '::-webkit-scrollbar-thumb{background:#A8834B;border:2px solid #F7F4EC;border-radius:6px;}' +
    '::-webkit-scrollbar-thumb:hover{background:#8A6B39;}' +
    'html{scrollbar-color:#A8834B #F7F4EC;scrollbar-width:thin;}' +
    '#brass-cursor{position:fixed;width:22px;height:22px;border:1px solid #A8834B;border-radius:50%;pointer-events:none;z-index:500;transform:translate(-50%,-50%);transition:width .25s,height .25s,background .25s,opacity .25s;opacity:0;}' +
    '#brass-cursor.on{opacity:1;}' +
    '#brass-cursor.hover{width:38px;height:38px;background:rgba(168,131,75,.12);}' +
    '#chapter-mark{position:fixed;bottom:18px;right:22px;font-family:"Bodoni Moda",Georgia,serif;font-style:italic;font-size:12px;color:rgba(29,27,22,.35);z-index:90;letter-spacing:.06em;pointer-events:none;}' +
    '@media (max-width:760px){#chapter-mark{display:none;}}';
  document.head.appendChild(css);

  /* ── Custom brass cursor (desktop, fine-pointer only) ── */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduced) {
    var cur = document.createElement('div');
    cur.id = 'brass-cursor';
    document.body.appendChild(cur);
    var curOn = false;
    document.addEventListener('mousemove', function(e){
      if (!curOn) { cur.classList.add('on'); curOn = true; }
      cur.style.left = e.clientX + 'px';
      cur.style.top = e.clientY + 'px';
    });
    document.addEventListener('mouseover', function(e){
      cur.classList.toggle('hover', !!e.target.closest('a, button, .btn, input, textarea, .hotel-card, .nav-links a'));
    });
    document.addEventListener('mouseleave', function(){ cur.classList.remove('on'); curOn = false; });
  }

  /* ── Chapter mark: page position, like a printed book ── */
  var CHAPTERS = { '/': 'I', '/our-story': 'II', '/the-day': 'III', '/travel': 'IV',
    '/accommodation': 'V', '/rsvp': 'VI', '/photos': 'VII', '/faqs': 'VIII' };
  var path = location.pathname.replace(/\/$/, '') || '/';
  var num = CHAPTERS[path];
  if (num) {
    var ch = document.createElement('div');
    ch.id = 'chapter-mark';
    ch.textContent = num + ' / VIII';
    document.body.appendChild(ch);
  }

  /* ── Evening mode: quietly shifts to the dark palette after 7pm local time ── */
  var hr = new Date().getHours();
  if ((hr >= 19 || hr < 5) && !sessionStorage.getItem('ls_evening_dismissed')) {
    var eve = document.createElement('style');
    eve.id = 'evening-mode';
    eve.textContent =
      ':root{--ivory:#12201B!important;--ink:#F2EFE6!important;--ink-dim:rgba(242,239,230,.6)!important;' +
      '--brass:#D9BE8C!important;--brass-line:rgba(217,190,140,.5)!important;--brass-faint:rgba(217,190,140,.2)!important;}' +
      'body::before{opacity:.05!important;}';
    document.head.appendChild(eve);

    // Externally-referenced SVGs (the seal) can't inherit page CSS variables —
    // swap to a matching dark variant so the monogram stays legible.
    document.querySelectorAll('img[src="/images/wax-seal.svg"]').forEach(function(img){
      img.src = '/images/wax-seal-dark.svg';
    });
  }

  /* ── Live event strip: one persistent thread across every page ── */
  (function(){
    var WEDDING_START = new Date('2027-06-26T00:00:00+01:00');
    var DAY_END = new Date('2027-06-27T02:00:00+01:00');
    var REVEAL_AT = new Date('2027-06-27T09:00:00+01:00');
    var n = new Date();

    var SCHEDULE = [
      ['2027-06-26T12:00:00+01:00', 'The ceremony is happening now'],
      ['2027-06-26T13:00:00+01:00', 'Photographs at the church'],
      ['2027-06-26T13:30:00+01:00', 'Doors open at Manor House'],
      ['2027-06-26T14:00:00+01:00', 'Drinks reception & tea ceremony'],
      ['2027-06-26T15:30:00+01:00', 'Guests are taking their seats'],
      ['2027-06-26T15:45:00+01:00', 'Mr & Mrs have just been announced'],
      ['2027-06-26T18:00:00+01:00', 'Speeches'],
      ['2027-06-26T18:30:00+01:00', 'A short interval'],
      ['2027-06-26T19:30:00+01:00', 'The evening has begun'],
      ['2027-06-26T20:00:00+01:00', 'Cake cutting & first dance'],
      ['2027-06-26T20:45:00+01:00', 'The band — first set'],
      ['2027-06-26T21:30:00+01:00', 'Evening food'],
      ['2027-06-26T22:15:00+01:00', 'The band — second set, then the DJ'],
      ['2027-06-27T00:00:00+01:00', 'Last orders at the bar'],
      ['2027-06-27T00:30:00+01:00', 'The bar has closed'],
      ['2027-06-27T01:00:00+01:00', 'Carriages'],
    ];

    var text = null, href = '/the-day';

    if (n < WEDDING_START) {
      var days = Math.ceil((WEDDING_START - n) / 864e5);
      text = days + ' day' + (days===1?'':'s') + ' to go &middot; RSVP';
      href = '/rsvp';
    } else if (n < DAY_END) {
      var current = null;
      for (var i = 0; i < SCHEDULE.length; i++) {
        if (n >= new Date(SCHEDULE[i][0])) current = SCHEDULE[i][1];
      }
      text = (current || 'The day has begun') + ' &middot; See the full schedule';
      href = '/the-day';
    } else if (n < REVEAL_AT) {
      text = 'The reveal is almost here &middot; Add your last photos';
      href = '/photos';
    }

    if (text) {
      var strip = document.createElement('div');
      strip.id = 'event-strip';
      strip.innerHTML = text;
      strip.addEventListener('click', function(){ window.location.href = href; });
      document.body.insertBefore(strip, document.body.firstChild);
      document.body.classList.add('has-strip');
    }
  })();

  /* ── Scroll progress bar ── */
  var bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.appendChild(bar);
  function progress(){
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? h.scrollTop / max : 0) + ')';
  }
  document.addEventListener('scroll', progress, { passive: true });
  progress();

  /* ── Nav scroll state ── */
  var nav = document.querySelector('.nav');
  if (nav) {
    function navState(){ nav.classList.toggle('scrolled', window.scrollY > 24); }
    document.addEventListener('scroll', navState, { passive: true });
    navState();
  }

  /* ── Page cross-fade transitions ── */
  if (!reduced) {
    document.body.classList.add('page-enter');
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){ document.body.classList.add('page-enter-active'); });
    });
    document.addEventListener('click', function(e){
      var a = e.target.closest('a');
      if (!a) return;
      var href = a.getAttribute('href') || '';
      if (a.target === '_blank' || href.startsWith('#') || href.startsWith('http') ||
          href.startsWith('mailto:') || href.startsWith('tel:') || href.endsWith('.ics') ||
          e.metaKey || e.ctrlKey) return;
      e.preventDefault();
      document.body.classList.add('page-exit');
      setTimeout(function(){ window.location.href = href; }, 260);
    });
    window.addEventListener('pageshow', function(e){
      if (e.persisted) document.body.classList.remove('page-exit');
    });
  }

  /* ── Lightbox (all framed photos + photo wall) ── */
  var lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.innerHTML = '<img alt=""><span id="lb-close" aria-label="Close">&times;</span>';
  document.body.appendChild(lb);
  var lbImg = lb.querySelector('img');

  document.addEventListener('click', function(e){
    var img = e.target.closest('.photo-pair img, .photo-full img, .gallery img');
    if (!img) return;
    lbImg.src = img.src;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  function closeLb(){
    lb.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(function(){ lbImg.src = ''; }, 300);
  }
  lb.addEventListener('click', closeLb);
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeLb(); });
})();
