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

    const [hashPart, queryPart] = href.split('?');
    const target = $(hashPart);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    const action = new URLSearchParams(queryPart || '').get('action');
    if (action && target) {
      setTimeout(() => startCallingAction(action), 350);
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
      { sender: 'cindy', text: 'Hello! I\'d love to help you make a reservation. Please fill in the details below and I\'ll book your table.' },
    ],
    event: [
      { sender: 'cindy', text: 'Hi there! I\'d love to help you plan an event. What kind of event are you thinking of?' },
      { sender: 'customer', text: 'It\'s a birthday dinner for about 20 people.' },
      { sender: 'cindy', text: 'How exciting! A birthday celebration for 20 — that\'s going to be wonderful. Let me get some details.' },
      { sender: 'customer', text: 'That would be great!' },
      { sender: 'cindy', text: 'When were you thinking of hosting it? And do you have any preferences for the setup?' },
    ],
    speak: [
      { sender: 'cindy', text: 'Hi! This is Cindy, the AI receptionist at Ayomorr Cravings. Ask me anything — reservations, takeaway orders, the menu, opening hours, directions and more!' },
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

  function appendMessage(sender, text) {
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    div.textContent = text;
    conversationMessages.appendChild(div);
    conversationMessages.scrollTop = conversationMessages.scrollHeight;
    return div;
  }

  async function askCindyAI(message, history = []) {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'AI assistant unavailable.');
    return data.reply;
  }

  let conversationChatHistory = [];

  function addAIConversation() {
    const wrap = document.createElement('div');
    wrap.className = 'conversation-chat-input';
    wrap.innerHTML = `
      <input type="text" placeholder="Ask Cindy anything…" aria-label="Message Cindy">
      <button type="button">Send</button>
    `;
    conversationMessages.appendChild(wrap);
    conversationMessages.scrollTop = conversationMessages.scrollHeight;

    const input = wrap.querySelector('input');
    const sendBtn = wrap.querySelector('button');

    const send = () => {
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      appendMessage('customer', text);
      sendToCindyChat(text);
    };

    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') send(); });
    sendBtn.addEventListener('click', send);

    async function sendToCindyChat(text) {
      conversationTyping?.classList.add('active');
      let reply;
      try {
        reply = await askCindyAI(text, conversationChatHistory);
      } catch (err) {
        reply = replyToCindy(text);
      }
      conversationChatHistory.push({ sender: 'customer', text }, { sender: 'cindy', text: reply });
      conversationTyping?.classList.remove('active');
      appendMessage('cindy', reply);
    }
  }

  function startCallingAction(action) {
    const card = document.querySelector(`.calling-card[data-action="${action}"]`);
    callingCards.forEach(c => c.classList.remove('active'));
    if (card) {
      card.classList.add('active');
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    playConversation(action);
  }

  async function playConversation(key) {
    const messages = conversationData[key];
    if (!messages || !conversationMessages) return;
    conversationMessages.innerHTML = '';
    conversationChatHistory = [];
    callingConversation?.classList.add('active');

    for (const msg of messages) {
      conversationTyping?.classList.add('active');
      conversationMessages.scrollTop = conversationMessages.scrollHeight;
      await sleep(rand(600, 900));
      conversationTyping?.classList.remove('active');
      appendMessage(msg.sender, msg.text);
      await sleep(120);
    }

    if (key === 'reservation') {
      appendReservationForm();
    } else if (key === 'speak') {
      addAIConversation();
    }

    const notice = document.createElement('div');
    notice.className = 'chat-notice';
    notice.textContent = key === 'reservation'
      ? 'Reservations are saved on the demo backend (in-memory data).'
      : key === 'speak'
        ? 'Cindy is powered by your local AI (Ollama) when it is available; otherwise she falls back to scripted replies.'
        : 'Demo mode — this is a simulated conversation.';
    notice.style.marginTop = '8px';
    conversationMessages.appendChild(notice);
  }

  function appendReservationForm() {
    const wrap = document.createElement('div');
    wrap.className = 'message cindy reservation-form-wrap';
    wrap.innerHTML = `
      <form class="reservation-form" novalidate>
        <h4 class="reservation-form-title">Reserve a Table</h4>
        <label class="rf-field">
          <span class="rf-label">Name</span>
          <input type="text" name="name" placeholder="Your full name" required>
        </label>
        <label class="rf-field">
          <span class="rf-label">Phone</span>
          <input type="tel" name="phone" placeholder="e.g. 08123456789" required>
        </label>
        <div class="rf-row">
          <label class="rf-field">
            <span class="rf-label">Guests</span>
            <input type="number" name="guests" min="1" max="50" value="2" required>
          </label>
          <label class="rf-field">
            <span class="rf-label">Date</span>
            <input type="date" name="date" required>
          </label>
        </div>
        <label class="rf-field">
          <span class="rf-label">Time</span>
          <input type="time" name="time" required>
        </label>
        <label class="rf-field">
          <span class="rf-label">Special requests <em>(optional)</em></span>
          <input type="text" name="specialRequests" placeholder="Window seat, birthday, etc.">
        </label>
        <button type="submit" class="rf-submit">Confirm Reservation</button>
        <p class="rf-status" role="alert"></p>
      </form>`;
    conversationMessages.appendChild(wrap);
    conversationMessages.scrollTop = conversationMessages.scrollHeight;

    const form = wrap.querySelector('form');
    const status = wrap.querySelector('.rf-status');
    const submitBtn = wrap.querySelector('.rf-submit');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        name: form.elements.name.value.trim(),
        phone: form.elements.phone.value.trim(),
        guests: parseInt(form.elements.guests.value, 10) || 2,
        date: form.elements.date.value,
        time: form.elements.time.value,
        specialRequests: form.elements.specialRequests.value.trim(),
      };

      if (!payload.name || !payload.phone || !payload.date || !payload.time) {
        status.textContent = 'Please fill in all the required fields.';
        status.classList.add('error');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Booking your table…';
      status.textContent = '';
      status.classList.remove('error');

      try {
        const res = await fetch('/api/reservations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Could not save your reservation.');

        form.remove();
        wrap.classList.remove('message', 'cindy');
        const success = document.createElement('div');
        success.className = 'reservation-success';
        success.textContent = `Table for ${payload.guests} on ${payload.date} at ${payload.time} is reserved. Confirmation ID: ${data.confirmationId}`;
        wrap.appendChild(success);
        appendMessage('cindy', `Thank you, ${payload.name}! Your reservation has been confirmed. We look forward to seeing you at Ayomorr Cravings.`);
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Confirm Reservation';
        status.textContent = err instanceof TypeError
          ? 'Connection failed — is the server running? Start it with: npm start'
          : err.message;
        status.classList.add('error');
      }
    });
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

  // ----- Live Demo Call: actually talk to Cindy via the Web Speech API -----
  const demoListening = $('.demo-listening-indicator');
  const demoTranscript = $('#demoTranscript');
  const demoInputRow = $('#demoInputRow');
  const demoInputField = $('#demoInputField');
  const demoInputSend = $('#demoInputSend');

  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  const demoRec = SpeechRec ? new SpeechRec() : null;
  let demoCallActive = false;
  let demoResponding = false;

  function startDemoListening() {
    if (!demoCallActive || !demoRec) return;
    try { demoRec.start(); } catch (e) { /* already running */ }
    setDemoStatus('Listening…');
  }

  function stopDemoRecognition() {
    if (demoRec) { try { demoRec.abort(); } catch (e) {} }
  }

  function setDemoStatus(text) {
    if (demoListening) {
      demoListening.innerHTML = `<span class="listening-dot"></span> ${text}`;
    }
  }

  function speakCindy(text) {
    stopDemoRecognition();
    if (demoSpeech) {
      const safe = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
      demoSpeech.innerHTML = `<p>${safe}</p>`;
    }
    const finish = () => {
      demoResponding = false;
      if (!demoCallActive) return;
      if (demoRec) {
        startDemoListening();
      } else {
        if (demoInputRow) demoInputRow.style.display = 'flex';
        setDemoStatus('Type below to talk with Cindy');
      }
    };
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1.02;
      u.pitch = 1.05;
      u.onend = finish;
      u.onerror = finish;
      window.speechSynthesis.speak(u);
    } else {
      setTimeout(finish, 800);
    }
  }

  function replyToCindy(input) {
    const t = (input || '').toLowerCase();
    if (/(reserve|book|table|booking)/.test(t)) return 'I can take care of that! Scroll up and tap the Reservation button, fill in the details, and I will confirm your table right away.';
    if (/(takeaway|take away|order|deliver)/.test(t)) return 'We offer takeaway pickup. Tap Order Takeaway and tell me what you would like from the menu.';
    if (/(open|hour|clos)/.test(t)) return 'We are open Monday to Thursday from 9am to 10pm, Friday till 11pm, Saturday from 10am to 11pm, and Sunday from 10am to 9pm.';
    if (/(menu|food|eat|suggestion|recommend)/.test(t)) return "Tonight's crowd favourites are the jollof rice, grilled chicken, suya, and our fresh salads. What sounds good?";
    if (/(address|where|direction|location|parking)/.test(t)) return 'We are at 123 Food Street, Lagos, with free parking for our guests.';
    if (/(event|party|birthday|owambe|cater)/.test(t)) return 'We would love to host your event! Tap Plan an Event and share the details with us.';
    if (/(pay|payment|card|cash|transfer)/.test(t)) return 'We accept cash, card payments, and mobile transfers.';
    if (/(thank|thanks)/.test(t)) return 'You are most welcome! Is there anything else I can help you with?';
    if (/(bye|goodbye|see you)/.test(t)) return 'Thank you for calling Ayomorr Cravings. Have a wonderful day!';
    return 'I can help you with reservations, takeaway orders, our menu, directions, and events. You can also ask about opening hours or parking.';
  }

  async function speakCindyAI(input) {
    let reply;
    try {
      reply = await askCindyAI(input);
    } catch (err) {
      reply = replyToCindy(input);
    }
    speakCindy(reply);
  }

  function showDemoFallback() {
    stopDemoRecognition();
    if (demoInputRow) demoInputRow.style.display = 'flex';
    if (demoInputField) demoInputField.focus();
    setDemoStatus('Type below to talk with Cindy');
  }

  function submitDemoMessage(text) {
    const v = (text || '').trim();
    if (!v || !demoCallActive) return;
    stopDemoRecognition();
    demoResponding = true;
    if (demoTranscript) demoTranscript.textContent = `You: "${v}"`;
    setDemoStatus('Cindy is responding…');
    setTimeout(() => speakCindyAI(v), 200);
  }

  if (demoRec) {
    demoRec.continuous = false;
    demoRec.interimResults = false;
    demoRec.lang = 'en-US';

    demoRec.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map(r => (r.isFinal ? r[0].transcript : ''))
        .join('').trim();
      if (!transcript) return;
      demoResponding = true;
      if (demoTranscript) demoTranscript.textContent = `You: "${transcript}"`;
      setDemoStatus('Cindy is responding…');
      setTimeout(() => speakCindyAI(transcript), 250);
    };

    demoRec.onend = () => {
      if (demoCallActive && !demoResponding) startDemoListening();
    };

    demoRec.onerror = (e) => {
      if (e.error && e.error !== 'no-speech' && e.error !== 'aborted') {
        showDemoFallback();
      }
    };
  }

  demoInputSend?.addEventListener('click', () => submitDemoMessage(demoInputField?.value));
  demoInputField?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitDemoMessage(demoInputField?.value);
  });

  startDemoBtn?.addEventListener('click', () => {
    demoConnected?.classList.add('active');
    startDemoWave();
    startDemoTimer();
    startDemoBtn.style.display = 'none';
    demoCallActive = true;
    demoResponding = false;
    if (demoTranscript) demoTranscript.textContent = '';
    if (demoInputRow) demoInputRow.style.display = 'none';
    speakCindy('Welcome to Ayomorr Cravings! How can I help you today?');
  });

  endDemoBtn?.addEventListener('click', () => {
    demoCallActive = false;
    stopDemoRecognition();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    demoConnected?.classList.remove('active');
    stopDemoWave();
    clearInterval(demoInterval);
    startDemoBtn.style.display = '';
    if (demoSpeech) demoSpeech.innerHTML = '<p>"Welcome to Ayomorr Cravings! How can I help you today?"</p>';
    if (demoInputRow) demoInputRow.style.display = 'none';
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
    const action = new URLSearchParams(hash.split('?')[1] || '').get('action');
    if (action) setTimeout(() => startCallingAction(action), 400);
  }

});
