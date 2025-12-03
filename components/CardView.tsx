import React from 'react';
import { CardData, ElementType, Rarity } from '../types';
import StatsChart from './StatsChart';
import { Flame, Droplets, Zap, Leaf, Snowflake, Tornado, Sparkles } from 'lucide-react';

interface CardViewProps {
  card: CardData;
  className?: string;
  isSmall?: boolean;
  onClick?: () => void;
  selected?: boolean;
}

const getElementColor = (element: ElementType) => {
  switch (element) {
    case ElementType.Fire: return '#ef4444'; // Red-500
    case ElementType.Water: return '#3b82f6'; // Blue-500
    case ElementType.Electric: return '#eab308'; // Yellow-500
    case ElementType.Nature: return '#22c55e'; // Green-500
    case ElementType.Frost: return '#67e8f9'; // Cyan-300
    case ElementType.Chaos: return '#a855f7'; // Purple-500
    case ElementType.Cosmic: return '#ec4899'; // Pink-500
    default: return '#94a3b8';
  }
};

const getElementIcon = (element: ElementType) => {
  switch (element) {
    case ElementType.Fire: return <Flame size={16} />;
    case ElementType.Water: return <Droplets size={16} />;
    case ElementType.Electric: return <Zap size={16} />;
    case ElementType.Nature: return <Leaf size={16} />;
    case ElementType.Frost: return <Snowflake size={16} />;
    case ElementType.Chaos: return <Tornado size={16} />;
    case ElementType.Cosmic: return <Sparkles size={16} />;
    default: return <Sparkles size={16} />;
  }
};

const getRarityBorder = (rarity: Rarity) => {
   switch (rarity) {
    case Rarity.Mythic: return 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]';
    case Rarity.Legendary: return 'border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]';
    case Rarity.UltraRare: return 'border-purple-500';
    case Rarity.SuperRare: return 'border-pink-500';
    case Rarity.Rare: return 'border-blue-400';
    case Rarity.Uncommon: return 'border-green-400';
    default: return 'border-slate-600';
   }
};

const CardView: React.FC<CardViewProps> = ({ card, className = '', isSmall = false, onClick, selected }) => {
  const primaryColor = getElementColor(card.element);
  const rarityBorder = getRarityBorder(card.rarity);
  
  if (isSmall) {
    return (
      <div 
        onClick={onClick}
        className={`relative bg-slate-900 border-2 rounded-xl p-3 cursor-pointer transition-all hover:-translate-y-1 ${selected ? 'border-white ring-2 ring-blue-500' : rarityBorder} ${className}`}
      >
        <div className="flex justify-between items-center mb-2">
           <span className="font-display font-bold text-xs truncate text-white">{card.title}</span>
           <span style={{ color: primaryColor }}>{getElementIcon(card.element)}</span>
        </div>
        <div className="w-full h-24 bg-slate-800 rounded mb-2 overflow-hidden">
          <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover opacity-80" />
        </div>
        <div className="text-[10px] text-slate-400 font-mono text-center">
          PWR: {card.stats.power} | VIB: {card.stats.vibe}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full max-w-sm aspect-[3/4] bg-slate-950 border-4 rounded-3xl p-4 flex flex-col shadow-2xl overflow-hidden transition-all ${rarityBorder} ${className}`}>
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ background: `radial-gradient(circle at center, ${primaryColor}, transparent)` }}
      />

      {/* Header */}
      <div className="flex justify-between items-center mb-3 z-10">
        <h2 className="font-display text-xl font-bold text-white tracking-wide truncate pr-2">{card.title}</h2>
        <div className="flex items-center gap-1 bg-slate-900/80 px-2 py-1 rounded-full border border-slate-700">
          <span style={{ color: primaryColor }}>{getElementIcon(card.element)}</span>
          <span className="text-xs font-bold uppercase" style={{ color: primaryColor }}>{card.element}</span>
        </div>
      </div>

      {/* Image Area */}
      <div className="relative w-full aspect-video bg-slate-900 rounded-lg border border-slate-800 overflow-hidden mb-4 group z-10">
        <img 
          src={card.imageUrl} 
          alt={card.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
          <p className="text-xs text-slate-300 italic truncate">"{card.original_text.substring(0, 50)}..."</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex-1 grid grid-cols-2 gap-2 mb-4 z-10">
        <div className="bg-slate-900/50 rounded-lg p-2 border border-slate-800 flex flex-col justify-center">
            <StatsChart stats={card.stats} color={primaryColor} />
        </div>
        <div className="flex flex-col gap-1 justify-center">
            <div className="flex justify-between text-xs font-mono text-slate-300 border-b border-slate-800 pb-1">
                <span>POWER</span> <span className="text-white font-bold">{card.stats.power}</span>
            </div>
            <div className="flex justify-between text-xs font-mono text-slate-300 border-b border-slate-800 pb-1">
                <span>VIBE</span> <span className="text-white font-bold">{card.stats.vibe}</span>
            </div>
            <div className="flex justify-between text-xs font-mono text-slate-300 border-b border-slate-800 pb-1">
                <span>CHAOS</span> <span className="text-white font-bold">{card.stats.chaos}</span>
            </div>
            <div className="flex justify-between text-xs font-mono text-slate-300">
                <span>MYSTERY</span> <span className="text-white font-bold">{card.stats.mystery}</span>
            </div>
        </div>
      </div>

      {/* Special Move */}
      <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700 z-10 mt-auto">
        <div className="flex justify-between items-baseline mb-1">
            <span className="text-sm font-bold text-white">{card.special_move.name}</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{card.rarity}</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
            {card.special_move.effect}
        </p>
      </div>
      
      {/* Footer ID */}
      <div className="absolute bottom-2 right-4 text-[9px] text-slate-600 font-mono">
        #{card.id.split('_')[2]}
      </div>
    </div>
  );
};

export default CardView;