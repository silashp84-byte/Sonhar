import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

export const ProfileSetup = () => {
  const { user, refreshProfile } = useAuth();
  const [dreamGoal, setDreamGoal] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!dreamGoal) {
      toast.error('Qual o seu maior sonho?');
      return;
    }

    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        dreamGoal,
        bio,
        location,
        lastSeen: new Date(),
      });
      await refreshProfile();
      toast.success('Seu perfil foi iluminado!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar sua visão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col p-8 bg-zinc-950 overflow-y-auto">
      <div className="atmosphere-bg" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto w-full pt-12"
      >
        <header className="mb-12">
          <h1 className="text-4xl font-serif font-bold text-white mb-2">Defina sua Visão</h1>
          <p className="text-zinc-400">Antes de encontrar outros sonhadores, precisamos conhecer o que te move.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-dream-purple">Seu Maior Sonho</label>
            <Input 
              placeholder="Ex: Abrir uma cafeteria literária sustentável" 
              className="bg-white/5 border-white/10 h-14 text-lg focus-visible:ring-dream-purple"
              value={dreamGoal}
              onChange={(e) => setDreamGoal(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Sua História (Opcional)</label>
            <Textarea 
              placeholder="Conte um pouco sobre sua jornada..." 
              className="bg-white/5 border-white/10 min-h-[120px] focus-visible:ring-dream-purple"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Localização</label>
            <Input 
              placeholder="Sua cidade/mundo" 
              className="bg-white/5 border-white/10 h-12 focus-visible:ring-dream-purple"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-14 bg-white text-black hover:bg-zinc-100 rounded-full font-bold text-lg"
          >
            {loading ? 'Manifestando...' : 'Entrar no Mundo dos Sonhos'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};
