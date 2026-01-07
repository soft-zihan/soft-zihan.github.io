import { GoogleGenAI } from "@google/genai";

// Helper to remove the data URL prefix for the API
const stripBase64Prefix = (base64: string) => {
  return base64.replace(/^data:image\/[a-z]+;base64,/, "");
};

const getMimeType = (base64: string) => {
  const match = base64.match(/^data:(image\/[a-z]+);base64,/);
  return match ? match[1] : 'image/png';
};

export const editImageWithGemini = async (
  base64Image: string,
  prompt: string
): Promise<string> => {
  try {
    // In Vite (via vite.config.ts), we polyfilled process.env.API_KEY.
    // However, on a public GitHub Pages without a backend, this might be empty string
    // unless you set it in GitHub Secrets AND inject it during build.
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      // Return a mock error or handle gracefully so the app doesn't crash on load
      throw new Error("API Key is missing. Please set API_KEY in your environment.");
    }

    const ai = new GoogleGenAI({ apiKey });

    const modelId = 'gemini-2.5-flash-image';
    const mimeType = getMimeType(base64Image);
    const rawBase64 = stripBase64Prefix(base64Image);

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              data: rawBase64,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No response from Gemini.");
    }

    const parts = candidates[0].content.parts;
    
    for (const part of parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("Gemini did not return an image.");

  } catch (error) {
    console.error("Gemini Service Error:", error);
    throw error;
  }
};