/* ============================================================
   Ayomiscript.js - Cindy Receptionist Landing Page
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Utilities ---
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  function formatTime(seconds) {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  // ============================================================
  // NAVIGATION
  // ============================================================
  const navbar = $('#navbar');
  const mobileMenuBtn = $('#mobileMenuBtn');
  const mobileNav = $('#mobileNav');

  window.addEventListener('scroll', () => {
    requestAnimationFrame(() => {
      navbar?.classList.toggle('scrolled', window.scrollY > 50);
    });
  }, { passive: true });

  mobileMenuBtn?.addEventListener('click', () => {
    const isOpen = mobileNav?.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
    mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
  });

  $$('.mobile-nav a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuBtn?.classList.remove('active');
      mobileNav?.classList.remove('active');
    });
  });

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const target = $(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav?.classList.contains('active')) {
      mobileMenuBtn?.classList.remove('active');
      mobileNav?.classList.remove('active');
      mobileMenuBtn?.focus();
    }
  });

  // ============================================================
  // HERO WAVEFORM
  // ============================================================
  const heroBars = $$('#heroWaveform .wave-bar');
  let heroWaveIds = [];

  function startHeroWave() {
    heroWaveIds.forEach(id => clearInterval(id));
    heroWaveIds.length = 0;
    heroBars.forEach(bar => {
      const id = setInterval(() => {
        bar.style.transform = `scaleY(${0.2 + Math.random() * 0.8})`;
      }, rand(120, 280));
      heroWaveIds.push(id);
    });
  }
  startHeroWave();

  // ============================================================
  // HERO STAT COUNTER
  // ============================================================
  const heroStatValues = $$('.ai-stat-value[data-target]');
  const heroCountObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        animateCounter(el, target);
        heroCountObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  heroStatValues.forEach(el => heroCountObserver.observe(el));

  function animateCounter(el, target) {
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      el.textContent = current;
    }, 30);
  }

  // ============================================================
  // SPEECH BUBBLE ROTATION (Hero)
  // ============================================================
  const speechPhrases = [
    '"Welcome to Ayomorr Cravings! How can I help you today?"',
    '"Would you like to make a reservation? I can help with that!"',
    '"Our jollof rice is amazing tonight — want me to check the menu?"',
    '"I can help you plan an event for any occasion!"',
    '"Need directions? We\'re easy to find!"',
  ];
  let speechIndex = 0;
  const heroSpeech = $('#heroSpeechBubble p');

  setInterval(() => {
    if (!heroSpeech) return;
    speechIndex = (speechIndex + 1) % speechPhrases.length;
    heroSpeech.style.opacity = '0';
    heroSpeech.style.transform = 'translateY(6px)';
    setTimeout(() => {
      heroSpeech.textContent = speechPhrases[speechIndex];
      heroSpeech.style.opacity = '1';
      heroSpeech.style.transform = 'translateY(0)';
    }, 300);
  }, 4000);

  // ============================================================
  // CALLING ABOUT SECTION
  // ============================================================
  const conversationData = {
    dinein: [
      { sender: 'cindy', text: 'Welcome to Ayomorr Cravings! Are you looking to dine in with us today?' },
      { sender: 'customer', text: 'Yes, we\'d love to! We\'re a group of four.' },
      { sender: 'cindy', text: 'That\'s wonderful! What time were you thinking of coming in?' },
      { sender: 'customer', text: 'Around 7 PM tonight.' },
      { sender: 'cindy', text: 'Perfect! Let me check availability for four guests at 7 PM. One moment...' },
    ],
    takeaway: [
      { sender: 'cindy', text: 'Thanks for calling Ayomorr Cravings! Would you like to place a takeaway order?' },
      { sender: 'customer', text: 'Yes please! What do you recommend?' },
      { sender: 'cindy', text: 'Our jollof rice and grilled chicken are really popular! We also have amazing suya. What sounds good?' },
      { sender: 'customer', text: 'I\'ll take the jollof rice with chicken and some plantain.' },
      { sender: 'cindy', text: 'Great choice! That\'s jollof rice with chicken and a side of plantain. What time would you like to pick that up?' },
    ],
    reservation: [
      { sender: 'cindy', text: 'Hello! I\'d love to help you make a reservation. How many guests will be dining?' },
      { sender: 'customer', text: 'It\'ll be four of us.' },
      { sender: 'cindy', text: 'Lovely! And what date and time works best for you?' },
      { sender: 'customer', text: 'This Saturday at 7:30 PM.' },
      { sender: 'cindy', text: 'Saturday at 7:30 for four. Could I get your name and phone number, please?' },
      { sender: 'customer', text: 'My name is Sarah, and my number is 08012345678.' },
      { sender: 'cindy', text: 'Thank you, Sarah! I\'m checking availability for four guests this Saturday at 7:30 PM.' },
    ],
    event: [
      { sender: 'cindy', text: 'Hi there! I\'d love to help you plan an event. What kind of event are you thinking of?' },
      { sender: 'customer', text: 'It\'s a birthday dinner for about 20 people.' },
      { sender: 'cindy', text: 'How exciting! A birthday celebration for 20 — that\'s going to be wonderful. Let me get some details.' },
      { sender: 'customer', text: 'That would be great!' },
      { sender: 'cindy', text: 'When were you thinking of hosting it? And do you have any preferences for the setup?' },
    ],
    speak: [
      { sender: 'cindy', text: 'Hi! This is Cindy, the AI receptionist at Ayomorr Cravings. How can I help you today?' },
      { sender: 'customer', text: 'I just wanted to check if you\'re open tonight.' },
      { sender: 'cindy', text: 'Yes, we\'re open tonight! Would you like to make a reservation or order something for takeaway?' },
      { sender: 'customer', text: 'I might just walk in. What\'s the address?' },
      { sender: 'cindy', text: 'We\'d love to have you! Let me share our location details with you.' },
    ],
    directions: [
      { sender: 'cindy', text: 'I\'d be happy to help you find us! Are you familiar with the area around Ayomorr Cravings?' },
      { sender: 'customer', text: 'Not really, I\'m coming from the other side of town.' },
      { sender: 'cindy', text: 'No problem! Ayomorr Cravings is easy to find. We\'re located at a convenient spot accessible from all major routes.' },
      { sender: 'customer', text: 'Do you have parking available?' },
      { sender: 'cindy', text: 'Yes, we have parking available for our guests. When you arrive, our staff will be happy to direct you.' },
    ],
  };

  const callingCards = $$('.calling-card');
  const callingConversation = $('#callingConversation');
  const conversationMessages = $('#conversationMessages');
  const conversationTyping = $('#conversationTyping');

  callingCards.forEach(card => {
    card.addEventListener('click', () => {
      callingCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const key = card.dataset.action.replace('-', '');
      playConversation(key);
    });
  });

  async function playConversation(key) {
    const messages = conversationData[key];
    if (!messages || !conversationMessages) return;
    conversationMessages.innerHTML = '';
    callingConversation?.classList.add('active');

    for (const msg of messages) {
      conversationTyping?.classList.add('active');
      conversationMessages.scrollTop = conversationMessages.scrollHeight;
      await sleep(rand(700, 1100));
      conversationTyping?.classList.remove('active');

      const div = document.createElement('div');
      div.className = `message ${msg.sender}`;
      div.textContent = msg.text;
      conversationMessages.appendChild(div);
      conversationMessages.scrollTop = conversationMessages.scrollHeight;
      await sleep(100);
    }

    // Add demo notice
    const notice = document.createElement('div');
    notice.className = 'chat-notice';
    notice.textContent = 'Demo mode — this is a simulated conversation.';
    notice.style.marginTop = '8px';
    conversationMessages.appendChild(notice);
  }

  // ============================================================
  // DEMO SECTION
  // ============================================================
  const demoWaveform = $('#demoWaveform');
  const demoSpeech = $('#demoSpeech');
  const demoTimer = $('#demoTimer');
  const demoConnected = $('#demoConnected');
  const startDemoBtn = $('#startDemoCall');
  const endDemoBtn = $('#demoEndCall');

  let demoInterval = null;
  let demoSeconds = 72;
  let demoWaveIds = [];

  function startDemoWave() {
    const bars = $$('#demoWaveform .demo-wave-bar');
    demoWaveIds.forEach(id => clearInterval(id));
    demoWaveIds.length = 0;
    bars.forEach(bar => {
      const id = setInterval(() => {
        bar.style.transform = `scaleY(${0.2 + Math.random() * 0.8})`;
      }, rand(120, 280));
      demoWaveIds.push(id);
    });
  }

  function stopDemoWave() {
    demoWaveIds.forEach(id => clearInterval(id));
    demoWaveIds.length = 0;
    $$('#demoWaveform .demo-wave-bar').forEach(bar => {
      bar.style.transform = 'scaleY(0.3)';
    });
  }

  function startDemoTimer() {
    demoSeconds = 0;
    if (demoTimer) demoTimer.textContent = '00:00';
    clearInterval(demoInterval);
    demoInterval = setInterval(() => {
      demoSeconds++;
      if (demoTimer) demoTimer.textContent = formatTime(demoSeconds);
    }, 1000);
  }

  startDemoBtn?.addEventListener('click', () => {
    demoConnected?.classList.add('active');
    startDemoWave();
    startDemoTimer();
    startDemoBtn.style.display = 'none';
  });

  endDemoBtn?.addEventListener('click', () => {
    demoConnected?.classList.remove('active');
    stopDemoWave();
    clearInterval(demoInterval);
    startDemoBtn.style.display = '';
    // Reset speech
    if (demoSpeech) demoSpeech.innerHTML = '<p>"Welcome to Ayomorr Cravings! How can I help you today?"</p>';
  });

  // Start demo waveform when visible
  const demoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && demoConnected?.classList.contains('active')) {
        startDemoWave();
      } else {
        stopDemoWave();
      }
    });
  }, { threshold: 0.3 });
  if (demoWaveform) demoObserver.observe(demoWaveform);

  // ============================================================
  // USE CASE CARDS
  // ============================================================
  const useCaseData = {
    table: 'I\'d be happy to reserve a table for you! How many guests and what time works best?',
    takeaway: 'Great! What would you like to order today? I can tell you about our most popular dishes.',
    menu: 'We have an amazing selection! From our popular jollof rice and grilled chicken to suya, pizza, and fresh salads. Want me to walk you through the highlights?',
    event: 'How exciting! Whether it\'s a birthday, owambe, or corporate dinner — I\'d love to help you plan the perfect event at Ayomorr Cravings.',
    directions: 'Of course! Ayomorr Cravings is easy to find. We also have parking available. Would you like our full address and landmarks?',
  };

  $$('.use-case-card').forEach(card => {
    card.addEventListener('click', () => {
      const wasActive = card.classList.contains('active');
      $$('.use-case-card').forEach(c => c.classList.remove('active'));
      if (!wasActive) {
        card.classList.add('active');
      }
    });
  });

  // ============================================================
  // FAQ ACCORDION
  // ============================================================
  $$('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasActive = item.classList.contains('active');
      $$('.faq-item').forEach(i => i.classList.remove('active'));
      if (!wasActive) item.classList.add('active');
    });
  });

  // ============================================================
  // SCROLL REVEAL
  // ============================================================
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  $$('.reveal').forEach(el => revealObserver.observe(el));

  // ============================================================
  // COUNTER ANIMATION (Dashboard + Analytics)
  // ============================================================
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent.replace(/,/g, '');
        const target = parseInt(text, 10);
        if (!isNaN(target)) animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  $$('.stat-value').forEach(el => counterObserver.observe(el));

  // ============================================================
  // CHART BAR ANIMATION
  // ============================================================
  const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $$('.chart-bar').forEach((bar, i) => {
          setTimeout(() => {
            bar.style.height = bar.dataset.height || '60%';
          }, i * 100);
        });
        chartObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const chartContainer = $('.chart-container');
  if (chartContainer) chartObserver.observe(chartContainer);

  // ============================================================
  // PLACEHOLDER LINK HANDLERS
  // ============================================================
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href="#app-store-coming-soon"], a[href="#google-play-coming-soon"]');
    if (link) {
      e.preventDefault();
      alert('Coming soon! We\'re working on getting Cindy on mobile.');
    }
    const webApp = e.target.closest('a[href="#web-app"]');
    if (webApp) {
      e.preventDefault();
      alert('Web app launching soon!');
    }
  });

  // ============================================================
  // FLOATING CALL BUTTON
  // ============================================================
  const floatingCall = $('.floating-call');
  if (floatingCall) {
    window.addEventListener('scroll', () => {
      floatingCall.style.opacity = window.scrollY > 400 ? '1' : '0';
      floatingCall.style.pointerEvents = window.scrollY > 400 ? 'all' : 'none';
    }, { passive: true });
    floatingCall.style.opacity = '0';
    floatingCall.style.pointerEvents = 'none';
    floatingCall.style.transition = 'opacity 0.3s ease';
  }

  // ============================================================
  // TELEPHONE CLICK TRACKING
  // ============================================================
  document.addEventListener('click', (e) => {
    const tel = e.target.closest('a[href^="tel:"]');
    if (tel) {
      console.log('[Cindy] Phone call initiated:', tel.href);
    }
    const mail = e.target.closest('a[href^="mailto:"]');
    if (mail) {
      console.log('[Cindy] Email link clicked:', mail.href);
    }
  });

  // ============================================================
  // SPEECH BUBBLE TRANSITION (Hero)
  // ============================================================
  if (heroSpeech) {
    heroSpeech.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  }

  // ============================================================
  // AUTO-ACTIVATE CALLING CARD FROM URL HASH
  // ============================================================
  const hash = window.location.hash;
  if (hash.includes('?action=')) {
    const action = hash.split('?action=')[1];
    const targetCard = document.querySelector(`.calling-card[data-action="${action}"]`);
    if (targetCard) {
      setTimeout(() => {
        callingCards.forEach(c => c.classList.remove('active'));
        targetCard.classList.add('active');
        playConversation(action);
      }, 400);
    }
  }

});
