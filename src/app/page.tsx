'use client';

/**
 * Home Page - Entry point that redirects to the game.
 * Shows a loading screen while the game module loads.
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Brief splash then navigate to game
    const timer = setTimeout(() => {
      router.push('/game');
    }, 1500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-neo-dark">
      <div className="text-center">
        <h1 className="text-5xl font-bold font-mono text-neo-cyan mb-4 tracking-wider animate-pulse">
          NEOCITY
        </h1>
        <h2 className="text-xl font-mono text-neo-magenta tracking-widest mb-8">
          EXPLORER
        </h2>
        <div className="flex items-center justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-neo-cyan rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <p className="mt-4 text-sm text-gray-500 font-mono">Loading game...</p>
      </div>
    </div>
  );
}
