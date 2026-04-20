import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, RefreshCw, Bookmark, X, Quote as QuoteIcon } from 'lucide-react';
import { fetchMotivationalQuotes } from './services/geminiService';
import { Quote } from './types';

// Component for a quote that floats predictably but randomly within the viewport
function FloatingQuote({ 
  quote, 
  isFavorite, 
  onToggleFavorite 
}: { 
  quote: Quote; 
  isFavorite: boolean; 
  onToggleFavorite: (q: Quote) => void;
  key?: string | number;
}) {
  const [position, setPosition] = useState({ 
    x: Math.random() * 80 + 10, 
    y: Math.random() * 80 + 10 
  });
  
  // Create a slow, floating animation path
  const duration = 15 + Math.random() * 20; // 15-35s for a full loop
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        left: [`${position.x}%`, `${(position.x + 10) % 90}%`, `${(position.x - 5) % 90}%`, `${position.x}%`],
        top: [`${position.y}%`, `${(position.y - 15) % 85}%`, `${(position.y + 10) % 85}%`, `${position.y}%`],
      }}
      transition={{ 
        opacity: { duration: 1 },
        left: { duration, repeat: Infinity, ease: "linear" },
        top: { duration: duration * 1.2, repeat: Infinity, ease: "linear" },
      }}
      className="absolute group z-10"
      style={{ width: 'min(240px, 80vw)' }}
    >
      <motion.div
        animate={{ rotate: [position.x % 10 - 5, (position.x + 5) % 10 - 5] }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="glass-card p-6 relative transition-all duration-500 group-hover:scale-105 group-hover:bg-white/10 cursor-default"
      >
        <p className="font-serif text-[18px] leading-relaxed text-white italic mb-4">
          "{quote.text}"
        </p>
        
        <div className="flex justify-between items-center mt-auto">
          <span className="text-[10px] uppercase tracking-widest text-white/50 font-sans font-medium">
            {quote.author}
          </span>
          
          <button
            onClick={() => onToggleFavorite(quote)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              isFavorite ? 'text-brand-600 bg-brand-600/10' : 'bg-white/10 text-white/60 hover:bg-brand-600/20 hover:text-brand-600'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function App() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [favorites, setFavorites] = useState<Quote[]>(() => {
    const saved = localStorage.getItem('inspira-favs');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showFavs, setShowFavs] = useState(false);

  useEffect(() => {
    loadQuotes();
  }, []);

  useEffect(() => {
    localStorage.setItem('inspira-favs', JSON.stringify(favorites));
  }, [favorites]);

  const loadQuotes = async () => {
    setIsLoading(true);
    const newQuotes = await fetchMotivationalQuotes();
    setQuotes(newQuotes);
    setIsLoading(false);
  };

  const toggleFavorite = (quote: Quote) => {
    setFavorites(prev => {
      const exists = prev.find(q => q.id === quote.id);
      if (exists) {
        return prev.filter(q => q.id !== quote.id);
      }
      return [...prev, quote];
    });
  };

  return (
    <main className="relative w-full h-screen bg-[#050505] text-white selection:bg-brand-600/30 overflow-hidden font-sans">
      {/* Background elements */}
      <div className="fixed inset-0 atmosphere z-0" />
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none mix-blend-overlay" />
      
      {/* Dynamic Floating Quotes */}
      <div className="relative w-full h-full">
        <AnimatePresence>
          {!isLoading && quotes.map((quote) => (
            <FloatingQuote 
              key={quote.id} 
              quote={quote} 
              isFavorite={favorites.some(f => f.id === quote.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </AnimatePresence>

        {isLoading && (
          <div className="flex h-full w-full items-center justify-center">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw className="w-12 h-12 text-brand-600 opacity-50" />
            </motion.div>
          </div>
        )}
      </div>

      {/* Main Overlay UI */}
      <div className="fixed top-0 left-0 w-full p-10 flex justify-between items-start z-40 pointer-events-none">
        <div className="pointer-events-auto">
          <h1 className="font-sans font-black tracking-[4px] text-[20px] uppercase opacity-80 select-none">
            Vibe<span className="text-brand-600">Flow</span>
          </h1>
        </div>
        
        <div className="flex gap-4 pointer-events-auto">
          <button 
            onClick={loadQuotes}
            disabled={isLoading}
            className="p-3 rounded-full bg-white/10 border border-white/10 hover:bg-white/20 transition-all text-white/70"
            title="Nuevas frases"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => setShowFavs(true)}
            className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-5 py-2 rounded-[100px] border border-white/10 transition-all text-white/80 relative text-[14px] font-semibold"
            title="Mis favoritas"
          >
            <div className="w-2 h-2 rounded-full bg-brand-600 shadow-[0_0_10px_#fb7185]" />
            <span>{favorites.length} FAVORITES</span>
          </button>
        </div>
      </div>

      {/* Bottom Detail */}
      <div className="fixed bottom-10 left-10 opacity-30 text-[12px] tracking-[2px] z-40 uppercase pointer-events-none">
        Scrolling moments in time
      </div>
      <div className="fixed bottom-10 right-10 w-[120px] h-[1px] bg-white/20 z-40 pointer-events-none" />

      {/* Favorites Drawer */}
      <AnimatePresence>
        {showFavs && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFavs(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-[#070B14] border-l border-white/10 z-[60] shadow-2xl p-10 overflow-y-auto backdrop-blur-xl"
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-3xl font-serif italic text-white">Favoritas</h2>
                <button 
                  onClick={() => setShowFavs(false)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white"
                >
                  <X />
                </button>
              </div>

              {favorites.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-white/10 space-y-4">
                  <Heart className="w-12 h-12 stroke-current" strokeWidth={1} />
                  <p className="text-[10px] font-sans tracking-[4px] uppercase">Vibras vacías</p>
                </div>
              ) : (
                <div className="space-y-10">
                  {favorites.map((fav) => (
                    <motion.div 
                      layout
                      key={fav.id}
                      className="border-b border-white/5 pb-8 relative group"
                    >
                      <button 
                        onClick={() => toggleFavorite(fav)}
                        className="absolute top-0 right-0 p-1 text-white/10 hover:text-brand-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <p className="font-serif text-[18px] italic text-white/90 leading-relaxed mb-3 pr-8">
                        "{fav.text}"
                      </p>
                      <span className="text-[10px] uppercase tracking-widest text-white/40">
                        {fav.author}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
