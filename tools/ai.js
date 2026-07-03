import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function handleAIRequest(prompt, mode) {
  // Silver AI personality
  const systemPrompt = `
You are Silver AI — a custom assistant built for Atreyu.
You specialize in:
- Code generation
- Pixel textures
- File creation
- Game mod tools
- Creative technical solutions

Your style:
- Fast
- Technical
- Clean output
- No fluff
- No disclaimers
- No provider mentions
`;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Mode: ${mode}\nPrompt: ${prompt}` }
    ]
  });

  const text = completion.choices[0].message.content;

  // Route to tools
  if (mode === "texture") {
    return {
      text,
      texture: generateTexture(prompt)
    };
  }

  if (mode === "code") {
    return { text };
  }

  return { text };
}

// Silver AI’s pixel texture generator
function generateTexture(prompt) {
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

  return texture;
}
}

  // generic file/text mode
  return {
    text: `Silver AI response for: ${prompt}\n\n(This is where a real model would answer.)`
  };
}
