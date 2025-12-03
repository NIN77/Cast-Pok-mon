import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layout, Sparkles, Swords, History as HistoryIcon, User, PlusCircle, Trash2, Zap } from 'lucide-react';
import { CardData, BattleResult } from './types';
import * as GeminiService from './services/geminiService';
import CardView from './components/CardView';

// --- Components ---

const Navbar: React.FC = () => {
  const location = useLocation();
  const linkClass = (path: string) => 
    `flex flex-col items-center gap-1 p-2 text-xs font-medium transition-colors ${
      location.pathname === path ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
    }`;

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-slate-900/95 backdrop-blur-md border-t border-slate-800 z-50 px-6 py-2 pb-5 md:pb-2 flex justify-around md:justify-center md:gap-12 shadow-lg">
      <Link to="/" className={linkClass('/')}>
        <PlusCircle size={24} />
        <span>Create</span>
      </Link>
      <Link to="/collection" className={linkClass('/collection')}>
        <Layout size={24} />
        <span>Deck</span>
      </Link>
      <Link to="/battle" className={linkClass('/battle')}>
        <Swords size={24} />
        <span>Battle</span>
      </Link>
    </nav>
  );
};

const CreatePage: React.FC<{ onCardCreated: (card: CardData) => void }> = ({ onCardCreated }) => {
  const [text, setText] = useState('');
  const [fid, setFid] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedCard, setGeneratedCard] = useState<CardData | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError('');
    setGeneratedCard(null);

    try {
      const card = await GeminiService.generateCardFromText(text, fid);
      setGeneratedCard(card);
      onCardCreated(card);
    } catch (err) {
      setError("Failed to conjure card. The ether is cloudy.");
    } finally {
      setLoading(false);
    }
  };

  const sampleTexts = [
    "Just minted my first NFT and it feels like the future.",
    "Why is everyone arguing about block size? Can't we just build cool stuff?",
    "Coffee machine broke. Chaos reigns. Send help.",
    "The stars aligned perfectly tonight. Cosmic energy flowing."
  ];

  const fillRandom = () => {
    setText(sampleTexts[Math.floor(Math.random() * sampleTexts.length)]);
  };

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto w-full pt-8 pb-24 px-4">
      <div className="text-center mb-8">
        <h1 className="font-display text-4xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
          Cast Pokémon
        </h1>
        <p className="text-slate-400 text-sm">Turn your thoughts into battle cards.</p>
      </div>

      <div className="w-full bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl mb-8">
        <form onSubmit={handleGenerate} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Farcaster ID (Optional)</label>
            <input 
              type="text" 
              value={fid}
              onChange={(e) => setFid(e.target.value)}
              placeholder="e.g. 12345"
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Cast Text</label>
            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's on your mind? The AI will forge it into a card..."
              className="w-full h-24 bg-slate-950 border border-slate-800 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          
          <div className="flex gap-2">
            <button 
              type="button" 
              onClick={fillRandom}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 rounded-lg transition-colors text-sm"
            >
              Randomize
            </button>
            <button 
              type="submit" 
              disabled={loading || !text}
              className={`flex-[2] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-wait' : ''}`}
            >
              {loading ? (
                <Sparkles className="animate-spin" /> 
              ) : (
                <>
                  <Zap size={18} />
                  <span>Generate Card</span>
                </>
              )}
            </button>
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </form>
      </div>

      {generatedCard && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardView card={generatedCard} />
        </div>
      )}
    </div>
  );
};

