import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { MapPin, LogOut, Edit2, Star, Target } from 'lucide-react';
import { motion } from 'motion/react';

export const ProfileView = () => {
  const { profile, logOut } = useAuth();

  if (!profile) return null;

  return (
    <div className="h-full w-full overflow-y-auto space-y-6 pb-20 max-w-2xl mx-auto">
      {/* Header Profile */}
      <div className="flex flex-col items-center text-center pt-4">
        <div className="relative mb-4 group">
          <Avatar className="w-32 h-32 border-4 border-dream-purple shadow-[0_0_40px_rgba(99,102,241,0.3)]">
            <AvatarImage src={profile.photoURL} />
            <AvatarFallback className="text-4xl">{profile.displayName?.[0]}</AvatarFallback>
          </Avatar>
          <div className="absolute bottom-1 right-1 bg-dream-purple p-2 rounded-full border-4 border-zinc-950">
            <Edit2 className="w-4 h-4 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-serif font-bold text-white">{profile.displayName}</h2>
        <div className="flex items-center gap-1 text-zinc-400 text-sm mt-1">
          <MapPin className="w-3 h-3" />
          {profile.location || 'Sonhador Errante'}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard icon={<Target className="w-4 h-4" />} value="0" label="Planos" />
        <StatCard icon={<Star className="w-4 h-4" />} value="0" label="Conexões" />
      </div>

      {/* Main Goal Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-3xl border-dream-purple/20 bg-gradient-to-br from-dream-purple/5 to-transparent"
      >
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-dream-purple font-bold" />
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-dream-purple">Minha Chama</h3>
        </div>
        <p className="text-xl font-serif italic text-white leading-relaxed">
          "{profile.dreamGoal}"
        </p>
      </motion.div>

      {/* Bio */}
      {profile.bio && (
        <div className="px-2">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Manifesto Pessoal</h4>
          <p className="text-sm text-zinc-400 leading-relaxed font-light">
            {profile.bio}
          </p>
        </div>
      )}

      {/* Logout */}
      <div className="pt-8">
        <Button 
          variant="ghost" 
          onClick={logOut}
          className="w-full text-zinc-500 hover:text-red-400 hover:bg-red-400/5 gap-2 rounded-2xl"
        >
          <LogOut className="w-4 h-4" /> Finalizar Sessão
        </Button>
      </div>
    </div>
  );
};

const StatCard = ({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) => (
  <div className="p-4 bg-white/3 border border-white/5 rounded-3xl flex flex-col items-center gap-1">
    <div className="text-dream-purple opacity-50">{icon}</div>
    <span className="text-xl font-bold text-white tracking-tight">{value}</span>
    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{label}</span>
  </div>
);
