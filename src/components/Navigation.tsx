import { Globe, Users, MessageSquare, User } from 'lucide-react';
import { motion } from 'motion/react';

interface NavigationProps {
  activeTab: 'discover' | 'friends' | 'chat' | 'profile';
  setActiveTab: (tab: 'discover' | 'friends' | 'chat' | 'profile') => void;
}

export const Navigation = ({ activeTab, setActiveTab }: NavigationProps) => {
  const tabs = [
    { id: 'discover', icon: <Globe />, label: 'Explorar' },
    { id: 'friends', icon: <Users />, label: 'Sonhadores' },
    { id: 'chat', icon: <MessageSquare />, label: 'Chat' },
    { id: 'profile', icon: <User />, label: 'Visão' },
  ] as const;

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-lg h-16 glass-card rounded-full flex items-center px-2 z-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as any)}
          className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all h-full relative ${
            activeTab === tab.id ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="active-tab"
              className="absolute inset-0 bg-white/5 rounded-full"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <div className={`z-10 transition-transform ${activeTab === tab.id ? 'scale-110' : ''}`}>
             {tab.icon}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider z-10">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};
