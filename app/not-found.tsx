import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'Page not found - NoteHub',
  description: 'The page you are looking for does not exist.',
  url: 'https://08-zustand-seven-iota.vercel.app/not-found',
  openGraph: {
    title: 'Page not found - NoteHub',
    description: 'The page you are looking for does not exist.',
    url: 'https://08-zustand-seven-iota.vercel.app/not-found',
    images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
  },
};


export default function NotFoundPage() {
  return (
    <div className="not-found-container">
      <h1>404 - Page not found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link href="/">Go back home</Link>
    </div>
  );
}
