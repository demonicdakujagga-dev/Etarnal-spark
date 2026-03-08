/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Sparkles, 
  MessageCircle, 
  Gift, 
  Music, 
  Music2, 
  ChevronRight, 
  Star,
  Quote
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- Components ---

const FloatingHearts = () => {
  const [hearts, setHearts] = useState<{ id: number; left: number; size: number; duration: number; delay: number }[]>([]);

  useEffect(() => {
    const newHearts = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * (30 - 10) + 10,
      duration: Math.random() * (15 - 10) + 10,
      delay: Math.random() * 10,
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{ y: '110vh', opacity: 0 }}
          animate={{ y: '-10vh', opacity: [0, 0.5, 0] }}
          transition={{
            duration: heart.duration,
            repeat: Infinity,
            delay: heart.delay,
            ease: "linear"
          }}
          style={{
            left: `${heart.left}%`,
            position: 'absolute',
          }}
        >
          <Heart size={heart.size} className="text-pink-300 fill-pink-300 opacity-20" />
        </motion.div>
      ))}
    </div>
  );
};

const TypingText = ({ text, delay = 50 }: { text: string; delay?: number }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, delay);
    return () => clearInterval(timer);
  }, [text, delay]);

  return <span>{displayedText}</span>;
};

// --- Main App ---

