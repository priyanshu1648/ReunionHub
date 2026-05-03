requireAuth();

const user = getUser();
const chatParams = new URLSearchParams(window.location.search);
const connectionId = chatParams.get("connectionId");

const chatTitle = document.getElementById("chatTitle");
const chatSubtitle = document.getElementById("chatSubtitle");
const chatConnectionMeta = document.getElementById("chatConnectionMeta");
const chatMessages = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");

function renderChatMessages(messages) {
  chatMessages.innerHTML = "";

  if (!messages.length) {
    chatMessages.innerHTML = `<div class="empty-state">No messages yet. Start the conversation.</div>`;
    return;
  }

  messages.forEach((message) => {
    const isOwn = message.sender && (message.sender._id === user.id);
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${isOwn ? "chat-own" : "chat-other"}`;
    bubble.innerHTML = `
      <strong>${escapeHtml(message.sender?.name || "User")}</strong>
      <p>${escapeHtml(message.text)}</p>
      <span>${formatDate(message.createdAt)}</span>
    `;
    chatMessages.appendChild(bubble);
  });

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function loadChat() {
  if (!connectionId) {
    chatTitle.textContent = "Chat not found";
    chatSubtitle.textContent = "Connection ID is missing.";
    return;
  }

  try {
    const data = await apiRequest(`/messages/${connectionId}`);
    const { connection, messages } = data;
    const otherPerson = user.role === "alumni" ? connection.student : connection.alumni;

    chatTitle.textContent = `Chat with ${otherPerson?.name || "Connection"}`;
    chatSubtitle.textContent =
      user.role === "alumni"
        ? "Guide and support your connected student."
        : "Reach out to your alumni connection here.";
    chatConnectionMeta.innerHTML = `
      <p><strong>Email:</strong> ${escapeHtml(otherPerson?.email || "Not shared")}</p>
      <p><strong>Institution:</strong> ${escapeHtml(otherPerson?.institution || "Not shared")}</p>
      <p><strong>Location:</strong> ${escapeHtml(otherPerson?.location || "Not shared")}</p>
    `;

    renderChatMessages(messages);
  } catch (error) {
    chatTitle.textContent = "Chat unavailable";
    chatSubtitle.textContent = error.message;
    chatForm.classList.add("hidden");
  }
}

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const text = chatInput.value.trim();
  if (!text) {
    return;
  }

  try {
    await apiRequest(`/messages/${connectionId}`, {
      method: "POST",
      body: JSON.stringify({ text }),
    });

    chatInput.value = "";
    loadChat();
  } catch (error) {
    alert(error.message);
  }
});

loadChat();
