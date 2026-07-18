import './globals.css';
import Providers from './providers';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

export const metadata = {
  title: {
    default: 'ExamPrep AI — Micro-Learning Engine',
    template: '%s | ExamPrep AI',
  },
  description:
    'ExamPrep AI is a production-grade micro-learning curriculum planner powered by Gemini AI. Beat academic burnout with structured study roadmaps, AI difficulty scoring, and smart memory recalibration.',
  keywords: ['exam prep', 'AI study planner', 'micro-learning', 'Gemini AI', 'student tools'],
  authors: [{ name: 'ExamPrep AI Team' }],
  openGraph: {
    type: 'website',
    title: 'ExamPrep AI — Micro-Learning Engine',
    description: 'Beat academic burnout with AI-powered study roadmaps.',
    siteName: 'ExamPrep AI',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-slate-50 text-slate-900 antialiased">
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
