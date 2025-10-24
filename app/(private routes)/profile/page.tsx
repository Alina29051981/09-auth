import { cookies } from 'next/headers';
import { getMe } from '../../../lib/api/serverApi';
import css from './ProfilePage.module.css';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile | NoteHub',
  description: 'User profile page of NoteHub application. View and manage your account details.',
  keywords: ['NoteHub', 'profile', 'user', 'account'],
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Profile | NoteHub',
    description: 'Manage your NoteHub user profile',
    url: '/profile',
    siteName: 'NoteHub',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub Profile',
      },
    ],
  },
};

export default async function ProfilePage() {
  const cookieStore = cookies();
  const cookieHeader = cookieStore.toString();

  let user;
  try {
    user = await getMe({ cookie: cookieHeader }); // передаємо cookie для SSR
  } catch {
    user = null;
  }

  if (!user) {
    return (
      <main className={css.mainContent}>
        <div className={css.profileCard}>
          <h1 className={css.formTitle}>Access denied</h1>
          <p>You need to log in to view this page.</p>
          <Link href="/sign-in" className={css.editProfileButton}>
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar || '/default-avatar.png'}
            alt={user.username || 'User Avatar'}
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

       <div className={css.profileInfo}>
  <p>Username: {user.username}</p>
  <p>Email: {user.email}</p>
</div>

      </div>
    </main>
  );
}
