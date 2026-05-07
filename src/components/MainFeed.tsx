import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, limit, getDocs, addDoc, serverTimestamp, getDoc, doc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, FriendshipStatus } from '../types';
import { Button } from './ui/button';
import { UserPlus, Star, Info, MessageSquare, X, Globe } from 'lucide-react';
import { toast } from 'sonner';

export const MainFeed = () => {
  const { user, profile } = useAuth();
  const [visionaries, setVisionaries] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchVisionaries = async () => {
      if (!user) return;
      setLoading(true);
      try {
        // Simple discovery: Fetch some users who aren't the current user
        // In a real app, we'd filter out already requested/friends
        const q = query(
          collection(db, 'users'),
          where('uid', '!=', user.uid),
          limit(10)
        );
        const querySnapshot = await getDocs(q);
        const users: UserProfile[] = [];
        querySnapshot.forEach((doc) => {
          users.push(doc.data() as UserProfile);
        });
        setVisionaries(users);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisionaries();
  }, [user]);

  const handleAddFriend = async (targetId: string) => {
    if (!user) return;
    try {
      // Check if already requested (simplified: just try to add, rules will block if duplicate logic exists)
      // Ideal: Check for existing friendship doc
      const friendshipId = [user.uid, targetId].sort().join('_');
      const friendshipRef = doc(db, 'friendships', friendshipId);
      const snap = await getDoc(friendshipRef);

      if (snap.exists()) {
        toast.info('Vocês já estão conectados ou o pedido está pendente.');
        return;
      }

      await addDoc(collection(db, 'friendships'), {
        userIds: [user.uid, targetId],
        status: FriendshipStatus.PENDING,
        requestedBy: user.uid,
        createdAt: serverTimestamp()
      });
      toast.success('Pedido de conexão enviado! Aguarde o retorno.');
      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao enviar pedido.');
    }
  };

  const nextCard = () => setCurrentIndex(prev => prev + 1);

  if (loading) return null; // Handled by parent skeleton if needed

  if (currentIndex >= visionaries.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
        <Star className="w-12 h-12 text-dream-purple mb-4 animate-pulse" />
        <h2 className="text-2xl font-serif font-bold text-white mb-2">Pausa na Visão</h2>
        <p className="text-zinc-400 mb-6 font-light italic">Você explorou todos os sonhadores próximos. Que tal revisar seus próprios objetivos agora?</p>
        <Button 
          variant="outline" 
          onClick={() => setCurrentIndex(0)}
          className="border-white/10 hover:bg-white/5"
        >
          Explorar Novamente
        </Button>
      </div>
    );
  }

  const currentVisionary = visionaries[currentIndex];

  return (
    <div className="h-full w-full relative flex items-center justify-center perspective-1000">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentVisionary.uid}
          initial={{ scale: 0.9, opacity: 0, rotate: -2 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ x: 300, opacity: 0, rotate: 10 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="w-full h-full glass-card rounded-[2.5rem] overflow-hidden flex flex-col relative"
        >
          {/* Cover Image / Profile Pic */}
          <div className="h-[60%] w-full relative">
            <img 
              src={currentVisionary.photoURL || `https://picsum.photos/seed/${currentVisionary.uid}/800/1200`} 
              alt={currentVisionary.displayName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="text-3xl font-serif font-bold text-white leading-tight">
                {currentVisionary.displayName}
              </h3>
              <p className="text-zinc-300 text-sm flex items-center gap-1 opacity-80">
                <Globe className="w-3 h-3" /> {currentVisionary.location || 'Sonhador Errante'}
              </p>
            </div>
          </div>

          {/* Dream Goal Section */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
               <div className="flex items-center gap-1 mb-2">
                 <Star className="w-3 h-3 text-dream-purple" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-dream-purple">O Grande Sonho</span>
               </div>
               <p className="text-lg font-medium text-white italic leading-relaxed">
                 "{currentVisionary.dreamGoal}"
               </p>
            </div>

            <div className="flex items-center justify-around pb-2">
               <button 
                onClick={nextCard}
                className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
               >
                 <X className="w-6 h-6" />
               </button>
               
               <button 
                onClick={() => handleAddFriend(currentVisionary.uid)}
                className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-black shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-110 active:scale-95 transition-all"
               >
                 <UserPlus className="w-8 h-8" />
               </button>

               <button 
                className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400"
                onClick={() => toast.info('Funcionalidade de perfil completo em breve!')}
               >
                 <Info className="w-6 h-6" />
               </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
