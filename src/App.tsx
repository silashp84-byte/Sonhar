import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from './components/ui/sonner';
import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { ProfileSetup } from './components/ProfileSetup';
import { MainFeed } from './components/MainFeed';
import { Navigation } from './components/Navigation';
import { FriendsList } from './components/FriendsList';
import { ChatRoom } from './components/ChatRoom';
import { ProfileView } from './components/ProfileView';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'discover' | 'friends' | 'chat' | 'profile'>('discover');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-dream-purple/20 border-2 border-dream-purple shadow-[0_0_20px_rgba(99,102,241,0.5)]" />
          <p className="font-serif italic text-dream-purple text-xl">Sintonizando Sonhos...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  // Mandatory profile setup if missing dreamGoal
  if (profile && !profile.dreamGoal) {
    return <ProfileSetup />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'discover':
        return <MainFeed />;
      case 'friends':
        return <FriendsList onOpenChat={(id) => { setSelectedChatId(id); setActiveTab('chat'); }} />;
      case 'chat':
        return selectedChatId ? (
          <ChatRoom chatId={selectedChatId} onBack={() => setActiveTab('friends')} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-zinc-900/50 rounded-3xl border border-zinc-800">
             <p className="text-zinc-500 italic">Selecione um amigo para conversar sobre seus objetivos.</p>
             <button onClick={() => setActiveTab('friends')} className="mt-4 text-dream-purple font-medium hover:underline">Ver Amigos</button>
          </div>
        );
      case 'profile':
        return <ProfileView />;
      default:
        return <MainFeed />;
    }
  };

  return (
    <div className="min-h-screen max-w-md mx-auto relative flex flex-col pt-6 pb-24 px-4 bg-transparent overflow-hidden">
      <div className="atmosphere-bg" />
      <header className="flex justify-between items-center mb-8 px-2">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight text-white">SONHAR</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-dream-purple font-semibold">Conectando Almas Visionárias</p>
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative">
        {renderContent()}
      </main>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <Toaster position="top-center" expand={true} richColors />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
