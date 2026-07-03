export async function handleAIRequest(prompt, mode) {
  if (mode === "code") {
    return {
      text:
        `// Silver AI code for: ${prompt}\n` +
        `console.log("This is custom AI-generated code for '${prompt}'");`
    };
  }

  if (mode === "texture") {
    const size = 16;
    const texture = [];
    for (let y = 0; y < size; y++) {
      const row = [];
      for (let x = 0; x < size; x++) {
        const hue = (prompt.length * 13 + x * 7 + y * 11) % 360;
        const light = 40 + ((x + y) % 4) * 5;
        row.push(`hsl(${hue}, 70%, ${light}%)`);
      }
      texture.push(row);
    }
    return {
      text: `Generated a ${size}x${size} texture for: ${prompt}`,
      texture
    };
  }

  // generic file/text mode
  return {
    text: `Silver AI response for: ${prompt}\n\n(This is where a real model would answer.)`
  };
}
