(function(){
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var els = document.querySelectorAll(
    '.info-row, .order-row, .order-part, .photo-pair, .photo-full, .hotel-card, .cat-head, ' +
    '.prose, .names-grid, .faq-item, .stamp, .venue-map-block, .next-block, .form-wrap, ' +
    '.route .stop, .route .leg, .tt, .mode, .tr-maps'
  );
  els.forEach(function(el){
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity .8s cubic-bezier(.2,.6,.2,1), transform .8s cubic-bezier(.2,.6,.2,1)';
  });
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'none';
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  els.forEach(function(el){ io.observe(el); });
})();
