import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) throw new Error('Missing HF API key.');

    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'No message.' });

    const hfRes = await fetch(
      'https://api-inference.huggingface.co/models/gpt2',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: message }),
      }
    );
    const json = await hfRes.json();
    const reply = Array.isArray(json) ? json[0].generated_text : json.generated_text;
    res.status(200).json({ reply });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}

