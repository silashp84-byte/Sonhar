import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { Message, UserProfile } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ChevronLeft, Send, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';

export const ChatRoom = ({ chatId, onBack }: { chatId: string; onBack: () => void }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [otherUser, setOtherUser] = useState<UserProfile | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || !chatId) return;

    // Fetch other user profile
    const fetchOther = async () => {
      const friendshipSnap = await getDoc(doc(db, 'friendships', chatId));
      if (friendshipSnap.exists()) {
        const userIds = friendshipSnap.data().userIds as string[];
        const otherId = userIds.find(id => id !== user.uid);
        if (otherId) {
          const userSnap = await getDoc(doc(db, 'users', otherId));
          if (userSnap.exists()) {
            setOtherUser(userSnap.data() as UserProfile);
          }
        }
      }
    };
    fetchOther();

    const q = query(
      collection(db, `friendships/${chatId}/messages`),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Message));
      setMessages(list);
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    return () => unsubscribe();
  }, [user, chatId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user) return;

    const text = inputText;
    setInputText('');

    try {
      await addDoc(collection(db, `friendships/${chatId}/messages`), {
        chatId,
        senderId: user.uid,
        text,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900/50 rounded-3xl overflow-hidden border border-white/5 relative">
      {/* Header */}
      <div className="p-4 flex items-center gap-3 border-bottom border-white/5 bg-white/5">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full text-zinc-400">
          <ChevronLeft />
        </button>
        <Avatar className="w-10 h-10 border border-white/10">
          <AvatarImage src={otherUser?.photoURL} />
          <AvatarFallback>{otherUser?.displayName?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h4 className="font-medium text-white text-sm">{otherUser?.displayName}</h4>
          <p className="text-[10px] text-dream-purple font-bold tracking-widest uppercase">Arquitetando Sonhos</p>
        </div>
        <Sparkles className="w-5 h-5 text-dream-purple opacity-30" />
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((m) => (
            <div 
              key={m.id} 
              className={`flex ${m.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  m.senderId === user?.uid 
                    ? 'bg-dream-purple text-white rounded-br-none' 
                    : 'bg-white/10 text-zinc-200 rounded-bl-none border border-white/5'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 flex gap-2 bg-white/5 border-top border-white/5">
        <Input 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Fale sobre sua visão..."
          className="bg-transparent border-white/10 focus-visible:ring-dream-purple"
        />
        <Button type="submit" size="icon" className="bg-dream-purple hover:bg-dream-purple/80 rounded-full">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};
