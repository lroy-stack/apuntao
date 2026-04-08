// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// Scroll reveal animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('visible'), parseInt(delay));
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

// Animated chat
const messages = [
  { type: 'incoming', text: 'Hola! Teneis mesa para 4 el viernes a las 9?' },
  { type: 'outgoing', text: 'Hola! Si, tenemos disponibilidad el viernes 11 a las 21:00. A nombre de quien?' },
  { type: 'incoming', text: 'A nombre de Maria, gracias!' },
  { type: 'outgoing', text: 'Perfecto Maria ✅ Reserva confirmada para 4 personas el viernes 11 a las 21:00. Hasta entonces!' },
  { type: 'time', text: 'Respondido en 3 segundos · 2:47 AM' },
];

const container = document.getElementById('chatMessages');
let currentMsg = 0;
let chatRunning = false;

function showTyping() {
  const t = document.createElement('div');
  t.className = 'typing';
  t.innerHTML = '<span></span><span></span><span></span>';
  t.id = 'typing';
  container.appendChild(t);
  container.scrollTop = container.scrollHeight;
}

function hideTyping() {
  const t = document.getElementById('typing');
  if (t) t.remove();
}

function addMessage(msg, delay) {
  return new Promise(resolve => {
    setTimeout(() => {
      if (msg.type === 'outgoing') showTyping();
      setTimeout(() => {
        hideTyping();
        const el = document.createElement('div');
        el.className = 'msg ' + msg.type;
        el.textContent = msg.text;
        container.appendChild(el);
        requestAnimationFrame(() => el.classList.add('show'));
        container.scrollTop = container.scrollHeight;
        resolve();
      }, msg.type === 'outgoing' ? 900 : 0);
    }, delay);
  });
}

async function runChat() {
  if (chatRunning) return;
  chatRunning = true;
  container.innerHTML = '';
  currentMsg = 0;
  const delays = [400, 1800, 3800, 5200, 8000];
  for (let i = 0; i < messages.length; i++) {
    await addMessage(messages[i], i === 0 ? delays[0] : delays[i] - delays[i-1]);
  }
  setTimeout(() => {
    chatRunning = false;
    runChat();
  }, 4000);
}

// Start chat when hero is visible
const heroVisual = document.querySelector('.hero-visual');
const chatObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    runChat();
    chatObserver.disconnect();
  }
}, { threshold: 0.3 });
chatObserver.observe(heroVisual);
