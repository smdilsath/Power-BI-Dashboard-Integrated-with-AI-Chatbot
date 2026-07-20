/* ── DOM refs ─────────────────────────────────────────── */
const chatBox   = document.getElementById("chat-box");
const input     = document.getElementById("user-input");
const typing    = document.getElementById("typing");
const sendBtn   = document.getElementById("send-btn");
const clearBtn  = document.getElementById("clear-btn");
const hintChips = document.querySelectorAll(".hint-chip");

/* ── Auto-grow textarea ───────────────────────────────── */
input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height = Math.min(input.scrollHeight, 100) + "px";
});

/* ── Send on Enter (Shift+Enter = newline) ────────────── */
input.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

/* ── Hint chips ───────────────────────────────────────── */
hintChips.forEach(chip => {
  chip.addEventListener("click", () => {
    input.value = chip.dataset.hint;
    input.focus();
    input.dispatchEvent(new Event("input"));
  });
});

/* ── Send button ──────────────────────────────────────── */
sendBtn.addEventListener("click", sendMessage);

/* ── Clear chat ───────────────────────────────────────── */
clearBtn.addEventListener("click", () => {
  chatBox.innerHTML = "";
  appendMsg("bot", "Chat cleared. How can I help you with your data?");
});

/* ── Helpers ──────────────────────────────────────────── */
function scrollBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showTyping(visible) {
  typing.classList.toggle("visible", visible);
  if (visible) scrollBottom();
}

function appendMsg(role, text) {
  const wrap = document.createElement("div");
  wrap.className = `msg ${role}`;

  const sender = document.createElement("span");
  sender.className = "msg-sender";
  sender.textContent = role === "user" ? "You" : "Assistant";

  const bubble = document.createElement("div");
  bubble.className = "msg-bubble";
  bubble.textContent = text;

  wrap.appendChild(sender);
  wrap.appendChild(bubble);
  chatBox.appendChild(wrap);
  scrollBottom();
  return bubble;
}

/* ── Core send function ───────────────────────────────── */
async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  appendMsg("user", message);
  input.value = "";
  input.style.height = "auto";
  showTyping(true);

  try {
    const res  = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    const data = await res.json();
    showTyping(false);
    appendMsg("bot", data.reply);
  } catch (err) {
    showTyping(false);
    appendMsg("bot", "Sorry, something went wrong. Please try again.");
  }
}