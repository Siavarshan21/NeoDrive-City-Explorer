'use client';

/**
 * Home Page - Entry point that redirects to the game.
 * Shows a loading screen while the game module loads.
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Brief splash then navigate to game
    const timer = setTimeout(() => {
      try {
        router.push('/game');
      } catch {
        setShowButton(true);
      }
    }, 1500);

    // Show manual button after 4 seconds as fallback
    const fallback = setTimeout(() => {
      setShowButton(true);
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(fallback);
    };
  }, [router]);

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a1a',
        color: 'white',
        fontFamily: 'monospace',
      }}
      className="h-screen w-screen flex items-center justify-center bg-neo-dark"
    >
      <div style={{ textAlign: 'center' }}>
        <h1
          style={{ fontSize: 48, fontWeight: 'bold', color: '#00f0ff', marginBottom: 16, letterSpacing: '0.1em' }}
          className="text-5xl font-bold font-mono text-neo-cyan mb-4 tracking-wider animate-pulse"
        >
          NEOCITY
        </h1>
        <h2
          style={{ fontSize: 20, color: '#ff00e5', letterSpacing: '0.2em', marginBottom: 32 }}
          className="text-xl font-mono text-neo-magenta tracking-widest mb-8"
        >
          EXPLORER
        </h2>
        <div className="flex items-center justify-center gap-1" style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-neo-cyan rounded-full animate-bounce"
              style={{
                width: 8,
                height: 8,
                backgroundColor: '#00f0ff',
                borderRadius: '50%',
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
        <p style={{ marginTop: 16, fontSize: 14, color: '#666' }} className="mt-4 text-sm text-gray-500 font-mono">
          Loading game...
        </p>
        {showButton && (
          <a
            href="/game"
            style={{
              display: 'inline-block',
              marginTop: 24,
              padding: '12px 32px',
              background: 'rgba(0,240,255,0.2)',
              border: '1px solid #00f0ff',
              color: '#00f0ff',
              fontFamily: 'monospace',
              cursor: 'pointer',
              borderRadius: 4,
              textDecoration: 'none',
            }}
          >
            ENTER GAME
          </a>
        )}
      </div>
    </div>
  );
}
