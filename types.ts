export enum ElementType {
  Fire = 'Fire',
  Water = 'Water',
  Electric = 'Electric',
  Nature = 'Nature',
  Frost = 'Frost',
  Chaos = 'Chaos',
  Cosmic = 'Cosmic'
}

export enum Rarity {
  Common = 'Common',
  Uncommon = 'Uncommon',
  Rare = 'Rare',
  SuperRare = 'Super Rare',
  UltraRare = 'Ultra Rare',
  Legendary = 'Legendary',
  Mythic = 'Mythic'
}

export interface CardStats {
  power: number;
  vibe: number;
  chaos: number;
  mystery: number;
}

export interface SpecialMove {
  name: string;
  effect: string;
}

export interface CardData {
  id: string;
  fid?: string;
  title: string;
  element: ElementType;
  rarity: Rarity;
  stats: CardStats;
  special_move: SpecialMove;
  original_text: string;
  created_at: number;
  imageUrl?: string;
}

export interface BattleResult {
  winnerId: string;
  scoreA: number;
  scoreB: number;
  reason: string;
  log: string[];
}