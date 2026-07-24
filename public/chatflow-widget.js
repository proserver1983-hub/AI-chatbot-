(function () {
  // ChatFlow AI Chatbot Embed Widget
  // Usage: <script src="http://localhost:3000/chatflow-widget.js" bot-id="bot-apex"></script>

  // Find the script element to extract the bot-id attribute
  const scriptTag = document.currentScript || (function() {
    const scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  const botId = scriptTag ? scriptTag.getAttribute('bot-id') : 'bot-apex';
  const apiHost = scriptTag ? new URL(scriptTag.src).origin : 'http://localhost:3000';

  console.log('ChatFlow Widget Initialized with Bot ID:', botId, 'API Host:', apiHost);

  // Default config that will be updated when we fetch chatbot settings
  let config = {
    name: "ChatFlow Assistant",
    avatar: "🤖",
    brandColor: "#6366f1",
    welcomeMessage: "Hello! How can I help you today?",
    personality: "Professional and polite.",
    businessInfo: "AI Chatbot Platform",
    faqs: [],
    themeMode: "light",
    launcherIcon: "🤖"
  };

  let chatHistory = [];

  // Create Stylesheet
  const style = document.createElement('style');
  style.innerHTML = `
    #chatflow-widget-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    
    /* Toggle Button */
    .chatflow-launcher {
      width: 60px;
      height: 60px;
      border-radius: 30px;
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    .chatflow-launcher:hover {
      transform: scale(1.08) rotate(5deg);
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
    }
    
    .chatflow-launcher svg {
      width: 28px;
      height: 28px;
      fill: #ffffff;
      transition: transform 0.2s ease;
    }
    
    .chatflow-launcher.active svg {
      transform: rotate(90deg) scale(0.85);
    }

    /* Floating Bubble Notification */
    .chatflow-ping {
      position: absolute;
      top: -2px;
      right: -2px;
      width: 14px;
      height: 14px;
      background-color: #ef4444;
      border: 2px solid #ffffff;
      border-radius: 50%;
      animation: chatflow-pulse 2s infinite;
    }

    @keyframes chatflow-pulse {
      0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
      70% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
      100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }
    
    /* Chat window wrapper */
    .chatflow-window {
      position: absolute;
      bottom: 76px;
      right: 0;
      width: 380px;
      height: 560px;
      max-height: calc(100vh - 120px);
      background-color: #0d1117;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      opacity: 0;
      transform: translateY(20px) scale(0.95);
      pointer-events: none;
      transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
    }
    
    .chatflow-window.active {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }
    
    /* Header */
    .chatflow-header {
      padding: 16px;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    
    .chatflow-bot-profile {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .chatflow-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }
    
    .chatflow-bot-details {
      display: flex;
      flex-direction: column;
    }
    
    .chatflow-bot-name {
      font-weight: 600;
      font-size: 15px;
      margin: 0;
    }
    
    .chatflow-status {
      font-size: 11px;
      color: #10b981;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .chatflow-status-dot {
      width: 6px;
      height: 6px;
      background-color: #10b981;
      border-radius: 50%;
      display: inline-block;
    }
    
    .chatflow-close {
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.6);
      cursor: pointer;
      font-size: 20px;
      padding: 4px;
    }
    
    /* Messages */
    .chatflow-messages-area {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background-color: #090d12;
    }
    
    .chatflow-msg-row {
      display: flex;
      width: 100%;
    }
    
    .chatflow-msg-row.user {
      justify-content: flex-end;
    }
    
    .chatflow-bubble {
      max-width: 80%;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 13.5px;
      line-height: 1.45;
      color: #e2e8f0;
      word-wrap: break-word;
    }
    
    .chatflow-bubble.bot {
      background-color: #1f2937;
      border-bottom-left-radius: 2px;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .chatflow-bubble.user {
      color: #ffffff;
      border-bottom-right-radius: 2px;
    }

    /* Typing indicator */
    .chatflow-typing {
      display: flex;
      gap: 4px;
      padding: 6px 10px;
      align-items: center;
    }

    .chatflow-typing span {
      width: 6px;
      height: 6px;
      background-color: #9ca3af;
      border-radius: 50%;
      animation: chatflow-typing-wave 1.2s infinite ease-in-out;
    }

    .chatflow-typing span:nth-child(2) { animation-delay: 0.2s; }
    .chatflow-typing span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes chatflow-typing-wave {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }
    
    /* Input Form */
    .chatflow-input-form {
      padding: 12px;
      background-color: #0d1117;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      gap: 8px;
      align-items: center;
    }
    
    .chatflow-input {
      flex: 1;
      background-color: #161b22;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 10px 12px;
      color: #ffffff;
      font-size: 13px;
      outline: none;
      transition: border-color 0.2s ease;
    }
    
    .chatflow-input:focus {
      border-color: var(--brand-color, #4f46e5);
    }
    
    .chatflow-send-btn {
      background-color: var(--brand-color, #4f46e5);
      border: none;
      border-radius: 8px;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #ffffff;
      transition: transform 0.1s ease;
    }
    
    .chatflow-send-btn:active {
      transform: scale(0.92);
    }
    
    /* Powered By Footer */
    .chatflow-footer {
      text-align: center;
      padding: 6px;
      background-color: #090d12;
      border-top: 1px solid rgba(255, 255, 255, 0.03);
      font-size: 10px;
      color: rgba(255, 255, 255, 0.35);
    }
    
    .chatflow-footer a {
      color: inherit;
      text-decoration: none;
      font-weight: 600;
    }
    .chatflow-footer a:hover {
      color: var(--brand-color, #4f46e5);
    }

    /* Mobile Responsive adjustments */
    @media (max-width: 450px) {
      #chatflow-widget-container {
        bottom: 16px;
        right: 16px;
      }
      .chatflow-window {
        width: calc(100vw - 32px);
        height: calc(100vh - 100px);
        bottom: 72px;
      }
    }
  `;
  document.head.appendChild(style);

  // HTML Structure
  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'chatflow-widget-container';
  widgetContainer.innerHTML = `
    <!-- Launcher -->
    <div class="chatflow-launcher" id="chatflow-launcher-btn">
      <div class="chatflow-ping"></div>
      <div id="launcher-icon-container" style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
        <svg viewBox="0 0 24 24" id="launcher-open-icon" style="width: 28px; height: 28px; fill: #ffffff;">
          <path d="M12 2C6.477 2 2 6.134 2 11.235c0 2.805 1.34 5.313 3.447 7.02l-.847 3.327c-.082.321.218.608.528.508l3.774-1.22c1.01.248 2.073.385 3.102.385 5.523 0 10-4.134 10-9.235C22 6.134 17.523 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/>
        </svg>
      </div>
      <svg viewBox="0 0 24 24" id="launcher-close-icon" style="display: none; width: 22px; height: 22px; fill: #ffffff;">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
      </svg>
    </div>

    <!-- Chat Window -->
    <div class="chatflow-window" id="chatflow-window-panel">
      <!-- Header -->
      <div class="chatflow-header" id="chatflow-header-bg">
        <div class="chatflow-bot-profile">
          <div class="chatflow-avatar" id="chatflow-avatar-icon">🤖</div>
          <div class="chatflow-bot-details">
            <h4 class="chatflow-bot-name" id="chatflow-bot-title">ChatFlow Agent</h4>
            <span class="chatflow-status">
              <span class="chatflow-status-dot"></span>
              online
            </span>
          </div>
        </div>
        <button class="chatflow-close" id="chatflow-close-btn">&times;</button>
      </div>

      <!-- Messages Area -->
      <div class="chatflow-messages-area" id="chatflow-messages-container">
        <!-- Messages appended dynamically -->
      </div>

      <!-- Input Form -->
      <form class="chatflow-input-form" id="chatflow-msg-form">
        <input type="text" class="chatflow-input" id="chatflow-msg-input" placeholder="Ask anything..." autoComplete="off" />
        <button type="submit" class="chatflow-send-btn" id="chatflow-send-btn-icon">
          <svg viewBox="0 0 24 24" style="width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>

      <!-- Footer -->
      <div class="chatflow-footer">
        Powered by <a href="${apiHost}" target="_blank">ChatFlow AI</a>
      </div>
    </div>
  `;

  document.body.appendChild(widgetContainer);

  // Element Cache
  const launcherBtn = document.getElementById('chatflow-launcher-btn');
  const chatWindow = document.getElementById('chatflow-window-panel');
  const openIcon = document.getElementById('launcher-open-icon');
  const closeIcon = document.getElementById('launcher-close-icon');
  const closeBtn = document.getElementById('chatflow-close-btn');
  const msgForm = document.getElementById('chatflow-msg-form');
  const msgInput = document.getElementById('chatflow-msg-input');
  const messagesContainer = document.getElementById('chatflow-messages-container');
  const pingEl = launcherBtn.querySelector('.chatflow-ping');

  // DOM Setters
  const botTitle = document.getElementById('chatflow-bot-title');
  const avatarIcon = document.getElementById('chatflow-avatar-icon');
  const headerBg = document.getElementById('chatflow-header-bg');
  const sendBtnIcon = document.getElementById('chatflow-send-btn-icon');

  // Load custom configurations from local storage chatbots if they are previewing on same domain
  function loadLocalSettings() {
    try {
      const saved = localStorage.getItem('chatflow_chatbots');
      if (saved) {
        const bots = JSON.parse(saved);
        const currentBot = bots.find(b => b.id === botId || b.clientId === botId);
        if (currentBot) {
          config = {
            name: currentBot.name,
            avatar: currentBot.avatar || "🤖",
            brandColor: currentBot.brandColor || "#6366f1",
            welcomeMessage: currentBot.welcomeMessage || "Hello!",
            personality: currentBot.personality,
            businessInfo: currentBot.businessInfo,
            faqs: currentBot.faqs || [],
            themeMode: currentBot.themeMode || "light",
            launcherIcon: currentBot.launcherIcon || "🤖"
          };
          applyConfig();
          return;
        }
      }
    } catch (e) {
      console.log('No local storage settings accessible (cross-domain):', e);
    }

    // Default configuration loader - fetch from SaaS API if needed, or fallback
    applyConfig();
  }

  function applyConfig() {
    // Inject Custom Variables
    document.documentElement.style.setProperty('--brand-color', config.brandColor);
    
    // Update Theme Mode
    if (config.themeMode === 'dark' || (config.themeMode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      chatWindow.style.backgroundColor = '#0d1117';
      messagesContainer.style.backgroundColor = '#090d12';
      chatWindow.style.color = '#ffffff';
    } else {
      chatWindow.style.backgroundColor = '#ffffff';
      messagesContainer.style.backgroundColor = '#f8fafc';
      chatWindow.style.color = '#0f172a';
    }

    // Update Launcher Icon
    const iconContainer = document.getElementById('launcher-icon-container');
    if (iconContainer) {
      if (config.launcherIcon && config.launcherIcon !== '🤖') {
        iconContainer.innerHTML = `<span style="font-size: 28px;">${config.launcherIcon}</span>`;
      } else {
        iconContainer.innerHTML = `<svg viewBox="0 0 24 24" style="width: 28px; height: 28px; fill: #ffffff;"><path d="M12 2C6.477 2 2 6.134 2 11.235c0 2.805 1.34 5.313 3.447 7.02l-.847 3.327c-.082.321.218.608.528.508l3.774-1.22c1.01.248 2.073.385 3.102.385 5.523 0 10-4.134 10-9.235C22 6.134 17.523 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/></svg>`;
      }
    }

    // Update Header Text & Colors
    if (botTitle) botTitle.innerText = config.name;
    if (avatarIcon) avatarIcon.innerText = config.avatar;
    if (headerBg) headerBg.style.background = `linear-gradient(135deg, ${config.brandColor} 0%, rgba(13, 17, 23, 0.95) 100%)`;
    if (sendBtnIcon) sendBtnIcon.style.backgroundColor = config.brandColor;

    // Set Welcome message
    if (chatHistory.length === 0) {
      addMessage('bot', config.welcomeMessage);
    }
  }

  function toggleWindow() {
    const isActive = chatWindow.classList.contains('active');
    if (isActive) {
      chatWindow.classList.remove('active');
      openIcon.style.display = 'block';
      closeIcon.style.display = 'none';
    } else {
      chatWindow.classList.add('active');
      openIcon.style.display = 'none';
      closeIcon.style.display = 'block';
      if (pingEl) pingEl.style.display = 'none'; // Clear ping indicator when opened
      
      // Focus input
      setTimeout(() => msgInput.focus(), 200);
    }
  }

  function addMessage(sender, text) {
    const row = document.createElement('div');
    row.className = `chatflow-msg-row ${sender}`;
    
    const bubble = document.createElement('div');
    bubble.className = `chatflow-bubble ${sender}`;
    bubble.innerText = text;

    if (sender === 'user') {
      bubble.style.backgroundColor = config.brandColor;
      bubble.style.color = '#ffffff';
    } else {
      // Bot bubble theme adjustments
      if (config.themeMode === 'light' || (config.themeMode === 'auto' && !window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        bubble.style.backgroundColor = '#ffffff';
        bubble.style.color = '#0f172a';
        bubble.style.border = '1px solid #e2e8f0';
      } else {
        bubble.style.backgroundColor = '#1f2937';
        bubble.style.color = '#e2e8f0';
        bubble.style.border = '1px solid rgba(255, 255, 255, 0.05)';
      }
    }

    row.appendChild(bubble);
    messagesContainer.appendChild(row);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    chatHistory.push({ sender, text });
  }

  function addTypingIndicator() {
    const row = document.createElement('div');
    row.className = 'chatflow-msg-row bot';
    row.id = 'chatflow-typing-indicator';
    
    const bubble = document.createElement('div');
    bubble.className = 'chatflow-bubble bot chatflow-typing';
    
    if (config.themeMode === 'light' || (config.themeMode === 'auto' && !window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      bubble.style.backgroundColor = '#ffffff';
      bubble.style.border = '1px solid #e2e8f0';
    } else {
      bubble.style.backgroundColor = '#1f2937';
      bubble.style.border = '1px solid rgba(255, 255, 255, 0.05)';
    }

    bubble.innerHTML = '<span></span><span></span><span></span>';
    
    row.appendChild(bubble);
    messagesContainer.appendChild(row);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('chatflow-typing-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  async function handleSend(e) {
    e.preventDefault();
    const text = msgInput.value.trim();
    if (!text) return;

    msgInput.value = '';
    addMessage('user', text);

    // Show Typing Indicator
    addTypingIndicator();

    try {
      // Call Server-side API Route
      const response = await fetch(`${apiHost}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          chatbotId: botId,
          businessInfo: config.businessInfo,
          faqs: config.faqs,
          personality: config.personality
        })
      });

      removeTypingIndicator();

      if (response.ok) {
        const data = await response.json();
        addMessage('bot', data.reply);

        // Capture Leads dynamically if email/phone detected and sync to local storage/API
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const phoneRegex = /(\+?\d{1,4}[-.\s]??)?(\(?\d{2,3}\)?[-.\s]??)?\d{3,4}[-.\s]??\d{4}/g;
        const emails = text.match(emailRegex);
        const phones = text.match(phoneRegex);

        if (emails || phones) {
          // Send a lead update or log it locally
          logLeadLocally(text, emails, phones);
        }
      } else {
        addMessage('bot', "Apologies, I encountered a connection error. Please try again shortly.");
      }
    } catch (err) {
      console.error('Error fetching chat response:', err);
      removeTypingIndicator();
      addMessage('bot', "Apologies, I'm experiencing some difficulties reaching the server. Please check your internet connection.");
    }
  }

  function logLeadLocally(text, emails, phones) {
    try {
      const savedConvs = localStorage.getItem('chatflow_conversations');
      const email = emails ? emails[0] : '';
      const phone = phones ? phones[0] : '';
      
      let convs = [];
      if (savedConvs) {
        convs = JSON.parse(savedConvs);
      }
      
      // Look for current conversation or create one
      let currentConvIndex = convs.findIndex(c => c.chatbotId === botId && c.lead === null);
      if (currentConvIndex === -1) {
        currentConvIndex = convs.length;
        convs.push({
          id: 'conv-' + Math.random().toString(36).substring(2, 9),
          chatbotId: botId,
          clientId: 'client-apex',
          lead: null,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          browser: 'Widget Embedded Client',
          location: 'US East',
          messages: []
        });
      }

      // Extract a plausible name from the text
      const words = text.split(/[\s,]+/);
      let name = "Captured Lead";
      const capitalizedWords = words.filter(w => w && w[0] === w[0].toUpperCase() && !w.includes('@') && isNaN(Number(w)));
      if (capitalizedWords.length > 0) {
        name = capitalizedWords.slice(0, 2).join(" ");
      }

      convs[currentConvIndex].lead = { name, email, phone };
      localStorage.setItem('chatflow_conversations', JSON.stringify(convs));
      console.log('Lead logged successfully for Bot ID:', botId);
    } catch (e) {
      console.log('Failed to log lead locally due to cross-domain or storage limitations:', e);
    }
  }

  // Event Listeners
  launcherBtn.addEventListener('click', toggleWindow);
  closeBtn.addEventListener('click', toggleWindow);
  msgForm.addEventListener('submit', handleSend);

  // Initialize
  loadLocalSettings();
})();
