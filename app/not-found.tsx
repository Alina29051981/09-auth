import Link from 'next/link';
import './globals.css';

export default function NotFoundPage() {
  return (
    <div className="not-found-container">
      <h1>404 - Page not found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link href="/">Go back home</Link>
    </div>
  );
}
