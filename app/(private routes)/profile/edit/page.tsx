'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../../lib/store/authStore';
import { getMe, updateMe } from '../../../../lib/api/clientApi';
import { useRouter } from 'next/navigation';
import css from './EditProfilePage.module.css';
import Image from 'next/image';

export default function EditProfilePage() {
  const { user, setUser } = useAuthStore();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!user) {
          const me = await getMe();
          setUsername(me.username ?? '');
          setUser(me);
        } else {
          setUsername(user.username ?? '');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [user, setUser]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username.trim()) return;

    try {
      const updated = await updateMe({ username });
      setUser(updated);
      router.push('/profile');
      router.refresh();
    } catch (err) {
      console.error('Failed to update profile', err);
      alert('Failed to update profile');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>
        {user?.avatar && (
          <Image
            src={user.avatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        )}

        <form className={css.profileInfo} onSubmit={handleSave}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
              required
            />
          </div>

          <p>Email: {user?.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
