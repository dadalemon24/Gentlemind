import { GoogleGenAI } from "@google/genai";
import { Mood, Language } from "../types";
import { FALLBACK_QUOTES, POST_SESSION_MESSAGES } from "../constants";

let genAI: GoogleGenAI | null = null;

if (process.env.API_KEY) {
  genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const generateWisdomCard = async (
  mood: Mood,
  lang: Language
): Promise<string> => {
  if (!genAI) {
    return "API Key not configured. Please add your API_KEY.";
  }

  const languageName = lang === "th" ? "Thai (ภาษาไทย)" : "English";

  try {
    const prompt = `
      You are a psychology and mindfulness expert.
      The user is feeling: "${mood}".
      Please create a short "Wisdom Card" or mindfulness quote (max 2 sentences) in ${languageName}.
      It should provide encouragement, perspective, or a grounding thought suitable for this emotion.
      Do not include quotation marks. Just the text.
    `;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return (
      response.text ||
      (lang === "th"
        ? "ขอให้วันนี้เป็นวันที่ดีของคุณ"
        : "May you have a wonderful day.")
    );
  } catch (error) {
    console.error("Gemini Error:", error);
    // Fallback based on language
    const fallback = FALLBACK_QUOTES[lang] as any;
    return fallback[mood] || fallback.default;
  }
};

export const generateMeditationScript = async (
  mood: Mood,
  durationMinutes: number,
  lang: Language
): Promise<string> => {
  const defaultText =
    lang === "th"
      ? "หายใจเข้า... รู้สึกผ่อนคลาย หายใจออก... ปล่อยวางความกังวล"
      : "Breathe in... feel relaxed. Breathe out... let go of worries.";

  if (!genAI) return defaultText;

  const languageName = lang === "th" ? "Thai (ภาษาไทย)" : "English";

  try {
    const prompt = `
      Write a short Guided Meditation Script in ${languageName}.
      For a user feeling: "${mood}"
      Duration: ${durationMinutes} minutes.
      
      Structure:
      1. Start with relaxation and posture.
      2. Breathing technique or visualization suitable for the emotion "${mood}".
      3. Closing affirmation.
      
      Tone: Gentle, soothing, like a kind friend or teacher.
      Length: 3-4 short paragraphs.
    `;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || defaultText;
  } catch (error) {
    console.error("Gemini Error:", error);
    return defaultText;
  }
};

export const generatePostSessionMessage = async (
  mood: Mood,
  lang: Language
): Promise<string> => {
  const defaultText = POST_SESSION_MESSAGES[lang];
  if (!genAI) return defaultText;

  const languageName = lang === "th" ? "Thai (ภาษาไทย)" : "English";

  try {
    const prompt = `
          The user has just finished a meditation session. They were feeling "${mood}" before starting.
          Write a warm, healing, and encouraging message (max 2-3 sentences) in ${languageName} to congratulate them and give them a final positive thought to carry on with their day.
          Tone: Very kind, soft, healing, like a supportive hug.
          Do not use quotation marks.
        `;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || defaultText;
  } catch (error) {
    console.error("Gemini Error:", error);
    return defaultText;
  }
};
