
import { GoogleGenAI } from "@google/genai";

export const generateAdDescription = async (keywords: string): Promise<string> => {
  try {
    // Initialize the client here, so the app can load even if process.env is not defined.
    // The error will only occur when this function is called.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
      Eres un experto en marketing de motocicletas. Crea una descripción de venta atractiva, vendedora y profesional para un anuncio online.
      La descripción debe ser en español. Usa un tono entusiasta pero creíble.
      Utiliza los siguientes datos y palabras clave proporcionados por el vendedor: "${keywords}".
      
      Estructura la descripción de la siguiente manera:
      1. Un titular corto y llamativo.
      2. Un párrafo introductorio que capte el interés.
      3. Una lista de 2-3 características destacadas (usando viñetas si es apropiado).
      4. Un párrafo final que resuma por qué es una buena compra y un llamado a la acción claro (ej. "¡No dejes pasar esta oportunidad! Contáctame para verla.").
      
      No uses markdown, solo texto plano. No incluyas frases como "Aquí tienes una descripción:". Responde directamente con la descripción del anuncio.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    return response.text;
  } catch (error) {
    console.error("Error al generar la descripción con Gemini:", error);
    // Return a generic error message as per guidelines to avoid mentioning API keys to the user.
    return "Hubo un error al generar la descripción. Por favor, inténtalo de nuevo o escríbela manualmente.";
  }
};
