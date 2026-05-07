import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { UserProfile, Friendship, FriendshipStatus } from '../types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Check, X, MessageCircle, Star } from 'lucide-react';
import { toast } from 'sonner';

export const FriendsList = ({ onOpenChat }: { onOpenChat: (id: string) => void }) => {
  const { user } = useAuth();
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [friendData, setFriendData] = useState<Record<string, UserProfile>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'friendships'),
      where('userIds', 'array-contains', user.uid)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Friendship));
      setFriendships(list);

      // Fetch user profiles for friends
      for (const friendship of list) {
        const otherId = friendship.userIds.find(id => id !== user.uid);
        if (otherId && !friendData[otherId]) {
          const userSnap = await getDoc(doc(db, 'users', otherId));
          if (userSnap.exists()) {
            setFriendData(prev => ({ ...prev, [otherId]: userSnap.data() as UserProfile }));
          }
        }
      }
      setLoading(false);
    }, (error) => {
      console.error(error);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAccept = async (id: string) => {
    try {
      await updateDoc(doc(db, 'friendships', id), {
        status: FriendshipStatus.ACCEPTED
      });
      toast.success('Conexão aceita! Já podem colaborar.');
    } catch (error) {
      toast.error('Erro ao aceitar pedido.');
    }
  };

  if (loading) return <div>Carregando conexões...</div>;

  const pending = friendships.filter(f => f.status === FriendshipStatus.PENDING && f.requestedBy !== user?.uid);
  const accepted = friendships.filter(f => f.status === FriendshipStatus.ACCEPTED);

  return (
    <div className="flex flex-col gap-8 h-full">
      {pending.length > 0 && (
        <section>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-dream-purple mb-4">Novas Inspirações</h3>
          <div className="space-y-3">
            {pending.map(f => {
              const otherId = f.userIds.find(id => id !== user?.uid);
              const data = otherId ? friendData[otherId] : null;
              if (!data) return null;
              return (
                <div key={f.id} className="p-4 glass-card rounded-2xl flex items-center gap-4">
                  <Avatar className="w-12 h-12 border border-white/10">
                    <AvatarImage src={data.photoURL} />
                    <AvatarFallback>{data.displayName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <h4 className="font-medium text-white truncate">{data.displayName}</h4>
                    <p className="text-xs text-zinc-500 italic truncate">"{data.dreamGoal}"</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => handleAccept(f.id)} className="text-green-500 hover:text-green-400 hover:bg-green-500/10 rounded-full">
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-full">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="flex-1 overflow-y-auto">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4">Arquitetos de Destino ({accepted.length})</h3>
        {accepted.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-zinc-600 bg-white/2 rounded-3xl border border-dashed border-white/5">
            <Star className="w-8 h-8 mb-2 opacity-20" />
            <p className="text-sm font-light italic">Suas parcerias surgirão aqui assim que aceitas.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {accepted.map(f => {
              const otherId = f.userIds.find(id => id !== user?.uid);
              const data = otherId ? friendData[otherId] : null;
              if (!data) return null;
              return (
                <div 
                  key={f.id} 
                  onClick={() => onOpenChat(f.id)}
                  className="p-4 glass-card rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-white/10 transition-all border-none"
                >
                  <Avatar className="w-12 h-12 border border-white/10">
                    <AvatarImage src={data.photoURL} />
                    <AvatarFallback>{data.displayName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <h4 className="font-medium text-white truncate">{data.displayName}</h4>
                    <p className="text-xs text-zinc-500 italic truncate">"{data.dreamGoal}"</p>
                  </div>
                  <MessageCircle className="w-5 h-5 text-dream-purple opacity-50" />
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