export default function App() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextStep = () => setStep(prev => prev + 1);

  const handleGiftClick = () => {
    // Heart explosion
    const end = Date.now() + 3 * 1000;
    const colors = ['#ff69b4', '#ff1493', '#da70d6'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
        shapes: ['circle']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
        shapes: ['circle']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());

    // Fireworks after a short delay
    setTimeout(() => {
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    }, 1000);

    nextStep();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 text-slate-800 font-sans selection:bg-pink-200 overflow-x-hidden relative">
      <FloatingHearts />
      
      {/* Audio Element */}
      <audio 
        ref={audioRef} 
        loop 
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // Placeholder romantic-ish track
      />

      {/* Music Toggle */}
      <button 
        onClick={toggleMusic}
        className="fixed top-6 right-6 z-50 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-pink-100 hover:scale-110 transition-transform text-pink-500"
      >
        {isPlaying ? <Music2 size={24} /> : <Music size={24} />}
      </button>

      <main className="relative z-10 max-w-lg mx-auto px-6 py-12 min-h-screen flex flex-col justify-center">
        <AnimatePresence mode="wait">
          
          {/* Step 0: Intro */}
          {step === 0 && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8"
            >
              <div className="relative inline-block">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="bg-white p-6 rounded-full shadow-2xl shadow-pink-200/50 border-4 border-pink-100"
                >
                  <Heart size={64} className="text-pink-500 fill-pink-500" />
                </motion.div>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-2 -right-2 text-yellow-400"
                >
                  <Sparkles size={24} />
                </motion.div>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                  A Little Surprise
                </h1>
                <p className="text-slate-500 text-lg">
                  I made something special just for you. Ready to see?
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (!isPlaying) toggleMusic();
                  nextStep();
                }}
                className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-semibold shadow-xl shadow-pink-200 hover:shadow-pink-300 transition-all overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Surprise <ChevronRight size={20} />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              </motion.button>
            </motion.div>
          )}

          {/* Step 1: Greeting */}
          {step === 1 && (
            <motion.div
              key="greeting"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="text-center space-y-8"
            >
              <div className="space-y-6">
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-block text-6xl"
                >
                  ✨
                </motion.span>
                <h2 className="text-3xl font-bold text-slate-800">
                  Hey Gorgeous! 🌸
                </h2>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Today is just another day to remind you how amazing you are. You bring so much light into my world, and I appreciate every single moment we share.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {['You\'re Kind', 'You\'re Smart', 'You\'re Beautiful'].map((text, i) => (
                  <motion.div
                    key={text}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-pink-100 text-xs font-medium text-pink-600"
                  >
                    {text}
                  </motion.div>
                ))}
              </div>

              <button
                onClick={nextStep}
                className="text-pink-500 font-medium flex items-center gap-1 mx-auto hover:gap-2 transition-all"
              >
                Continue the magic <ChevronRight size={18} />
              </button>
            </motion.div>
          )}

          {/* Step 2: Chat Messages */}
          {step === 2 && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Messages for You</h3>
                  <p className="text-xs text-slate-400">Sent with love</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  "I was just thinking about your smile... 😊",
                  "Thank you for being my person. ❤️",
                  "You make everything better just by being you. ✨",
                  "I'm so lucky to have you in my life. 🍀"
                ].map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.5 }}
                    className="max-w-[85%] p-4 bg-white rounded-2xl rounded-tl-none shadow-sm border border-pink-50 text-slate-700"
                  >
                    {msg}
                  </motion.div>
                ))}
              </div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
                onClick={nextStep}
                className="w-full py-4 bg-white/80 border border-pink-100 rounded-2xl text-pink-500 font-semibold hover:bg-pink-50 transition-colors mt-8"
              >
                See more surprises
              </motion.button>
            </motion.div>
          )}

          {/* Step 3: Sticker Gallery */}
          {step === 3 && (
            <motion.div
              key="stickers"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-8"
            >
              <h3 className="text-2xl font-bold text-slate-800">Pick a Sticker! 🧸</h3>
              <div className="grid grid-cols-3 gap-6">
                {['🧸', '💖', '🌸', '🌹', '🦋', '✨', '🎀', '🍭', '🌈'].map((emoji, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-5xl p-4 bg-white/40 rounded-2xl hover:bg-white/80 transition-all shadow-sm"
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
              <p className="text-slate-400 text-sm italic">Each one represents a hug I'm sending you right now.</p>
              
              <button
                onClick={nextStep}
                className="px-8 py-3 bg-slate-800 text-white rounded-full font-medium shadow-lg hover:bg-slate-700 transition-colors"
              >
                Next Surprise
              </button>
            </motion.div>
          )}

          {/* Step 4: Reasons */}
          {step === 4 && (
            <motion.div
              key="reasons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-slate-800">Why I Appreciate You</h3>
                <p className="text-slate-500">Just a few of the million reasons...</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {[
                  { title: "Your Heart", desc: "You care so deeply for everyone around you.", icon: <Heart className="text-pink-500" /> },
                  { title: "Your Strength", desc: "The way you handle everything with grace.", icon: <Star className="text-yellow-500" /> },
                  { title: "Your Laugh", desc: "It's literally my favorite sound in the world.", icon: <Sparkles className="text-purple-500" /> }
                ].map((reason, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.3 }}
                    className="p-5 bg-white rounded-2xl border border-pink-50 shadow-sm flex gap-4 items-start"
                  >
                    <div className="p-3 bg-pink-50 rounded-xl">
                      {reason.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{reason.title}</h4>
                      <p className="text-sm text-slate-500">{reason.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={nextStep}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-bold shadow-lg"
              >
                Read my letter to you
              </button>
            </motion.div>
          )}

          {/* Step 5: Love Letter */}
          {step === 5 && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white p-8 rounded-3xl shadow-xl border border-pink-50 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Quote size={80} className="text-pink-500" />
              </div>
              
              <div className="space-y-6 relative z-10">
                <h3 className="text-xl font-serif italic text-pink-600">Dearest You,</h3>
                <div className="text-slate-600 leading-relaxed font-serif text-lg min-h-[200px]">
                  <TypingText 
                    text="Sometimes words aren't enough to express how much you mean to me. You've changed my life in ways I never thought possible. Thank you for being my best friend, my partner, and my home. I promise to always be there for you, through every high and every low. I love you more than yesterday, but less than tomorrow." 
                    delay={40}
                  />
                </div>
                <div className="pt-6 border-t border-pink-50">
                  <p className="font-serif italic text-pink-500">Forever yours,</p>
                  <p className="font-bold text-slate-800">Me ❤️</p>
                </div>
              </div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 10 }}
                onClick={nextStep}
                className="mt-8 w-full py-3 bg-pink-50 text-pink-600 rounded-xl font-medium hover:bg-pink-100 transition-colors"
              >
                One last thing...
              </motion.button>
            </motion.div>
          )}

          {/* Step 6: The Gift */}
          {step === 6 && (
            <motion.div
              key="gift"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-12"
            >
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-slate-800">A Final Gift 🎁</h3>
                <p className="text-slate-500">Click the box to open your surprise!</p>
              </div>

              <motion.div
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                whileTap={{ scale: 0.9 }}
                onClick={handleGiftClick}
                className="cursor-pointer inline-block"
              >
                <div className="text-9xl filter drop-shadow-2xl">
                  🎁
                </div>
              </motion.div>

              <div className="h-20" /> {/* Spacer */}
            </motion.div>
          )}

          {/* Step 7: Celebration */}
          {step === 7 && (
            <motion.div
              key="celebration"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-8xl"
              >
                🥰
              </motion.div>
              
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                  YOU ARE LOVED!
                </h2>
                <p className="text-slate-600 text-lg">
                  I hope this made you smile today. You deserve all the happiness in the world!
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-4xl">🎈</motion.div>
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.3 }} className="text-4xl">💖</motion.div>
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.6 }} className="text-4xl">✨</motion.div>
              </div>

              <button
                onClick={() => setStep(0)}
                className="px-6 py-2 text-slate-400 hover:text-pink-500 transition-colors text-sm underline underline-offset-4"
              >
                Replay the magic
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Footer Decoration */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 pointer-events-none flex justify-between items-end opacity-30">
        <div className="text-4xl">🎀</div>
        <div className="text-4xl">🧸</div>
      </footer>
    </div>
  );
}
