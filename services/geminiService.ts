import { GoogleGenAI, Type, Schema } from "@google/genai";
import { CardData, ElementType, Rarity, BattleResult } from "../types";

// Ensure API Key is present
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const modelName = "gemini-2.5-flash";

// Schema for Card Generation
const cardSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A creative name for the card based on the text. Max 25 chars." },
    element: { 
      type: Type.STRING, 
      enum: ["Fire", "Water", "Electric", "Nature", "Frost", "Chaos", "Cosmic"],
      description: "The elemental type of the card."
    },
    rarity: { 
      type: Type.STRING, 
      enum: ["Common", "Uncommon", "Rare", "Super Rare", "Ultra Rare", "Legendary", "Mythic"],
      description: "Rarity based on the uniqueness or intensity of the text."
    },
    stats: {
      type: Type.OBJECT,
      properties: {
        power: { type: Type.INTEGER, description: "Raw strength (0-100)" },
        vibe: { type: Type.INTEGER, description: "Coolness/Aura (0-100)" },
        chaos: { type: Type.INTEGER, description: "Unpredictability (0-100)" },
        mystery: { type: Type.INTEGER, description: "Enigma factor (0-100)" },
      },
      required: ["power", "vibe", "chaos", "mystery"]
    },
    special_move: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "Name of the move" },
        effect: { type: Type.STRING, description: "Short description of what the move does" }
      },
      required: ["name", "effect"]
    }
  },
  required: ["title", "element", "rarity", "stats", "special_move"]
};

// Schema for Battle Judgment
const battleSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    winnerId: { type: Type.STRING, description: "The ID of the winning card (either cardA or cardB)" },
    scoreA: { type: Type.INTEGER, description: "Calculated score for Card A" },
    scoreB: { type: Type.INTEGER, description: "Calculated score for Card B" },
    reason: { type: Type.STRING, description: "A dramatic, short explanation of why the winner won." },
    log: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "3-4 short sentences describing the flow of the battle." 
    }
  },
  required: ["winnerId", "scoreA", "scoreB", "reason", "log"]
};

export const generateCardFromText = async (text: string, fid?: string): Promise<CardData> => {
  if (!apiKey) throw new Error("API Key missing");

  const prompt = `
    Generate a 'Cast Pokémon' collectible card based on this social media post/cast:
    "${text}"
    
    Be creative, funny, and thematic. Map the tone of the text to the stats and element.
    If the text is aggressive, use Fire/Chaos. If chill, use Nature/Water.
    The title should be catchy.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: cardSchema,
        temperature: 0.7,
      }
    });

    const json = JSON.parse(response.text || "{}");
    
    // Generate a consistent ID
    const uniqueId = `card_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Construct the full card object
    return {
      id: uniqueId,
      fid: fid || 'anon',
      title: json.title,
      element: json.element as ElementType,
      rarity: json.rarity as Rarity,
      stats: json.stats,
      special_move: json.special_move,
      original_text: text,
      created_at: Date.now(),
      // Use picsum with a consistent seed based on uniqueId for a pseudo-deterministic image
      imageUrl: `https://picsum.photos/seed/${uniqueId}/400/300` 
    };
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error("Failed to generate card from the ether.");
  }
};

export const judgeBattle = async (cardA: CardData, cardB: CardData): Promise<BattleResult> => {
  if (!apiKey) throw new Error("API Key missing");

  const prompt = `
    Simulate a battle between two cards.
    
    CARD A:
    ${JSON.stringify(cardA)}
    
    CARD B:
    ${JSON.stringify(cardB)}
    
    Rules:
    1. Calculate a base score: Sum of all stats (power+vibe+chaos+mystery).
    2. Apply Multipliers:
       - Rarity: Common (1x), Uncommon (1.1x), Rare (1.2x), Super Rare (1.3x), Ultra Rare (1.4x), Legendary (1.5x), Mythic (2.0x).
       - Element Advantage: Fire>Nature, Nature>Water, Water>Fire, Electric>Water, Frost>Nature, Chaos>Cosmic, Cosmic>Chaos. (Add 15% bonus for advantage).
    3. Determine winner based on final score.
    4. Provide a dramatic battle log.
    
    Return the result JSON with winnerId being either "${cardA.id}" or "${cardB.id}".
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: battleSchema,
        temperature: 0.5, // Lower temperature for more consistent rule following
      }
    });

    return JSON.parse(response.text || "{}") as BattleResult;
  } catch (error) {
    console.error("Battle Judgment Error:", error);
    throw new Error("The arbiter could not decide the fate of this battle.");
  }
};