// ===== Mobile menu =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
  hamburger.classList.remove('open'); navLinks.classList.remove('open');
}));

// ===== Navbar shadow, active link, back-to-top =====
const navbar = document.getElementById('navbar');
const toTop = document.getElementById('toTop');
const sections = [...document.querySelectorAll('section[id]')];
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 20);
  toTop.classList.toggle('show', y > 600);
  let current = 'home';
  sections.forEach((s) => { if (y >= s.offsetTop - 120) current = s.id; });
  navLinks.querySelectorAll('a:not(.btn)').forEach((a) =>
    a.classList.toggle('active', a.getAttribute('href') === '#' + current));
});
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== Reveal on scroll + counters =====
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visible');
    io.unobserve(e.target);
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.count;
    let n = 0; const step = Math.max(1, Math.ceil(target / 60));
    const t = setInterval(() => { n += step; if (n >= target) { n = target; clearInterval(t); } el.textContent = n; }, 25);
    counterObs.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach((el) => counterObs.observe(el));

// ===== Project filters =====
document.querySelectorAll('.filter').forEach((btn) => btn.addEventListener('click', () => {
  document.querySelectorAll('.filter').forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');
  const f = btn.dataset.filter;
  document.querySelectorAll('.project').forEach((p) => {
    p.classList.toggle('hide', f !== 'all' && !p.dataset.cat.split(' ').includes(f));
  });
}));

// ===== "Enquire Now" on service cards pre-selects the service =====
document.querySelectorAll('.svc-link').forEach((a) => a.addEventListener('click', () => {
  const sel = document.querySelector('#contactForm select[name="service"]');
  if (sel) sel.value = a.dataset.service;
}));

// ===== Forms -> backend (/api/enquiry) =====
document.querySelectorAll('.enquiry-form').forEach((form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = form.querySelector('.form-msg');
    const btn = form.querySelector('button[type="submit"]');
    msg.className = 'form-msg'; msg.textContent = '';

    // client-side validation
    let valid = true;
    form.querySelectorAll('[required]').forEach((f) => {
      let ok = f.value.trim() !== '';
      if (f.name === 'phone') ok = /^(\+?91[\s-]?)?[6-9]\d{9}$/.test(f.value.replace(/[\s-]/g, ''));
      f.classList.toggle('invalid', !ok);
      if (!ok) valid = false;
    });
    const email = form.querySelector('[name="email"]');
    if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { email.classList.add('invalid'); valid = false; }
    if (!valid) {
      msg.className = 'form-msg err';
      msg.textContent = 'Please fill all required fields correctly (valid 10-digit mobile number).';
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    data.source = form.dataset.source;
    const original = btn.textContent;
    btn.disabled = true; btn.textContent = 'Sending...';
    try {
      const res = await fetch('api/enquiry', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
      });
      const out = await res.json();
      msg.className = 'form-msg ' + (out.ok ? 'ok' : 'err');
      msg.textContent = (out.ok ? '✅ ' : '⚠️ ') + out.message;
      if (out.ok) form.reset();
    } catch {
      msg.className = 'form-msg err';
      msg.innerHTML = '⚠️ Could not send right now. Please <a href="tel:+917735446710"><b>call 7735446710</b></a> or WhatsApp us.';
    } finally {
      btn.disabled = false; btn.textContent = original;
    }
  });
  form.querySelectorAll('input,select').forEach((f) => f.addEventListener('input', () => f.classList.remove('invalid')));
});

document.getElementById('year').textContent = new Date().getFullYear();
