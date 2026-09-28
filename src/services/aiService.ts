import { GoogleGenAI } from '@google/genai';
import { SocialPlatform } from '../types';

let aiInstance: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  if (!aiInstance) {
    // Uses GEMINI_API_KEY from environment
    aiInstance = new GoogleGenAI();
  }
  return aiInstance;
}

export interface GeneratePostOptions {
  prompt: string;
  platforms: SocialPlatform[];
  tone?: 'professional' | 'engaging' | 'casual' | 'provocative' | 'educational' | 'storytelling';
  includeHashtags?: boolean;
  includeEmoji?: boolean;
  length?: 'short' | 'medium' | 'thread';
}

export async function generateSocialPost(options: GeneratePostOptions): Promise<string> {
  const { prompt, platforms, tone = 'engaging', includeHashtags = true, includeEmoji = true, length = 'medium' } = options;

  const platformNames = platforms.join(', ');

  const systemInstruction = `You are Postiz AI, an elite social media strategist and viral copywriter.
Create high-converting, authentic, and platform-optimized social media posts.
Strict rules:
- Respect platform tone and context (target: ${platformNames}).
- Tone: ${tone}.
- Include relevant hashtags: ${includeHashtags ? 'yes, 2-4 strategic hashtags' : 'no hashtags'}.
- Include emojis: ${includeEmoji ? 'tasteful and eye-catching emojis' : 'no emojis'}.
- Length preference: ${length}.
- For LinkedIn/X, focus on a sharp hook in the first 2 lines.
- Output ONLY the final draft ready to publish or schedule. Do NOT include markdown code blocks, metadata labels, or intros like "Here is your post:".`;

  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 1000,
      }
    });

    return response.text?.trim() || prompt;
  } catch (err: any) {
    console.error('Gemini generation error, providing smart template fallback:', err);
    // Fallback if API key is not yet set
    return `${prompt}\n\nKey takeaways:\n• Scalable architecture\n• Open source by design\n• Built for speed\n\n#socialmedia #automation #dev`;
  }
}

export async function improvePostContent(currentText: string, instruction: 'hook' | 'shorten' | 'expand' | 'fix_grammar' | 'viral'): Promise<string> {
  const instructionsMap: Record<string, string> = {
    hook: 'Rewrite only the opening hook to be 10x more captivating and stop the scroll, keep the rest intact.',
    shorten: 'Condense this copy to be ultra-punchy and direct, removing filler words while keeping core value.',
    expand: 'Expand this with 2-3 compelling bullet points and a strong call-to-action question.',
    fix_grammar: 'Polishing grammar, flow, and clarity while retaining personal tone.',
    viral: 'Rewrite with viral storytelling framework (Hook -> Conflict -> Insight -> Actionable takeaway -> CTA).',
  };

  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Original Post:\n${currentText}\n\nTask: ${instructionsMap[instruction]}`,
      config: {
        systemInstruction: 'You are an expert copy editor. Return only the revised post text with no commentary or quotes.',
        temperature: 0.6,
      }
    });

    return response.text?.trim() || currentText;
  } catch (err) {
    console.warn('AI polish error:', err);
    return currentText;
  }
}

export async function generateHashtags(text: string, platform: SocialPlatform): Promise<string[]> {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this ${platform} post and generate 5 trending, high-relevance hashtags:\n${text}`,
      config: {
        systemInstruction: 'Respond with a simple comma-separated list of hashtags like #tag1, #tag2, #tag3. No preamble.',
      }
    });

    const tags = response.text?.split(',').map(t => t.trim()).filter(t => t.startsWith('#')) || [];
    return tags.length > 0 ? tags : ['#buildinpublic', '#tech', '#trending'];
  } catch {
    return ['#buildinpublic', '#marketing', '#saas'];
  }
}
