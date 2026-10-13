document.body.classList.remove('no-js');

// Testemunhos: miniatura leve; o player do Vimeo só carrega ao clicar
document.querySelectorAll('.video-slot').forEach(function(slot){
  var id = (slot.getAttribute('data-vimeo-id') || '').trim();
  if(!/^[0-9]+$/.test(id)) return;
  var label = slot.getAttribute('data-label') || 'Testemunho';
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('aria-label', (document.documentElement.lang === 'en' ? 'Play video, ' : 'Ver vídeo, ') + label);
  var img = document.createElement('img');
  img.className = 'poster'; img.alt = ''; img.loading = 'lazy'; img.decoding = 'async';
  img.src = slot.getAttribute('data-thumb') || ('https://vumbnail.com/' + id + '.jpg');
  btn.appendChild(img);
  var play = document.createElement('span'); play.className = 'play'; btn.appendChild(play);
  var d = slot.getAttribute('data-dur');
  if(d){ var s = document.createElement('span'); s.className = 'dur'; s.textContent = d; btn.appendChild(s); }
  btn.addEventListener('click', function(){
    var f = document.createElement('iframe');
    f.src = 'https://player.vimeo.com/video/' + id + '?autoplay=1&dnt=1&title=0&byline=0&portrait=0&badge=0';
    f.allow = 'autoplay; fullscreen; picture-in-picture';
    f.title = label;
    f.allowFullscreen = true;
    slot.innerHTML = '';
    slot.appendChild(f);
  });
  slot.appendChild(btn);
});

// Reveal on scroll
if('IntersectionObserver' in window){
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  },{threshold:.1, rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
} else {
  document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
}

// Header com borda ao fazer scroll + CTA flutuante no mobile
var header = document.querySelector('header');
var floatCta = document.querySelector('.float-cta');
var hero = document.querySelector('.hero-ctas');
var closing = document.querySelector('.closing-ctas');
var light = document.querySelector('.light');
function onScroll(){
  header.classList.toggle('scrolled', window.scrollY > 8);
  var pastHero = hero.getBoundingClientRect().bottom < 0;
  var atClosing = closing.getBoundingClientRect().top < window.innerHeight;
  floatCta.classList.toggle('show', pastHero && !atClosing);
  var lt = light.getBoundingClientRect();
  floatCta.classList.toggle('on-light', lt.top < window.innerHeight - 40 && lt.bottom > window.innerHeight);
}
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();

// Carrossel de vídeos verticais
document.querySelectorAll('[data-reels]').forEach(function(wrap){
  var track = wrap.querySelector('.reels');
  var prev = wrap.querySelector('[data-prev]');
  var next = wrap.querySelector('[data-next]');
  if(!track || !prev || !next) return;
  function step(){ var it = track.querySelector('.work-item'); return it ? it.getBoundingClientRect().width + 16 : 300; }
  function sync(){
    prev.disabled = track.scrollLeft < 4;
    next.disabled = track.scrollLeft + track.clientWidth > track.scrollWidth - 4;
  }
  prev.addEventListener('click', function(){ track.scrollBy({left:-step()*2, behavior:'smooth'}); });
  next.addEventListener('click', function(){ track.scrollBy({left:step()*2, behavior:'smooth'}); });
  track.addEventListener('scroll', sync, {passive:true});
  window.addEventListener('resize', sync);
  sync();
});
