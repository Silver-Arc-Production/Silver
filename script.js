const promptEl = document.getElementById("prompt");
const modeEl = document.getElementById("mode");
const sendBtn = document.getElementById("sendBtn");
const responseEl = document.getElementById("response");
const downloadBtn = document.getElementById("downloadBtn");
const textureCanvas = document.getElementById("textureCanvas");
const ctx = textureCanvas.getContext("2d");

let lastOutput = "";
let lastTextureDataUrl = null;

sendBtn.addEventListener("click", async () => {
  const prompt = promptEl.value.trim();
  const mode = modeEl.value;

  if (!prompt) {
    alert("Type something first.");
    return;
  }

  sendBtn.disabled = true;
  sendBtn.textContent = "Thinking...";

  try {
const res = await fetch("https://silver-ai-3ukr.onrender.com/ai", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt, mode })
});

    const data = await res.json();

    responseEl.textContent = data.text ?? "";
    lastOutput = data.text ?? "";

    downloadBtn.disabled = false;

    if (data.texture && Array.isArray(data.texture)) {
      const size = data.texture.length;
      textureCanvas.width = size;
      textureCanvas.height = size;

      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          ctx.fillStyle = data.texture[y][x];
          ctx.fillRect(x, y, 1, 1);
        }
      }

      lastTextureDataUrl = textureCanvas.toDataURL("image/png");
    }
  } catch (err) {
    console.error(err);
    alert("Error talking to your AI backend.");
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = "Send";
  }
});

downloadBtn.addEventListener("click", () => {
  const mode = modeEl.value;

  if (mode === "texture" && lastTextureDataUrl) {
    const a = document.createElement("a");
    a.href = lastTextureDataUrl;
    a.download = "texture.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
    return;
  }

  if (!lastOutput) return;

  const blob = new Blob([lastOutput], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = mode === "code" ? "generated.js" : "output.txt";
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
});
