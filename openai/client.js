// OpenAI client wrapper that supports multiple SDK shapes and degrades gracefully
const OpenAIImport = require('openai');
const dotenv = require('dotenv');
dotenv.config();

let openaiClient = null;

// Initialize client supporting both older (Configuration/OpenAIApi) and newer SDK shapes
try {
  if (OpenAIImport && OpenAIImport.Configuration && OpenAIImport.OpenAIApi) {
    const { Configuration, OpenAIApi } = OpenAIImport;
    const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
    openaiClient = new OpenAIApi(configuration);
  } else {
    // newer SDK often exports a default class
    const OpenAI = OpenAIImport.default || OpenAIImport;
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
} catch (err) {
  console.warn('OpenAI client init failed:', err && err.message ? err.message : err);
  openaiClient = null;
}

async function analyzeResume(text) {
  const prompt = `You are an expert career coach. Given the resume text below, produce a JSON object with keys: summary (1-2 short paragraphs), recommendations (array of short actionable suggestions), skillGaps (array of missing skills or areas to improve relevant to typical job descriptions), and toneSuggestions (short list).\n\nResume Text:\n${text}`;

  if (!openaiClient || !process.env.OPENAI_API_KEY) {
    const raw = `OpenAI not configured. Resume excerpt:\n${text.slice(0, 500)}`;
    return { raw, parsed: { summary: raw, recommendations: [], skillGaps: [], toneSuggestions: [] }, fullResponse: null };
  }

  try {
    // Older SDK: createCompletion
    if (typeof openaiClient.createCompletion === 'function') {
      const resp = await openaiClient.createCompletion({ model: 'text-davinci-003', prompt, max_tokens: 800, temperature: 0.2, top_p: 1 });
      const raw = resp.data?.choices?.[0]?.text?.trim() || '';
      let parsed = null;
      try {
        const jsonStart = raw.indexOf('{');
        const jsonText = jsonStart >= 0 ? raw.slice(jsonStart) : raw;
        parsed = JSON.parse(jsonText);
      } catch (e) {
        parsed = { summary: raw, recommendations: [], skillGaps: [], toneSuggestions: [] };
      }
      return { raw, parsed, fullResponse: resp.data };
    }

    // Newer SDK: responses.create
    if (openaiClient.responses && typeof openaiClient.responses.create === 'function') {
      const resp = await openaiClient.responses.create({ model: 'gpt-3.5-turbo', input: prompt, max_tokens: 800 });
      // Build raw text from response output
      let raw = '';
      if (resp.output && Array.isArray(resp.output)) {
        raw = resp.output.map(o => (typeof o === 'string' ? o : (o.content || []).map(c => c.text || '').join(' '))).join(' ');
      } else if (resp.output_text) {
        raw = resp.output_text;
      }
      raw = (raw || '').trim();
      let parsed = null;
      try {
        const jsonStart = raw.indexOf('{');
        const jsonText = jsonStart >= 0 ? raw.slice(jsonStart) : raw;
        parsed = JSON.parse(jsonText);
      } catch (e) {
        parsed = { summary: raw, recommendations: [], skillGaps: [], toneSuggestions: [] };
      }
      return { raw, parsed, fullResponse: resp };
    }

    // Unknown client shape
    const fallback = `OpenAI client present but unsupported SDK shape. Resume excerpt:\n${text.slice(0, 500)}`;
    return { raw: fallback, parsed: { summary: fallback, recommendations: [], skillGaps: [], toneSuggestions: [] }, fullResponse: null };
  } catch (err) {
    console.error('OpenAI analyze error:', err && err.message ? err.message : err);
    const raw = `OpenAI error: ${err && err.message ? err.message : String(err)}`;
    return { raw, parsed: { summary: raw, recommendations: [], skillGaps: [], toneSuggestions: [] }, fullResponse: null };
  }
}

module.exports = { analyzeResume };