const CollectionPage: React.FC<{ cards: CardData[], onDelete: (id: string) => void }> = ({ cards, onDelete }) => {
  return (
    <div className="w-full max-w-4xl mx-auto pt-8 pb-24 px-4">
      <h2 className="font-display text-2xl text-white mb-6 flex items-center gap-2">
        <HistoryIcon /> Card Deck <span className="text-slate-500 text-sm font-sans font-normal">({cards.length})</span>
      </h2>

      {cards.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
          <p className="text-slate-400 mb-4">No cards found in your deck.</p>
          <Link to="/" className="text-blue-400 hover:text-blue-300 font-semibold">Generate your first card</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cards.map(card => (
            <div key={card.id} className="relative group">
              <CardView card={card} isSmall />
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(card.id);
                }}
                className="absolute top-2 right-2 bg-red-500/80 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const BattlePage: React.FC<{ cards: CardData[] }> = ({ cards }) => {
  const [cardA, setCardA] = useState<CardData | null>(null);
  const [cardB, setCardB] = useState<CardData | null>(null);
  const [result, setResult] = useState<BattleResult | null>(null);
  const [battling, setBattling] = useState(false);
  const [selectMode, setSelectMode] = useState<'A' | 'B' | null>(null);

  const startBattle = async () => {
    if (!cardA || !cardB) return;
    setBattling(true);
    setResult(null);
    try {
      const res = await GeminiService.judgeBattle(cardA, cardB);
      setResult(res);
    } catch (e) {
      alert("Battle simulation failed.");
    } finally {
      setBattling(false);
    }
  };

  const handleCardSelect = (card: CardData) => {
    if (selectMode === 'A') setCardA(card);
    if (selectMode === 'B') setCardB(card);
    setSelectMode(null);
    setResult(null);
  };

  if (selectMode) {
    return (
      <div className="pt-6 pb-24 px-4 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-display text-white">Select Combatant {selectMode}</h2>
          <button onClick={() => setSelectMode(null)} className="text-slate-400 hover:text-white">Cancel</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map(c => (
             <div key={c.id} onClick={() => handleCardSelect(c)}>
                <CardView card={c} isSmall className="hover:ring-2 ring-blue-500" />
             </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center pt-8 pb-24 px-4 w-full max-w-5xl mx-auto">
      <h1 className="font-display text-3xl text-white mb-8 text-center"><span className="text-red-500">Battle</span> Arena</h1>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full mb-8">
        {/* Fighter A */}
        <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
          {cardA ? (
            <div className="relative w-full flex justify-center">
                <div className="transform scale-90 md:scale-100 origin-top">
                  <CardView card={cardA} />
                </div>
                <button 
                  onClick={() => setSelectMode('A')} 
                  className="absolute top-0 right-10 bg-slate-800 text-xs px-2 py-1 rounded text-white border border-slate-600"
                >
                  Change
                </button>
            </div>
          ) : (
            <button 
              onClick={() => setSelectMode('A')}
              className="w-full aspect-[3/4] max-w-xs border-2 border-dashed border-slate-700 rounded-3xl flex flex-col items-center justify-center text-slate-500 hover:bg-slate-900 transition-colors"
            >
              <PlusCircle size={48} className="mb-2" />
              <span className="font-display">Select Card A</span>
            </button>
          )}
        </div>

        {/* VS Badge */}
        <div className="md:mt-0 flex flex-col items-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center font-display font-black text-2xl text-white shadow-[0_0_20px_rgba(220,38,38,0.6)] border-4 border-slate-900 z-20">
                VS
            </div>
        </div>

        {/* Fighter B */}
        <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
          {cardB ? (
             <div className="relative w-full flex justify-center">
                <div className="transform scale-90 md:scale-100 origin-top">
                  <CardView card={cardB} />
                </div>
                <button 
                  onClick={() => setSelectMode('B')} 
                  className="absolute top-0 right-10 bg-slate-800 text-xs px-2 py-1 rounded text-white border border-slate-600"
                >
                  Change
                </button>
            </div>
          ) : (
            <button 
              onClick={() => setSelectMode('B')}
              className="w-full aspect-[3/4] max-w-xs border-2 border-dashed border-slate-700 rounded-3xl flex flex-col items-center justify-center text-slate-500 hover:bg-slate-900 transition-colors"
            >
              <PlusCircle size={48} className="mb-2" />
              <span className="font-display">Select Card B</span>
            </button>
          )}
        </div>
      </div>

      <button 
        onClick={startBattle}
        disabled={!cardA || !cardB || battling}
        className={`px-12 py-4 bg-red-600 hover:bg-red-500 text-white font-display font-bold text-xl rounded-full shadow-lg transition-all transform hover:scale-105 ${battling ? 'opacity-50' : ''}`}
      >
        {battling ? 'Fighting...' : 'FIGHT!'}
      </button>

      {result && cardA && cardB && (
        <div className="w-full max-w-2xl mt-12 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-700">
           <div className="text-center mb-6">
              <span className="text-slate-400 text-sm uppercase tracking-widest">Winner</span>
              <h3 className="text-3xl font-display font-bold text-yellow-400 mt-1">
                 {result.winnerId === cardA.id ? cardA.title : cardB.title}
              </h3>
              <p className="text-slate-300 mt-2 italic">"{result.reason}"</p>
           </div>
           
           <div className="space-y-2 mb-6 bg-black/30 p-4 rounded-lg font-mono text-sm text-slate-400 border border-slate-800/50">
              {result.log.map((line, i) => (
                  <p key={i}>&gt; {line}</p>
              ))}
           </div>

           <div className="flex justify-between items-center text-xs font-mono uppercase text-slate-500 border-t border-slate-800 pt-4">
              <div>Score A: <span className="text-white font-bold text-lg">{result.scoreA}</span></div>
              <div>Score B: <span className="text-white font-bold text-lg">{result.scoreB}</span></div>
           </div>
        </div>
      )}
    </div>
  );
};


const App: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([]);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('cast_pokemon_cards');
    if (saved) {
      try {
        setCards(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load cards");
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('cast_pokemon_cards', JSON.stringify(cards));
  }, [cards]);

  const addCard = (card: CardData) => {
    setCards(prev => [card, ...prev]);
  };

  const removeCard = (id: string) => {
    setCards(prev => prev.filter(c => c.id !== id));
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500/30">
        <Routes>
          <Route path="/" element={<CreatePage onCardCreated={addCard} />} />
          <Route path="/collection" element={<CollectionPage cards={cards} onDelete={removeCard} />} />
          <Route path="/battle" element={<BattlePage cards={cards} />} />
        </Routes>
        <Navbar />
      </div>
    </HashRouter>
  );
};

export default App;