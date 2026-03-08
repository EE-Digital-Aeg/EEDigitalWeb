/* ===========================
   E&E Digital — script.js
   =========================== */

// ---------- Sticky nav ----------
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ---------- Mobile menu ----------
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ---------- Scroll reveal ----------
const revealEls = document.querySelectorAll(
  '.card, .work__card, .step, .testimonial, .hero__stats, .about__card, .highlight, .value__card, .pricing__card, .empty-state, .first-client, .section__header'
);

revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

// ---------- Contact form ----------
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (form) form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    highlightEmpty(form);
    return;
  }

  const btn = form.querySelector('button[type="submit"]');
  const formError = document.getElementById('formError');
  btn.textContent = translations[currentLang]?.['form.sending'] || 'Sending...';
  btn.disabled = true;
  formError.classList.remove('show');

  try {
    const res = await fetch('https://formspree.io/f/xeeropao', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        phone: form.phone?.value.trim() || '',
        budget: form.budget?.value || '',
        service: form.service?.value || '',
        message
      })
    });

    if (res.ok) {
      form.reset();
      formSuccess.classList.add('show');
      setTimeout(() => formSuccess.classList.remove('show'), 6000);
    } else {
      formError.classList.add('show');
    }
  } catch {
    formError.classList.add('show');
  }

  btn.textContent = translations[currentLang]?.['form.submit'] || 'Send Message';
  btn.disabled = false;
});

function highlightEmpty(form) {
  ['name', 'email', 'message'].forEach(field => {
    const el = form[field];
    if (!el.value.trim()) {
      el.style.borderColor = '#ef4444';
      el.addEventListener('input', () => el.style.borderColor = '', { once: true });
    }
  });
}

// ---------- Smooth scroll for anchor links ----------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---------- Counter animation ----------
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const steps = 60;
  const increment = target / steps;
  let current = 0;
  let count = 0;
  const timer = setInterval(() => {
    count++;
    current = Math.min(current + increment, target);
    el.textContent = (Number.isInteger(target) ? Math.round(current) : current.toFixed(1)) + suffix;
    if (count >= steps) clearInterval(timer);
  }, duration / steps);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// ---------- Back to top ----------
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ---------- Active nav link based on current page ----------
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(link => {
  const href = link.getAttribute('href');
  if (href && !link.classList.contains('btn') && href === currentPage) {
    link.classList.add('active');
  }
});

// ---------- FAQ accordion ----------
document.querySelectorAll('.faq__item').forEach(item => {
  item.querySelector('.faq__question').addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq__item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ---------- Portfolio filter ----------
const filterBtns = document.querySelectorAll('.filter__btn');
const workCards = document.querySelectorAll('.work__card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    workCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
    });
  });
});

// ============================================================
// ---------- Theme toggle ----------
// ============================================================
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

