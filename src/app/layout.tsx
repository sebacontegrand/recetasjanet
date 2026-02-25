import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Recetas que no fallan',
  description: 'Cocinar es una forma de decir te quiero. Recetas de cocina casera argentina.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased text-warm-900 bg-warm-50 flex flex-col min-h-screen`}>
        <header className="sticky top-0 z-50 w-full border-b border-warm-200 bg-white/80 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <a href="/" className="font-serif text-xl font-bold text-brand-primary">
              Recetas de <span className="italic">Janet</span>
            </a>
            <nav className="flex items-center gap-6 text-sm font-medium">
              <a href="/recetas" className="text-warm-800 hover:text-brand-primary transition-colors">Explorar</a>
              <a href="/admin" className="text-warm-800/50 hover:text-warm-900 transition-colors">Admin</a>
            </nav>
          </div>
        </header>

        <div className="flex-1">
          {children}
        </div>

        <footer className="border-t border-warm-200 bg-white py-12 text-center text-warm-800">
          <p className="font-serif italic mb-2">"La receta sale mejor cuando hay sobremesa."</p>
          <p className="text-sm opacity-70">Hecho en casa, como corresponde. © {new Date().getFullYear()}</p>
        </footer>
      </body>
    </html>
  );
}
