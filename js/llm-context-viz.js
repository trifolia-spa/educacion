/**
 * LLM Context Visualization - Conversation Edition
 * "Fundamentos Técnicos de IA para Abogados"
 *
 * (c) 2025 Trifolia (trifolia.cl)
 * Licensed under CC BY-NC-SA 4.0
 * https://creativecommons.org/licenses/by-nc-sa/4.0/
 *
 * Demonstrates how LLMs process the full context before generating each word
 */
(function () {
  "use strict";

  // Pre-scripted conversation - concise legal consultation (3 exchanges)
  // Demonstrates context growth, especially with file attachments
  const conversation = [
    {
      role: "user",
      content:
        "Hola, mi empleador no me ha pagado las horas extras trabajadas durante los últimos meses.",
      tokens: 22,
    },
    {
      role: "assistant",
      content:
        "Según el Código del Trabajo chileno, las horas extraordinarias deben pagarse con un recargo mínimo del 50%. Tiene derecho a reclamar el pago. Le recomiendo reunir evidencia como correos o registros de asistencia.",
      tokens: 58,
    },
    {
      role: "user",
      content: "Te adjunto los registros de acceso del edificio. ¿Sirven como prueba?",
      tokens: 600, // File adds significant tokens
      attachment: {
        name: "registros_acceso_edificio.pdf",
        tokens: 580,
      },
    },
    {
      role: "assistant",
      content:
        "Sí, los registros de acceso son muy valiosos porque son objetivos y difíciles de refutar. Puede presentar un reclamo ante la Inspección del Trabajo o iniciar una demanda laboral.",
      tokens: 48,
    },
    {
      role: "user",
      content: "¿Cuál sería el primer paso que debería tomar?",
      tokens: 12,
    },
    {
      role: "assistant",
      content:
        "Envíe una carta formal a su empleador solicitando el pago. Si no obtiene respuesta, presente una denuncia ante la Inspección del Trabajo. La mediación es gratuita y muchos casos se resuelven ahí.",
      tokens: 52,
    },
  ];

  // Configuration
  const CONTEXT_LIMIT = 1000; // Simulated context window (lowered to show dramatic progress)
  const WORD_DELAY = 40; // ms between assistant words
  const PROCESSING_STEP_DELAY = 8; // ms per word during processing animation
  const PROCESSING_STEP_DELAY_WITH_FILE = 3; // Faster sweep for more words (file content)
  const ATTACHMENT_PAUSE_PER_TOKEN = 2; // ms to pause per token when processing file attachment
  const PAUSE_AFTER_USER = 200; // ms pause after user message appears
  const PAUSE_AFTER_ASSISTANT = 600; // ms pause after assistant finishes

  // State
  let currentMessageIndex = 0;
  let totalTokens = 0;
  let isRunning = false;
  let animationComplete = false;
  let currentTimeoutId = null;
  let processingIntervalId = null;

  // DOM elements
  let chatViewport;
  let contextBarFill;
  let contextPercent;
  let btnStart;
  let btnReset;
  let explanationPanel;

  /**
   * Initialize DOM references
   */
  function initDOMReferences() {
    chatViewport = document.getElementById("chat-viewport");
    contextBarFill = document.getElementById("context-bar-fill");
    contextPercent = document.getElementById("context-percent");
    btnStart = document.getElementById("btn-start");
    btnReset = document.getElementById("btn-reset");
    explanationPanel = document.getElementById("explanation-panel");
  }

  /**
   * Update context bar visualization
   */
  function updateContextBar() {
    const percentage = Math.min((totalTokens / CONTEXT_LIMIT) * 100, 100);

    contextBarFill.style.width = percentage + "%";
    contextPercent.textContent = Math.round(percentage) + "%";

    // Update colors based on percentage
    contextBarFill.classList.remove("warning", "full");
    contextPercent.classList.remove("warning", "full");

    if (percentage >= 90) {
      contextBarFill.classList.add("full");
      contextPercent.classList.add("full");
    } else if (percentage >= 70) {
      contextBarFill.classList.add("warning");
      contextPercent.classList.add("warning");
    }
  }

  /**
   * Scroll chat viewport to bottom
   */
  function scrollToBottom() {
    chatViewport.scrollTop = chatViewport.scrollHeight;
  }

  /**
   * Get all processable elements (words and attachments) in the chat viewport
   */
  function getAllProcessableElements() {
    return chatViewport.querySelectorAll(".word, .attachment-indicator.processable");
  }

  /**
   * Clear all processing highlights
   */
  function clearProcessingHighlights() {
    const elements = getAllProcessableElements();
    elements.forEach((el) => el.classList.remove("processing"));
  }

  /**
   * Show processing animation - sweep through all words and attachments
   * @param {Function} callback - Called when animation completes
   * @param {number} stepDelay - Optional custom delay between steps (for large contexts)
   */
  function showProcessingAnimation(callback, stepDelay) {
    const elements = getAllProcessableElements();
    const totalElements = elements.length;
    const delay = stepDelay || PROCESSING_STEP_DELAY;

    if (totalElements === 0) {
      callback();
      return;
    }

    let processingIndex = 0;

    // Clear any existing interval
    if (processingIntervalId) {
      clearInterval(processingIntervalId);
    }

    function processNextElement() {
      if (processingIndex >= totalElements) {
        // Done processing - brief pause showing all highlighted, then clear and callback
        currentTimeoutId = setTimeout(() => {
          clearProcessingHighlights();
          callback();
        }, 100);
        return;
      }

      const element = elements[processingIndex];
      element.classList.add("processing");

      // Check if this is an attachment (has data-tokens attribute)
      const tokens = element.getAttribute("data-tokens");
      if (tokens) {
        // Pause proportionally to token count to show file processing
        const pauseDuration = parseInt(tokens, 10) * ATTACHMENT_PAUSE_PER_TOKEN;
        processingIndex++;
        currentTimeoutId = setTimeout(processNextElement, pauseDuration);
      } else {
        // Regular word - continue with normal delay
        processingIndex++;
        currentTimeoutId = setTimeout(processNextElement, delay);
      }
    }

    // Start processing
    processNextElement();
  }

  /**
   * Create a chat bubble element
   * @param {string} role - 'user' or 'assistant'
   * @param {Object} attachment - Optional file attachment info
   */
  function createBubble(role, attachment) {
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${role}`;

    const roleLabel = document.createElement("div");
    roleLabel.className = "role-label";
    roleLabel.textContent = role === "user" ? "Usuario" : "Asistente";

    const content = document.createElement("div");
    content.className = "content";

    bubble.appendChild(roleLabel);
    bubble.appendChild(content);

    // Add file attachment indicator if present
    if (attachment) {
      const attachmentEl = document.createElement("div");
      attachmentEl.className = "attachment-indicator processable";
      attachmentEl.setAttribute("data-tokens", attachment.tokens);
      attachmentEl.innerHTML = `
        <i class="bi bi-file-earmark-text"></i>
        <span class="attachment-name">${attachment.name}</span>
        <span class="attachment-tokens">(${attachment.tokens} tokens)</span>
      `;
      bubble.appendChild(attachmentEl);
    }

    return bubble;
  }

  /**
   * Wrap text content in word spans
   */
  function wrapWordsInSpans(text) {
    const words = text.split(" ");
    const fragment = document.createDocumentFragment();

    words.forEach((word, index) => {
      const span = document.createElement("span");
      span.className = "word";
      span.textContent = word;
      fragment.appendChild(span);

      // Add space after each word except the last
      if (index < words.length - 1) {
        fragment.appendChild(document.createTextNode(" "));
      }
    });

    return fragment;
  }

  /**
   * Add user message with processing animation
   * User messages appear as blocks, but we show the LLM "reading" all context
   */
  function addUserMessage(message, onComplete) {
    // Create bubble with optional attachment
    const bubble = createBubble("user", message.attachment);
    const content = bubble.querySelector(".content");

    // Add words wrapped in spans
    content.appendChild(wrapWordsInSpans(message.content));

    // Add bubble to viewport
    chatViewport.appendChild(bubble);
    scrollToBottom();

    // Update token count
    totalTokens += message.tokens;
    updateContextBar();

    // Determine processing delay - use faster sweep when there's a file
    // (more words to process, so faster per-word to keep total time reasonable)
    const processingDelay = message.attachment
      ? PROCESSING_STEP_DELAY_WITH_FILE
      : PROCESSING_STEP_DELAY;

    // Show processing animation (LLM reading the new user input in context)
    currentTimeoutId = setTimeout(() => {
      showProcessingAnimation(onComplete, processingDelay);
    }, PAUSE_AFTER_USER);
  }

  /**
   * Stream assistant message word by word with processing animation before each word
   */
  function streamAssistantMessage(message, onComplete) {
    const bubble = createBubble("assistant");
    const content = bubble.querySelector(".content");

    // Add cursor
    const cursor = document.createElement("span");
    cursor.className = "cursor";
    content.appendChild(cursor);

    // Add bubble to viewport
    chatViewport.appendChild(bubble);
    scrollToBottom();

    const words = message.content.split(" ");
    let wordIndex = 0;
    const tokensPerWord = message.tokens / words.length;

    function addNextWord() {
      if (!isRunning || wordIndex >= words.length) {
        // Done streaming
        if (cursor.parentNode) {
          cursor.remove();
        }
        onComplete();
        return;
      }

      // Show processing animation before adding each word
      showProcessingAnimation(() => {
        if (!isRunning) return;

        // Remove cursor temporarily
        if (cursor.parentNode) {
          cursor.remove();
        }

        // Add word span
        if (wordIndex > 0) {
          content.appendChild(document.createTextNode(" "));
        }
        const wordSpan = document.createElement("span");
        wordSpan.className = "word new";
        wordSpan.textContent = words[wordIndex];
        content.appendChild(wordSpan);

        // Re-add cursor
        content.appendChild(cursor);

        // Update tokens progressively
        totalTokens += tokensPerWord;
        updateContextBar();

        wordIndex++;
        scrollToBottom();

        // Remove 'new' class after animation
        setTimeout(() => wordSpan.classList.remove("new"), 200);

        // Schedule next word
        currentTimeoutId = setTimeout(addNextWord, WORD_DELAY);
      });
    }

    // Start streaming
    addNextWord();
  }

  /**
   * Process the next message in the conversation
   */
  function processNextMessage() {
    if (!isRunning || currentMessageIndex >= conversation.length) {
      finishConversation();
      return;
    }

    const message = conversation[currentMessageIndex];

    if (message.role === "user") {
      // User message - appears as block, then processing animation
      addUserMessage(message, () => {
        currentMessageIndex++;
        processNextMessage();
      });
    } else {
      // Assistant message - streamed word by word
      streamAssistantMessage(message, () => {
        currentMessageIndex++;
        currentTimeoutId = setTimeout(processNextMessage, PAUSE_AFTER_ASSISTANT);
      });
    }
  }

  /**
   * Start the conversation animation
   */
  function startConversation() {
    if (isRunning) return;

    isRunning = true;
    animationComplete = false;
    currentMessageIndex = 0;
    totalTokens = 0;

    // Clear previous conversation
    chatViewport.innerHTML = "";

    // Update UI
    updateContextBar();
    btnStart.disabled = true;
    btnStart.textContent = "Conversando...";
    btnReset.classList.add("visible");
    explanationPanel.style.display = "none";

    // Start processing messages
    processNextMessage();
  }

  /**
   * Finish the conversation
   */
  function finishConversation() {
    isRunning = false;
    animationComplete = true;
    btnStart.disabled = false;
    btnStart.textContent = "Reiniciar Demostracion";
  }

  /**
   * Reset to initial state
   */
  function reset() {
    // Clear any pending timeouts/intervals
    if (currentTimeoutId) {
      clearTimeout(currentTimeoutId);
      currentTimeoutId = null;
    }
    if (processingIntervalId) {
      clearInterval(processingIntervalId);
      processingIntervalId = null;
    }

    isRunning = false;
    animationComplete = false;
    currentMessageIndex = 0;
    totalTokens = 0;

    // Clear chat
    chatViewport.innerHTML = "";

    // Reset UI
    updateContextBar();
    btnStart.disabled = false;
    btnStart.textContent = "Iniciar Conversacion";
    btnReset.classList.remove("visible");
    explanationPanel.style.display = "block";
  }

  /**
   * Initialize event listeners
   */
  function initEventListeners() {
    btnStart.addEventListener("click", () => {
      if (animationComplete) {
        reset();
        startConversation();
      } else {
        startConversation();
      }
    });
    btnReset.addEventListener("click", reset);
  }

  /**
   * Initialize the visualization
   */
  function init() {
    initDOMReferences();
    initEventListeners();

    // Register with slide navigation for clicker support
    if (window.slideInteraction) {
      window.slideInteraction.register(function () {
        if (!animationComplete && !isRunning) {
          startConversation();
          return false; // Don't navigate, animation starting
        }
        return true; // Animation done, navigate to next slide
      });
    }
  }

  // Initialize on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