// ============================================================
// ---------- i18n — EN / TR ----------
// ============================================================
const translations = {
  en: {
    // Nav
    'nav.services':  'Services',
    'nav.work':      'Work',
    'nav.about':     'About',
    'nav.pricing':   'Pricing',
    'nav.cta':       'Get a Quote',

    // Index hero
    'hero.badge':  'Web Design & Development',
    'hero.title':  'Websites that <span class="gradient-text">grow your business</span>',
    'hero.sub':    'We design and build high-performance websites that attract customers, build trust, and drive revenue — all delivered in 2 weeks.',
    'hero.cta1':   'See Our Work',
    'hero.cta2':   'Get a Free Quote',

    // Index section labels & titles
    'section.services.label': 'What we do',
    'section.services.title': 'Services built to grow your business',
    'section.services.cta':   'Explore All Services →',
    'section.work.label':     'Our work',
    'section.work.title':     'Projects we\'re proud of',
    'section.work.cta':       'View full portfolio →',
    'section.process.label':  'How it works',
    'section.testi.label':    'Testimonials',
    'section.testi.title':    'What our clients say',

    // Index page — hero stats
    'hero.stat1':       'Avg. Delivery Time',
    'hero.stat2.num':   'Free',
    'hero.stat2.label': 'Discovery Call',
    'hero.stat3':       'Focused on Your Project',

    // Index page — service cards
    'index.svc1.title': 'Website Design',
    'index.svc1.text':  'Pixel-perfect, modern designs tailored to your brand that captivate visitors and drive conversions.',
    'index.svc2.title': 'Web Development',
    'index.svc2.text':  'Clean, fast, and scalable code. We build websites that load quickly, rank well, and work on every device.',
    'index.svc3.title': 'Landing Pages',
    'index.svc3.text':  'High-converting landing pages built for a single goal — capturing leads, launching a product, or driving sign-ups.',

    // Index page — portfolio empty state
    'index.portfolio.label': 'Portfolio',
    'index.portfolio.title': 'Your project could be first here.',
    'index.portfolio.sub':   'We\'re just getting started — and that\'s good news for you. You\'ll get our full attention, our best work, and launch pricing.',
    'index.portfolio.cta':   'Start a Project →',

    // Index page — process section
    'index.process.title':  'Simple process, great results',
    'process.step1.title':  'Discovery Call',
    'process.step1.text':   'We learn about your business, goals, and audience so we can build the right solution for you.',
    'process.step2.title':  'Design & Build',
    'process.step2.text':   'We design and develop your site, keeping you in the loop with regular updates.',
    'process.step3.title':  'Review & Refine',
    'process.step3.text':   'You review the site and we make revisions until it\'s exactly right. No hidden fees.',
    'process.step4.title':  'Launch & Support',
    'process.step4.text':   'We launch your site and provide ongoing support to make sure everything runs smoothly.',

    // First client CTA
    'fc.title': 'Be our first five-star client.',
    'fc.sub':   'We\'re a new agency with big ambitions. Work with us now and get our undivided attention, launch-day pricing, and a website we\'ll both be proud to show the world.',

    // CTA banner (index)
    'cta.title': 'Ready to get started?',
    'cta.sub':   'Let\'s build a website that works as hard as you do.',
    'cta.btn':   'Start Your Project',

    // Footer
    'footer.tagline':       'Modern websites for growing businesses.',
    'footer.services':      'Services',
    'footer.company':       'Company',
    'footer.rights':        '© 2026 E&E Digital. All rights reserved.',
    'footer.built':         'Built with care.',
    'footer.link.design':   'Web Design',
    'footer.link.dev':      'Web Development',
    'footer.link.support':  'Ongoing Support',
    'footer.link.portfolio':'Portfolio',
    'footer.link.contact':  'Contact',

    // Page heroes
    'page.services.label': 'What we offer',
    'page.services.title': 'Everything you need to grow online',
    'page.services.sub':   'From a simple brochure site to a high-converting landing page — we handle it all.',
    'page.work.label':     'Portfolio',
    'page.work.title':     'Your project could be first.',
    'page.work.sub':       'We\'re building our portfolio — and we\'d love for your brand to be the one we showcase first.',
    'page.about.label':    'About us',
    'page.about.title':    'We build websites that mean business',
    'page.about.sub':      'A small, dedicated agency focused on one thing — building websites that genuinely grow your business.',
    'page.pricing.label':  'Transparent pricing',
    'page.pricing.title':  'Simple, honest packages',
    'page.pricing.sub':    'One-time fees, no hidden costs, no surprises. Pick a plan or get a custom quote.',
    'page.contact.label':  'Get in touch',
    'page.contact.title':  'Let\'s build something great',
    'page.contact.sub':    'Fill in the form and we\'ll get back to you within 24 hours with a free consultation and quote.',

    // About page sections
    'about.story.label': 'Our story',
    'about.story.title': 'Built on a simple belief',
    'about.values.label': 'What drives us',
    'about.values.title': 'Our values',

    // Pricing page
    'pricing.compare.label': 'Compare',
    'pricing.compare.title': 'What\'s included in each plan',
    'pricing.faq.label': 'FAQ',
    'pricing.faq.title': 'Questions about pricing',
    'pricing.cta.title': 'Not sure which plan is right for you?',
    'pricing.cta.sub':   'Book a free 20-minute call and we\'ll work it out together.',
    'pricing.cta.btn':   'Book a Free Call',

    // Contact form labels
    'form.name':    'Your name',
    'form.email':   'Email address',
    'form.phone':   'Phone (optional)',
    'form.budget':  'Approximate budget',
    'form.service': 'Service needed',
    'form.message': 'Tell us about your project',
    'form.submit':  'Send Message',
    'form.sending': 'Sending...',
    'form.success': 'Thanks! We\'ll be in touch within 24 hours.',
    'form.error':   'Something went wrong. Please email us directly at hello@eedigital.com.',

    // Filter buttons
    'filter.all':     'All',
    'filter.web':     'Web Design',
    'filter.ecom':    'E-Commerce',
    'filter.seo':     'SEO',
  },

  tr: {
    // Nav
    'nav.services':  'Hizmetler',
    'nav.work':      'Çalışmalar',
    'nav.about':     'Hakkımızda',
    'nav.pricing':   'Fiyatlar',
    'nav.cta':       'Teklif Al',

    // Index hero
    'hero.badge':  'Web Tasarım & Geliştirme',
    'hero.title':  'İşinizi <span class="gradient-text">büyüten web siteleri</span>',
    'hero.sub':    'Müşteri çeken, güven inşa eden ve gelir artıran yüksek performanslı web siteleri tasarlıyor ve geliştiriyoruz — 2 haftada teslim.',
    'hero.cta1':   'Çalışmalarımıza Bak',
    'hero.cta2':   'Ücretsiz Teklif Al',

    // Index section labels & titles
    'section.services.label': 'Ne yapıyoruz',
    'section.services.title': 'İşinizi büyütecek hizmetler',
    'section.services.cta':   'Tüm Hizmetleri Keşfet →',
    'section.work.label':     'Çalışmalarımız',
    'section.work.title':     'Gurur duyduğumuz projeler',
    'section.work.cta':       'Tüm portföyü gör →',
    'section.process.label':  'Nasıl çalışıyoruz',
    'section.testi.label':    'Referanslar',
    'section.testi.title':    'Müşterilerimiz ne diyor',

    // Index page — hero stats
    'hero.stat1':       'Ort. Teslimat Süresi',
    'hero.stat2.num':   'Ücretsiz',
    'hero.stat2.label': 'Keşif Görüşmesi',
    'hero.stat3':       'Projenize Odaklanmış',

    // Index page — service cards
    'index.svc1.title': 'Website Tasarımı',
    'index.svc1.text':  'Markanıza özel piksel mükemmel, modern tasarımlar. Ziyaretçileri büyüler ve dönüşümleri artırır.',
    'index.svc2.title': 'Web Geliştirme',
    'index.svc2.text':  'Temiz, hızlı ve ölçeklenebilir kod. Her cihazda çalışan, hızlı yüklenen ve iyi sıralanan siteler inşa ediyoruz.',
    'index.svc3.title': 'Açılış Sayfaları',
    'index.svc3.text':  'Tek bir hedefe yönelik yüksek dönüşümlü açılış sayfaları — lead toplamak, ürün lansmanı veya kayıt artırmak.',

    // Index page — portfolio empty state
    'index.portfolio.label': 'Portföy',
    'index.portfolio.title': 'Projeniz burada ilk olabilir.',
    'index.portfolio.sub':   'Yeni başlıyoruz — ve bu sizin için iyi bir haber. Tam dikkatimizi, en iyi çalışmamızı ve lansman fiyatını alacaksınız.',
    'index.portfolio.cta':   'Proje Başlat →',

    // Index page — process section
    'index.process.title':  'Basit süreç, harika sonuçlar',
    'process.step1.title':  'Keşif Görüşmesi',
    'process.step1.text':   'Doğru çözümü inşa edebilmek için işinizi, hedeflerinizi ve kitlenizi öğreniyoruz.',
    'process.step2.title':  'Tasarım & Geliştirme',
    'process.step2.text':   'Sitenizi tasarlayıp geliştiriyoruz, düzenli güncellemelerle sizi her adımda bilgilendiriyoruz.',
    'process.step3.title':  'İnceleme & Revizyon',
    'process.step3.text':   'Siteyi inceliyorsunuz, her şey tam olana kadar revizyonlar yapıyoruz. Gizli ücret yok.',
    'process.step4.title':  'Yayın & Destek',
    'process.step4.text':   'Sitenizi yayına alıyor ve her şeyin sorunsuz çalışması için sürekli destek sağlıyoruz.',

    // First client CTA
    'fc.title': 'İlk beş yıldızlı müşterimiz olun.',
    'fc.sub':   'Büyük hırslarla dolu yeni bir ajansız. Şimdi birlikte çalışın ve tam dikkatimizi, lansman fiyatını ve dünyaya göstereceğiniz bir web sitesini elde edin.',

    // CTA banner (index)
    'cta.title': 'Başlamaya hazır mısınız?',
    'cta.sub':   'Sizin kadar sıkı çalışan bir website inşa edelim.',
    'cta.btn':   'Projenizi Başlatın',

    // Footer
    'footer.tagline':       'Büyüyen işletmeler için modern web siteleri.',
    'footer.services':      'Hizmetler',
    'footer.company':       'Şirket',
    'footer.rights':        '© 2026 E&E Digital. Tüm hakları saklıdır.',
    'footer.built':         'Özenle inşa edildi.',
    'footer.link.design':   'Web Tasarım',
    'footer.link.dev':      'Web Geliştirme',
    'footer.link.support':  'Sürekli Destek',
    'footer.link.portfolio':'Portföy',
    'footer.link.contact':  'İletişim',

    // Page heroes
    'page.services.label': 'Ne sunuyoruz',
    'page.services.title': 'Online büyümek için ihtiyacınız olan her şey',
    'page.services.sub':   'Basit bir tanıtım sitesinden yüksek dönüşümlü bir açılış sayfasına kadar — her şeyi biz hallediyoruz.',
    'page.work.label':     'Portföy',
    'page.work.title':     'Projeniz ilk olabilir.',
    'page.work.sub':       'Portföyümüzü inşa ediyoruz — ve markanızın ilk vitrin projemiz olmasını çok isteriz.',
    'page.about.label':    'Hakkımızda',
    'page.about.title':    'İşinize anlam katan web siteleri yapıyoruz',
    'page.about.sub':      'Tek bir şeye odaklanan küçük, özverili bir ajans — işinizi gerçekten büyüten web siteleri.',
    'page.pricing.label':  'Şeffaf fiyatlandırma',
    'page.pricing.title':  'Basit, dürüst paketler',
    'page.pricing.sub':    'Tek seferlik ücretler, gizli maliyetler yok, sürpriz yok. Bir plan seçin veya özel teklif alın.',
    'page.contact.label':  'İletişime geçin',
    'page.contact.title':  'Birlikte harika bir şey inşa edelim',
    'page.contact.sub':    'Formu doldurun, 24 saat içinde ücretsiz danışmanlık ve teklifle geri dönelim.',

    // About page sections
    'about.story.label': 'Hikayemiz',
    'about.story.title': 'Basit bir inanca dayalı',
    'about.values.label': 'Bizi yönlendiren',
    'about.values.title': 'Değerlerimiz',

    // Pricing page
    'pricing.compare.label': 'Karşılaştır',
    'pricing.compare.title': 'Her planda neler var',
    'pricing.faq.label': 'SSS',
    'pricing.faq.title': 'Fiyatlandırma hakkında sorular',
    'pricing.cta.title': 'Hangi planın size uygun olduğundan emin değil misiniz?',
    'pricing.cta.sub':   'Ücretsiz 20 dakikalık arama yapın, birlikte çözelim.',
    'pricing.cta.btn':   'Ücretsiz Arama Yap',

    // Contact form labels
    'form.name':    'Adınız',
    'form.email':   'E-posta adresi',
    'form.phone':   'Telefon (isteğe bağlı)',
    'form.budget':  'Tahmini bütçe',
    'form.service': 'İhtiyaç duyulan hizmet',
    'form.message': 'Projenizi anlatın',
    'form.submit':  'Mesaj Gönder',
    'form.sending': 'Gönderiliyor...',
    'form.success': 'Teşekkürler! 24 saat içinde sizinle iletişime geçeceğiz.',
    'form.error':   'Bir şeyler ters gitti. Lütfen bize doğrudan e-posta gönderin: hello@eedigital.com.',

    // Filter buttons
    'filter.all':     'Tümü',
    'filter.web':     'Web Tasarım',
    'filter.ecom':    'E-Ticaret',
    'filter.seo':     'SEO',
  },

  de: {
    // Nav
    'nav.services':  'Leistungen',
    'nav.work':      'Projekte',
    'nav.about':     'Über uns',
    'nav.pricing':   'Preise',
    'nav.cta':       'Angebot anfordern',

    // Index hero
    'hero.badge':  'Webdesign & Entwicklung',
    'hero.title':  'Websites, die Ihr <span class="gradient-text">Unternehmen wachsen lassen</span>',
    'hero.sub':    'Wir gestalten und entwickeln leistungsstarke Websites, die Kunden gewinnen, Vertrauen aufbauen und Umsatz steigern — in 2 Wochen geliefert.',
    'hero.cta1':   'Unsere Projekte',
    'hero.cta2':   'Kostenloses Angebot',

    // Index section labels & titles
    'section.services.label': 'Was wir tun',
    'section.services.title': 'Leistungen für Ihr Wachstum',
    'section.services.cta':   'Alle Leistungen erkunden →',
    'section.work.label':     'Unsere Arbeit',
    'section.work.title':     'Projekte, auf die wir stolz sind',
    'section.work.cta':       'Gesamtes Portfolio →',
    'section.process.label':  'So funktioniert es',
    'section.testi.label':    'Referenzen',
    'section.testi.title':    'Was unsere Kunden sagen',

    // Index page — hero stats
    'hero.stat1':       'Ø Lieferzeit',
    'hero.stat2.num':   'Kostenlos',
    'hero.stat2.label': 'Erstgespräch',
    'hero.stat3':       'Fokussiert auf Ihr Projekt',

    // Index page — service cards
    'index.svc1.title': 'Webdesign',
    'index.svc1.text':  'Pixelgenaue, moderne Designs, die zu Ihrer Marke passen, Besucher fesseln und Conversions steigern.',
    'index.svc2.title': 'Webentwicklung',
    'index.svc2.text':  'Sauberer, schneller und skalierbarer Code. Wir bauen Websites, die schnell laden, gut ranken und auf jedem Gerät funktionieren.',
    'index.svc3.title': 'Landingpages',
    'index.svc3.text':  'Hochkonvertierende Landingpages für ein einziges Ziel — Leads generieren, Produkte launchen oder Anmeldungen steigern.',

    // Index page — portfolio empty state
    'index.portfolio.label': 'Portfolio',
    'index.portfolio.title': 'Ihr Projekt könnte hier das erste sein.',
    'index.portfolio.sub':   'Wir fangen gerade erst an — und das ist eine gute Nachricht für Sie. Sie bekommen unsere volle Aufmerksamkeit, unsere beste Arbeit und Einführungspreise.',
    'index.portfolio.cta':   'Projekt starten →',

    // Index page — process section
    'index.process.title':  'Einfacher Prozess, tolle Ergebnisse',
    'process.step1.title':  'Erstgespräch',
    'process.step1.text':   'Wir lernen Ihr Unternehmen, Ihre Ziele und Ihre Zielgruppe kennen, um die richtige Lösung für Sie zu entwickeln.',
    'process.step2.title':  'Design & Entwicklung',
    'process.step2.text':   'Wir gestalten und entwickeln Ihre Website und halten Sie mit regelmäßigen Updates auf dem Laufenden.',
    'process.step3.title':  'Überprüfung & Optimierung',
    'process.step3.text':   'Sie begutachten die Website, wir machen Revisionen bis alles perfekt ist. Keine versteckten Kosten.',
    'process.step4.title':  'Launch & Support',
    'process.step4.text':   'Wir launchen Ihre Website und bieten fortlaufenden Support, damit alles reibungslos läuft.',

    // First client CTA
    'fc.title': 'Werden Sie unser erster Fünf-Sterne-Kunde.',
    'fc.sub':   'Wir sind eine neue Agentur mit großen Ambitionen. Arbeiten Sie jetzt mit uns und erhalten Sie unsere volle Aufmerksamkeit, Einführungspreise und eine Website, auf die wir beide stolz sein werden.',

    // CTA banner (index)
    'cta.title': 'Bereit loszulegen?',
    'cta.sub':   'Lassen Sie uns eine Website entwickeln, die so hart arbeitet wie Sie.',
    'cta.btn':   'Projekt starten',

    // Footer
    'footer.tagline':       'Moderne Websites für wachsende Unternehmen.',
    'footer.services':      'Leistungen',
    'footer.company':       'Unternehmen',
    'footer.rights':        '© 2026 E&E Digital. Alle Rechte vorbehalten.',
    'footer.built':         'Mit Sorgfalt entwickelt.',
    'footer.link.design':   'Webdesign',
    'footer.link.dev':      'Webentwicklung',
    'footer.link.support':  'Laufender Support',
    'footer.link.portfolio':'Portfolio',
    'footer.link.contact':  'Kontakt',

    // Page heroes
    'page.services.label': 'Was wir anbieten',
    'page.services.title': 'Alles, was Sie für Ihr Online-Wachstum brauchen',
    'page.services.sub':   'Von der einfachen Broschüren-Website bis zur hochkonvertierenden Landingpage — wir kümmern uns um alles.',
    'page.work.label':     'Portfolio',
    'page.work.title':     'Ihr Projekt könnte das erste sein.',
    'page.work.sub':       'Wir bauen unser Portfolio auf — und würden uns freuen, Ihre Marke als erstes Vorzeigeprojekt zu präsentieren.',
    'page.about.label':    'Über uns',
    'page.about.title':    'Wir bauen Websites, die Ergebnisse liefern',
    'page.about.sub':      'Eine kleine, engagierte Agentur mit einem Ziel — Websites, die Ihr Unternehmen wirklich wachsen lassen.',
    'page.pricing.label':  'Transparente Preise',
    'page.pricing.title':  'Einfache, faire Pakete',
    'page.pricing.sub':    'Einmalige Festpreise, keine versteckten Kosten, keine Überraschungen. Wählen Sie ein Paket oder fordern Sie ein individuelles Angebot an.',
    'page.contact.label':  'Kontakt aufnehmen',
    'page.contact.title':  'Lassen Sie uns etwas Großes aufbauen',
    'page.contact.sub':    'Füllen Sie das Formular aus — wir melden uns innerhalb von 24 Stunden mit einer kostenlosen Beratung und einem Angebot.',

    // About page sections
    'about.story.label': 'Unsere Geschichte',
    'about.story.title': 'Aufgebaut auf einem einfachen Glauben',
    'about.values.label': 'Was uns antreibt',
    'about.values.title': 'Unsere Werte',

    // Pricing page
    'pricing.compare.label': 'Vergleich',
    'pricing.compare.title': 'Was in jedem Paket enthalten ist',
    'pricing.faq.label': 'FAQ',
    'pricing.faq.title': 'Fragen zu den Preisen',
    'pricing.cta.title': 'Nicht sicher, welches Paket das Richtige ist?',
    'pricing.cta.sub':   'Buchen Sie ein kostenloses 20-Minuten-Gespräch — wir finden es gemeinsam heraus.',
    'pricing.cta.btn':   'Kostenloses Gespräch buchen',

    // Contact form labels
    'form.name':    'Ihr Name',
    'form.email':   'E-Mail-Adresse',
    'form.phone':   'Telefon (optional)',
    'form.budget':  'Ungefähres Budget',
    'form.service': 'Benötigte Leistung',
    'form.message': 'Erzählen Sie uns von Ihrem Projekt',
    'form.submit':  'Nachricht senden',
    'form.sending': 'Wird gesendet...',
    'form.success': 'Danke! Wir melden uns innerhalb von 24 Stunden.',
    'form.error':   'Etwas ist schiefgelaufen. Bitte schreiben Sie uns direkt: hello@eedigital.com.',

    // Filter buttons
    'filter.all':     'Alle',
    'filter.web':     'Webdesign',
    'filter.ecom':    'E-Commerce',
    'filter.seo':     'SEO',
  }
};

// Auto-detect language from browser locale; persist choice via localStorage
const browserLang = navigator.language.toLowerCase().startsWith('de') ? 'de'
  : navigator.language.toLowerCase().startsWith('tr') ? 'tr' : 'en';
let currentLang = localStorage.getItem('lang') || browserLang;

function applyLang(lang) {
  currentLang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const text = translations[lang]?.[key];
    if (text === undefined) return;

    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = text;
    } else if (el.dataset.i18nHtml !== undefined || key === 'hero.title') {
      el.innerHTML = text;
    } else {
      el.textContent = text;
    }
  });

  localStorage.setItem('lang', lang);
  document.documentElement.setAttribute('lang', lang);
}

// Init language on page load
applyLang(currentLang);
