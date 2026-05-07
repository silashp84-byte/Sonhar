import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { Sparkles, Globe, Heart, MessageCircle } from 'lucide-react';

export const LandingPage = () => {
  const { signIn } = useAuth();

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center p-8 relative overflow-hidden bg-zinc-950">
      <div className="atmosphere-bg" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10"
      >
        <span className="px-3 py-1 pb-1.5 rounded-full bg-dream-purple/20 text-dream-purple border border-dream-purple/30 text-xs font-bold tracking-widest uppercase mb-6 inline-block">
          Explore sua Visão
        </span>
        <h1 className="text-6xl font-serif font-black text-white mb-4 leading-tight">SONHAR</h1>
        <p className="text-zinc-400 text-lg mb-12 max-w-sm font-light">
          Onde conexões transcendem o casual e se tornam o combustível para seus maiores objetivos.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 mb-16 w-full max-w-xs z-10">
        <Feature icon={<Globe className="w-5 h-5" />} text="Alcance Global" />
        <Feature icon={<Heart className="w-5 h-5" />} text="Conexão Real" />
        <Feature icon={<Sparkles className="w-5 h-5" />} text="Inspiração" />
        <Feature icon={<MessageCircle className="w-5 h-5" />} text="Apoio Mútuo" />
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={signIn}
        className="w-full max-w-xs py-4 rounded-full bg-white text-black font-bold text-lg shadow-2xl shadow-blue-500/20 hover:bg-zinc-100 transition-colors z-10 flex items-center justify-center gap-3"
      >
        Começar Jornada
      </motion.button>

      <div className="absolute bottom-12 text-zinc-600 text-xs text-center z-10 uppercase tracking-widest px-8">
        Ao continuar, você aceita nossa visão de um mundo mais conectado pelos sonhos.
      </div>

      {/* Decorative Orbs */}
      <div className="absolute top-[20%] -left-20 w-64 h-64 bg-dream-purple/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[20%] -right-20 w-64 h-64 bg-dream-blue/20 blur-[120px] rounded-full" />
    </div>
  );
};

const Feature = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex flex-col items-center gap-2 p-4 rounded-3xl bg-white/5 border border-white/10 glass-card">
    <div className="text-dream-purple">{icon}</div>
    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-300">{text}</span>
  </div>
);
