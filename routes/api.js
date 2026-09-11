const express = require('express');
const router = express.Router();
const { validateContact, validateReservation, validateOrder } = require('../middleware/validate');
const { generateId, getCurrentTimestamp } = require('../utils/helpers');

// In-memory storage for demo
const contacts = [];
const reservations = [];
const orders = [];

// GET /api/health
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: getCurrentTimestamp(),
    version: '1.0.0'
  });
});

// GET /api/info
router.get('/info', (req, res) => {
  res.json({
    name: 'Ayomorr Cravings',
    phone: '+234 800 CINDY',
    email: 'hello@ayomorrcravings.com',
    instagram: '@ayomorrcravings',
    hours: {
      monday: '9:00 AM - 10:00 PM',
      tuesday: '9:00 AM - 10:00 PM',
      wednesday: '9:00 AM - 10:00 PM',
      thursday: '9:00 AM - 10:00 PM',
      friday: '9:00 AM - 11:00 PM',
      saturday: '10:00 AM - 11:00 PM',
      sunday: '10:00 AM - 9:00 PM'
    },
    location: {
      address: '123 Food Street, Lagos, Nigeria',
      coordinates: { lat: 6.5244, lng: 3.3792 }
    }
  });
});

// POST /api/contact
router.post('/contact', (req, res) => {
  const validation = validateContact(req.body);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const { name, email, subject, message } = req.body;
  const id = generateId('MSG');
  const entry = { id, name, email, subject, message, timestamp: getCurrentTimestamp() };
  contacts.push(entry);

  res.json({
    success: true,
    id,
    message: 'Thank you for contacting us! We will get back to you soon.',
    demo: true
  });
});

// POST /api/reservations
router.post('/reservations', (req, res) => {
  const validation = validateReservation(req.body);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const { name, phone, email, guests, date, time, specialRequests } = req.body;
  const id = generateId('RES');
  const entry = { id, name, phone, email, guests, date, time, specialRequests, timestamp: getCurrentTimestamp() };
  reservations.push(entry);

  res.json({
    success: true,
    id,
    message: `Reservation confirmed! Your table for ${guests} on ${date} at ${time} is reserved. Confirmation ID: ${id}`,
    confirmationId: id,
    demo: true
  });
});

// POST /api/orders
router.post('/orders', (req, res) => {
  const validation = validateOrder(req.body);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const { name, phone, items, pickupTime, specialInstructions } = req.body;
  const id = generateId('ORD');
  const entry = { id, name, phone, items, pickupTime, specialInstructions, timestamp: getCurrentTimestamp() };
  orders.push(entry);

  res.json({
    success: true,
    id,
    message: `Order placed! Pickup at ${pickupTime}. Order ID: ${id}`,
    orderId: id,
    demo: true
  });
});

// POST /api/chat — real AI responses powered by a local Ollama server
const CINDY_SYSTEM_PROMPT = `You are Cindy, the friendly AI receptionist at Ayomorr Cravings, a restaurant in Lagos, Nigeria.
Be warm, concise and natural; keep replies to 1-3 short sentences. Never invent menu items, prices, or policies you are unsure about.

Restaurant facts:
- Cuisine: West African favourites — jollof rice, grilled chicken, suya, pepper soup, fried plantain, salads.
- Hours: Monday-Thursday 9AM-10PM, Friday 9AM-11PM, Saturday 10AM-11PM, Sunday 10AM-9PM.
- Reservations: taken for up to 50 guests; events/catering available for 20+ guests.
- Takeaway: pickup only from the restaurant; delivery is coming soon.
- Payments: cash, card, and mobile transfers.
- Location: 123 Food Street, Lagos, Nigeria. Free parking available.
- Contact: phone 08165795380, email Ayomimore05@gmail.com.

If you don't know the answer, say so honestly and offer to connect the caller with a human team member.`;

router.post('/chat', async (req, res) => {
  const { message, history = [] } = req.body;
  if (!message || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
  const ollamaModel = process.env.OLLAMA_MODEL || 'llama3.2';

  const messages = [
    { role: 'system', content: CINDY_SYSTEM_PROMPT },
    ...history.slice(-8).map(h => ({
      role: h.sender === 'cindy' ? 'assistant' : 'user',
      content: h.text
    })),
    { role: 'user', content: message }
  ];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(`${ollamaUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: ollamaModel, messages, stream: false }),
      signal: controller.signal
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status}`);
    }
    res.json({
      reply: (data.message && data.message.content) ? data.message.content.trim() : 'Hmm, I lost my train of thought.',
      model: ollamaModel
    });
  } catch (err) {
    console.error('Ollama chat error:', err.message);
    res.status(502).json({ error: 'AI assistant unavailable — is Ollama running? Start it with: ollama serve' });
  } finally {
    clearTimeout(timeout);
  }
});

// GET /api/analytics
router.get('/analytics', (req, res) => {
  res.json({
    calls: { today: 24, week: 156, month: 623 },
    reservations: { today: 8, week: 52, month: 210 },
    orders: { today: 15, week: 98, month: 412 },
    avgResponseTime: '1.2s',
    satisfaction: '4.8/5',
    peakHours: ['12:00-14:00', '18:00-21:00'],
    popularItems: ['Jollof Rice Special', 'Grilled Chicken', 'Pepper Soup']
  });
});

// GET /api/faq
router.get('/faq', (req, res) => {
  res.json([
    { q: 'What are your opening hours?', a: 'We are open Monday-Thursday 9AM-10PM, Friday 9AM-11PM, Saturday 10AM-11PM, Sunday 10AM-9PM.' },
    { q: 'Do you accept reservations?', a: 'Yes! You can reserve a table through our AI assistant or by calling us directly.' },
    { q: 'Do you offer delivery?', a: 'Currently we offer pickup only. We are working on adding delivery services soon.' },
    { q: 'What payment methods do you accept?', a: 'We accept cash, card payments, and mobile transfers.' },
    { q: 'Do you cater for events?', a: 'Yes! We offer catering services for events of 20+ guests. Contact us for a quote.' },
    { q: 'Is parking available?', a: 'Yes, we have free parking for our customers.' }
  ]);
});

// GET /api/features
router.get('/features', (req, res) => {
  res.json([
    { icon: 'brain', title: 'AI-Powered', desc: 'Cindy uses advanced AI to understand and respond to your queries naturally.' },
    { icon: 'clock', title: '24/7 Available', desc: 'Available round the clock to assist you with reservations and orders.' },
    { icon: 'calendar', title: 'Easy Booking', desc: 'Book your table in seconds through natural conversation.' },
    { icon: 'utensils', title: 'Menu Orders', desc: 'Browse our menu and place orders for pickup anytime.' },
    { icon: 'phone', title: 'Voice Support', desc: 'Speak naturally with Cindy for a personalized experience.' },
    { icon: 'shield', title: 'Secure & Private', desc: 'Your data is encrypted and never shared with third parties.' }
  ]);
});

module.exports = router;
