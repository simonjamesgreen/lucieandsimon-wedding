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
    '#lb-close{position:absolute;top:20px;right:28px;font-weight:300;font-size:34px;color:#F7F4EC;cursor:pointer;line-height:1;font-family:sans-serif;}';
  document.head.appendChild(css);

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
