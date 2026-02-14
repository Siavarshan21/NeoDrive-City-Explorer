import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NeoDrive City Explorer',
  description: 'A 3D open-world city exploration game built with Next.js, React Three Fiber, and TypeScript.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-neo-dark text-white antialiased">
        {children}
      </body>
    </html>
  );
}
