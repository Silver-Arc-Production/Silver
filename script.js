const chatWindow = document.getElementById("chatWindow");
const input = document.getElementById("input");
const sendBtn = document.getElementById("sendBtn");
const modeEl = document.getElementById("mode");

let chats = JSON.parse(localStorage.getItem("silverChats")) || [];

function renderChats() {
  chatWindow.innerHTML = "";
  chats.forEach(msg => {
    const div = document.createElement("div");
    div.className = `message ${msg.role}`;
    div.innerHTML = msg.content;
    chatWindow.appendChild(div);
  });
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

renderChats();

function saveChat(role, content) {
  chats.push({ role, content });
  localStorage.setItem("silverChats", JSON.stringify(chats));
}

sendBtn.addEventListener("click", async () => {
  const prompt = input.value.trim();
  const mode = modeEl.value;

  if (!prompt) return;

  saveChat("user", prompt);
  renderChats();

  input.value = "";
  sendBtn.disabled = true;
  sendBtn.textContent = "Thinking...";

  try {
    const res = await fetch("https://silver-ai-3ukr.onrender.com/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, mode })
    });

    const data = await res.json();

    let aiMessage = data.text;

    // Texture preview
    if (data.texture) {
      aiMessage += `<br><canvas id="previewCanvas"></canvas>`;
    }

    saveChat("ai", aiMessage);
    renderChats();

    if (data.texture) {
      const canvas = document.getElementById("previewCanvas");
      const ctx = canvas.getContext("2d");
      const size = data.texture.length;

      canvas.width = size;
      canvas.height = size;

      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          ctx.fillStyle = data.texture[y][x];
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }

  } catch (err) {
    saveChat("ai", "Error contacting Silver AI backend.");
    renderChats();
  }

  sendBtn.disabled = false;
  sendBtn.textContent = "Send";
});
