import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Gemini AI service for machine translations
 * Uses the Gemini-2.0-flash model to translate text from English to Arabic
 */
class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: string = "models/gemini-1.5-flash";
  private imagineModel: string = "gemini-pro-vision";
  
  constructor() {
    const apiKey = process.env.GOOGLE_API_KEY || "";
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  /**
   * Translate a single text string from English to Arabic
   * @param text The English text to translate
   * @returns Translated Arabic text
   */
  async translateToArabic(text: string): Promise<string> {
    try {
      const modelInstance = this.genAI.getGenerativeModel({ model: this.model });
      const prompt = `Please translate the following English text to Arabic. Only respond with the translation, no explanations or additional text.
      
English text: "${text}"`;

      const result = await modelInstance.generateContent(prompt);
      const response = await result.response;
      const translatedText = response.text();
      
      return translatedText.trim();
    } catch (error) {
      console.error("Error translating text with Gemini:", error);
      throw new Error(`Translation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Batch translate multiple text items from English to Arabic
   * @param items An array of texts with IDs to translate
   * @returns Array of translated items with IDs
   */
  async batchTranslateToArabic(items: Array<{id: number, text: string}>): Promise<Array<{id: number, translation: string}>> {
    try {
      const modelInstance = this.genAI.getGenerativeModel({ model: this.model });
      
      // Join all texts with a special separator to translate in a single request
      const combinedText = items.map((item, index) => `${index + 1}. ${item.text}`).join("\n");
      
      const prompt = `Please translate each of these numbered English text items to Arabic. Return only the translations, maintaining the same numbering format.

English items:
${combinedText}`;

      const result = await modelInstance.generateContent(prompt);
      const response = await result.response;
      const translatedText = response.text();
      
      // Split the response back into individual translations
      const translationLines = translatedText.split("\n").filter(line => line.trim() !== "");
      
      // Process each line to extract the translation (remove numbering)
      const translations = translationLines.map(line => {
        // Extract the text after the number and period
        const match = line.match(/^\d+\.\s*(.*)$/);
        return match ? match[1].trim() : line.trim();
      });
      
      // Ensure we have the same number of translations as inputs
      if (translations.length !== items.length) {
        throw new Error("The number of translations does not match the number of inputs");
      }
      
      // Match translations with their original IDs
      return items.map((item, index) => ({
        id: item.id,
        translation: translations[index]
      }));
    } catch (error) {
      console.error("Error batch translating with Gemini:", error);
      console.log("GOOGLE_API_KEY:", process.env.GOOGLE_API_KEY);

      throw new Error(`Batch translation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Generate an image description for Unsplash based on package overview and city
   * @param overview The package overview/description text
   * @param city The city name
   * @returns A detailed image description for travel photo generation
   */
  async generateImageDescription(overview: string, city: string): Promise<string> {
    try {
      const modelInstance = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      
      const prompt = `Create a detailed, vivid, and evocative description for a high-quality travel photograph of ${city} that captures the essence of this travel package overview:
      
      "${overview}"
      
      The description should focus on remarkable landmarks, landscape features, cultural elements, or natural beauty that would make a professional, inspirational travel image.
      
      Describe specifically what the image should show, focusing on scenery, landmarks, atmosphere, mood, lighting, colors, and composition.
      
      Format the description as a prompt for a search on Unsplash by starting with "site:unsplash.com" and including keywords that would help find this exact type of image.
      
      Do not apologize, and do not explain why you're creating this description. Just provide the search prompt.`;

      const result = await modelInstance.generateContent(prompt);
      const response = await result.response;
      const description = response.text();
      
      return description.trim();
    } catch (error) {
      console.error("Error generating image description with Gemini:", error);
      throw new Error(`Image description generation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Get a suitable image URL from Unsplash based on the package content
   * @param overview The package overview/description
   * @param city The city name
   * @returns Unsplash random image URL based on the description 
   */
  async getImageForPackage(overview: string, city: string): Promise<string> {
    try {
      // Generate a detailed description for the image search
      const imageDescription = await this.generateImageDescription(overview, city);
      
      // Extract keywords from the generated description and format for Unsplash
      const keywords = imageDescription
        .replace(/site:unsplash\.com/i, '')
        .split(/[,\s]+/)
        .filter(word => word.length > 3)
        .join(',');
      
      // Format a URL for Unsplash source with the extracted keywords
      const imageUrl = `https://source.unsplash.com/random/800x600/?${encodeURIComponent(city)},${encodeURIComponent(keywords)},travel,landmarks`;
      
      return imageUrl;
    } catch (error) {
      console.error("Error getting image for package:", error);
      // Return a fallback image if there's an error
      return `https://source.unsplash.com/random/800x600/?${encodeURIComponent(city)},travel`;
    }
  }
}

// Create and export a singleton instance
const geminiService = new GeminiService();
export default geminiService;