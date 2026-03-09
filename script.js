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

  const btn = form.querySelector('button[type="submit"]');
  const formError = document.getElementById('formError');

  if (!name || !email || !message) {
    highlightEmpty(form);
    formError.textContent = translations[currentLang]?.['form.validation.required'] || 'Please fill in all required fields.';
    formError.classList.add('show');
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    form.email.style.borderColor = '#ef4444';
    form.email.addEventListener('input', () => { form.email.style.borderColor = ''; formError.classList.remove('show'); }, { once: true });
    formError.textContent = translations[currentLang]?.['form.validation.email'] || 'Please enter a valid email address.';
    formError.classList.add('show');
    return;
  }
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

    // Marquee
    'marquee.design':   'Web Design',
    'marquee.dev':      'Web Development',
    'marquee.seo':      'SEO Optimisation',
    'marquee.landing':  'Landing Pages',
    'marquee.brand':    'Brand Identity',
    'marquee.perf':     'Performance Optimisation',
    'marquee.support':  'Ongoing Support',
    'marquee.delivery': 'Fast Delivery',

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
    'footer.link.portfolio':  'Portfolio',
    'footer.link.contact':    'Contact',
    'footer.link.impressum':  'Imprint',
    'footer.link.datenschutz':'Privacy Policy',

    // Page titles
    'page.index.doctitle':    'E&E Digital — Web Design & Development Agency',
    'page.services.doctitle': 'Services — E&E Digital',
    'page.work.doctitle':     'Our Work — E&E Digital',
    'page.about.doctitle':    'About — E&E Digital',
    'page.pricing.doctitle':  'Pricing — E&E Digital',
    'page.contact.doctitle':  'Contact — E&E Digital',
    'page.404.doctitle':      '404 — Page Not Found | E&E Digital',
    'page.404.label':         '404 Error',
    'page.404.title':         'Page Not Found',
    'page.404.sub':           "The page you're looking for doesn't exist or has been moved.",
    'page.404.cta':           'Go Back Home',

    // OG / Twitter meta
    'meta.index.title':    'E&E Digital — Web Design & Development Agency',
    'meta.index.desc':     'E&E Digital builds modern, high-performance websites for growing businesses. Custom web design, development, and SEO.',
    'meta.services.title': 'Services — E&E Digital',
    'meta.services.desc':  'From web design and development to SEO and landing pages — E&E Digital offers everything your business needs to succeed online.',
    'meta.work.title':     'Our Work — E&E Digital',
    'meta.work.desc':      "We're building our portfolio — and we'd love for your brand to be the one we showcase first.",
    'meta.about.title':    'About — E&E Digital',
    'meta.about.desc':     'Learn about E&E Digital — a web design and development agency focused on building websites that grow businesses.',
    'meta.pricing.title':  'Pricing — E&E Digital',
    'meta.pricing.desc':   'Simple, transparent pricing for web design and development. Choose a package that fits your business — no hidden fees.',
    'meta.contact.title':  'Contact — E&E Digital',
    'meta.contact.desc':   "Get in touch with E&E Digital. Tell us about your project and we'll get back to you within 24 hours with a free quote.",

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
    'form.error':   'Something went wrong. Please email us directly at ee-digital@outlook.com.',
    'form.budget.placeholder': 'Select a range...',
    'form.budget.opt1': 'Under £1,000',
    'form.budget.opt2': '£1,000 – £2,500',
    'form.budget.opt3': '£2,500 – £5,000',
    'form.budget.opt4': '£5,000+',
    'form.budget.opt5': 'Not sure yet',
    'form.service.placeholder': 'Select a service...',
    'form.service.opt1': 'Website Design',
    'form.service.opt2': 'Web Development',
    'form.service.opt3': 'Landing Page',
    'form.service.opt4': 'SEO Optimisation',
    'form.service.opt5': 'Ongoing Support',
    'form.service.opt6': 'Other / Not Sure',
    'form.validation.required': 'Please fill in all required fields.',
    'form.validation.email':    'Please enter a valid email address.',
    'form.name.ph':    'John Smith',
    'form.email.ph':   'john@example.com',
    'form.phone.ph':   '+44 7700 000000',
    'form.message.ph': 'Describe your project, goals, timeline, and any specific requirements...',

    // Filter buttons
    'filter.all':     'All',
    'filter.web':     'Web Design',
    'filter.ecom':    'E-Commerce',
    'footer.link.seo':     'SEO',

    // Work page
    'work.empty.title': 'No projects yet — but yours could be first.',
    'work.empty.sub':   'We\'re a new agency ready to pour everything into our first clients. You\'ll get launch pricing, our full focus, and a finished site you\'ll actually want to show people.',
    'work.empty.cta':   'Start a Project',
    'work.fc.sub':      'In exchange for your trust, you get our undivided attention, launch-day pricing, and a website we\'ll both be proud to show the world — delivered in 2 weeks.',
    'work.cta.title':   'Ready to be first?',
    'work.cta.sub':     'Let\'s talk about your project and build something we\'re both proud of.',
    'work.cta.btn':     'Start a Project',

    // Services page — service cards
    'services.svc1.title': 'Website Design',
    'services.svc1.text':  'We create visually stunning, strategically designed websites that reflect your brand and convert visitors into customers. Every design is custom — no templates, no shortcuts.',
    'services.svc1.li1':   'Custom UI/UX design',
    'services.svc1.li2':   'Brand-aligned visuals',
    'services.svc1.li3':   'Mobile-first approach',
    'services.svc1.li4':   'Interactive prototypes',
    'services.svc2.title': 'Web Development',
    'services.svc2.text':  'We write clean, performant code that makes your site fast, secure, and rock solid. Built on modern standards and tested across all devices and browsers.',
    'services.svc2.li1':   'HTML, CSS, JavaScript',
    'services.svc2.li2':   'React & Next.js',
    'services.svc2.li3':   'WordPress & Webflow',
    'services.svc2.li4':   'Performance optimisation',
    'services.svc3.title': 'SEO Optimisation',
    'services.svc3.text':  'We build with SEO best practices from day one — fast load times, clean code structure, meta tags, schema markup, and keyword strategy all baked in from the start.',
    'services.svc3.li1':   'On-page SEO setup',
    'services.svc3.li2':   'Technical SEO audit',
    'services.svc3.li3':   'Keyword research',
    'services.svc3.li4':   'Google Search Console setup',
    'services.svc4.title': 'Landing Pages',
    'services.svc4.text':  'Focused, high-converting pages built around a single goal. Whether it\'s a product launch, lead magnet, or ad campaign — we design pages that turn clicks into customers.',
    'services.svc4.li1':   'Conversion-focused design',
    'services.svc4.li2':   'A/B-ready layout structure',
    'services.svc4.li3':   'Lead capture forms',
    'services.svc4.li4':   'Fast turnaround',
    'services.svc5.title': 'Performance Optimisation',
    'services.svc5.text':  'We audit and improve your existing site\'s speed, Core Web Vitals, and SEO health — so you rank higher, load faster, and keep more visitors.',
    'services.svc5.li1':   'Core Web Vitals audit',
    'services.svc5.li2':   'Image & asset optimisation',
    'services.svc5.li3':   'Caching & compression',
    'services.svc5.li4':   'Technical SEO fixes',
    'services.svc6.title': 'Ongoing Support',
    'services.svc6.text':  'We don\'t disappear after launch. Our maintenance plans keep your site fast, secure, and up to date. Need a quick change? We\'re always just a message away.',
    'services.svc6.li1':   'Monthly maintenance plans',
    'services.svc6.li2':   'Security & updates',
    'services.svc6.li3':   'Performance monitoring',
    'services.svc6.li4':   'Priority support',

    // Services page — process section
    'services.process.title':       'From brief to launch in 4 steps',
    'services.process.step1.title': 'Discovery Call',
    'services.process.step1.text':  'We learn about your business, goals, and target audience so we can build the right solution for you.',
    'services.process.step2.title': 'Design & Build',
    'services.process.step2.text':  'We design and develop your site, keeping you in the loop at every stage with regular progress updates.',
    'services.process.step3.title': 'Review & Refine',
    'services.process.step3.text':  'You review the site and we make revisions until everything is exactly right. No hidden fees or surprise charges.',
    'services.process.step4.title': 'Launch & Support',
    'services.process.step4.text':  'We launch your site and provide ongoing support to make sure everything continues to run smoothly.',

    // Services page — tech section
    'services.tech.label': 'Technologies',
    'services.tech.title': 'Tools & technologies we work with',

    // Services page — CTA
    'services.cta.title': 'Not sure which service you need?',
    'services.cta.sub':   'Book a free discovery call and we\'ll figure it out together.',
    'services.cta.btn':   'Book a Free Call',

    // About page — body text
    'about.p1': 'E&E Digital was founded with a straightforward belief: businesses deserve websites that actually work. Not just pretty designs that sit there — websites that load fast, rank well, and convert visitors into paying customers.',
    'about.p2': 'We\'re a small, tight-knit team of designers and developers who are genuinely passionate about the craft. We work closely with every client — no account managers, no hand-offs, no shortcuts.',
    'about.p3': 'Whether you\'re a startup launching your first site or an established brand ready for a full redesign, we bring the same level of care and commitment to every project.',

    // About page — highlights
    'about.hl1': 'Custom-built, not templated',
    'about.hl2': 'Mobile-first & SEO ready',
    'about.hl3': 'Fast turnaround times',
    'about.hl4': 'Transparent pricing & communication',

    // About page — visual cards
    'about.card1.label': 'Avg. delivery time',
    'about.card1.val':   '2 weeks',
    'about.card2.label': 'Discovery call',
    'about.card2.val':   'Free',
    'about.card3.label': 'Templates used',
    'about.card3.val':   'Zero',

    // About page — stats
    'about.stat1.num':   '2 wks',
    'about.stat1.label': 'Avg. Delivery Time',
    'about.stat2.num':   'Free',
    'about.stat2.label': 'Discovery Call',
    'about.stat3.label': 'Custom Built',
    'about.stat4.label': 'Templates Used',

    // About page — value cards
    'about.val1.title': 'Craft',
    'about.val1.text':  'We obsess over the details others miss — typography, spacing, performance, accessibility. Good enough is never enough.',
    'about.val2.title': 'Transparency',
    'about.val2.text':  'No jargon, no hidden fees, no nasty surprises. We communicate clearly and honestly at every stage of the project.',
    'about.val3.title': 'Results',
    'about.val3.text':  'Beautiful websites mean nothing if they don\'t convert. We design and build with your business goals front and centre.',
    'about.val4.title': 'Partnership',
    'about.val4.text':  'We\'re invested in your long-term success — not just your launch. We\'re here after go-live too, for updates, advice, and support.',

    // About page — first client & CTA
    'about.fc.sub':    'We\'re honest: we\'re just starting out. But that means you get our absolute best — full attention, no distractions, and a finished product we\'ll both be proud of.',
    'about.cta.title': 'Ready to work together?',
    'about.cta.sub':   'Tell us about your project — we\'d love to hear from you.',
    'about.cta.btn':   'Get in Touch',

    // Pricing page — card tiers, descs, list items, buttons
    'pricing.starter.tier':  'Starter',
    'pricing.starter.desc':  'Perfect for small businesses needing a clean, professional online presence.',
    'pricing.starter.li1':   'Up to 5 pages',
    'pricing.starter.li2':   'Mobile responsive design',
    'pricing.starter.li3':   'Contact form',
    'pricing.starter.li4':   'Basic SEO setup',
    'pricing.starter.li5':   '1 round of revisions',
    'pricing.starter.li6':   '30-day post-launch support',
    'pricing.starter.btn':   'Get Started',
    'pricing.growth.tier':   'Growth',
    'pricing.growth.badge':  'Most Popular',
    'pricing.growth.desc':   'For growing businesses that need more pages, features, and content control.',
    'pricing.growth.li1':    'Up to 10 pages',
    'pricing.growth.li2':    'Performance optimisation',
    'pricing.growth.li3':    'Advanced SEO optimisation',
    'pricing.growth.li4':    'Google Analytics setup',
    'pricing.growth.li5':    '3 rounds of revisions',
    'pricing.growth.li6':    '3-month post-launch support',
    'pricing.growth.btn':    'Get Started',
    'pricing.premium.tier':  'Premium',
    'pricing.premium.desc':  'Full-service package for brands that want everything done right, end to end.',
    'pricing.premium.li1':   'Unlimited pages',
    'pricing.premium.li2':   'API & third-party integrations',
    'pricing.premium.li3':   'Full SEO & performance audit',
    'pricing.premium.li4':   'Custom animations',
    'pricing.premium.li5':   'Unlimited revisions',
    'pricing.premium.li6':   '12-month priority support',
    'pricing.premium.btn':   'Get Started',
    'pricing.note':          'All prices are one-time fees. Need something custom? <a href="contact.html">Let\'s talk.</a>',

    // Pricing page — comparison table
    'pricing.table.feature':         'Feature',
    'pricing.table.pages':           'Number of pages',
    'pricing.table.pages.starter':   'Up to 5',
    'pricing.table.pages.growth':    'Up to 10',
    'pricing.table.unlimited':       'Unlimited',
    'pricing.table.responsive':      'Mobile responsive',
    'pricing.table.form':            'Contact form',
    'pricing.table.perf':            'Performance optimisation',
    'pricing.table.basic':           'Basic',
    'pricing.table.advanced':        'Advanced',
    'pricing.table.full':            'Full audit',
    'pricing.table.seo':             'SEO optimisation',
    'pricing.table.analytics':       'Google Analytics',
    'pricing.table.api':             'API integrations',
    'pricing.table.animations':      'Custom animations',
    'pricing.table.revisions':       'Revision rounds',
    'pricing.table.support':         'Post-launch support',
    'pricing.table.support.starter': '30 days',
    'pricing.table.support.growth':  '3 months',
    'pricing.table.support.premium': '12 months',

    // Pricing page — FAQ
    'pricing.faq1.q': 'Are these one-time fees or monthly?',
    'pricing.faq1.a': 'All prices listed are one-time project fees — not subscriptions. You pay once and the site is yours. Optional maintenance retainers are available after launch if you\'d like ongoing support.',
    'pricing.faq2.q': 'Do you offer payment plans?',
    'pricing.faq2.a': 'Yes. We typically ask for a 50% deposit to begin work, with the remaining 50% due on completion. For larger projects we can arrange staged payments — just ask us during your free consultation.',
    'pricing.faq3.q': 'What if my project doesn\'t fit a package?',
    'pricing.faq3.a': 'No problem. These packages are starting points — we\'re happy to customise scope, features, or pricing to fit your exact needs. Get in touch and we\'ll put together a bespoke quote.',
    'pricing.faq4.q': 'Are there any additional costs I should know about?',
    'pricing.faq4.a': 'Our prices cover everything listed. The only extras would be third-party costs you\'d pay directly — things like your domain name, hosting, or any premium plugins your project requires. We\'ll always flag these upfront.',
    'pricing.faq5.q': 'How long does it take?',
    'pricing.faq5.a': 'Starter projects typically take 1–2 weeks. Growth projects 2–3 weeks. Premium projects with custom features or API integrations can take 3–5 weeks. We\'ll give you a clear timeline before we start.',

    // Contact page — card
    'contact.card.heading': 'Contact details',
    'contact.card.text':    'We\'d love to hear from you.',
    'contact.card.sub':     'Not ready for a form? Drop us an email — we\'re happy to chat about your project, no strings attached.',
    'contact.item1.label':  'Email us',
    'contact.item2.label':  'Call us',
    'contact.item3.label':  'Response time',
    'contact.item3.val':    'Within 24 hours',
    'contact.social.label': 'Follow us',
    'contact.trust1':       'Free discovery call',
    'contact.trust2':       'No obligation quote',
    'contact.trust3':       'Delivered in 2 weeks',
    'contact.social.label': 'Find us online',

    // Contact page — form header
    'contact.form.title': 'Tell us about your project',
    'contact.form.sub':   'We\'ll review your message and get back to you with a free consultation and quote.',

    // Contact page — FAQ
    'contact.faq.label': 'FAQ',
    'contact.faq.title': 'Common questions answered',
    'contact.faq1.q': 'How long does it take to build a website?',
    'contact.faq1.a': 'Most projects are completed within 2–4 weeks depending on scope. Simple sites and landing pages can be done in under 2 weeks, while larger or more complex builds may take 3–5 weeks. We\'ll give you a clear timeline before we start.',
    'contact.faq2.q': 'Do I need to provide the content?',
    'contact.faq2.a': 'You\'ll need to provide your logo, brand colours, and any specific text or images you want. If you need help with copywriting or photography, we can recommend trusted partners or handle it for an additional fee.',
    'contact.faq3.q': 'Will my site work on mobile and tablet?',
    'contact.faq3.a': 'Absolutely. Every website we build is fully responsive and tested across all major devices and screen sizes. Mobile performance is one of our top priorities — it affects both UX and SEO rankings.',
    'contact.faq4.q': 'Can I update the website myself?',
    'contact.faq4.a': 'For small changes and updates after launch, just send us a message — we handle it for you quickly. For regular ongoing updates, our maintenance packages are a great fit. We keep things simple and hassle-free.',
    'contact.faq5.q': 'What happens after the site goes live?',
    'contact.faq5.a': 'All packages include post-launch support. We fix any bugs that arise, and we\'re always available if you have questions. Ongoing maintenance retainers are also available for regular updates.',

    // Impressum page
    'page.impressum.doctitle':       'Imprint — E&E Digital',
    'page.impressum.label':          'Legal',
    'page.impressum.title':          'Impressum',
    'page.impressum.sub':            'Information pursuant to § 5 TMG (German Telemedia Act)',
    'impressum.h.responsible':       'Responsible party',
    'impressum.h.contact':           'Contact',
    'impressum.h.vat':               'VAT',
    'impressum.h.profession':        'Professional designation',
    'impressum.h.eu':                'EU Dispute Resolution',
    'impressum.h.consumer':          'Consumer Dispute Resolution',
    'impressum.h.liability.content': 'Liability for Content',
    'impressum.h.liability.links':   'Liability for Links',
    'impressum.h.copyright':         'Copyright',

    // Datenschutz page
    'page.datenschutz.doctitle': 'Privacy Policy — E&E Digital',
    'page.datenschutz.label': 'Legal',
    'page.datenschutz.title': 'Privacy Policy',
    'page.datenschutz.sub':   'Information pursuant to GDPR / Art. 13 GDPR',
    'dsgvo.h1': '1. Controller',
    'dsgvo.h2': '2. General Information on Data Processing',
    'dsgvo.h3': '3. Hosting',
    'dsgvo.h4': '4. Server Log Files',
    'dsgvo.h5': '5. Contact Form',
    'dsgvo.h6': '6. Local Storage (localStorage)',
    'dsgvo.h7': '7. Fonts (Webfonts)',
    'dsgvo.h8': '8. Your Rights as a Data Subject',
    'dsgvo.h9': '9. Updates to this Privacy Policy',

    // Impressum body
    'impressum.p1':  'Ebu Bekir Yel<br>Buddestraße 24<br>21109 Hamburg<br>Germany',
    'impressum.p2':  'Email: <a href="mailto:ee-digital@outlook.com">ee-digital@outlook.com</a>',
    'impressum.p3a': 'Pursuant to § 19 UStG, no VAT is charged (small business regulation).',
    'impressum.p4':  'Professional designation: Web Designer / Web Developer<br>Awarded in: Germany',
    'impressum.p5a': 'The European Commission provides a platform for online dispute resolution (ODR): <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr/</a>',
    'impressum.p5b': 'Our email address can be found above in the Impressum.',
    'impressum.p6':  'We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.',
    'impressum.p7a': 'As a service provider, we are responsible for our own content on these pages under general law pursuant to § 7 para. 1 TMG. According to §§ 8 to 10 TMG, however, we are not obliged as a service provider to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.',
    'impressum.p7b': 'Obligations to remove or block the use of information under general law remain unaffected by this. However, liability in this regard is only possible from the time of knowledge of a specific infringement. Upon becoming aware of such legal infringements, we will remove this content immediately.',
    'impressum.p8a': 'Our offer contains links to external third-party websites, the content of which we have no influence over. Therefore, we cannot assume any liability for these external contents. The respective provider or operator of the pages is always responsible for the content of the linked pages.',
    'impressum.p8b': 'The linked pages were checked for possible legal violations at the time of linking. Illegal content was not identifiable at the time of linking. However, permanent monitoring of the content of the linked pages is not reasonable without concrete indications of a legal violation. Upon becoming aware of legal infringements, we will remove such links immediately.',
    'impressum.p9a': 'The content and works created by the site operators on these pages are subject to German copyright law. Reproduction, editing, distribution and any kind of use beyond the limits of copyright law require the written consent of the respective author or creator.',
    'impressum.p9b': 'Downloads and copies of this site are only permitted for private, non-commercial use. Insofar as the content on this site was not created by the operator, the copyrights of third parties are respected. Should you nevertheless become aware of a copyright infringement, please inform us accordingly. Upon becoming aware of legal infringements, we will remove such content immediately.',

    // Datenschutz body
    'dsgvo.p1':      'The controller for data processing on this website is:<br><br>Ebu Bekir Yel<br>Buddestraße 24<br>21109 Hamburg<br>Germany<br><br>Email: <a href="mailto:ee-digital@outlook.com">ee-digital@outlook.com</a>',
    'dsgvo.p2a':     'We take the protection of your personal data very seriously and handle your personal data confidentially and in accordance with statutory data protection regulations and this privacy policy.',
    'dsgvo.p2b':     'As a rule, our website can be used without providing personal data. Insofar as personal data (such as name, email address or telephone number) is collected on our pages, this is always done on a voluntary basis. This data will not be passed on to third parties without your express consent.',
    'dsgvo.p2c':     'The legal bases for data processing are Art. 6 GDPR, in particular:',
    'dsgvo.p2.list': '<li><strong>Art. 6(1)(a) GDPR</strong> – Consent of the data subject</li><li><strong>Art. 6(1)(b) GDPR</strong> – Performance of a contract or pre-contractual measures</li><li><strong>Art. 6(1)(f) GDPR</strong> – Legitimate interests of the controller</li>',
    'dsgvo.p3a':     'This website is hosted by an external service provider (host). The personal data collected on this website is stored on the host\'s servers. This may include IP addresses, contact requests, meta and communication data, contract data, contact details, names, website access data and other data.',
    'dsgvo.p3b':     'The use of the host is for the purpose of fulfilling the contract with our potential and existing customers (Art. 6(1)(b) GDPR) and in the interest of a secure, fast and efficient provision of our online offering by a professional provider (Art. 6(1)(f) GDPR).',
    'dsgvo.p3c':     'Our host: <strong>Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA</strong>',
    'dsgvo.p4a':     'The provider of this website automatically collects and stores information in so-called server log files, which your browser automatically transmits to us. These are:',
    'dsgvo.p4.list': '<li>Browser type and browser version</li><li>Operating system used</li><li>Referrer URL</li><li>Hostname of the accessing computer</li><li>Time of the server request</li><li>IP address</li>',
    'dsgvo.p4b':     'This data is not merged with other data sources. The basis for data processing is Art. 6(1)(f) GDPR, the legitimate interest in the technically error-free presentation and optimisation of our website.',
    'dsgvo.p5a':     'When you contact us via the contact form, your details from the enquiry form, including the contact data you provided there, will be stored by us for the purpose of processing the request and in the event of follow-up questions. We will not pass on this data without your consent.',
    'dsgvo.p5b':     'The following data is collected when the form is submitted:',
    'dsgvo.p5.list': '<li>Name</li><li>Email address</li><li>Phone number (optional)</li><li>Project description / Message</li><li>Budget and desired service (optional)</li>',
    'dsgvo.p5c':     'The processing of the data entered in the contact form is based on Art. 6(1)(b) GDPR (pre-contractual measures) and Art. 6(1)(f) GDPR (legitimate interest in responding to customer enquiries). The data you enter will remain with us until you request deletion, revoke your consent to storage, or the purpose for data storage no longer applies.',
    'dsgvo.p6a':     'This website stores technically necessary settings in the local storage (localStorage) of your browser. These are exclusively:',
    'dsgvo.p6.list': '<li><strong>theme</strong> – Your chosen colour scheme (light or dark mode)</li><li><strong>lang</strong> – Your chosen language (EN/TR/DE)</li>',
    'dsgvo.p6b':     'This data is not transmitted to servers and remains exclusively local on your device. This does not constitute cookies in the legal sense; consent is therefore not required. The basis is Art. 6(1)(f) GDPR (legitimate interest in user-friendly presentation of the website).',
    'dsgvo.p7a':     'This website uses the Inter font, which is hosted locally on our server. No data is transferred to external servers.',
    'dsgvo.p7b':     'The font is served exclusively from our own web server. No personal data is transmitted to third parties. The legal basis is Art. 6(1)(f) GDPR (legitimate interest in a uniform and appealing presentation of the website).',
    'dsgvo.p7c':     '',
    'dsgvo.p8a':     'You have the following rights with respect to us regarding the personal data concerning you:',
    'dsgvo.p8.list': '<li><strong>Right of access</strong> (Art. 15 GDPR)</li><li><strong>Right to rectification</strong> (Art. 16 GDPR)</li><li><strong>Right to erasure</strong> (Art. 17 GDPR)</li><li><strong>Right to restriction of processing</strong> (Art. 18 GDPR)</li><li><strong>Right to data portability</strong> (Art. 20 GDPR)</li><li><strong>Right to object</strong> to processing (Art. 21 GDPR)</li><li><strong>Right to withdraw</strong> consent (Art. 7(3) GDPR)</li>',
    'dsgvo.p8b':     'To exercise your rights, please contact: <a href="mailto:ee-digital@outlook.com">ee-digital@outlook.com</a>',
    'dsgvo.p8c':     'You also have the right to lodge a complaint with a data protection supervisory authority regarding the processing of your personal data by us. The responsible supervisory authority depends on your place of residence or the registered office of our company.',
    'dsgvo.p9':      'This privacy policy is currently valid and dated March 2026. Due to the further development of our website and offers, or due to changed legal or regulatory requirements, it may become necessary to amend this privacy policy. The current privacy policy can always be accessed on the website at <a href="datenschutz.html">datenschutz.html</a>.',
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

    // Marquee
    'marquee.design':   'Web Tasarımı',
    'marquee.dev':      'Web Geliştirme',
    'marquee.seo':      'SEO Optimizasyonu',
    'marquee.landing':  'Landing Pages',
    'marquee.brand':    'Marka Kimliği',
    'marquee.perf':     'Performans Optimizasyonu',
    'marquee.support':  'Süregelen Destek',
    'marquee.delivery': 'Hızlı Teslimat',

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
    'footer.link.portfolio':  'Portföy',
    'footer.link.contact':    'İletişim',
    'footer.link.impressum':  'Künye',
    'footer.link.datenschutz':'Gizlilik Politikası',

    // Page titles
    'page.index.doctitle':    'E&E Digital — Web Tasarım & Geliştirme Ajansı',
    'page.services.doctitle': 'Hizmetler — E&E Digital',
    'page.work.doctitle':     'Çalışmalarımız — E&E Digital',
    'page.about.doctitle':    'Hakkımızda — E&E Digital',
    'page.pricing.doctitle':  'Fiyatlar — E&E Digital',
    'page.contact.doctitle':  'İletişim — E&E Digital',
    'page.404.doctitle':      '404 — Sayfa Bulunamadı | E&E Digital',
    'page.404.label':         '404 Hatası',
    'page.404.title':         'Sayfa Bulunamadı',
    'page.404.sub':           'Aradığınız sayfa mevcut değil veya taşınmış olabilir.',
    'page.404.cta':           'Ana Sayfaya Dön',

    // OG / Twitter meta
    'meta.index.title':    'E&E Digital — Web Tasarım & Geliştirme Ajansı',
    'meta.index.desc':     'E&E Digital, büyüyen işletmeler için modern, yüksek performanslı web siteleri kurar. Özel web tasarımı, geliştirme ve SEO.',
    'meta.services.title': 'Hizmetler — E&E Digital',
    'meta.services.desc':  'Web tasarımından geliştirmeye, SEO\'dan landing page\'lere — E&E Digital, işletmenizin çevrimiçi başarısı için ihtiyaç duyduğu her şeyi sunar.',
    'meta.work.title':     'Çalışmalarımız — E&E Digital',
    'meta.work.desc':      'Portföyümüzü oluşturuyoruz — ve markanızın vitrinimizde öne çıkan ilk proje olmasını çok isteriz.',
    'meta.about.title':    'Hakkımızda — E&E Digital',
    'meta.about.desc':     'E&E Digital hakkında bilgi edinin — işletmeleri büyüten web siteleri oluşturmaya odaklanmış bir web tasarım ve geliştirme ajansı.',
    'meta.pricing.title':  'Fiyatlar — E&E Digital',
    'meta.pricing.desc':   'Web tasarımı ve geliştirme için sade, şeffaf fiyatlandırma. İşletmenize uygun paketi seçin — gizli ücret yok.',
    'meta.contact.title':  'İletişim — E&E Digital',
    'meta.contact.desc':   'E&E Digital ile iletişime geçin. Projenizi anlatın, 24 saat içinde ücretsiz teklifle geri dönelim.',

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
    'form.error':   'Bir şeyler ters gitti. Lütfen bize doğrudan e-posta gönderin: ee-digital@outlook.com.',
    'form.budget.placeholder': 'Bir aralık seçin...',
    'form.budget.opt1': '£1.000 altı',
    'form.budget.opt2': '£1.000 – £2.500',
    'form.budget.opt3': '£2.500 – £5.000',
    'form.budget.opt4': '£5.000+',
    'form.budget.opt5': 'Henüz emin değilim',
    'form.service.placeholder': 'Bir hizmet seçin...',
    'form.service.opt1': 'Web Tasarımı',
    'form.service.opt2': 'Web Geliştirme',
    'form.service.opt3': 'Açılış Sayfası',
    'form.service.opt4': 'SEO Optimizasyonu',
    'form.service.opt5': 'Süregelen Destek',
    'form.service.opt6': 'Diğer / Emin Değilim',
    'form.validation.required': 'Lütfen tüm zorunlu alanları doldurun.',
    'form.validation.email':    'Lütfen geçerli bir e-posta adresi girin.',
    'form.name.ph':    'Ad Soyad',
    'form.email.ph':   'ornek@email.com',
    'form.phone.ph':   '+90 / +49 ...',
    'form.message.ph': 'Projenizi, hedeflerinizi, zaman çizelgenizi ve özel gereksinimlerinizi açıklayın...',

    // Filter buttons
    'filter.all':     'Tümü',
    'filter.web':     'Web Tasarım',
    'filter.ecom':    'E-Ticaret',
    'footer.link.seo':     'SEO',

    // Work page
    'work.empty.title': 'Henüz proje yok — ama sizinki ilk olabilir.',
    'work.empty.sub':   'İlk müşterilerimize her şeyimizi vermeye hazır yeni bir ajansız. Lansman fiyatı, tam odağımız ve gerçekten göstermek isteyeceğiniz bir site alacaksınız.',
    'work.empty.cta':   'Proje Başlat',
    'work.fc.sub':      'Güveniniz karşılığında tam dikkatimizi, lansman günü fiyatını ve ikimizin de dünyaya göstermekten gurur duyacağı bir web sitesini alıyorsunuz — 2 haftada teslim.',
    'work.cta.title':   'İlk olmaya hazır mısınız?',
    'work.cta.sub':     'Projenizi konuşalım ve ikimizin de gurur duyacağı bir şey inşa edelim.',
    'work.cta.btn':     'Proje Başlat',

    // Services page — service cards
    'services.svc1.title': 'Website Tasarımı',
    'services.svc1.text':  'Markanızı yansıtan ve ziyaretçileri müşteriye dönüştüren görsel açıdan etkileyici, stratejik web siteleri tasarlıyoruz. Her tasarım özeldir — şablon yok, kısayol yok.',
    'services.svc1.li1':   'Özel UI/UX tasarımı',
    'services.svc1.li2':   'Markaya uyumlu görseller',
    'services.svc1.li3':   'Mobil öncelikli yaklaşım',
    'services.svc1.li4':   'Etkileşimli prototipler',
    'services.svc2.title': 'Web Geliştirme',
    'services.svc2.text':  'Sitenizi hızlı, güvenli ve sağlam yapan temiz, yüksek performanslı kodlar yazıyoruz. Modern standartlarla inşa edilmiş, tüm cihaz ve tarayıcılarda test edilmiş.',
    'services.svc2.li1':   'HTML, CSS, JavaScript',
    'services.svc2.li2':   'React & Next.js',
    'services.svc2.li3':   'WordPress & Webflow',
    'services.svc2.li4':   'Performans optimizasyonu',
    'services.svc3.title': 'SEO Optimizasyonu',
    'services.svc3.text':  'Başından itibaren SEO en iyi uygulamalarıyla inşa ediyoruz — hızlı yükleme süreleri, temiz kod yapısı, meta etiketler, şema işaretlemesi ve anahtar kelime stratejisi.',
    'services.svc3.li1':   'Sayfa içi SEO kurulumu',
    'services.svc3.li2':   'Teknik SEO denetimi',
    'services.svc3.li3':   'Anahtar kelime araştırması',
    'services.svc3.li4':   'Google Search Console kurulumu',
    'services.svc4.title': 'Açılış Sayfaları',
    'services.svc4.text':  'Tek bir hedefe yönelik, yüksek dönüşümlü sayfalar. İster ürün lansmanı, ister lead mıknatısı, ister reklam kampanyası olsun — tıklamaları müşteriye çeviren sayfalar tasarlıyoruz.',
    'services.svc4.li1':   'Dönüşüm odaklı tasarım',
    'services.svc4.li2':   'A/B testine hazır düzen',
    'services.svc4.li3':   'Lead toplama formları',
    'services.svc4.li4':   'Hızlı teslimat',
    'services.svc5.title': 'Performans Optimizasyonu',
    'services.svc5.text':  'Mevcut sitenizin hızını, Core Web Vitals skorlarını ve SEO sağlığını denetleyip iyileştiriyoruz — daha üst sıralarda yer alın, daha hızlı yüklenin, daha fazla ziyaretçi tutun.',
    'services.svc5.li1':   'Core Web Vitals denetimi',
    'services.svc5.li2':   'Görsel ve varlık optimizasyonu',
    'services.svc5.li3':   'Önbellekleme ve sıkıştırma',
    'services.svc5.li4':   'Teknik SEO düzeltmeleri',
    'services.svc6.title': 'Sürekli Destek',
    'services.svc6.text':  'Yayından sonra kaybolmuyoruz. Bakım planlarımız sitenizi hızlı, güvenli ve güncel tutar. Küçük bir değişikliğe mi ihtiyacınız var? Her zaman bir mesaj uzağınızdayız.',
    'services.svc6.li1':   'Aylık bakım planları',
    'services.svc6.li2':   'Güvenlik ve güncellemeler',
    'services.svc6.li3':   'Performans izleme',
    'services.svc6.li4':   'Öncelikli destek',

    // Services page — process section
    'services.process.title':       'Briefingtden yayına 4 adımda',
    'services.process.step1.title': 'Keşif Görüşmesi',
    'services.process.step1.text':  'Doğru çözümü inşa edebilmek için işinizi, hedeflerinizi ve hedef kitlenizi öğreniyoruz.',
    'services.process.step2.title': 'Tasarım & Geliştirme',
    'services.process.step2.text':  'Sitenizi tasarlayıp geliştiriyoruz; her aşamada düzenli ilerleme güncellemeleriyle sizi döngüde tutuyoruz.',
    'services.process.step3.title': 'İnceleme & Revizyon',
    'services.process.step3.text':  'Siteyi inceliyorsunuz, her şey tam olana kadar revizyonlar yapıyoruz. Gizli ücret veya sürpriz maliyet yok.',
    'services.process.step4.title': 'Yayın & Destek',
    'services.process.step4.text':  'Sitenizi yayına alıyor ve her şeyin sorunsuz çalışmaya devam etmesi için sürekli destek sağlıyoruz.',

    // Services page — tech section
    'services.tech.label': 'Teknolojiler',
    'services.tech.title': 'Kullandığımız araçlar ve teknolojiler',

    // Services page — CTA
    'services.cta.title': 'Hangi hizmete ihtiyacınız olduğundan emin değil misiniz?',
    'services.cta.sub':   'Ücretsiz bir keşif araması yapın, birlikte bulalım.',
    'services.cta.btn':   'Ücretsiz Arama Yap',

    // About page — body text
    'about.p1': 'E&E Digital basit bir inançla kuruldu: işletmeler gerçekten çalışan web sitelerini hak ediyor. Sadece orada duran güzel tasarımlar değil — hızlı yüklenen, iyi sıralanan ve ziyaretçileri ödeme yapan müşterilere dönüştüren siteler.',
    'about.p2': 'Zanaat konusunda gerçekten tutkulu, küçük ve sıkı sıkıya bağlı bir tasarımcı ve geliştirici ekibiyiz. Her müşteriyle yakından çalışıyoruz — hesap yöneticisi yok, el değiştirme yok, kısayol yok.',
    'about.p3': 'İster ilk sitenizi başlatan bir girişim olun, ister tam yeniden tasarım için hazır köklü bir marka — her projeye aynı özen ve bağlılığı getiriyoruz.',

    // About page — highlights
    'about.hl1': 'Özel yapım, şablon değil',
    'about.hl2': 'Mobil öncelikli ve SEO\'ya hazır',
    'about.hl3': 'Hızlı teslimat süreleri',
    'about.hl4': 'Şeffaf fiyatlandırma ve iletişim',

    // About page — visual cards
    'about.card1.label': 'Ort. teslimat süresi',
    'about.card1.val':   '2 hafta',
    'about.card2.label': 'Keşif görüşmesi',
    'about.card2.val':   'Ücretsiz',
    'about.card3.label': 'Kullanılan şablon',
    'about.card3.val':   'Sıfır',

    // About page — stats
    'about.stat1.num':   '2 hafta',
    'about.stat1.label': 'Ort. Teslimat Süresi',
    'about.stat2.num':   'Ücretsiz',
    'about.stat2.label': 'Keşif Görüşmesi',
    'about.stat3.label': 'Özel Yapım',
    'about.stat4.label': 'Kullanılan Şablon',

    // About page — value cards
    'about.val1.title': 'Zanaat',
    'about.val1.text':  'Başkalarının gözden kaçırdığı ayrıntılara takıntılıyız — tipografi, boşluk, performans, erişilebilirlik. Yeterince iyi hiçbir zaman yeterli değildir.',
    'about.val2.title': 'Şeffaflık',
    'about.val2.text':  'Jargon yok, gizli ücret yok, kötü sürpriz yok. Projenin her aşamasında açık ve dürüst bir iletişim kuruyoruz.',
    'about.val3.title': 'Sonuçlar',
    'about.val3.text':  'Dönüşüm sağlamayan güzel web siteleri anlamsızdır. İş hedeflerinizi ön planda tutarak tasarlıyor ve geliştiriyoruz.',
    'about.val4.title': 'Ortaklık',
    'about.val4.text':  'Sadece lansmanınıza değil, uzun vadeli başarınıza yatırım yapıyoruz. Yayından sonra da güncellemeler, tavsiyeler ve destek için buradayız.',

    // About page — first client & CTA
    'about.fc.sub':    'Dürüst olalım: yeni başlıyoruz. Ama bu, en iyimizi aldığınız anlamına geliyor — tam dikkat, hiçbir dikkat dağıtıcı ve ikimizin de gurur duyacağı bir ürün.',
    'about.cta.title': 'Birlikte çalışmaya hazır mısınız?',
    'about.cta.sub':   'Projenizi anlatın — duymaktan mutluluk duyarız.',
    'about.cta.btn':   'İletişime Geçin',

    // Pricing page — card tiers, descs, list items, buttons
    'pricing.starter.tier':  'Başlangıç',
    'pricing.starter.desc':  'Temiz, profesyonel bir çevrimiçi varlığa ihtiyaç duyan küçük işletmeler için ideal.',
    'pricing.starter.li1':   '5 sayfaya kadar',
    'pricing.starter.li2':   'Mobil uyumlu tasarım',
    'pricing.starter.li3':   'İletişim formu',
    'pricing.starter.li4':   'Temel SEO kurulumu',
    'pricing.starter.li5':   '1 revizyon turu',
    'pricing.starter.li6':   '30 günlük yayın sonrası destek',
    'pricing.starter.btn':   'Başlayın',
    'pricing.growth.tier':   'Büyüme',
    'pricing.growth.badge':  'En Popüler',
    'pricing.growth.desc':   'Daha fazla sayfa, özellik ve içerik kontrolüne ihtiyaç duyan büyüyen işletmeler için.',
    'pricing.growth.li1':    '10 sayfaya kadar',
    'pricing.growth.li2':    'Performans optimizasyonu',
    'pricing.growth.li3':    'Gelişmiş SEO optimizasyonu',
    'pricing.growth.li4':    'Google Analytics kurulumu',
    'pricing.growth.li5':    '3 revizyon turu',
    'pricing.growth.li6':    '3 aylık yayın sonrası destek',
    'pricing.growth.btn':    'Başlayın',
    'pricing.premium.tier':  'Premium',
    'pricing.premium.desc':  'Her şeyin baştan sona doğru yapılmasını isteyen markalar için tam hizmet paketi.',
    'pricing.premium.li1':   'Sınırsız sayfa',
    'pricing.premium.li2':   'API ve üçüncü taraf entegrasyonları',
    'pricing.premium.li3':   'Tam SEO ve performans denetimi',
    'pricing.premium.li4':   'Özel animasyonlar',
    'pricing.premium.li5':   'Sınırsız revizyon',
    'pricing.premium.li6':   '12 aylık öncelikli destek',
    'pricing.premium.btn':   'Başlayın',
    'pricing.note':          'Tüm fiyatlar tek seferlik ücrettir. Özel bir şeye mi ihtiyacınız var? <a href="contact.html">Konuşalım.</a>',

    // Pricing page — comparison table
    'pricing.table.feature':         'Özellik',
    'pricing.table.pages':           'Sayfa sayısı',
    'pricing.table.pages.starter':   '5\'e kadar',
    'pricing.table.pages.growth':    '10\'a kadar',
    'pricing.table.unlimited':       'Sınırsız',
    'pricing.table.responsive':      'Mobil uyumlu',
    'pricing.table.form':            'İletişim formu',
    'pricing.table.perf':            'Performans optimizasyonu',
    'pricing.table.basic':           'Temel',
    'pricing.table.advanced':        'Gelişmiş',
    'pricing.table.full':            'Tam denetim',
    'pricing.table.seo':             'SEO optimizasyonu',
    'pricing.table.analytics':       'Google Analytics',
    'pricing.table.api':             'API entegrasyonları',
    'pricing.table.animations':      'Özel animasyonlar',
    'pricing.table.revisions':       'Revizyon turları',
    'pricing.table.support':         'Yayın sonrası destek',
    'pricing.table.support.starter': '30 gün',
    'pricing.table.support.growth':  '3 ay',
    'pricing.table.support.premium': '12 ay',

    // Pricing page — FAQ
    'pricing.faq1.q': 'Bu ücretler tek seferlik mi, yoksa aylık mı?',
    'pricing.faq1.a': 'Listelenen tüm fiyatlar tek seferlik proje ücretleridir — abonelik değil. Bir kez ödersiniz ve site sizin olur. Yayından sonra sürekli destek istiyorsanız isteğe bağlı bakım ücretleri de mevcuttur.',
    'pricing.faq2.q': 'Taksit imkânı sunuyor musunuz?',
    'pricing.faq2.a': 'Evet. Genellikle çalışmaya başlamak için %50 depozito, kalan %50\'yi tamamlanma sırasında talep ediyoruz. Büyük projeler için aşamalı ödemeler düzenlenebilir — ücretsiz danışmanlığınızda bize sorun.',
    'pricing.faq3.q': 'Projem bir pakete uymuyorsa ne olur?',
    'pricing.faq3.a': 'Sorun değil. Bu paketler başlangıç noktalarıdır — tam ihtiyaçlarınıza göre kapsam, özellikler veya fiyatı özelleştirmekten memnuniyet duyarız. Bizimle iletişime geçin, özel bir teklif hazırlayalım.',
    'pricing.faq4.q': 'Bilmem gereken ek maliyetler var mı?',
    'pricing.faq4.a': 'Fiyatlarımız listelenen her şeyi kapsar. Tek ekstralar, doğrudan ödeyeceğiniz üçüncü taraf maliyetleri olabilir — alan adı, barındırma veya projenizin gerektirdiği premium eklentiler gibi. Bunları her zaman önceden bildiririz.',
    'pricing.faq5.q': 'Ne kadar sürer?',
    'pricing.faq5.a': 'Başlangıç projeleri genellikle 1-2 hafta sürer. Büyüme projeleri 2-3 hafta. Özel özellikler veya API entegrasyonlu premium projeler 3-5 hafta sürebilir. Başlamadan önce net bir zaman çizelgesi vereceğiz.',

    // Contact page — card
    'contact.card.heading': 'İletişim bilgileri',
    'contact.card.text':    'Sizi duymaktan mutluluk duyarız.',
    'contact.card.sub':     'Forma hazır değil misiniz? Bize e-posta gönderin — projeniz hakkında hiçbir bağlayıcılık olmadan sohbet etmekten mutluluk duyarız.',
    'contact.item1.label':  'Bize e-posta gönderin',
    'contact.item2.label':  'Bizi arayın',
    'contact.item3.label':  'Yanıt süresi',
    'contact.item3.val':    '24 saat içinde',
    'contact.social.label': 'Bizi takip edin',
    'contact.trust1':       'Ücretsiz keşif görüşmesi',
    'contact.trust2':       'Bağlayıcılığı olmayan teklif',
    'contact.trust3':       '2 haftada teslim',
    'contact.social.label': 'Bizi çevrimiçi bulun',

    // Contact page — form header
    'contact.form.title': 'Projenizi anlatın',
    'contact.form.sub':   'Mesajınızı inceleyip ücretsiz danışmanlık ve teklifle geri döneceğiz.',

    // Contact page — FAQ
    'contact.faq.label': 'SSS',
    'contact.faq.title': 'Sık sorulan sorular',
    'contact.faq1.q': 'Web sitesi yapmak ne kadar sürer?',
    'contact.faq1.a': 'Çoğu proje kapsama bağlı olarak 2-4 hafta içinde tamamlanır. Basit siteler ve açılış sayfaları 2 haftanın altında hazır olabilir; daha büyük veya karmaşık yapılar 3-5 hafta sürebilir. Başlamadan önce net bir zaman çizelgesi vereceğiz.',
    'contact.faq2.q': 'İçeriği ben mi sağlamalıyım?',
    'contact.faq2.a': 'Logonuzu, marka renklerinizi ve istediğiniz metin veya görselleri sağlamanız gerekecek. Metin yazarlığı veya fotoğrafçılık konusunda yardıma ihtiyacınız varsa güvenilir iş ortakları önerebilir ya da ek ücret karşılığında biz üstlenebiliriz.',
    'contact.faq3.q': 'Sitem mobil ve tablette çalışır mı?',
    'contact.faq3.a': 'Kesinlikle. Yaptığımız her web sitesi tamamen duyarlıdır ve tüm büyük cihaz ve ekran boyutlarında test edilmiştir. Mobil performans en önemli önceliklerimizden biridir — hem UX\'i hem de SEO sıralamalarını etkiler.',
    'contact.faq4.q': 'Web sitesini kendim güncelleyebilir miyim?',
    'contact.faq4.a': 'Yayından sonra küçük değişiklikler ve güncellemeler için bize mesaj gönderin — hızlıca hallederiz. Düzenli süregelen güncellemeler için bakım paketlerimiz harika bir seçenek. Her şeyi basit ve zahmetsiz tutuyoruz.',
    'contact.faq5.q': 'Site yayına girdikten sonra ne olur?',
    'contact.faq5.a': 'Tüm paketler yayın sonrası destek içerir. Ortaya çıkan hataları düzeltiyor, sorularınız için her zaman hazır bulunuyoruz. Düzenli güncellemeler için süregelen bakım ücretleri de mevcuttur.',

    // Impressum page
    'page.impressum.doctitle':       'Künye — E&E Digital',
    'page.impressum.label':          'Yasal',
    'page.impressum.title':          'Impressum',
    'page.impressum.sub':            '§ 5 TMG uyarınca yasal bildirim',
    'impressum.h.responsible':       'Sorumlu taraf',
    'impressum.h.contact':           'İletişim',
    'impressum.h.vat':               'KDV',
    'impressum.h.profession':        'Mesleki unvan',
    'impressum.h.eu':                'AB Uyuşmazlık Çözümü',
    'impressum.h.consumer':          'Tüketici Uyuşmazlık Çözümü',
    'impressum.h.liability.content': 'İçerik Sorumluluğu',
    'impressum.h.liability.links':   'Bağlantı Sorumluluğu',
    'impressum.h.copyright':         'Telif Hakkı',

    // Datenschutz page
    'page.datenschutz.doctitle': 'Gizlilik Politikası — E&E Digital',
    'page.datenschutz.label': 'Yasal',
    'page.datenschutz.title': 'Gizlilik Politikası',
    'page.datenschutz.sub':   'GDPR / Mad. 13 GDPR uyarınca bilgiler',
    'dsgvo.h1': '1. Veri Sorumlusu',
    'dsgvo.h2': '2. Veri İşleme Hakkında Genel Bilgiler',
    'dsgvo.h3': '3. Barındırma',
    'dsgvo.h4': '4. Sunucu Günlük Dosyaları',
    'dsgvo.h5': '5. İletişim Formu',
    'dsgvo.h6': '6. Yerel Depolama (localStorage)',
    'dsgvo.h7': '7. Yazı Tipleri (Web Fontları)',
    'dsgvo.h8': '8. İlgili Kişi Olarak Haklarınız',
    'dsgvo.h9': '9. Bu Gizlilik Politikasının Güncellenmesi',

    // Impressum body
    'impressum.p1':  'Ebu Bekir Yel<br>Buddestraße 24<br>21109 Hamburg<br>Almanya',
    'impressum.p2':  'E-posta: <a href="mailto:ee-digital@outlook.com">ee-digital@outlook.com</a>',
    'impressum.p3a': '§ 19 UStG uyarınca küçük işletme düzenlemesi kapsamında KDV alınmamaktadır.',
    'impressum.p4':  'Mesleki unvan: Web Tasarımcı / Web Geliştiricisi<br>Veriliş yeri: Almanya',
    'impressum.p5a': 'Avrupa Komisyonu, çevrimiçi uyuşmazlık çözümü (ODR) için bir platform sunmaktadır: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr/</a>',
    'impressum.p5b': 'E-posta adresimiz yukarıdaki Impressum bölümünde yer almaktadır.',
    'impressum.p6':  'Bir tüketici tahkim kurulu önünde uyuşmazlık çözüm süreçlerine katılmaya istekli veya yükümlü değiliz.',
    'impressum.p7a': '§ 7 par. 1 TMG uyarınca hizmet sağlayıcı olarak bu sayfalardaki kendi içeriklerimizden genel hukuk kapsamında sorumluyuz. Ancak §§ 8 ila 10 TMG uyarınca hizmet sağlayıcı olarak iletilen veya depolanan üçüncü taraf bilgileri izlemek ya da yasadışı faaliyetlere işaret eden koşulları araştırmakla yükümlü değiliz.',
    'impressum.p7b': 'Genel hukuk çerçevesinde bilgilerin kaldırılması veya kullanımının engellenmesine ilişkin yükümlülükler bundan etkilenmez. Bu konudaki sorumluluk ancak belirli bir ihlalden haberdar olunduğu andan itibaren mümkündür. Bu tür ihlallerden haberdar olunması durumunda söz konusu içerikleri derhal kaldıracağız.',
    'impressum.p8a': 'Teklifimiz, üçüncü taraflara ait harici web sitelerine bağlantılar içermektedir; bu sitelerin içerikleri üzerinde herhangi bir etkimiz bulunmamaktadır. Bu nedenle söz konusu harici içerikler için hiçbir sorumluluk üstlenemeyiz. Bağlantılı sayfaların içeriğinden her zaman ilgili sağlayıcı veya işletici sorumludur.',
    'impressum.p8b': 'Bağlantılı sayfalar, bağlantı kurulduğu sırada olası hukuki ihlaller açısından incelenmiştir. Bağlantı kurulduğu sırada yasadışı içerik tespit edilmemiştir. Ancak hukuki ihlale dair somut bir gösterge olmaksızın bağlantılı sayfaların içeriğinin sürekli olarak denetlenmesi makul değildir. Hukuki ihlallerden haberdar olunması halinde bu tür bağlantıları derhal kaldıracağız.',
    'impressum.p9a': 'Site yöneticileri tarafından bu sayfalarda oluşturulan içerik ve eserler Alman telif hakkı yasasına tabidir. Telif hakkı yasasının sınırları ötesinde çoğaltma, düzenleme, dağıtım ve her türlü kullanım için ilgili yazar veya yaratıcının yazılı onayı gerekmektedir.',
    'impressum.p9b': 'Bu sitenin indirmeleri ve kopyaları yalnızca özel, ticari olmayan kullanım için izin verilmektedir. Bu sitedeki içerikler işletici tarafından oluşturulmadığı ölçüde üçüncü tarafların telif hakları gözetilmektedir. Buna rağmen bir telif hakkı ihlaliyle karşılaşırsanız lütfen bizi bilgilendirin. Hukuki ihlallerden haberdar olunması halinde söz konusu içerikleri derhal kaldıracağız.',

    // Datenschutz body
    'dsgvo.p1':      'Bu web sitesindeki veri işlemenin sorumlusu:<br><br>Ebu Bekir Yel<br>Buddestraße 24<br>21109 Hamburg<br>Almanya<br><br>E-posta: <a href="mailto:ee-digital@outlook.com">ee-digital@outlook.com</a>',
    'dsgvo.p2a':     'Kişisel verilerinizin korunmasını son derece ciddiye alıyor ve kişisel verilerinizi gizlilik içinde, yasal veri koruma düzenlemelerine ve bu gizlilik politikasına uygun olarak işliyoruz.',
    'dsgvo.p2b':     'Web sitemiz, kural olarak kişisel veri sağlanmadan kullanılabilir. Sayfalarımızda kişisel veriler (örneğin ad, e-posta adresi veya telefon numarası) toplanıyorsa, bu her zaman gönüllülük esasına dayanır. Bu veriler açık rızanız olmaksızın üçüncü taraflara aktarılmaz.',
    'dsgvo.p2c':     'Veri işlemenin hukuki dayanakları özellikle GDPR Madde 6 olmak üzere:',
    'dsgvo.p2.list': '<li><strong>GDPR Mad. 6(1)(a)</strong> – İlgili kişinin rızası</li><li><strong>GDPR Mad. 6(1)(b)</strong> – Sözleşme ifası veya sözleşme öncesi tedbirler</li><li><strong>GDPR Mad. 6(1)(f)</strong> – Veri sorumlusunun meşru menfaatleri</li>',
    'dsgvo.p3a':     'Bu web sitesi harici bir hizmet sağlayıcı (host) tarafından barındırılmaktadır. Bu web sitesinde toplanan kişisel veriler host\'un sunucularında saklanır. Bu veriler; IP adresleri, iletişim talepleri, meta ve iletişim verileri, sözleşme verileri, iletişim bilgileri, adlar, web sitesi erişim verileri ve diğer veriler olabilir.',
    'dsgvo.p3b':     'Host kullanımı, potansiyel ve mevcut müşterilerimizle sözleşme ifası amacıyla (GDPR Mad. 6(1)(b)) ve profesyonel bir sağlayıcı tarafından çevrimiçi teklifimizin güvenli, hızlı ve verimli biçimde sunulması meşru menfaatine (GDPR Mad. 6(1)(f)) dayanmaktadır.',
    'dsgvo.p3c':     'Host\'umuz: <strong>Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, ABD</strong>',
    'dsgvo.p4a':     'Bu web sitesinin sağlayıcısı, tarayıcınızın otomatik olarak bize ilettiği bilgileri sunucu günlük dosyalarında otomatik olarak toplar ve depolar. Bunlar:',
    'dsgvo.p4.list': '<li>Tarayıcı türü ve sürümü</li><li>Kullanılan işletim sistemi</li><li>Referrer URL</li><li>Erişen bilgisayarın ana makine adı</li><li>Sunucu isteğinin zamanı</li><li>IP adresi</li>',
    'dsgvo.p4b':     'Bu veriler diğer veri kaynaklarıyla birleştirilmez. Veri işlemenin dayanağı, web sitemizin teknik açıdan hatasız gösterimi ve optimizasyonundaki meşru menfaat olan GDPR Mad. 6(1)(f)\'dir.',
    'dsgvo.p5a':     'İletişim formu aracılığıyla bize sorgu gönderdiğinizde, talep formundaki bilgileriniz ve orada belirttiğiniz iletişim verileri, talebi işlemek ve olası takip soruları için tarafımızda saklanır. Bu verileri rızanız olmaksızın üçüncü taraflara aktarmayız.',
    'dsgvo.p5b':     'Form gönderildiğinde aşağıdaki veriler toplanır:',
    'dsgvo.p5.list': '<li>Ad</li><li>E-posta adresi</li><li>Telefon numarası (isteğe bağlı)</li><li>Proje açıklaması / Mesaj</li><li>Bütçe ve istenen hizmet (isteğe bağlı)</li>',
    'dsgvo.p5c':     'İletişim formuna girilen verilerin işlenmesi, GDPR Mad. 6(1)(b) (sözleşme öncesi tedbirler) ve GDPR Mad. 6(1)(f) (müşteri sorgularını yanıtlamadaki meşru menfaat) dayanaklarına dayanmaktadır. Girdiğiniz veriler, silme talebinde bulunana, depolama onayını geri alana veya veri depolamanın amacı ortadan kalkana kadar tarafımızda saklanır.',
    'dsgvo.p6a':     'Bu web sitesi, tarayıcınızın yerel depolama alanında (localStorage) teknik olarak gerekli ayarları depolar. Bunlar yalnızca:',
    'dsgvo.p6.list': '<li><strong>theme</strong> – Seçtiğiniz renk şeması (aydınlık veya karanlık mod)</li><li><strong>lang</strong> – Seçtiğiniz dil (EN/TR/DE)</li>',
    'dsgvo.p6b':     'Bu veriler sunuculara iletilmez ve yalnızca cihazınızda yerel olarak kalır. Bu, hukuki anlamda çerez niteliği taşımaz; dolayısıyla rıza gerekmez. Dayanak, GDPR Mad. 6(1)(f)\'dir (web sitesinin kullanıcı dostu sunumundaki meşru menfaat).',
    'dsgvo.p7a':     'Bu web sitesi, kendi sunucumuzda yerel olarak barındırılan Inter yazı tipini kullanmaktadır. Harici sunuculara herhangi bir veri aktarımı gerçekleşmez.',
    'dsgvo.p7b':     'Yazı tipi yalnızca kendi web sunucumuzdan sunulmaktadır. Üçüncü taraflara hiçbir kişisel veri iletilmez. Hukuki dayanak, GDPR Mad. 6(1)(f)dir (web sitesinin tekdüze ve çekici sunumundaki meşru menfaat).',
    'dsgvo.p7c':     '',
    'dsgvo.p8a':     'Sizi ilgilendiren kişisel veriler konusunda bize karşı aşağıdaki haklara sahipsiniz:',
    'dsgvo.p8.list': '<li><strong>Erişim hakkı</strong> (GDPR Mad. 15)</li><li><strong>Düzeltme hakkı</strong> (GDPR Mad. 16)</li><li><strong>Silme hakkı</strong> (GDPR Mad. 17)</li><li><strong>İşlemeyi kısıtlama hakkı</strong> (GDPR Mad. 18)</li><li><strong>Veri taşınabilirliği hakkı</strong> (GDPR Mad. 20)</li><li><strong>İtiraz hakkı</strong> işlemeye karşı (GDPR Mad. 21)</li><li><strong>Geri alma hakkı</strong> verilen rızalar için (GDPR Mad. 7(3))</li>',
    'dsgvo.p8b':     'Haklarınızı kullanmak için lütfen şu adrese başvurun: <a href="mailto:ee-digital@outlook.com">ee-digital@outlook.com</a>',
    'dsgvo.p8c':     'Ayrıca, kişisel verilerinizin tarafımızca işlenmesine ilişkin bir veri koruma denetim makamına şikâyette bulunma hakkına da sahipsiniz. Yetkili denetim makamı, ikamet yerinize veya şirketimizin tescilli merkezine göre belirlenir.',
    'dsgvo.p9':      'Bu gizlilik politikası geçerliliğini korumakta olup Mart 2026 tarihlidir. Web sitemizin ve tekliflerimizin geliştirilmesi ya da değişen yasal veya düzenleyici gerekliliklere bağlı olarak bu gizlilik politikasının güncellenmesi gerekebilir. Güncel gizlilik politikasına her zaman <a href="datenschutz.html">datenschutz.html</a> adresinden erişilebilir.',
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

    // Marquee
    'marquee.design':   'Webdesign',
    'marquee.dev':      'Webentwicklung',
    'marquee.seo':      'SEO-Optimierung',
    'marquee.landing':  'Landingpages',
    'marquee.brand':    'Markenidentität',
    'marquee.perf':     'Performance-Optimierung',
    'marquee.support':  'Laufender Support',
    'marquee.delivery': 'Schnelle Lieferung',

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
    'footer.link.portfolio':  'Portfolio',
    'footer.link.contact':    'Kontakt',
    'footer.link.impressum':  'Impressum',
    'footer.link.datenschutz':'Datenschutz',

    // Page titles
    'page.index.doctitle':    'E&E Digital — Webdesign & Entwicklungsagentur',
    'page.services.doctitle': 'Leistungen — E&E Digital',
    'page.work.doctitle':     'Unsere Projekte — E&E Digital',
    'page.about.doctitle':    'Über uns — E&E Digital',
    'page.pricing.doctitle':  'Preise — E&E Digital',
    'page.contact.doctitle':  'Kontakt — E&E Digital',
    'page.404.doctitle':      '404 — Seite nicht gefunden | E&E Digital',
    'page.404.label':         '404 Fehler',
    'page.404.title':         'Seite nicht gefunden',
    'page.404.sub':           'Die gesuchte Seite existiert nicht oder wurde verschoben.',
    'page.404.cta':           'Zurück zur Startseite',

    // OG / Twitter meta
    'meta.index.title':    'E&E Digital — Webdesign & Entwicklungsagentur',
    'meta.index.desc':     'E&E Digital erstellt moderne, leistungsstarke Webseiten für wachsende Unternehmen. Individuelles Webdesign, Entwicklung und SEO.',
    'meta.services.title': 'Leistungen — E&E Digital',
    'meta.services.desc':  'Von Webdesign und Entwicklung bis SEO und Landingpages — E&E Digital bietet alles, was Ihr Unternehmen für den Erfolg im Netz braucht.',
    'meta.work.title':     'Unsere Projekte — E&E Digital',
    'meta.work.desc':      'Wir bauen unser Portfolio auf — und würden uns freuen, wenn Ihre Marke das erste Aushängeschild wäre.',
    'meta.about.title':    'Über uns — E&E Digital',
    'meta.about.desc':     'Erfahren Sie mehr über E&E Digital — eine Webdesign- und Entwicklungsagentur, die sich auf Webseiten für wachsende Unternehmen spezialisiert hat.',
    'meta.pricing.title':  'Preise — E&E Digital',
    'meta.pricing.desc':   'Klare, transparente Preise für Webdesign und Entwicklung. Wählen Sie das Paket, das zu Ihrem Unternehmen passt — keine versteckten Kosten.',
    'meta.contact.title':  'Kontakt — E&E Digital',
    'meta.contact.desc':   'Kontaktieren Sie E&E Digital. Erzählen Sie uns von Ihrem Projekt und wir melden uns innerhalb von 24 Stunden mit einem kostenlosen Angebot.',

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
    'form.error':   'Etwas ist schiefgelaufen. Bitte schreiben Sie uns direkt: ee-digital@outlook.com.',
    'form.budget.placeholder': 'Bereich auswählen...',
    'form.budget.opt1': 'Unter 1.000 £',
    'form.budget.opt2': '1.000 £ – 2.500 £',
    'form.budget.opt3': '2.500 £ – 5.000 £',
    'form.budget.opt4': '5.000 £+',
    'form.budget.opt5': 'Noch nicht sicher',
    'form.service.placeholder': 'Leistung auswählen...',
    'form.service.opt1': 'Website Design',
    'form.service.opt2': 'Web-Entwicklung',
    'form.service.opt3': 'Landing Page',
    'form.service.opt4': 'SEO-Optimierung',
    'form.service.opt5': 'Laufender Support',
    'form.service.opt6': 'Sonstiges / Nicht sicher',
    'form.validation.required': 'Bitte füllen Sie alle Pflichtfelder aus.',
    'form.validation.email':    'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
    'form.name.ph':    'Max Mustermann',
    'form.email.ph':   'max@beispiel.de',
    'form.phone.ph':   '+49 ...',
    'form.message.ph': 'Beschreiben Sie Ihr Projekt, Ihre Ziele, den Zeitplan und besondere Anforderungen...',

    // Filter buttons
    'filter.all':     'Alle',
    'filter.web':     'Webdesign',
    'filter.ecom':    'E-Commerce',
    'footer.link.seo':     'SEO',

    // Work page
    'work.empty.title': 'Noch keine Projekte — aber Ihres könnte das erste sein.',
    'work.empty.sub':   'Wir sind eine neue Agentur, die alles in ihre ersten Kunden investiert. Sie bekommen Einführungspreise, unsere volle Aufmerksamkeit und eine fertige Website, die Sie wirklich zeigen möchten.',
    'work.empty.cta':   'Projekt starten',
    'work.fc.sub':      'Im Gegenzug für Ihr Vertrauen erhalten Sie unsere ungeteilte Aufmerksamkeit, Einführungspreise und eine Website, auf die wir beide stolz sein werden — in 2 Wochen geliefert.',
    'work.cta.title':   'Bereit, der Erste zu sein?',
    'work.cta.sub':     'Lassen Sie uns über Ihr Projekt sprechen und gemeinsam etwas aufbauen, auf das wir beide stolz sind.',
    'work.cta.btn':     'Projekt starten',

    // Services page — service cards
    'services.svc1.title': 'Webdesign',
    'services.svc1.text':  'Wir gestalten visuell beeindruckende, strategisch durchdachte Websites, die Ihre Marke widerspiegeln und Besucher in Kunden verwandeln. Jedes Design ist individuell — keine Vorlagen, keine Abkürzungen.',
    'services.svc1.li1':   'Individuelles UI/UX-Design',
    'services.svc1.li2':   'Markenkonforme Gestaltung',
    'services.svc1.li3':   'Mobile-First-Ansatz',
    'services.svc1.li4':   'Interaktive Prototypen',
    'services.svc2.title': 'Webentwicklung',
    'services.svc2.text':  'Wir schreiben sauberen, performanten Code, der Ihre Website schnell, sicher und stabil macht. Entwickelt nach modernen Standards, getestet auf allen Geräten und Browsern.',
    'services.svc2.li1':   'HTML, CSS, JavaScript',
    'services.svc2.li2':   'React & Next.js',
    'services.svc2.li3':   'WordPress & Webflow',
    'services.svc2.li4':   'Performance-Optimierung',
    'services.svc3.title': 'SEO-Optimierung',
    'services.svc3.text':  'Wir bauen von Anfang an mit SEO-Best-Practices — schnelle Ladezeiten, saubere Code-Struktur, Meta-Tags, Schema-Markup und Keyword-Strategie sind von Beginn an integriert.',
    'services.svc3.li1':   'On-Page-SEO-Einrichtung',
    'services.svc3.li2':   'Technisches SEO-Audit',
    'services.svc3.li3':   'Keyword-Recherche',
    'services.svc3.li4':   'Google Search Console-Einrichtung',
    'services.svc4.title': 'Landingpages',
    'services.svc4.text':  'Fokussierte, hochkonvertierende Seiten für ein einziges Ziel. Ob Produktlaunch, Lead-Magnet oder Werbekampagne — wir gestalten Seiten, die Klicks in Kunden verwandeln.',
    'services.svc4.li1':   'Conversion-orientiertes Design',
    'services.svc4.li2':   'A/B-testbereite Struktur',
    'services.svc4.li3':   'Lead-Capture-Formulare',
    'services.svc4.li4':   'Schnelle Umsetzung',
    'services.svc5.title': 'Performance-Optimierung',
    'services.svc5.text':  'Wir prüfen und verbessern die Geschwindigkeit, die Core Web Vitals und die SEO-Gesundheit Ihrer bestehenden Website — damit Sie höher ranken, schneller laden und mehr Besucher halten.',
    'services.svc5.li1':   'Core Web Vitals-Audit',
    'services.svc5.li2':   'Bild- und Asset-Optimierung',
    'services.svc5.li3':   'Caching & Komprimierung',
    'services.svc5.li4':   'Technische SEO-Korrekturen',
    'services.svc6.title': 'Laufender Support',
    'services.svc6.text':  'Wir verschwinden nicht nach dem Launch. Unsere Wartungspläne halten Ihre Website schnell, sicher und aktuell. Brauchen Sie eine schnelle Änderung? Wir sind immer nur eine Nachricht entfernt.',
    'services.svc6.li1':   'Monatliche Wartungspläne',
    'services.svc6.li2':   'Sicherheit & Updates',
    'services.svc6.li3':   'Performance-Monitoring',
    'services.svc6.li4':   'Prioritätssupport',

    // Services page — process section
    'services.process.title':       'In 4 Schritten vom Briefing zum Launch',
    'services.process.step1.title': 'Erstgespräch',
    'services.process.step1.text':  'Wir lernen Ihr Unternehmen, Ihre Ziele und Ihre Zielgruppe kennen, um die richtige Lösung für Sie zu entwickeln.',
    'services.process.step2.title': 'Design & Entwicklung',
    'services.process.step2.text':  'Wir gestalten und entwickeln Ihre Website und halten Sie in jeder Phase mit regelmäßigen Fortschrittsupdates auf dem Laufenden.',
    'services.process.step3.title': 'Überprüfung & Verfeinerung',
    'services.process.step3.text':  'Sie begutachten die Website, wir nehmen Revisionen vor, bis alles genau richtig ist. Keine versteckten Kosten oder überraschenden Gebühren.',
    'services.process.step4.title': 'Launch & Support',
    'services.process.step4.text':  'Wir launchen Ihre Website und bieten fortlaufenden Support, damit alles reibungslos weiterläuft.',

    // Services page — tech section
    'services.tech.label': 'Technologien',
    'services.tech.title': 'Tools & Technologien, mit denen wir arbeiten',

    // Services page — CTA
    'services.cta.title': 'Nicht sicher, welche Leistung Sie benötigen?',
    'services.cta.sub':   'Buchen Sie ein kostenloses Erstgespräch — wir finden es gemeinsam heraus.',
    'services.cta.btn':   'Kostenloses Gespräch buchen',

    // About page — body text
    'about.p1': 'E&E Digital wurde mit einer klaren Überzeugung gegründet: Unternehmen verdienen Websites, die wirklich funktionieren. Nicht nur schöne Designs, die da sitzen — Websites, die schnell laden, gut ranken und Besucher in zahlende Kunden verwandeln.',
    'about.p2': 'Wir sind ein kleines, eng eingespieltes Team aus Designern und Entwicklern, die wirklich für ihr Handwerk brennen. Wir arbeiten eng mit jedem Kunden zusammen — keine Account-Manager, keine Übergaben, keine Abkürzungen.',
    'about.p3': 'Ob Sie ein Startup sind, das seine erste Website launcht, oder eine etablierte Marke, die bereit für ein vollständiges Redesign ist — wir bringen bei jedem Projekt dasselbe Maß an Sorgfalt und Engagement mit.',

    // About page — highlights
    'about.hl1': 'Individuell entwickelt, keine Vorlagen',
    'about.hl2': 'Mobile-First & SEO-optimiert',
    'about.hl3': 'Schnelle Lieferzeiten',
    'about.hl4': 'Transparente Preise & Kommunikation',

    // About page — visual cards
    'about.card1.label': 'Ø Lieferzeit',
    'about.card1.val':   '2 Wochen',
    'about.card2.label': 'Erstgespräch',
    'about.card2.val':   'Kostenlos',
    'about.card3.label': 'Verwendete Vorlagen',
    'about.card3.val':   'Null',

    // About page — stats
    'about.stat1.num':   '2 Wo.',
    'about.stat1.label': 'Ø Lieferzeit',
    'about.stat2.num':   'Kostenlos',
    'about.stat2.label': 'Erstgespräch',
    'about.stat3.label': 'Individuell entwickelt',
    'about.stat4.label': 'Verwendete Vorlagen',

    // About page — value cards
    'about.val1.title': 'Handwerk',
    'about.val1.text':  'Wir sind besessen von Details, die andere übersehen — Typografie, Abstände, Performance, Barrierefreiheit. Gut genug ist nie gut genug.',
    'about.val2.title': 'Transparenz',
    'about.val2.text':  'Kein Fachjargon, keine versteckten Gebühren, keine unangenehmen Überraschungen. Wir kommunizieren klar und ehrlich in jeder Projektphase.',
    'about.val3.title': 'Ergebnisse',
    'about.val3.text':  'Schöne Websites bedeuten nichts, wenn sie nicht konvertieren. Wir gestalten und entwickeln mit Ihren Geschäftszielen im Mittelpunkt.',
    'about.val4.title': 'Partnerschaft',
    'about.val4.text':  'Wir investieren in Ihren langfristigen Erfolg — nicht nur in Ihren Launch. Wir sind auch nach dem Go-live für Updates, Beratung und Support da.',

    // About page — first client & CTA
    'about.fc.sub':    'Wir sind ehrlich: wir fangen gerade erst an. Aber das bedeutet, dass Sie unser absolut Bestes bekommen — volle Aufmerksamkeit, keine Ablenkungen und ein fertiges Produkt, auf das wir beide stolz sein werden.',
    'about.cta.title': 'Bereit, zusammenzuarbeiten?',
    'about.cta.sub':   'Erzählen Sie uns von Ihrem Projekt — wir freuen uns darauf.',
    'about.cta.btn':   'Kontakt aufnehmen',

    // Pricing page — card tiers, descs, list items, buttons
    'pricing.starter.tier':  'Starter',
    'pricing.starter.desc':  'Perfekt für kleine Unternehmen, die eine saubere, professionelle Online-Präsenz benötigen.',
    'pricing.starter.li1':   'Bis zu 5 Seiten',
    'pricing.starter.li2':   'Mobiles responsives Design',
    'pricing.starter.li3':   'Kontaktformular',
    'pricing.starter.li4':   'Basis-SEO-Einrichtung',
    'pricing.starter.li5':   '1 Revisionsrunde',
    'pricing.starter.li6':   '30 Tage Support nach Launch',
    'pricing.starter.btn':   'Jetzt starten',
    'pricing.growth.tier':   'Wachstum',
    'pricing.growth.badge':  'Beliebteste Wahl',
    'pricing.growth.desc':   'Für wachsende Unternehmen, die mehr Seiten, Funktionen und Content-Kontrolle benötigen.',
    'pricing.growth.li1':    'Bis zu 10 Seiten',
    'pricing.growth.li2':    'Performance-Optimierung',
    'pricing.growth.li3':    'Erweiterte SEO-Optimierung',
    'pricing.growth.li4':    'Google Analytics-Einrichtung',
    'pricing.growth.li5':    '3 Revisionsrunden',
    'pricing.growth.li6':    '3 Monate Support nach Launch',
    'pricing.growth.btn':    'Jetzt starten',
    'pricing.premium.tier':  'Premium',
    'pricing.premium.desc':  'Full-Service-Paket für Marken, die alles von Anfang bis Ende richtig gemacht haben möchten.',
    'pricing.premium.li1':   'Unbegrenzte Seiten',
    'pricing.premium.li2':   'API- & Drittanbieter-Integrationen',
    'pricing.premium.li3':   'Vollständiges SEO- & Performance-Audit',
    'pricing.premium.li4':   'Individuelle Animationen',
    'pricing.premium.li5':   'Unbegrenzte Revisionen',
    'pricing.premium.li6':   '12 Monate Prioritätssupport',
    'pricing.premium.btn':   'Jetzt starten',
    'pricing.note':          'Alle Preise sind Einmalgebühren. Brauchen Sie etwas Individuelles? <a href="contact.html">Sprechen Sie uns an.</a>',

    // Pricing page — comparison table
    'pricing.table.feature':         'Merkmal',
    'pricing.table.pages':           'Anzahl der Seiten',
    'pricing.table.pages.starter':   'Bis zu 5',
    'pricing.table.pages.growth':    'Bis zu 10',
    'pricing.table.unlimited':       'Unbegrenzt',
    'pricing.table.responsive':      'Mobiles responsives Design',
    'pricing.table.form':            'Kontaktformular',
    'pricing.table.perf':            'Performance-Optimierung',
    'pricing.table.basic':           'Basis',
    'pricing.table.advanced':        'Erweitert',
    'pricing.table.full':            'Vollständiges Audit',
    'pricing.table.seo':             'SEO-Optimierung',
    'pricing.table.analytics':       'Google Analytics',
    'pricing.table.api':             'API-Integrationen',
    'pricing.table.animations':      'Individuelle Animationen',
    'pricing.table.revisions':       'Revisionsrunden',
    'pricing.table.support':         'Support nach Launch',
    'pricing.table.support.starter': '30 Tage',
    'pricing.table.support.growth':  '3 Monate',
    'pricing.table.support.premium': '12 Monate',

    // Pricing page — FAQ
    'pricing.faq1.q': 'Sind das Einmalgebühren oder monatliche Zahlungen?',
    'pricing.faq1.a': 'Alle aufgeführten Preise sind einmalige Projektgebühren — keine Abonnements. Sie zahlen einmal und die Website gehört Ihnen. Optionale Wartungsretainer sind nach dem Launch verfügbar, falls Sie fortlaufenden Support wünschen.',
    'pricing.faq2.q': 'Bieten Sie Ratenzahlungen an?',
    'pricing.faq2.a': 'Ja. Wir bitten in der Regel um eine 50%-Anzahlung zu Beginn der Arbeit, der Rest ist bei Fertigstellung fällig. Bei größeren Projekten können wir gestaffelte Zahlungen vereinbaren — fragen Sie uns einfach beim kostenlosen Erstgespräch.',
    'pricing.faq3.q': 'Was, wenn mein Projekt nicht in ein Paket passt?',
    'pricing.faq3.a': 'Kein Problem. Diese Pakete sind Ausgangspunkte — wir passen Umfang, Funktionen oder Preise gerne an Ihre genauen Bedürfnisse an. Nehmen Sie Kontakt auf und wir erstellen ein maßgeschneidertes Angebot.',
    'pricing.faq4.q': 'Gibt es zusätzliche Kosten, die ich kennen sollte?',
    'pricing.faq4.a': 'Unsere Preise decken alles Aufgeführte ab. Die einzigen Extras wären Drittanbieterkosten, die Sie direkt zahlen würden — zum Beispiel Ihren Domainnamen, Hosting oder Premium-Plugins, die Ihr Projekt erfordert. Wir weisen immer im Voraus darauf hin.',
    'pricing.faq5.q': 'Wie lange dauert es?',
    'pricing.faq5.a': 'Starter-Projekte dauern in der Regel 1–2 Wochen. Wachstumsprojekte 2–3 Wochen. Premium-Projekte mit individuellen Funktionen oder API-Integrationen können 3–5 Wochen dauern. Wir geben Ihnen vor dem Start einen klaren Zeitplan.',

    // Contact page — card
    'contact.card.heading': 'Kontaktdaten',
    'contact.card.text':    'Wir freuen uns, von Ihnen zu hören.',
    'contact.card.sub':     'Noch nicht bereit für ein Formular? Schreiben Sie uns eine E-Mail — wir unterhalten uns gerne unverbindlich über Ihr Projekt.',
    'contact.item1.label':  'E-Mail senden',
    'contact.item2.label':  'Anrufen',
    'contact.item3.label':  'Antwortzeit',
    'contact.item3.val':    'Innerhalb von 24 Stunden',
    'contact.social.label': 'Folge uns',
    'contact.trust1':       'Kostenloses Erstgespräch',
    'contact.trust2':       'Unverbindliches Angebot',
    'contact.trust3':       'Lieferung in 2 Wochen',
    'contact.social.label': 'Finden Sie uns online',

    // Contact page — form header
    'contact.form.title': 'Erzählen Sie uns von Ihrem Projekt',
    'contact.form.sub':   'Wir prüfen Ihre Nachricht und melden uns mit einer kostenlosen Beratung und einem Angebot.',

    // Contact page — FAQ
    'contact.faq.label': 'FAQ',
    'contact.faq.title': 'Häufig gestellte Fragen',
    'contact.faq1.q': 'Wie lange dauert es, eine Website zu erstellen?',
    'contact.faq1.a': 'Die meisten Projekte werden je nach Umfang innerhalb von 2–4 Wochen abgeschlossen. Einfache Websites und Landingpages können in unter 2 Wochen fertiggestellt werden, während größere oder komplexere Projekte 3–5 Wochen dauern können. Wir geben Ihnen vor dem Start einen klaren Zeitplan.',
    'contact.faq2.q': 'Muss ich die Inhalte bereitstellen?',
    'contact.faq2.a': 'Sie müssen Ihr Logo, Ihre Markenfarben und alle gewünschten Texte oder Bilder bereitstellen. Wenn Sie Hilfe beim Texten oder bei der Fotografie benötigen, können wir vertrauenswürdige Partner empfehlen oder dies gegen eine zusätzliche Gebühr übernehmen.',
    'contact.faq3.q': 'Funktioniert meine Website auf Mobilgeräten und Tablets?',
    'contact.faq3.a': 'Absolut. Jede Website, die wir erstellen, ist vollständig responsiv und auf allen wichtigen Geräten und Bildschirmgrößen getestet. Mobile Performance ist eine unserer obersten Prioritäten — sie beeinflusst sowohl die UX als auch die SEO-Rankings.',
    'contact.faq4.q': 'Kann ich die Website selbst aktualisieren?',
    'contact.faq4.a': 'Für kleine Änderungen und Updates nach dem Launch senden Sie uns einfach eine Nachricht — wir erledigen es schnell für Sie. Für regelmäßige, fortlaufende Updates sind unsere Wartungspakete ideal. Wir halten alles einfach und unkompliziert.',
    'contact.faq5.q': 'Was passiert, nachdem die Website live geht?',
    'contact.faq5.a': 'Alle Pakete beinhalten Support nach dem Launch. Wir beheben auftretende Fehler und sind immer für Ihre Fragen verfügbar. Fortlaufende Wartungsretainer sind auch für regelmäßige Updates verfügbar.',

    // Impressum page
    'page.impressum.doctitle':       'Impressum — E&E Digital',
    'page.impressum.label':          'Rechtliches',
    'page.impressum.title':          'Impressum',
    'page.impressum.sub':            'Angaben gemäß § 5 TMG',
    'impressum.h.responsible':       'Verantwortlich für den Inhalt',
    'impressum.h.contact':           'Kontakt',
    'impressum.h.vat':               'Umsatzsteuer',
    'impressum.h.profession':        'Berufsbezeichnung und berufsrechtliche Regelungen',
    'impressum.h.eu':                'EU-Streitschlichtung',
    'impressum.h.consumer':          'Verbraucherschlichtung',
    'impressum.h.liability.content': 'Haftung für Inhalte',
    'impressum.h.liability.links':   'Haftung für Links',
    'impressum.h.copyright':         'Urheberrecht',

    // Datenschutz page
    'page.datenschutz.doctitle': 'Datenschutzerklärung — E&E Digital',
    'page.datenschutz.label': 'Rechtliches',
    'page.datenschutz.title': 'Datenschutzerklärung',
    'page.datenschutz.sub':   'Informationen gemäß DSGVO / Art. 13 DSGVO',
    'dsgvo.h1': '1. Verantwortlicher',
    'dsgvo.h2': '2. Allgemeine Hinweise zur Datenverarbeitung',
    'dsgvo.h3': '3. Hosting',
    'dsgvo.h4': '4. Server-Log-Dateien',
    'dsgvo.h5': '5. Kontaktformular',
    'dsgvo.h6': '6. Lokaler Speicher (localStorage)',
    'dsgvo.h7': '7. Schriftarten (Webfonts)',
    'dsgvo.h8': '8. Ihre Rechte als betroffene Person',
    'dsgvo.h9': '9. Aktualität und Änderung dieser Datenschutzerklärung',

    // Impressum body
    'impressum.p1':  'Ebu Bekir Yel<br>Buddestraße 24<br>21109 Hamburg<br>Deutschland',
    'impressum.p2':  'E-Mail: <a href="mailto:ee-digital@outlook.com">ee-digital@outlook.com</a>',
    'impressum.p3a': 'Gemäß § 19 UStG wird keine Umsatzsteuer erhoben (Kleinunternehmerregelung).',
    'impressum.p4':  'Berufsbezeichnung: Webdesigner / Webentwickler<br>Verliehen in: Deutschland',
    'impressum.p5a': 'Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr/</a>',
    'impressum.p5b': 'Unsere E-Mail-Adresse finden Sie oben im Impressum.',
    'impressum.p6':  'Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.',
    'impressum.p7a': 'Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.',
    'impressum.p7b': 'Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.',
    'impressum.p8a': 'Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.',
    'impressum.p8b': 'Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.',
    'impressum.p9a': 'Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.',
    'impressum.p9b': 'Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.',

    // Datenschutz body
    'dsgvo.p1':      'Verantwortlicher für die Datenverarbeitung auf dieser Website ist:<br><br>Ebu Bekir Yel<br>Buddestraße 24<br>21109 Hamburg<br>Deutschland<br><br>E-Mail: <a href="mailto:ee-digital@outlook.com">ee-digital@outlook.com</a>',
    'dsgvo.p2a':     'Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst und behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.',
    'dsgvo.p2b':     'Die Nutzung unserer Website ist in der Regel ohne Angabe personenbezogener Daten möglich. Soweit auf unseren Seiten personenbezogene Daten (beispielsweise Name, E-Mail-Adresse oder Telefonnummer) erhoben werden, erfolgt dies stets auf freiwilliger Basis. Diese Daten werden ohne Ihre ausdrückliche Zustimmung nicht an Dritte weitergegeben.',
    'dsgvo.p2c':     'Rechtsgrundlagen der Datenverarbeitung sind Art. 6 DSGVO, insbesondere:',
    'dsgvo.p2.list': '<li><strong>Art. 6 Abs. 1 lit. a DSGVO</strong> – Einwilligung der betroffenen Person</li><li><strong>Art. 6 Abs. 1 lit. b DSGVO</strong> – Vertragserfüllung oder vorvertragliche Maßnahmen</li><li><strong>Art. 6 Abs. 1 lit. f DSGVO</strong> – Berechtigte Interessen des Verantwortlichen</li>',
    'dsgvo.p3a':     'Diese Website wird bei einem externen Dienstleister gehostet (Hoster). Die personenbezogenen Daten, die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert. Hierbei kann es sich v. a. um IP-Adressen, Kontaktanfragen, Meta- und Kommunikationsdaten, Vertragsdaten, Kontaktdaten, Namen, Websitezugriffe und sonstige Daten handeln.',
    'dsgvo.p3b':     'Der Einsatz des Hosters erfolgt zum Zwecke der Vertragserfüllung gegenüber unseren potenziellen und bestehenden Kunden (Art. 6 Abs. 1 lit. b DSGVO) und im Interesse einer sicheren, schnellen und effizienten Bereitstellung unseres Online-Angebots durch einen professionellen Anbieter (Art. 6 Abs. 1 lit. f DSGVO).',
    'dsgvo.p3c':     'Unser Hoster: <strong>Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA</strong>',
    'dsgvo.p4a':     'Der Provider dieser Website erhebt und speichert automatisch Informationen in sogenannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:',
    'dsgvo.p4.list': '<li>Browsertyp und Browserversion</li><li>Verwendetes Betriebssystem</li><li>Referrer URL</li><li>Hostname des zugreifenden Rechners</li><li>Uhrzeit der Serveranfrage</li><li>IP-Adresse</li>',
    'dsgvo.p4b':     'Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Grundlage für die Datenverarbeitung ist Art. 6 Abs. 1 lit. f DSGVO, das berechtigte Interesse an der technisch fehlerfreien Darstellung und der Optimierung unserer Website.',
    'dsgvo.p5a':     'Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.',
    'dsgvo.p5b':     'Folgende Daten werden beim Absenden des Formulars erhoben:',
    'dsgvo.p5.list': '<li>Name</li><li>E-Mail-Adresse</li><li>Telefonnummer (optional)</li><li>Projektbeschreibung / Nachricht</li><li>Budget und gewünschte Dienstleistung (optional)</li>',
    'dsgvo.p5c':     'Die Verarbeitung der in das Kontaktformular eingegebenen Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen) sowie Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Beantwortung von Kundenanfragen). Die von Ihnen eingegebenen Daten verbleiben bei uns, bis Sie uns zur Löschung auffordern, Ihre Einwilligung zur Speicherung widerrufen oder der Zweck für die Datenspeicherung entfällt.',
    'dsgvo.p6a':     'Diese Website speichert technisch notwendige Einstellungen im lokalen Speicher (localStorage) Ihres Browsers. Dabei handelt es sich ausschließlich um:',
    'dsgvo.p6.list': '<li><strong>theme</strong> – Ihre gewählte Farbdarstellung (Hell- oder Dunkelmodus)</li><li><strong>lang</strong> – Ihre gewählte Sprache (EN/TR/DE)</li>',
    'dsgvo.p6b':     'Diese Daten werden nicht an Server übertragen und verbleiben ausschließlich lokal auf Ihrem Gerät. Es handelt sich um keine Cookies im rechtlichen Sinne; eine Einwilligung ist daher nicht erforderlich. Grundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der nutzerfreundlichen Darstellung der Website).',
    'dsgvo.p7a':     'Diese Website verwendet die Schriftart Inter, welche lokal auf unserem Server eingebunden ist. Es findet kein Datentransfer an externe Server statt.',
    'dsgvo.p7b':     'Die Schriftart wird ausschließlich von unserem eigenen Webserver ausgeliefert. Dabei werden keine personenbezogenen Daten an Dritte übermittelt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer einheitlichen und ansprechenden Darstellung der Website).',
    'dsgvo.p7c':     '',
    'dsgvo.p8a':     'Sie haben gegenüber uns folgende Rechte hinsichtlich der Sie betreffenden personenbezogenen Daten:',
    'dsgvo.p8.list': '<li><strong>Recht auf Auskunft</strong> (Art. 15 DSGVO)</li><li><strong>Recht auf Berichtigung</strong> (Art. 16 DSGVO)</li><li><strong>Recht auf Löschung</strong> (Art. 17 DSGVO)</li><li><strong>Recht auf Einschränkung der Verarbeitung</strong> (Art. 18 DSGVO)</li><li><strong>Recht auf Datenübertragbarkeit</strong> (Art. 20 DSGVO)</li><li><strong>Recht auf Widerspruch</strong> gegen die Verarbeitung (Art. 21 DSGVO)</li><li><strong>Recht auf Widerruf</strong> erteilter Einwilligungen (Art. 7 Abs. 3 DSGVO)</li>',
    'dsgvo.p8b':     'Zur Ausübung Ihrer Rechte wenden Sie sich bitte an: <a href="mailto:ee-digital@outlook.com">ee-digital@outlook.com</a>',
    'dsgvo.p8c':     'Außerdem haben Sie das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten durch uns zu beschweren. Die zuständige Aufsichtsbehörde richtet sich nach Ihrem Wohnort bzw. dem Sitz unseres Unternehmens.',
    'dsgvo.p9':      'Diese Datenschutzerklärung ist aktuell gültig und hat den Stand März 2026. Durch die Weiterentwicklung unserer Website und Angebote oder aufgrund geänderter gesetzlicher beziehungsweise behördlicher Vorgaben kann es notwendig werden, diese Datenschutzerklärung zu ändern. Die jeweils aktuelle Datenschutzerklärung kann jederzeit auf der Website unter <a href="datenschutz.html">datenschutz.html</a> abgerufen werden.',
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

  document.querySelectorAll('[data-i18n-content]').forEach(el => {
    const key = el.dataset.i18nContent;
    const text = translations[lang]?.[key];
    if (text !== undefined) el.setAttribute('content', text);
  });

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  localStorage.setItem('lang', lang);
  document.documentElement.setAttribute('lang', lang);
}

// Language switch buttons
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => applyLang(btn.dataset.lang));
});

// Init language on page load
applyLang(currentLang);
